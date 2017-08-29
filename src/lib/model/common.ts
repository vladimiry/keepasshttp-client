import * as Response from "./response";
import * as Request from "./request";

export interface KeyId {
    key: string;
    id: string;
}

export enum ErrorCode {
    IdUndefined,
    ArgsUndefined,
}

export class TypedError extends Error {
    constructor(message: string, public code?: ErrorCode) {
        super(message);
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}

export class ErrorResponse<T extends Response.Base> extends TypedError {
    constructor(message: string, public request: Request.Request, public response: T, code?: ErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}
