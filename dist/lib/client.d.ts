import { Args, Response as Res } from "./model";
import { KeyId } from "./model/common";
export declare class KeePassHttpClient {
    private readonly _key;
    private _url;
    private _id;
    constructor(opts?: {
        url?: string;
        keyId?: KeyId;
    });
    readonly url: string;
    readonly id: string;
    readonly key: string;
    testAssociate(): Promise<Res.Base>;
    associate(): Promise<Res.Complete>;
    getLogins(args: Args.Base): Promise<Res.Complete>;
    getLoginsCount(args: Args.Base): Promise<Res.Complete>;
    createLogin(args: Args.Create): Promise<Res.Complete>;
    updateLogin(args: Args.Update): Promise<Res.Complete>;
    private request<T>(request);
}
