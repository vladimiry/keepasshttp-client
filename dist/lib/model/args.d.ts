export interface Minimum {
    url: string;
}
export interface Base extends Minimum {
    submitUrl?: string;
    realm?: string;
}
export interface Modify extends Minimum {
    login: string;
    password: string;
}
export interface Create extends Modify, Base {
    login: string;
    password: string;
}
export interface Update extends Modify {
    login: string;
    password: string;
    uuid: string;
}
