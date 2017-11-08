"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var common_1 = require("./common");
var Type;
(function (Type) {
    Type["TestAssosiate"] = "test-associate";
    Type["Associate"] = "associate";
    Type["GetLogins"] = "get-logins";
    Type["GetLoginsCount"] = "get-logins-count";
    Type["SetLogin"] = "set-login";
})(Type = exports.Type || (exports.Type = {}));
var Base = /** @class */ (function () {
    function Base(key) {
        var _this = this;
        this.TriggerUnlock = false;
        this.encryptValue = function (value) { return util_1.encrypt(key, _this.Nonce, value); };
        this.Nonce = util_1.generateRandomBase64(util_1.IV_SIZE);
        this.Verifier = this.encryptValue(this.Nonce);
    }
    return Base;
}());
exports.Base = Base;
var TestAssosiate = /** @class */ (function (_super) {
    __extends(TestAssosiate, _super);
    function TestAssosiate(key, id) {
        var _this = _super.call(this, key) || this;
        _this.RequestType = Type.TestAssosiate;
        if (typeof id !== "undefined") {
            _this.Id = id;
        }
        return _this;
    }
    return TestAssosiate;
}(Base));
exports.TestAssosiate = TestAssosiate;
var Associate = /** @class */ (function (_super) {
    __extends(Associate, _super);
    function Associate(key) {
        var _this = _super.call(this, key) || this;
        _this.RequestType = Type.Associate;
        _this.Key = key;
        return _this;
    }
    return Associate;
}(Base));
exports.Associate = Associate;
var RequiredId = /** @class */ (function (_super) {
    __extends(RequiredId, _super);
    function RequiredId(key, id) {
        var _this = _super.call(this, key) || this;
        if (!id) {
            throw new common_1.TypedError("The 'id' field must be defined to request/save a login. Use 'associate' method to get the 'id' value.", common_1.ErrorCode.IdUndefined);
        }
        _this.Id = id;
        return _this;
    }
    return RequiredId;
}(Base));
exports.RequiredId = RequiredId;
var Logins = /** @class */ (function (_super) {
    __extends(Logins, _super);
    function Logins(key, id, args) {
        var _this = _super.call(this, key, id) || this;
        _this.SortSelection = false;
        _this.Url = _this.encryptValue(args.url);
        return _this;
    }
    return Logins;
}(RequiredId));
exports.Logins = Logins;
var GetLogins = /** @class */ (function (_super) {
    __extends(GetLogins, _super);
    function GetLogins(key, id, args) {
        var _this = _super.call(this, key, id, args) || this;
        _this.RequestType = Type.GetLogins;
        if (args.submitUrl) {
            _this.SubmitUrl = _this.encryptValue(args.submitUrl);
            if (args.realm) {
                _this.Realm = _this.encryptValue(args.realm);
            }
        }
        return _this;
    }
    return GetLogins;
}(Logins));
exports.GetLogins = GetLogins;
var GetLoginsCount = /** @class */ (function (_super) {
    __extends(GetLoginsCount, _super);
    function GetLoginsCount() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.RequestType = Type.GetLoginsCount;
        return _this;
    }
    return GetLoginsCount;
}(GetLogins));
exports.GetLoginsCount = GetLoginsCount;
var ModifyLogin = /** @class */ (function (_super) {
    __extends(ModifyLogin, _super);
    function ModifyLogin(key, id, args) {
        var _this = _super.call(this, key, id, args) || this;
        _this.RequestType = Type.SetLogin;
        _this.Login = _this.encryptValue(args.login);
        _this.Password = _this.encryptValue(args.password);
        return _this;
    }
    return ModifyLogin;
}(Logins));
exports.ModifyLogin = ModifyLogin;
var CreateLogin = /** @class */ (function (_super) {
    __extends(CreateLogin, _super);
    function CreateLogin(key, id, args) {
        var _this = _super.call(this, key, id, args) || this;
        _this.SubmitUrl = args.submitUrl;
        if (args.realm) {
            _this.Realm = _this.encryptValue(args.realm);
        }
        return _this;
    }
    return CreateLogin;
}(ModifyLogin));
exports.CreateLogin = CreateLogin;
var UpdateLogin = /** @class */ (function (_super) {
    __extends(UpdateLogin, _super);
    function UpdateLogin(key, id, args) {
        var _this = _super.call(this, key, id, args) || this;
        _this.Uuid = _this.encryptValue(args.uuid);
        return _this;
    }
    return UpdateLogin;
}(ModifyLogin));
exports.UpdateLogin = UpdateLogin;
