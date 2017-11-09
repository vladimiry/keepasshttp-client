import fetch from "node-fetch";

import {
    KeyId,
    NetworkConnectionError,
    NetworkResponseContentError,
    NetworkResponseStatusCodeError,
} from "./model/common";
import {decrypt, generateRandomBase64, KEY_SIZE} from "./util";
import {Args, Request, Response} from "./model";

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
        return this.request<Response.Base>(new Request.TestAssosiate(this.key, this.id));
    }

    async associate() {
        const response = await this.request<Response.Complete>(new Request.Associate(this.key));

        this._id = response.Id;

        return response;
    }

    async getLogins(args: Args.Base) {
        const response = await this.request<Response.Complete>(new Request.GetLogins(this.key, this.id, args));
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
        return this.request<Response.Complete>(new Request.GetLoginsCount(this.key, this.id, args));
    }

    async createLogin(args: Args.Create) {
        return this.request<Response.Complete>(new Request.CreateLogin(this.key, this.id, args));
    }

    async updateLogin(args: Args.Update) {
        return this.request<Response.Complete>(new Request.UpdateLogin(this.key, this.id, args));
    }

    private async request<T extends Response.Base>(request: any): Promise<T> {
        const body = JSON.stringify(request);
        let fetchedResponse;

        try {
            fetchedResponse = await fetch(this.url, {method: "POST", body});
        } catch (err) {
            throw new NetworkConnectionError(err.message);
        }

        if (!fetchedResponse.ok) {
            throw new NetworkResponseStatusCodeError(fetchedResponse.statusText, fetchedResponse.status);
        }

        const response: T = await fetchedResponse.json();

        if (!response || !response.Success || response.Error) {
            throw new NetworkResponseContentError(`Remote service responded with an error response`, request, response);
        }

        return response;
    }
}
