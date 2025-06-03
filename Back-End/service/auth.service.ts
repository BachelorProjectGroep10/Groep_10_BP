import { getStaff, getStaffByMail } from "../domain/data-access/staff.db";
import { generateJwtToken } from "../util/jwt";


const simpleAuthenticate = async ({username, password}: { username: string; password: string }) => {
    const staff = await getStaff(username);
    if (!staff) {
        throw new Error('Admin not found');
    }
    if (staff.password !== password) {
        throw new Error('Invalid password');
    }
    return {
        id: staff.id,
        username: staff.username,
        email: staff.email,
        role: staff.role,
    }
}

const checkUser = async (email: string) => {
    const staff = await getStaffByMail(email);

    if (!staff) {
        return null;
    }

    return {
        id: staff.id,
        username: staff.username,
        email: staff.email,
        role: staff.role,
    };
}

export default {
    simpleAuthenticate,
    checkUser,
}