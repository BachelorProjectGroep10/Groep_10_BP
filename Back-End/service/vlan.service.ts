import { Vlan } from "../domain/model/Vlan";
import { getVlans } from "../domain/data-access/vlan.db";

const getAllVlans = async ():Promise<Vlan[]> => {
    const vlans = await getVlans();
    return vlans.map(vlan => {
        return new Vlan({
            id: vlan.id,
            vlan: vlan.vlan,
            name: vlan.name,
            isDefault: vlan.isDefault
        });
    });
}

export default { getAllVlans };