import { User } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getUsers = async (params = {}) => {
    const token = sessionStorage.getItem("token") || "";
    const queryString = new URLSearchParams(params).toString();
    
    const url = `${basicUrl}/user${queryString ? `?${queryString}` : ''}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
}

const addUser = async (user: User) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    });
}

const deleteUser = async (macAddress: string) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/user/${macAddress}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
}

const regenUserPw = async (macAddress: string) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/user/regen/${macAddress}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
};

const addToGroup = async (macAddress: string, groupName: string) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/user/addToGroup/${macAddress}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupName })
    });
};

const removeFromGroup = async (macAddress: string, groupName: string) => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/user/removeFromGroup/${macAddress}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupName })
    });
};

const UserService = {
    getUsers,
    addUser,
    deleteUser,
    regenUserPw,
    addToGroup,
    removeFromGroup
};

export default UserService;