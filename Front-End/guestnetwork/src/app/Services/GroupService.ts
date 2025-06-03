import { Group } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getGroups = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();

    const url = `${basicUrl}/group${queryString ? `?${queryString}` : ''}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}

const addGroup = async (group: Group) => {
    return fetch(`${basicUrl}/group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(group)
    });
}

const updateGroup = async (groupName: string, updates: Partial<Group>) => {
    return fetch(`${basicUrl}/group/${groupName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates)
    });
}

const deleteGroup = async (groupName: string) => {
    const response = await fetch(`${basicUrl}/group/${groupName}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete group.');
    }

    return response;
}

const regengroupPw = async (groupName: string) => {
    return fetch(`${basicUrl}/group/regen/${groupName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
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