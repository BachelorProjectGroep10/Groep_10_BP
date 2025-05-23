import knex from "../../util/database";
import { Vlan } from "../model/Vlan";


const getVlans = async (): Promise<Vlan[]> => {
    try{
        const rows = await knex('vlan')
            .select('vlan.*')
            .where('vlan.name', '!=', 'NULL');

        return rows.map((row) => {
            return new Vlan({
                id: row.id,
                vlan: row.number,
                name: row.name,
                isDefault: row.isDefault
            });
        });

    }catch (err) {
        console.error('DB error fetching vlans:', err);
        throw new Error('Fetch failed');
    }
}

export { getVlans };