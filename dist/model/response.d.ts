import { Type } from "./request";
export interface StringField {
    Key: string;
    Value: string;
}
export interface Entry {
    Login?: string;
    Name?: string;
    Password?: string;
    StringFields?: [StringField];
    Uuid: string;
}
export interface Base {
    Count?: number;
    Entries?: [Entry];
    Error?: string;
    Hash: string;
    Nonce?: string;
    RequestType: [Type];
    Success: boolean;
    Verifier?: string;
    Version: string;
    objectName?: string;
}
export interface Complete extends Base {
    Id: string;
}
