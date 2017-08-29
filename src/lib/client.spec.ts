import * as test from "tape";

import {KeePassHttpClient} from "./client";
import {ErrorCode, TypedError} from "./model/common";

const arg = {
    uri: "http://localhost:12345",
    keyId: {
        id: "id-",
        // 32 bytes size, base64 encoded
        key: "6ipg8p/immwgmzNN04pIZGlfE6QkoGykokilfc3vE3I=",
    },
};

test("constructor args should be setup as a member fields", (t) => {
    const client = new KeePassHttpClient(arg);

    t.equal(client.uri, arg.uri);
    t.equal(client.id, arg.keyId.id);
    t.equal(client.key, arg.keyId.key);
    t.end();
});

test("'getLogins/getLoginsCount/setLogin' methods should fail if 'id' has not been setup", (t) => {
    t.plan(3 * 2);

    const client = new KeePassHttpClient();
    const assert = (error: Error) => {
        t.ok(error instanceof TypedError);
        t.equal((error as TypedError).code, ErrorCode.IdUndefined);
    };

    try {
        client.getLogins({url: ""});
    } catch (error) {
        assert(error);
    }
    try {
        client.getLoginsCount({url: ""});
    } catch (error) {
        assert(error);
    }
    try {
        client.setLogin({url: "", uuid: "", login: "", password: ""});
    } catch (error) {
        assert(error);
    }
});

test("requests methods should return a promises", (t) => {
    const isPromise = (object: any) => object && typeof object.then === "function"
        && typeof object.catch === "function";
    const client = new KeePassHttpClient(arg);

    t.ok(isPromise(client.testAssociate()));
    t.ok(isPromise(client.associate()));
    t.ok(isPromise(client.getLogins({url: ""})));
    t.ok(isPromise(client.getLoginsCount({url: ""})));
    t.ok(isPromise(client.setLogin({url: "", uuid: "", login: "", password: ""})));

    t.end();
});
