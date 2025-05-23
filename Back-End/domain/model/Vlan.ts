export class Vlan {
    readonly id?: number;          
    readonly vlan: number;
    readonly name: string;
    readonly isDefault: boolean;


    constructor(data: {
        id?: number;
        vlan: number;
        name: string;
        isDefault: boolean;
    }) {
        this.id = data.id;
        this.vlan = data.vlan;
        this.name = data.name;
        this.isDefault = data.isDefault;
    }
}