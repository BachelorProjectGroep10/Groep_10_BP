import { User } from '../domain/model/User';
import { getUsers, deleteUserFromDb, insertUserWithGroup, insertUserWithoutGroup, regenUserPassword, addUserToGroup, removeUserFromGroup, updateUserFields } from '../domain/data-access/user.db';
import { validateUser } from '../util/validation';

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
  const errors = validateUser(user);

  if (Object.keys(errors).length > 0) {
    throw new Error(`Validation errors: ${JSON.stringify(errors)}`);
  }   
  
  const macSanitized = user.macAddress.replace(/[^a-fA-F0-9]/g, '').toLowerCase();

  const existingUsers = await getUsers();
  if (existingUsers.some(u => u.macAddress === macSanitized)) {
    throw new Error('A user with this MAC address already exists');
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

const updateUserByMac = async (macAddress: string, updates: Partial<User>): Promise<void> => {
  const macSanitized = macAddress.replace(/[^a-fA-F0-9]/g, '').toLowerCase();

  if (updates.expiredAt && isNaN(Date.parse(updates.expiredAt.toString()))) {
    throw new Error("Invalid 'expiredAt' date");
  }

  if (updates.macAddress) {
    throw new Error('MAC address cannot be updated through this endpoint');
  }

  await updateUserFields(macSanitized, updates);
};

const deleteUser = async (macAddress: string): Promise<void> => {
  await deleteUserFromDb(macAddress);
}

const regenUserPw = async (macAddress: string): Promise<void> => {
  await regenUserPassword(macAddress);
}

const addUserToAGroup = async (macAddress: string, groupName: string): Promise<void> => {
  if (!macAddress || typeof macAddress !== 'string') {
    throw new Error('MAC address is required');
  }

  if (!groupName || typeof groupName !== 'string') {
    throw new Error('Group name is required');
  }

  await addUserToGroup(macAddress, groupName);
}

const removeUserFromAGroup = async (macAddress: string, groupName: string): Promise<void> => {
  if (!macAddress || typeof macAddress !== 'string') {
    throw new Error('MAC address is required');
  }

  if (!groupName || typeof groupName !== 'string') {
    throw new Error('Group name is required');
  }

  await removeUserFromGroup(macAddress, groupName);
}

export default { getAllUsers, addUser, updateUserByMac, deleteUser, regenUserPw, addUserToAGroup, removeUserFromAGroup };