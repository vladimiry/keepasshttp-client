import { Args, Response as Res } from "./model";
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
    getLogins(args: Args.Base): Promise<Res.Complete>;
    getLoginsCount(args: Args.Base): Promise<Res.Complete>;
    createLogin(args: Args.Create): Promise<Res.Complete>;
    updateLogin(args: Args.Update): Promise<Res.Complete>;
    private execute<T, K>(requestConstructor, args?);
    private request<T, K>(request);
    private generateKey(size?);
    private encrypt(iv, data);
    private decrypt(iv, data);
}
