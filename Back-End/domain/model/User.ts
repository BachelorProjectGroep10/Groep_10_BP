export class User {
    readonly id?: number;          
    readonly macAddress: string;
    readonly email?: string;
    readonly uid?: string;
    readonly password?: string;
    readonly expiredAt: Date;
    readonly active: number;
    readonly description?: string;
    readonly groupName?: string;
    
    constructor(data: {
        id?: number;
        macAddress: string;
        email?: string;
        uid?: string;
        password?: string;
        expiredAt: Date;
        active: number;
        description?: string;
        groupName?: string;
    }) {
        this.id = data.id;
        this.macAddress = data.macAddress;
        this.email = data.email;
        this.uid = data.uid;
        this.password = data.password;
        this.expiredAt = data.expiredAt;
        this.active = data.active;
        this.description = data.description;
        this.groupName = data.groupName;
    }
}