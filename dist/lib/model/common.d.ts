import * as Response from "./response";
import * as Request from "./request";
export interface KeyId {
    key: string;
    id: string;
}
export declare enum ErrorCode {
    IdUndefined = 0,
}
export declare class TypedError extends Error {
    code: ErrorCode | undefined;
    constructor(message: string, code?: ErrorCode | undefined);
}
export declare class NetworkConnectionError extends Error {
    constructor(message: string);
}
export declare class NetworkResponseStatusCodeError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class NetworkResponseContentError<T extends Response.Base> extends Error {
    request: Request.Request;
    response: T;
    constructor(message: string, request: Request.Request, response: T);
}
