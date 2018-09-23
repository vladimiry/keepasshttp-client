// tslint:disable:max-classes-per-file
// tslint:disable:variable-name

import {encrypt, generateRandomBase64, IV_SIZE} from "../private/util";
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
    public TriggerUnlock = false;
    public Nonce: string;
    public Verifier: string;
    protected encryptValue: (value: string) => string;

    constructor(key: string) {
        this.encryptValue = (value: string) => encrypt(key, this.Nonce, value);
        this.Nonce = generateRandomBase64(IV_SIZE);
        this.Verifier = this.encryptValue(this.Nonce);
    }
}

export class TestAssosiate extends Base {
    public RequestType = Type.TestAssosiate;
    public Id?: string;

    constructor(key: string, id?: string) {
        super(key);

        if (typeof id !== "undefined") {
            this.Id = id;
        }
    }
}

export class Associate extends Base {
    public RequestType = Type.Associate;
    public Key: string;

    constructor(key: string) {
        super(key);
        this.Key = key;
    }
}

export class RequiredId extends Base {
    public Id: string;

    constructor(key: string, id: string) {
        super(key);

        if (!id) {
            throw new TypedError(
                [
                    `The "id" field must be defined to request/save a password records. `,
                    `Call the "associate" method to get the "id" wired into the client instance. `,
                    `Request constructor name: ${this.constructor.name}.`,
                ].join(""),
                ErrorCode.IdUndefined,
            );
        }

        this.Id = id;
    }
}

export class Logins extends RequiredId {
    public SortSelection = false;
    public Url: string;

    constructor(key: string, id: string, args: Args.Minimum) {
        super(key, id);
        this.Url = this.encryptValue(args.url);
    }
}

export class GetLogins extends Logins {
    public RequestType = Type.GetLogins;
    public SubmitUrl?: string;
    public Realm?: string;

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
    public RequestType = Type.GetLoginsCount;
}

export class ModifyLogin extends Logins {
    public RequestType = Type.SetLogin;
    public Login: string;
    public Password: string;

    constructor(key: string, id: string, args: Args.Modify) {
        super(key, id, args);

        this.Login = this.encryptValue(args.login);
        this.Password = this.encryptValue(args.password);
    }
}

export class CreateLogin extends ModifyLogin {
    public SubmitUrl?: string;
    public Realm?: string;

    constructor(key: string, id: string, args: Args.Create) {
        super(key, id, args);

        if (args.submitUrl) {
            this.SubmitUrl = this.encryptValue(args.submitUrl);
        }

        if (args.realm) {
            this.Realm = this.encryptValue(args.realm);
        }
    }
}

export class UpdateLogin extends ModifyLogin {
    public Uuid: string;

    constructor(key: string, id: string, args: Args.Update) {
        super(key, id, args);

        this.Uuid = this.encryptValue(args.uuid);
    }
}
