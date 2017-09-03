import {post} from "request-promise-native";
import {createCipheriv, createDecipheriv, randomBytes} from "crypto";

import {Args, Request as Req, Response as Res} from "./model";
import {ErrorCode, ErrorResponse, KeyId, TypedError} from "./model/common";

const base64: BufferEncoding = "base64";
const utf8: BufferEncoding = "utf8";
const base64ToBuffer = (value: string) => Buffer.from(value, base64);

export class KeePassHttpClient {
    private readonly ivSize = 16;
    private readonly keySize = 32;
    private readonly encryptionAlgorithm = "aes-256-cbc";

    private _url: string = "http://localhost:19455";
    private _id: string;
    private _key: string;

    constructor(opts?: { url?: string; keyId?: KeyId }) {
        if (opts && opts.url) {
            this._url = opts.url;
        }
        if (opts && opts.keyId) {
            this._id = opts.keyId.id;
            this._key = opts.keyId.key;
        } else {
            this._key = this.generateKey(this.keySize);
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

    testAssociate() {
        return this.execute<Req.TestAssosiate, Res.Base>(Req.TestAssosiate);
    }

    associate() {
        return this
            .execute<Req.Associate, Res.Complete>(Req.Associate)
            .then((response) => {
                this._id = response.Id;
                return response;
            });
    }

    getLogins(args: Args.Base) {
        return this
            .execute<Req.GetLogins, Res.Complete>(Req.GetLogins, args)
            .then((response) => {
                const decryptValue = ((value: string): string => this.decrypt(response.Nonce as string, value));

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
            });
    }

    getLoginsCount(args: Args.Base) {
        return this.execute<Req.GetLoginsCount, Res.Complete>(Req.GetLoginsCount, args);
    }

    createLogin(args: Args.Create) {
        return this.execute<Req.CreateLogin, Res.Complete>(Req.CreateLogin, args);
    }

    updateLogin(args: Args.Update) {
        return this.execute<Req.UpdateLogin, Res.Complete>(Req.UpdateLogin, args);
    }

    private execute<T extends Req.Request, K extends Res.Base>(requestConstructor: { new (...args: any[]): T },
                                                               args?: Args.Base) {
        const request = new requestConstructor();

        if (request instanceof Req.RequiredId && !this.id) {
            throw new TypedError(
                `The 'id' field must be defined to request/save a login. Use 'associate' method to get the 'id' value.`,
                ErrorCode.IdUndefined,
            );
        }

        if (request instanceof Req.Base) {
            const nonce = this.generateKey();

            request.Nonce = nonce;
            request.Verifier = this.encrypt(nonce, nonce);
        }

        if (request instanceof Req.RequiredId || request instanceof Req.TestAssosiate) {
            request.Id = this.id;
        }

        if (request instanceof Req.Associate) {
            request.Key = this._key;
        }

        if (request instanceof Req.Logins) {
            if (!args) {
                throw new TypedError(
                    `Request parameters have not been passed`,
                    ErrorCode.ArgsUndefined,
                );
            }

            const encryptValue = (value: string) => this.encrypt(request.Nonce, value);

            request.Url = encryptValue(args.url);

            if (request instanceof Req.ModifyLogin) {
                const modifyArgs = args as Args.Modify;

                request.Login = encryptValue(modifyArgs.login);
                request.Password = encryptValue(modifyArgs.password);
                request.Url = encryptValue(modifyArgs.url);

                if (request instanceof Req.CreateLogin) {
                    const createArgs = modifyArgs as Args.Create;

                    request.SubmitUrl = request.Url;

                    if (createArgs.realm) {
                        request.Realm = encryptValue(createArgs.realm);
                    }
                }

                if (request instanceof Req.UpdateLogin) {
                    const updateArgs = modifyArgs as Args.Update;

                    request.Uuid = encryptValue(updateArgs.uuid);
                }
            } else if (args.submitUrl) {
                request.SubmitUrl = encryptValue(args.submitUrl);

                if (args.realm) {
                    request.Realm = encryptValue(args.realm);
                }
            }
        }

        return this.request<T, K>(request);
    }

    private request<T extends Req.Request, K extends Res.Base>(request: T) {
        return post(this.url, {json: true, body: request})
            .then((response: K) => {
                if (!response || !response.Success || response.Error) {
                    throw new ErrorResponse(`Remote service responded with an error response`, request, response);
                }

                return response;
            });
    }

    private generateKey(size = this.ivSize) {
        return randomBytes(size).toString(base64);
    }

    private encrypt(iv: string, data: string) {
        const cipher = createCipheriv(this.encryptionAlgorithm, base64ToBuffer(this._key), base64ToBuffer(iv));

        return Buffer
            .concat([cipher.update(Buffer.from(data, utf8)), cipher.final()])
            .toString(base64);
    }

    private decrypt(iv: string, data: string) {
        const decipher = createDecipheriv(this.encryptionAlgorithm, base64ToBuffer(this._key), base64ToBuffer(iv));

        return Buffer
            .concat([decipher.update(base64ToBuffer(data)), decipher.final()])
            .toString(utf8);
    }

}
