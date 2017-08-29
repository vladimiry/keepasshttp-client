"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_native_1 = require("request-promise-native");
var crypto_1 = require("crypto");
var model_1 = require("./model");
var common_1 = require("./model/common");
var base64 = "base64";
var utf8 = "utf8";
var base64ToBuffer = function (value) { return Buffer.from(value, base64); };
var KeePassHttpClient = (function () {
    function KeePassHttpClient(opts) {
        this.ivSize = 16;
        this.keySize = 32;
        this.encryptionAlgorithm = "aes-256-cbc";
        this._uri = "http://localhost:19455";
        if (opts && opts.uri) {
            this._uri = opts.uri;
        }
        if (opts && opts.keyId) {
            this._id = opts.keyId.id;
            this._key = opts.keyId.key;
        }
        else {
            this._key = this.generateKey(this.keySize);
        }
    }
    Object.defineProperty(KeePassHttpClient.prototype, "uri", {
        get: function () {
            return this._uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeePassHttpClient.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeePassHttpClient.prototype, "key", {
        get: function () {
            return this._key;
        },
        enumerable: true,
        configurable: true
    });
    KeePassHttpClient.prototype.testAssociate = function () {
        return this.execute(model_1.Request.TestAssosiate);
    };
    KeePassHttpClient.prototype.associate = function () {
        var _this = this;
        return this
            .execute(model_1.Request.Associate)
            .then(function (response) {
            _this._id = response.Id;
            return response;
        });
    };
    KeePassHttpClient.prototype.getLogins = function (args) {
        var _this = this;
        return this
            .execute(model_1.Request.GetLogins, args)
            .then(function (response) {
            var decryptValue = (function (value) { return _this.decrypt(response.Nonce, value); });
            if (response.Entries) {
                response.Entries.forEach(function (entry) {
                    entry.Name = decryptValue(entry.Name);
                    entry.Login = decryptValue(entry.Login);
                    entry.Password = decryptValue(entry.Password);
                    entry.Uuid = decryptValue(entry.Uuid);
                    if (entry.StringFields) {
                        entry.StringFields.forEach(function (field) {
                            field.Key = decryptValue(field.Key);
                            field.Value = decryptValue(field.Value);
                        });
                    }
                });
            }
            return response;
        });
    };
    KeePassHttpClient.prototype.getLoginsCount = function (args) {
        return this.execute(model_1.Request.GetLoginsCount, args);
    };
    KeePassHttpClient.prototype.setLogin = function (args) {
        return this.execute(model_1.Request.SetLogin, args);
    };
    KeePassHttpClient.prototype.execute = function (requestConstructor, args) {
        var _this = this;
        var request = new requestConstructor();
        if (request instanceof model_1.Request.RequiredId && !this.id) {
            throw new common_1.TypedError("The 'id' field must be defined to request/save a login. Use 'associate' method to get the 'id' value.", common_1.ErrorCode.IdUndefined);
        }
        if (request instanceof model_1.Request.RequiredId || request instanceof model_1.Request.TestAssosiate) {
            request.Id = this.id;
        }
        if (request instanceof model_1.Request.Base) {
            var nonce = this.generateKey();
            request.Nonce = nonce;
            request.Verifier = this.encrypt(nonce, nonce);
        }
        if (request instanceof model_1.Request.Associate) {
            request.Key = this._key;
        }
        if (request instanceof model_1.Request.Logins) {
            if (!args) {
                throw new common_1.TypedError("Request parameters have not been passed", common_1.ErrorCode.ArgsUndefined);
            }
            var encryptValue = function (value) { return _this.encrypt(request.Nonce, value); };
            request.Url = encryptValue(args.url);
            if (args.realm) {
                request.Realm = encryptValue(args.realm);
            }
            if (request instanceof model_1.Request.SetLogin) {
                var updatingArgs = args;
                request.Uuid = encryptValue(updatingArgs.uuid);
                request.Login = encryptValue(updatingArgs.login);
                request.Password = encryptValue(updatingArgs.password);
                request.Url = encryptValue(updatingArgs.url);
                request.SubmitUrl = request.Url;
            }
            else if (args.submitUrl) {
                request.SubmitUrl = encryptValue(args.submitUrl);
            }
        }
        return this.request(request);
    };
    KeePassHttpClient.prototype.request = function (request) {
        return request_promise_native_1.post(this.uri, { json: true, body: request })
            .then(function (response) {
            if (!response || !response.Success || response.Error) {
                throw new common_1.ErrorResponse("Remote service responded with an error response", request, response);
            }
            return response;
        });
    };
    KeePassHttpClient.prototype.generateKey = function (size) {
        if (size === void 0) { size = this.ivSize; }
        return crypto_1.randomBytes(size).toString(base64);
    };
    KeePassHttpClient.prototype.encrypt = function (iv, data) {
        var cipher = crypto_1.createCipheriv(this.encryptionAlgorithm, base64ToBuffer(this._key), base64ToBuffer(iv));
        return Buffer
            .concat([cipher.update(Buffer.from(data, utf8)), cipher.final()])
            .toString(base64);
    };
    KeePassHttpClient.prototype.decrypt = function (iv, data) {
        var decipher = crypto_1.createDecipheriv(this.encryptionAlgorithm, base64ToBuffer(this._key), base64ToBuffer(iv));
        return Buffer
            .concat([decipher.update(base64ToBuffer(data)), decipher.final()])
            .toString(utf8);
    };
    return KeePassHttpClient;
}());
exports.KeePassHttpClient = KeePassHttpClient;
