export declare enum Type {
    TestAssosiate = "test-associate",
    Associate = "associate",
    GetLogins = "get-logins",
    GetLoginsCount = "get-logins-count",
    SetLogin = "set-login",
}
export interface Args {
    url: string;
    realm?: string;
    submitUrl?: string;
}
export interface UpdatingArgs extends Args {
    login: string;
    password: string;
    uuid: string;
}
export interface Request {
    Nonce: string;
    Verifier: string;
}
export declare class Base implements Request {
    TriggerUnlock: boolean;
    Nonce: string;
    Verifier: string;
}
export declare class TestAssosiate extends Base {
    RequestType: Type;
    Id?: string;
}
export declare class Associate extends Base {
    RequestType: Type;
    Key: string;
}
export declare class RequiredId extends Base {
    Id: string;
}
export declare class Logins extends RequiredId {
    SortSelection: boolean;
    Url: string;
    SubmitUrl?: string;
    Realm?: string;
}
export declare class GetLogins extends Logins {
    RequestType: Type;
}
export declare class GetLoginsCount extends Logins {
    RequestType: Type;
}
export declare class SetLogin extends Logins {
    RequestType: Type;
    Login: string;
    Password: string;
    Uuid?: string;
}
