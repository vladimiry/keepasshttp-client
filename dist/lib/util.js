"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
exports.BASE64 = "base64";
exports.UTF8 = "utf8";
exports.IV_SIZE = 16;
exports.KEY_SIZE = 32;
exports.ENCRYPTION_ALGORITHM = "aes-256-cbc";
exports.base64ToBuffer = function (value) { return Buffer.from(value, exports.BASE64); };
exports.generateRandomBase64 = function (size) { return crypto_1.randomBytes(size).toString(exports.BASE64); };
exports.encrypt = function (key, iv, data) {
    var cipherIv = crypto_1.createCipheriv(exports.ENCRYPTION_ALGORITHM, exports.base64ToBuffer(key), exports.base64ToBuffer(iv));
    var cipher = Buffer.concat([cipherIv.update(Buffer.from(data, exports.UTF8)), cipherIv.final()]);
    return cipher.toString(exports.BASE64);
};
exports.decrypt = function (key, iv, data) {
    var decipherIv = crypto_1.createDecipheriv(exports.ENCRYPTION_ALGORITHM, exports.base64ToBuffer(key), exports.base64ToBuffer(iv));
    var decipher = Buffer.concat([decipherIv.update(exports.base64ToBuffer(data)), decipherIv.final()]);
    return decipher.toString(exports.UTF8);
};
