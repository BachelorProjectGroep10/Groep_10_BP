export class User {
    readonly id?: number;          
    readonly macAddress: string;
    readonly email?: string;
    readonly studentNumber?: string;
    readonly password?: string;
    readonly expiredAt: Date;
    readonly active: number;
    readonly groupId?: number;
    readonly description?: string;
    
    constructor(data: {
        id?: number;
        macAddress: string;
        email?: string;
        studentNumber?: string;
        password?: string;
        expiredAt: Date;
        active: number;
        groupId?: number;
        description?: string;
    }) {
        this.id = data.id;
        this.macAddress = data.macAddress;
        this.email = data.email;
        this.studentNumber = data.studentNumber;
        this.password = data.password;
        this.expiredAt = data.expiredAt;
        this.active = data.active;
        this.groupId = data.groupId;
        this.description = data.description;
    }
}