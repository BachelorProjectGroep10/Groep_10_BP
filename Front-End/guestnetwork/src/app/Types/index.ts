export type Password = {
    readonly password: string;
};

export type User = {
    readonly id?: number;
    readonly macAddress: string;
    readonly email?: string;
    readonly studentNumber?: string;
    readonly password?: string;
    readonly expiredAt: Date;
    readonly active: number;
    readonly groupId?: number;
    readonly description?: string;
}

export type Group = {
    readonly id?: number;
    readonly groupName: string;
    readonly description: string;
    readonly password?: string;
};

export type Vlan = {
    readonly id?: number;
    readonly vlanNumber: number;
    readonly vlanName: string;
    readonly isDefault?: boolean;
}

export type Admin = {
    readonly username: string;
    readonly password: string;
};