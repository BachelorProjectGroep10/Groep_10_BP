import { Vlan } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getVlans = async () => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/vlan`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`       
        }
    });
}

const VlanService = {
    getVlans
};

export default VlanService;