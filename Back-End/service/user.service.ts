import { User } from '../domain/model/User';
import { getUsers, insertUser } from '../domain/data-access/user.db';

const getAllUsers = async (): Promise<User[]> => {
    const users = await getUsers();
    return users.map(user => {
        return new User({
        id: user.id,
        macAddress: user.macAddress,
        email: user.email,
        studentNumber: user.studentNumber,
        password: user.password,
        timeNeeded: user.timeNeeded,
        active: user.active,
        groupId: user.groupId,
        description: user.description,
        });
    });
};

const addUser = async (user: User): Promise<void> => {
    const newUser = new User({
        macAddress: user.macAddress,
        email: user.email,
        studentNumber: user.studentNumber,
        timeNeeded: user.timeNeeded,
        active: user.active,
        groupId: user.groupId,
        description: user.description,
    });
    await insertUser(newUser);
}

export default { getAllUsers, addUser };