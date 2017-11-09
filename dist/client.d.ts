import { KeyId } from "./model/common";
import * as Response from "./model/response";
import * as Args from "./model/args";
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
    testAssociate(): Promise<Response.Base>;
    associate(): Promise<Response.Complete>;
    getLogins(args: Args.Base): Promise<Response.Complete>;
    getLoginsCount(args: Args.Base): Promise<Response.Complete>;
    createLogin(args: Args.Create): Promise<Response.Complete>;
    updateLogin(args: Args.Update): Promise<Response.Complete>;
    private request<T>(request);
}
