/// <reference types="node" />
export declare const BASE64: BufferEncoding;
export declare const UTF8: BufferEncoding;
export declare const IV_SIZE = 16;
export declare const KEY_SIZE = 32;
export declare const ENCRYPTION_ALGORITHM = "aes-256-cbc";
export declare const base64ToBuffer: (value: string) => Buffer;
export declare const generateRandomBase64: (size: number) => string;
export declare const encrypt: (key: string, iv: string, data: string) => string;
export declare const decrypt: (key: string, iv: string, data: string) => string;
