import { User } from '../domain/model/User';
import { getUsers, insertUser } from '../domain/data-access/user.db';

const getAllUsers = async (): Promise<User[]> => {
    const users = await getUsers();
    return users.map(user => {
        return new User({
        id: user.id,
        macAddress: user.macAddress,
        email: user.email,
        uid: user.uid,
        password: user.password,
        expiredAt: user.expiredAt,
        active: user.active,
        description: user.description,
        vlan: user.vlan,
        groupName: user.groupName,
        });
    });
};

const addUser = async (user: User): Promise<void> => {
    const newUser = new User({
        macAddress: user.macAddress.toLowerCase(),
        email: user.email,
        uid: user.uid,
        expiredAt: user.expiredAt,
        active: user.active,
        description: user.description,
        groupName: user.groupName,
    });
    await insertUser(newUser);
}

export default { getAllUsers, addUser };