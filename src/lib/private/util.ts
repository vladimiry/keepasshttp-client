import {createCipheriv, createDecipheriv, randomBytes} from "crypto";

export const BASE64: BufferEncoding = "base64";
export const UTF8: BufferEncoding = "utf8";

export const IV_SIZE = 16;
export const KEY_SIZE = 32;
export const ENCRYPTION_ALGORITHM = "aes-256-cbc";

export const base64ToBuffer = (value: string) => Buffer.from(value, BASE64);

export const generateRandomBase64 = (size: number) => randomBytes(size).toString(BASE64);

export const encrypt = (key: string, iv: string, data: string) => {
    const cipherIv = createCipheriv(ENCRYPTION_ALGORITHM, base64ToBuffer(key), base64ToBuffer(iv));
    const cipher = Buffer.concat([cipherIv.update(Buffer.from(data, UTF8)), cipherIv.final()]);

    return cipher.toString(BASE64);
};

export const decrypt = (key: string, iv: string, data: string) => {
    const decipherIv = createDecipheriv(ENCRYPTION_ALGORITHM, base64ToBuffer(key), base64ToBuffer(iv));
    const decipher = Buffer.concat([decipherIv.update(base64ToBuffer(data)), decipherIv.final()]);

    return decipher.toString(UTF8);
};
