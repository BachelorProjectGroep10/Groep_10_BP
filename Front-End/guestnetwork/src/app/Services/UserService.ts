import { User } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getUsers = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    
    const url = `${basicUrl}/user${queryString ? `?${queryString}` : ''}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

const addUser = async (user: User) => {
    return fetch(`${basicUrl}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user)
    });
}

const updateUser = async (macAddress: string, updates: Partial<User>) => {
    return fetch(`${basicUrl}/user/${macAddress}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates)
    });
}

const deleteUser = async (macAddress: string) => {
    return fetch(`${basicUrl}/user/${macAddress}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}

const regenUserPw = async (macAddress: string) => {
    return fetch(`${basicUrl}/user/regen/${macAddress}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
};

const addToGroup = async (macAddress: string, groupName: string) => {
    return fetch(`${basicUrl}/user/addToGroup/${macAddress}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ groupName })
    });
};

const removeFromGroup = async (macAddress: string, groupName: string) => {
    return fetch(`${basicUrl}/user/removeFromGroup/${macAddress}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ groupName })
    });
};

const UserService = {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    regenUserPw,
    addToGroup,
    removeFromGroup
};

export default UserService;