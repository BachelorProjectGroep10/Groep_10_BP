import { execPath } from "process";

export type Password = {
    readonly password: string, 
    readonly valid: number
};

export type User = {
    readonly id?: number,          
    readonly macAddress: string,
    readonly email?: string,
    readonly studentNumber?: string,
    readonly password: string,
    readonly timeNeeded: number,
    readonly active: number,
    readonly description?: string
};

export type Vlan = {
    readonly id?: number;          
    readonly vlan: number;
    readonly name: string;
    readonly isDefault: boolean;
}

export type Staff = {
    readonly id?: number;
    readonly username: string;
    readonly email: string;
    readonly role: string;
}