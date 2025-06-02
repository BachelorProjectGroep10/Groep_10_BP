export class Staff {
    readonly id?: number;          
    readonly username: string;
    readonly email?: string;
    readonly password: string;
    readonly role?: string;

    constructor(data: {
        id?: number;
        username: string;
        email?: string;
        password: string;
        role?: string;
    }) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
    }
}