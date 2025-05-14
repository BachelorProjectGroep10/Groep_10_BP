export class Password {
    readonly password: string;

    constructor(customer: { 
        password: string;
    }) {
        this.password = customer.password;
    }
}