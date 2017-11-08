import fetch from "node-fetch";

import {Args, Request as Req, Response as Res} from "./model";
import {ErrorResponse, KeyId} from "./model/common";
import {decrypt, generateRandomBase64, KEY_SIZE} from "./util";

export class KeePassHttpClient {
    private readonly _key: string;
    private _url: string = "http://localhost:19455";
    private _id: string;

    constructor(opts?: { url?: string; keyId?: KeyId }) {
        if (opts && opts.url) {
            this._url = opts.url;
        }
        if (opts && opts.keyId) {
            this._id = opts.keyId.id;
            this._key = opts.keyId.key;
        } else {
            this._key = generateRandomBase64(KEY_SIZE);
        }
    }

    get url(): string {
        return this._url;
    }

    get id(): string {
        return this._id;
    }

    get key(): string {
        return this._key;
    }

    async testAssociate() {
        return this.request<Res.Base>(new Req.TestAssosiate(this.key, this.id));
    }

    async associate() {
        const response = await this.request<Res.Complete>(new Req.Associate(this.key));

        this._id = response.Id;

        return response;
    }

    async getLogins(args: Args.Base) {
        const response = await this.request<Res.Complete>(new Req.GetLogins(this.key, this.id, args));
        const decryptValue = ((value: string): string => decrypt(this.key, response.Nonce as string, value));

        if (response.Entries) {
            response.Entries.forEach((entry) => {
                entry.Name = decryptValue(entry.Name as string);
                entry.Login = decryptValue(entry.Login as string);
                entry.Password = decryptValue(entry.Password as string);
                entry.Uuid = decryptValue(entry.Uuid);

                if (entry.StringFields) {
                    entry.StringFields.forEach((field) => {
                        field.Key = decryptValue(field.Key);
                        field.Value = decryptValue(field.Value);
                    });
                }
            });
        }

        return response;
    }

    async getLoginsCount(args: Args.Base) {
        return this.request<Res.Complete>(new Req.GetLoginsCount(this.key, this.id, args));
    }

    async createLogin(args: Args.Create) {
        return this.request<Res.Complete>(new Req.CreateLogin(this.key, this.id, args));
    }

    async updateLogin(args: Args.Update) {
        return this.request<Res.Complete>(new Req.UpdateLogin(this.key, this.id, args));
    }

    private async request<T extends Res.Base>(request: any): Promise<T> {
        const body = JSON.stringify(request);
        const fetchRequest = await fetch(this.url, {method: "POST", body});
        const response: T = await fetchRequest.json();

        if (!response || !response.Success || response.Error) {
            throw new ErrorResponse(`Remote service responded with an error response`, request, response);
        }

        return response;
    }
}
