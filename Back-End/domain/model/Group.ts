export class Group {
    readonly id?: number;          
    readonly groupName: string;
    readonly description?: string;
    readonly password?: string;
    
    constructor(data: {
        id?: number;
        groupName: string;
        description?: string;
        password?: string;
    }) {
        this.id = data.id;
        this.groupName = data.groupName;
        this.description = data.description;
        this.password = data.password;
    }
}