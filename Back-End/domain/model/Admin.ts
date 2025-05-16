export class Admin {
    readonly id?: number;          
    readonly username: string;
    readonly password: string;
    readonly role?: string;

    constructor(data: {
        id?: number;
        username: string;
        password: string;
        role?: string;
    }) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.role = data.role;
    }
}