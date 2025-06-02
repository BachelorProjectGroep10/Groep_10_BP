import { getStaff } from "../domain/data-access/staff.db";
import { generateJwtToken } from "../util/jwt";


const simpleAuthenticate = async ({username, password}: { username: string; password: string }) => {
    const admin = await getStaff(username);
    if (!admin) {
        throw new Error('Admin not found');
    }
    if (admin.password !== password) {
        throw new Error('Invalid password');
    }
    return {
        token : generateJwtToken({ userId: admin.id, username: admin.username }),
        username: admin.username,
        role: admin.role,
    }
}

const checkUser = async (username: string) => {
    const staff = await getStaff(username);
    if (!staff) {
        throw new Error('User not found');
    }
    return {
        id: staff.id,
        username: staff.username,
        role: staff.role,
    };
}

export default {
    simpleAuthenticate,
    checkUser,
}