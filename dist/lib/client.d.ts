import { Request as Req, Response as Res } from "./model";
import { KeyId } from "./model/common";
export declare class KeePassHttpClient {
    private readonly ivSize;
    private readonly keySize;
    private readonly encryptionAlgorithm;
    private _uri;
    private _id;
    private _key;
    constructor(opts?: {
        uri?: string;
        keyId?: KeyId;
    });
    readonly uri: string;
    readonly id: string;
    readonly key: string;
    testAssociate(): Promise<Res.Base>;
    associate(): Promise<Res.Complete>;
    getLogins(args: Req.Args): Promise<Res.Complete>;
    getLoginsCount(args: Req.Args): Promise<Res.Complete>;
    setLogin(args: Req.UpdatingArgs): Promise<Res.Complete>;
    private execute<T, K>(requestConstructor, args?);
    private request<T, K>(request);
    private generateKey(size?);
    private encrypt(iv, data);
    private decrypt(iv, data);
}
