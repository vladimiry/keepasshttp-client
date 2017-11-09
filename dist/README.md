# KeePassHttp Client

is a Node.js module for interaction with [KeePassHTTP](https://github.com/pfn/keepasshttp).

## Notes

- Code is written in TypeScript.
- Supported request types: `test-associate`, `associate`, `get-logins`, `get-logins-count`, `set-login`. Respective methods return ES2015 Promises.

## Code Example

Associating with KeePassHTTP, caching received `id` and `key` values and then passwords requesting:
```typescript
    import * as nconf from "nconf";
    import {KeePassHttpClient} from "keepasshttp-client";
    
    // we will be using "nconf" as a cache store, but you can use any store for this purpose
    nconf.file(".keepasshttp-creds");
    
    const client = new KeePassHttpClient();
    
    client
        .associate()
        .then(() => {
            // at this stage (after successful associating) key and id are setup as a members of the client instance
            // so now we are ready to initiate the "get-logins" request
            // but let's first cache initialized key/id for future use
            nconf.set("id", client.id);
            nconf.set("key", client.key);
            nconf.save(() => {
                client.getLogins({url: "https://domain.com"})
                    .then((response) => {
                        console.log(JSON.stringify(response, null, 4));
                    });
            });
        });
```

Requesting passwords using previously cached `id` and `key` values:
```typescript
    import * as nconf from "nconf";
    import {KeePassHttpClient} from "keepasshttp-client";
    
    nconf.file(".keepasshttp-creds");
    
    const client = new KeePassHttpClient({
        // url: "http://localhost:19555",
        keyId: {
            id: nconf.get("id"),
            key: nconf.get("key"),
        },
    });
    
    client
        .getLogins({url: "https://domain.com"})
        .then((response) => {
            console.log(JSON.stringify(response, null, 4));
        });
```
## Links

 * [KeePass](http://keepass.info/) - original "Keepass Password Safe" password manager.
 * [KeePassHTTP](https://github.com/pfn/keepasshttp) - KeePass plugin that exposes passwords entries via HTTP for clients to consume.
 * [KeePassXC](https://github.com/keepassxreboot/keepassxc) - cross-platform community-driven port of the Windows application "Keepass Password Safe". It has built-in KeePassHTTP protocol support.
