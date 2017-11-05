import {encrypt, generateRandomBase64, IV_SIZE} from "../util";
import {ErrorCode, TypedError} from "./common";
import * as Args from "./args";

export enum Type {
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

export class Base implements Request {
    TriggerUnlock = false;
    Nonce: string;
    Verifier: string;
    protected encryptValue: (value: string) => string;

    constructor(key: string) {
        this.encryptValue = (value: string) => encrypt(key, this.Nonce, value);
        this.Nonce = generateRandomBase64(IV_SIZE);
        this.Verifier = this.encryptValue(this.Nonce);
    }

    generateBody(): {[k: string]: any } {
        return JSON.parse(JSON.stringify(this));
    }
}

export class TestAssosiate extends Base {
    RequestType = Type.TestAssosiate;
    Id?: string;

    constructor(key: string, id?: string) {
        super(key);

        if (typeof id !== "undefined") {
            this.Id = id;
        }
    }
}

export class Associate extends Base {
    RequestType = Type.Associate;
    Key: string;

    constructor(key: string) {
        super(key);
        this.Key = key;
    }
}

export class RequiredId extends Base {
    Id: string;

    constructor(key: string, id: string) {
        super(key);

        if (!id) {
            throw new TypedError(
                `The 'id' field must be defined to request/save a login. Use 'associate' method to get the 'id' value.`,
                ErrorCode.IdUndefined,
            );
        }

        this.Id = id;
    }
}

export class Logins extends RequiredId {
    SortSelection = false;
    Url: string;

    constructor(key: string, id: string, args: Args.Minimum) {
        super(key, id);
        this.Url = this.encryptValue(args.url);
    }
}

export class GetLogins extends Logins {
    RequestType = Type.GetLogins;
    SubmitUrl?: string;
    Realm?: string;

    constructor(key: string, id: string, args: Args.Base) {
        super(key, id, args);

        if (args.submitUrl) {
            this.SubmitUrl = this.encryptValue(args.submitUrl);

            if (args.realm) {
                this.Realm = this.encryptValue(args.realm);
            }
        }
    }
}

export class GetLoginsCount extends GetLogins {
    RequestType = Type.GetLoginsCount;
}

export class ModifyLogin extends Logins {
    RequestType = Type.SetLogin;
    Login: string;
    Password: string;

    constructor(key: string, id: string, args: Args.Modify) {
        super(key, id, args);

        this.Login = this.encryptValue(args.login);
        this.Password = this.encryptValue(args.password);
    }
}

export class CreateLogin extends ModifyLogin {
    SubmitUrl?: string;
    Realm?: string;

    constructor(key: string, id: string, args: Args.Create) {
        super(key, id, args);

        this.SubmitUrl = args.submitUrl;

        if (args.realm) {
            this.Realm = this.encryptValue(args.realm);
        }
    }
}

export class UpdateLogin extends ModifyLogin {
    Uuid: string;

    constructor(key: string, id: string, args: Args.Update) {
        super(key, id, args);

        this.Uuid = this.encryptValue(args.uuid);
    }
}
