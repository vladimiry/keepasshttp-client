import * as Response from "./response";
import * as Request from "./request";
export interface KeyId {
    key: string;
    id: string;
}
export declare enum ErrorCode {
    IdUndefined = 0,
    ArgsUndefined = 1,
}
export declare class TypedError extends Error {
    code: ErrorCode | undefined;
    constructor(message: string, code?: ErrorCode | undefined);
}
export declare class ErrorResponse<T extends Response.Base> extends TypedError {
    request: Request.Request;
    response: T;
    constructor(message: string, request: Request.Request, response: T, code?: ErrorCode);
}
