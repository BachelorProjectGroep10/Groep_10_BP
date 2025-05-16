import { getAdmin } from "../domain/data-access/admin.db";
import { generateJwtToken } from "../util/jwt";


const authenticate = async ({username, password}: { username: string; password: string }) => {
    const admin = await getAdmin(username);
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

export default {
    authenticate
}