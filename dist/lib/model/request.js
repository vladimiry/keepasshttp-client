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
var Type;
(function (Type) {
    Type["TestAssosiate"] = "test-associate";
    Type["Associate"] = "associate";
    Type["GetLogins"] = "get-logins";
    Type["GetLoginsCount"] = "get-logins-count";
    Type["SetLogin"] = "set-login";
})(Type = exports.Type || (exports.Type = {}));
var Base = /** @class */ (function () {
    function Base() {
        this.TriggerUnlock = false;
    }
    return Base;
}());
exports.Base = Base;
var TestAssosiate = /** @class */ (function (_super) {
    __extends(TestAssosiate, _super);
    function TestAssosiate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.RequestType = Type.TestAssosiate;
        return _this;
    }
    return TestAssosiate;
}(Base));
exports.TestAssosiate = TestAssosiate;
var Associate = /** @class */ (function (_super) {
    __extends(Associate, _super);
    function Associate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.RequestType = Type.Associate;
        return _this;
    }
    return Associate;
}(Base));
exports.Associate = Associate;
var RequiredId = /** @class */ (function (_super) {
    __extends(RequiredId, _super);
    function RequiredId() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RequiredId;
}(Base));
exports.RequiredId = RequiredId;
var Logins = /** @class */ (function (_super) {
    __extends(Logins, _super);
    function Logins() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.SortSelection = false;
        return _this;
    }
    return Logins;
}(RequiredId));
exports.Logins = Logins;
var GetLogins = /** @class */ (function (_super) {
    __extends(GetLogins, _super);
    function GetLogins() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.RequestType = Type.GetLogins;
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
}(Logins));
exports.GetLoginsCount = GetLoginsCount;
var ModifyLogin = /** @class */ (function (_super) {
    __extends(ModifyLogin, _super);
    function ModifyLogin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.RequestType = Type.SetLogin;
        return _this;
    }
    return ModifyLogin;
}(Logins));
exports.ModifyLogin = ModifyLogin;
var CreateLogin = /** @class */ (function (_super) {
    __extends(CreateLogin, _super);
    function CreateLogin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CreateLogin;
}(ModifyLogin));
exports.CreateLogin = CreateLogin;
var UpdateLogin = /** @class */ (function (_super) {
    __extends(UpdateLogin, _super);
    function UpdateLogin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateLogin;
}(ModifyLogin));
exports.UpdateLogin = UpdateLogin;
