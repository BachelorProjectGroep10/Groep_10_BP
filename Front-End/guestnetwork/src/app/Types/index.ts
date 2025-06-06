export type Password = {
    readonly password: {value: string}[];
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
  readonly eventName: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly description?: string;
  readonly password?: {
    value: string;
    week: number;
    year: number;
    validNow: boolean;
  }[];
};

export type WeeklyPassword = {
  value: string;
  week: number;
  year: number;
  validNow: boolean;
}

export type Vlan = {
    readonly id?: number;          
    readonly vlan: number;
    readonly name: string;
    readonly isDefault: number;
}

export type Staff = {
    readonly username: string;
    readonly password: string;
};

export type LoginResponse = {
    readonly username: string;
    readonly email: string;
    readonly role: string;
};