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
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["IdUndefined"] = 0] = "IdUndefined";
    ErrorCode[ErrorCode["ArgsUndefined"] = 1] = "ArgsUndefined";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var TypedError = /** @class */ (function (_super) {
    __extends(TypedError, _super);
    function TypedError(message, code) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.code = code;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return TypedError;
}(Error));
exports.TypedError = TypedError;
var ErrorResponse = /** @class */ (function (_super) {
    __extends(ErrorResponse, _super);
    function ErrorResponse(message, request, response, code) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message, code) || this;
        _this.request = request;
        _this.response = response;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return ErrorResponse;
}(TypedError));
exports.ErrorResponse = ErrorResponse;
