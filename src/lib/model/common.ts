import * as Response from "./response";
import * as Request from "./request";

export interface KeyId {
    key: string;
    id: string;
}

export enum ErrorCode {
    IdUndefined,
}

export class TypedError extends Error {
    constructor(message: string, public code?: ErrorCode) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NetworkConnectionError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NetworkResponseStatusCodeError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NetworkResponseContentError<T extends Response.Base> extends Error {
    constructor(message: string, public request: Request.Request, public response: T) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
