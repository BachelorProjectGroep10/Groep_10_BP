import { User } from '../domain/model/User';
import { getUsers, deleteUserFromDb, insertUserWithGroup, insertUserWithoutGroup, regenUserPassword, addUserToGroup, removeUserFromGroup } from '../domain/data-access/user.db';
import { validateUser } from '../util/validation';
import e from 'express';

const getAllUsers = async (macAddress:string, email:string, uid:string): Promise<User[]> => {
    const users = await getUsers(macAddress, email, uid);
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

  if (!user.macAddress || !user.email || !user.uid) {
    throw new Error('User MAC address and email are required');
  }
  
  const existingUsers = await getUsers(user.macAddress, user.email, user.uid);
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

export default { getAllUsers, addUser, deleteUser, regenUserPw, addUserToAGroup, removeUserFromAGroup };