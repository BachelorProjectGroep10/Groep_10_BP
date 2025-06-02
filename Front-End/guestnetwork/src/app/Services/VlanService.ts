import { Vlan } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getVlans = async () => {
    return fetch(`${basicUrl}/vlan`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
}

const VlanService = {
    getVlans
};

export default VlanService;