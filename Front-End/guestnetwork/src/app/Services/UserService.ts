import { User } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getUsers = async () => {
    const token = sessionStorage.getItem("token") || "";
    return fetch(`${basicUrl}/user`, {
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

const UserService = {
    getUsers,
    addUser
};

export default UserService;