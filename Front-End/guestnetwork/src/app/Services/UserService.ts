import { User } from "../Types";

const basicUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

const getUsers = async () => {
    return fetch(`${basicUrl}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'          
        }
    });
}

const addUser = async (user: User) => {
    return fetch(`${basicUrl}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

const UserService = {
    getUsers,
    addUser
};

export default UserService;