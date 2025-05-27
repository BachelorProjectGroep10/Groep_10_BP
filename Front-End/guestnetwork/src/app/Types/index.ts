export type Password = {
    readonly password: string;
};

export type User = {
    readonly id?: number;
    readonly macAddress: string;
    readonly email?: string;
    readonly uid?: string;
    readonly password?: string;
    readonly expiredAt: Date;
    readonly active: number;
    readonly description?: string;
    readonly groupName?: string | null;
    readonly vlan?: number;
}

export type Group = {
    readonly id?: number;
    readonly groupName: string;
    readonly description?: string;
    readonly password?: string;
    readonly vlan?: number;
};

export type Event = {
    readonly id?: number;
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly password?: string;
    readonly description?: string;
}

export type Vlan = {
    readonly id?: number;          
    readonly vlan: number;
    readonly name: string;
    readonly isDefault: number;
}

export type Admin = {
    readonly username: string;
    readonly password: string;
};