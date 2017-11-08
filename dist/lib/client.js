"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var common_1 = require("./model/common");
var model_1 = require("./model");
var util_1 = require("./util");
var KeePassHttpClient = /** @class */ (function () {
    function KeePassHttpClient(opts) {
        this._url = "http://localhost:19455";
        if (opts && opts.url) {
            this._url = opts.url;
        }
        if (opts && opts.keyId) {
            this._id = opts.keyId.id;
            this._key = opts.keyId.key;
        }
        else {
            this._key = util_1.generateRandomBase64(util_1.KEY_SIZE);
        }
    }
    Object.defineProperty(KeePassHttpClient.prototype, "url", {
        get: function () {
            return this._url;
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(new model_1.Request.TestAssosiate(this.key, this.id))];
            });
        });
    };
    KeePassHttpClient.prototype.associate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(new model_1.Request.Associate(this.key))];
                    case 1:
                        response = _a.sent();
                        this._id = response.Id;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    KeePassHttpClient.prototype.getLogins = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var response, decryptValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(new model_1.Request.GetLogins(this.key, this.id, args))];
                    case 1:
                        response = _a.sent();
                        decryptValue = (function (value) { return util_1.decrypt(_this.key, response.Nonce, value); });
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
                        return [2 /*return*/, response];
                }
            });
        });
    };
    KeePassHttpClient.prototype.getLoginsCount = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(new model_1.Request.GetLoginsCount(this.key, this.id, args))];
            });
        });
    };
    KeePassHttpClient.prototype.createLogin = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(new model_1.Request.CreateLogin(this.key, this.id, args))];
            });
        });
    };
    KeePassHttpClient.prototype.updateLogin = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(new model_1.Request.UpdateLogin(this.key, this.id, args))];
            });
        });
    };
    KeePassHttpClient.prototype.request = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var body, fetchedResponse, err_1, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = JSON.stringify(request);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, node_fetch_1.default(this.url, { method: "POST", body: body })];
                    case 2:
                        fetchedResponse = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        throw new common_1.NetworkConnectionError(err_1.message);
                    case 4:
                        if (!fetchedResponse.ok) {
                            throw new common_1.NetworkResponseStatusCodeError(fetchedResponse.statusText, fetchedResponse.status);
                        }
                        return [4 /*yield*/, fetchedResponse.json()];
                    case 5:
                        response = _a.sent();
                        if (!response || !response.Success || response.Error) {
                            throw new common_1.NetworkResponseContentError("Remote service responded with an error response", request, response);
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return KeePassHttpClient;
}());
exports.KeePassHttpClient = KeePassHttpClient;
