export type Password = {
    readonly password: string;
};

export type User = {
    readonly id?: number;
    readonly macAddress: string;
    readonly email?: string;
    readonly studentNumber?: string;
    readonly password: string;
    readonly timeNeeded: number;
    readonly active: number;
    readonly groupId?: number;
    readonly description?: string;
}

export type Admin = {
    readonly username: string;
    readonly password: string;
};