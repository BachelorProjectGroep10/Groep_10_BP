import { Staff } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;


const simpleLogin = async (staff:Staff) => {
    return fetch(`${basicUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'          
        },
        credentials: 'include',
        body: JSON.stringify(staff)
    });
};


const microsoftLogin = async () => {
    const url = `${basicUrl}/auth/microsoft/login`;
    return fetch(url, {
        method: 'GET',
    });
}

const verifyUserData = async () => {
    const url = `${basicUrl}/auth/me`;
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    });
}

const logout = async () => {
    const url = `${basicUrl}/auth/logout`;
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    });
}

const AdminService = {
    simpleLogin,
    microsoftLogin,
    verifyUserData,
    logout
};

export default AdminService;