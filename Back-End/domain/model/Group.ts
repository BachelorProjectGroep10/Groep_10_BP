export class Group {
    readonly id?: number;          
    readonly groupName: string;
    readonly description?: string;
    readonly password?: string;
    readonly expiredAt: Date;
    
    constructor(data: {
        id?: number;
        groupName: string;
        description?: string;
        password?: string;
        expiredAt: Date;
    }) {
        this.id = data.id;
        this.groupName = data.groupName;
        this.description = data.description;
        this.password = data.password;
        this.expiredAt = data.expiredAt;
    }
}