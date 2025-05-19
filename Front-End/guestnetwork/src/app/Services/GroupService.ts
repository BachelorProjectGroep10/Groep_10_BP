import { Group } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getGroups = async () => {
    const storedToken = sessionStorage.getItem('admin');
    const token = storedToken ? JSON.parse(storedToken).token : null;
    return fetch(`${basicUrl}/group`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`       
        }
    });
}

const addGroup = async (group: Group) => {
    const storedToken = sessionStorage.getItem('admin');
    const token = storedToken ? JSON.parse(storedToken).token : null;
    return fetch(`${basicUrl}/group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(group)
    });
}

const UserService = {
    getGroups,
    addGroup
};

export default UserService;