import {test} from "ava";

import {KeePassHttpClient, Model} from "dist";
import {encrypt, generateRandomBase64, IV_SIZE, KEY_SIZE} from "../lib/private/util";

const clientOpts = {
    url: "http://localhost:12345",
    keyId: {
        id: "id-",
        key: generateRandomBase64(KEY_SIZE),
    },
};

test("constructor args should be setup as a member fields", (t) => {
    const client = new KeePassHttpClient(clientOpts);

    t.is(client.url, clientOpts.url);
    t.is(client.id, clientOpts.keyId.id);
    t.is(client.key, clientOpts.keyId.key);
});

test("request methods should fail if 'id' has not been setup", async (t) => {
    const client = new KeePassHttpClient();
    const assertError = (error: any) => {
        t.true(error instanceof Model.Common.TypedError, "error instance");
        t.is(Model.Common.ErrorCode.IdUndefined, error.code, "error code");
    };

    assertError(await t.throws(client.getLogins({url: ""})));
    assertError(await t.throws(client.getLoginsCount({url: ""})));
    assertError(await t.throws(client.createLogin({url: "", login: "", password: ""})));
    assertError(await t.throws(client.updateLogin({url: "", uuid: "", login: "", password: ""})));
});

test("requests methods should return a promises", (t) => {
    const isPromise = (object: any) => object && typeof object.then === "function"
        && typeof object.catch === "function";
    const client = new KeePassHttpClient(clientOpts);

    t.true(isPromise(client.testAssociate()));
    t.true(isPromise(client.associate()));
    t.true(isPromise(client.getLogins({url: ""})));
    t.true(isPromise(client.getLoginsCount({url: ""})));
    t.true(isPromise(client.createLogin({url: "", login: "", password: ""})));
    t.true(isPromise(client.updateLogin({url: "", uuid: "", login: "", password: ""})));
});

test("values of the password entry should be properly decrypted", async (t) => {
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
            } as Model.Response.Entry,
        ],
    };

    const client = new KeePassHttpClient(clientOpts);

    // mocking "request" method - it's not what is being tested in this case
    (client as any).request = () => {
        return new Promise((resolve) => {
            const key = clientOpts.keyId.key;
            const iv = generateRandomBase64(IV_SIZE);

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
    };

    const response = await client.getLogins({url: ""});

    if (!response || !response.Entries) {
        t.fail("Invalid response");
        return;
    }

    const entry = response.Entries[0];
    const expectedEntry = expectedEntriesResponse.Entries[0];

    t.truthy(response);
    t.truthy(response.Entries && response.Entries.length === 1);

    t.is(entry.Uuid, expectedEntry.Uuid);
    t.is(entry.Name, expectedEntry.Name);
    t.is(entry.Login, expectedEntry.Login);
    t.is(entry.Password, expectedEntry.Password);
});
