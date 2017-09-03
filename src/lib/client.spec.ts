import * as test from "tape";
import * as mockRequire from "mock-require";
import {createCipheriv, randomBytes} from "crypto";

import {KeePassHttpClient} from "./client";
import {Response} from "./model";
import {ErrorCode, TypedError} from "./model/common";

const clientOpts = {
    url: "http://localhost:12345",
    keyId: {
        id: "id-",
        key: randomBytes(32).toString("base64"),
    },
};

test("constructor args should be setup as a member fields", (t) => {
    const client = new KeePassHttpClient(clientOpts);

    t.equal(client.url, clientOpts.url);
    t.equal(client.id, clientOpts.keyId.id);
    t.equal(client.key, clientOpts.keyId.key);

    t.end();
});

test("request methods should fail if 'id' has not been setup", (t) => {
    t.plan(4 * 2);

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
        client.createLogin({url: "", login: "", password: ""});
    } catch (error) {
        assert(error);
    }
    try {
        client.updateLogin({url: "", uuid: "", login: "", password: ""});
    } catch (error) {
        assert(error);
    }
});

test("requests methods should return a promises", (t) => {
    const isPromise = (object: any) => object && typeof object.then === "function"
        && typeof object.catch === "function";
    const client = new KeePassHttpClient(clientOpts);

    t.ok(isPromise(client.testAssociate()));
    t.ok(isPromise(client.associate()));
    t.ok(isPromise(client.getLogins({url: ""})));
    t.ok(isPromise(client.getLoginsCount({url: ""})));
    t.ok(isPromise(client.createLogin({url: "", login: "", password: ""})));
    t.ok(isPromise(client.updateLogin({url: "", uuid: "", login: "", password: ""})));

    t.end();
});

test("values of the password entry should be properly decrypted", (t) => {
    t.plan(6);

    const expectedEntriesResponse = {
        Success: true,
        Nonce: "",
        Verifier: "",
        Entries: [
            {
                Name: "name",
                Login: "login",
                Password: "password",
                Uuid: "uuid",
            } as Response.Entry,
        ],
    };
    const encrypt = (key: string, iv: string, data: string) => {
        const cipher = createCipheriv(
            "aes-256-cbc",
            Buffer.from(key, "base64"),
            Buffer.from(iv, "base64"),
        );

        return Buffer
            .concat([cipher.update(Buffer.from(data, "utf8")), cipher.final()])
            .toString("base64");
    };
    const clientModule = "./client";
    const mockedModule = "request-promise-native";

    mockRequire(mockedModule, {
        post: () => {
            return new Promise((resolve) => {
                const key = clientOpts.keyId.key;
                const iv = randomBytes(16).toString("base64");

                const httpResponse = JSON.parse(JSON.stringify(expectedEntriesResponse));
                const httpResponseEntry = httpResponse.Entries[0];

                httpResponse.Nonce = iv;
                httpResponse.Verifier = encrypt(key, iv, iv);

                httpResponseEntry.Name = encrypt(key, iv, httpResponse.Entries[0].Name as string);
                httpResponseEntry.Login = encrypt(key, iv, httpResponse.Entries[0].Login as string);
                httpResponseEntry.Password = encrypt(key, iv, httpResponse.Entries[0].Password as string);
                httpResponseEntry.Uuid = encrypt(key, iv, httpResponse.Entries[0].Uuid);

                resolve(httpResponse);
            });
        },
    });

    // uncache previously loaded library
    delete require.cache[require.resolve(clientModule)];

    const reImportedKeePassHttpClient = require(clientModule).KeePassHttpClient;
    const client = new reImportedKeePassHttpClient(clientOpts);

    client.getLogins({url: ""})
        .then((response: Response.Complete) => {
            if (!response || !response.Entries) {
                t.fail("Invalid response");
                return;
            }

            const entry = response.Entries[0];
            const expectedEntry = expectedEntriesResponse.Entries[0];

            t.ok(response);
            t.ok(response.Entries && response.Entries.length === 1);

            t.equal(entry.Uuid, expectedEntry.Uuid);
            t.equal(entry.Name, expectedEntry.Name);
            t.equal(entry.Login, expectedEntry.Login);
            t.equal(entry.Password, expectedEntry.Password);

            mockRequire.stop(mockedModule);
        });
});
