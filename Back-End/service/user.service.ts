import { User } from '../domain/model/User';
import { getUsers, deleteUserFromDb, insertUserWithGroup, insertUserWithoutGroup, regenUserPassword, addUserToGroup, removeUserFromGroup } from '../domain/data-access/user.db';

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
  const macSanitized = user.macAddress.replace(/[^a-fA-F0-9]/g, '').toLowerCase();
  const macAddressRegex = /^[0-9a-f]{12}$/;

  if (!macAddressRegex.test(macSanitized)) {
    throw new Error("Invalid MAC address format");
  }

  const newUser = new User({
    macAddress: macSanitized,
    email: user.email,
    uid: user.uid,
    expiredAt: user.expiredAt,
    active: user.active,
    description: user.description,
    groupName: user.groupName,
  });

  if (user.groupName) {
    await insertUserWithGroup(newUser);
  } else {
    await insertUserWithoutGroup(newUser);
  }
};

const deleteUser = async (macAddress: string): Promise<void> => {
  await deleteUserFromDb(macAddress);
}

const regenUserPw = async (macAddress: string): Promise<void> => {
  await regenUserPassword(macAddress);
}

const addUserToAGroup = async (macAddress: string, groupName: string): Promise<void> => {
  await addUserToGroup(macAddress, groupName);
}

const removeUserFromAGroup = async (macAddress: string, groupName: string): Promise<void> => {
  await removeUserFromGroup(macAddress, groupName);
}

export default { getAllUsers, addUser, deleteUser, regenUserPw, addUserToAGroup, removeUserFromAGroup };