import { Group } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getGroups = async (params = {}) => {
    const token = sessionStorage.getItem("token") || "";
    const queryString = new URLSearchParams(params).toString();

    const url = `${basicUrl}/group${queryString ? `?${queryString}` : ''}`;

    return fetch(url, {
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

const updateGroup = async (groupName: string, updates: Partial<Group>) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/group/${groupName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
    });
}

const deleteGroup = async (groupName: string) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/group/${groupName}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
}

const regengroupPw = async (groupName: string) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/group/regen/${groupName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
}


const GroupService = {
    getGroups,
    addGroup,
    updateGroup,
    deleteGroup,
    regengroupPw
};

export default GroupService;