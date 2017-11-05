import * as Args from "./args";
export declare enum Type {
    TestAssosiate = "test-associate",
    Associate = "associate",
    GetLogins = "get-logins",
    GetLoginsCount = "get-logins-count",
    SetLogin = "set-login",
}
export interface Request {
    Nonce: string;
    Verifier: string;
}
export declare class Base implements Request {
    TriggerUnlock: boolean;
    Nonce: string;
    Verifier: string;
    protected encryptValue: (value: string) => string;
    constructor(key: string);
    generateBody(): {
        [k: string]: any;
    };
}
export declare class TestAssosiate extends Base {
    RequestType: Type;
    Id?: string;
    constructor(key: string, id?: string);
}
export declare class Associate extends Base {
    RequestType: Type;
    Key: string;
    constructor(key: string);
}
export declare class RequiredId extends Base {
    Id: string;
    constructor(key: string, id: string);
}
export declare class Logins extends RequiredId {
    SortSelection: boolean;
    Url: string;
    constructor(key: string, id: string, args: Args.Minimum);
}
export declare class GetLogins extends Logins {
    RequestType: Type;
    SubmitUrl?: string;
    Realm?: string;
    constructor(key: string, id: string, args: Args.Base);
}
export declare class GetLoginsCount extends GetLogins {
    RequestType: Type;
}
export declare class ModifyLogin extends Logins {
    RequestType: Type;
    Login: string;
    Password: string;
    constructor(key: string, id: string, args: Args.Modify);
}
export declare class CreateLogin extends ModifyLogin {
    SubmitUrl?: string;
    Realm?: string;
    constructor(key: string, id: string, args: Args.Create);
}
export declare class UpdateLogin extends ModifyLogin {
    Uuid: string;
    constructor(key: string, id: string, args: Args.Update);
}
