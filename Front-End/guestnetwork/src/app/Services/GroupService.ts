import { Group } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getGroups = async () => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/group`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`       
        }
    });
}

const addGroup = async (group: Group) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(group)
    });
}

const GroupService = {
    getGroups,
    addGroup
};

export default GroupService;