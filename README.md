# keepasshttp-client

is a Node.js module for interaction with [KeePassHTTP](https://github.com/pfn/keepasshttp).

## Notes

- Supported request types: `test-associate`, `associate`, `get-logins`, `get-logins-count`, `set-login`. Respective methods return ES2015 Promises.

## Usage Examples

Using TypeScript and async/await:
```typescript
import {KeePassHttpClient, Model as KeePassHttpClientModel} from "keepasshttp-client";
import {Model as StoreModel, Store} from "fs-json-store";
import {EncryptionAdapter} from "fs-json-store-encryption-adapter";

type KeePassHttpSettings = Partial<StoreModel.StoreEntity> & KeePassHttpClientModel.Common.KeyId;

const password = process.env.PASSWORD;

if (!password) {
    throw new Error("Empty password is not allowed");
}

// it's generally not secure to store the key/id values in the unencrypted form
// since basically a smart/targeted computer virus/trojan can read the unencrypted key/id values
// and fetch/modify your passwords interacting with the KeepassHttp using that key/id pair
// so we are going to use a simple encrypted storage
const store = new Store<KeePassHttpSettings>({
    file: ".keepasshttp-client.json",
    adapter: new EncryptionAdapter(
        password,
        {
            keyDerivation: {type: "sodium.crypto_pwhash", preset: "mode:moderate|algorithm:default"},
            encryption: {type: "sodium.crypto_secretbox_easy", preset: "algorithm:default"},
        },
    ),
});

const examplesSequence = [
    // associating with KeePassHttp and storing received key/id pair
    async () => {
        const client = new KeePassHttpClient(/*{url: "http://localhost:19455"}*/);

        await client.associate();

        // at this stage - after the successful associating with KeePassHttp
        // the key/id values are wired into the "client" instance
        // so now we are ready to initiate the getting password records request
        // but let's first cache the received key/id values for future use
        await store.write({key: client.key, id: client.id});

        // passwords requesting
        const records = await client.getLogins({url: "http://domain.com"});

        console.log(JSON.stringify(records, null, 2));
    },

    // requesting passwords using previously cached key/id pair
    async () => {
        const client = new KeePassHttpClient({
            // url: "http://localhost:19455",
            keyId: await store.read(),
        });

        const records = await client.getLogins({url: "http://domain.com"});

        console.log(JSON.stringify(records, null, 2));
    },
];

(async () => {
    for (const example of examplesSequence) {
        await example();
    }
})();
```
Using JavaScript and Promises:
```javascript
const {KeePassHttpClient} = require("keepasshttp-client");
const {Store} = require("fs-json-store");
const {EncryptionAdapter} = require("fs-json-store-encryption-adapter");

const password = process.env.PASSWORD;

if (!password) {
    throw new Error("Empty password is not allowed");
}

// it's generally not secure to store the key/id values in the unencrypted form
// since basically a smart/targeted computer virus/trojan can read the unencrypted key/id values
// and fetch/modify your passwords interacting with the KeepassHttp using that key/id pair
// so we are going to use a simple encrypted storage
const store = new Store({
    file: ".keepasshttp-client.json",
    adapter: new EncryptionAdapter(
        password,
        {
            keyDerivation: {type: "sodium.crypto_pwhash", preset: "mode:moderate|algorithm:default"},
            encryption: {type: "sodium.crypto_secretbox_easy", preset: "algorithm:default"},
        },
    ),
});

const examplesSequence = [
    // associating with KeePassHttp and storing received key/id pair
    () => {
        const client = new KeePassHttpClient(/*{url: "http://localhost:19455"}*/);

        return client.associate()
            // at this stage - after the successful associating with KeePassHttp
            // the key/id values are wired into the "client" instance
            // so now we are ready to initiate the getting password records request
            // but let's first cache the received key/id values for future use
            .then(() => store.write({key: client.key, id: client.id}))
            // passwords requesting
            .then(() => client.getLogins({url: "http://domain.com"}))
            .then((records) => console.log(JSON.stringify(records, null, 2)));
    },

    // requesting passwords using previously cached key/id pair
    () => {
        return store.read()
            .then((keyId) => new KeePassHttpClient({
                // url: "http://localhost:19455",
                keyId,
            }))
            .then((client) => client.getLogins({url: "http://domain.com"}))
            .then((records) => console.log(JSON.stringify(records, null, 2)));
    },
];

examplesSequence.reduce(
    (accumulator, example) => accumulator.then(example),
    Promise.resolve(),
);
```

## Links

 * [KeePass](http://keepass.info/) - original "Keepass Password Safe" password manager.
 * [KeePassHTTP](https://github.com/pfn/keepasshttp) - KeePass plugin that exposes passwords entries via HTTP for clients to consume.
 * [KeePassXC](https://github.com/keepassxreboot/keepassxc) - cross-platform community-driven port of the Windows application "Keepass Password Safe". It has built-in KeePassHTTP protocol support.
