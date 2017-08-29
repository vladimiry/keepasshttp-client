export enum Type {
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

export class Base implements Request {
    TriggerUnlock: boolean = false;
    Nonce: string;
    Verifier: string;
}

export class TestAssosiate extends Base {
    RequestType = Type.TestAssosiate;
    Id?: string;
}

export class Associate extends Base {
    RequestType = Type.Associate;
    Key: string;
}

export class RequiredId extends Base {
    Id: string;
}

export class Logins extends RequiredId {
    SortSelection: boolean = false;
    Url: string;
    SubmitUrl?: string;
    Realm?: string;
}

export class GetLogins extends Logins {
    RequestType = Type.GetLogins;
}

export class GetLoginsCount extends Logins {
    RequestType = Type.GetLoginsCount;
}

export class SetLogin extends Logins {
    RequestType = Type.SetLogin;
    Login: string;
    Password: string;
    Uuid?: string;
}
