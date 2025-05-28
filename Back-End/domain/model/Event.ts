export class Event {
    readonly id?: number;          
    readonly eventName: string;
    readonly password?: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly description?: string;

    constructor(data: {
        id?: number;
        eventName: string;
        password?: string;
        startDate: Date;
        endDate: Date;
        description?: string;
    }) {
        this.id = data.id;
        this.eventName = data.eventName;
        this.password = data.password;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.description = data.description;
    }
}
