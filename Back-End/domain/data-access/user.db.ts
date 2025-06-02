import knex from '../../util/database';
import { User } from '../model/User';
import { generateRandomPassword } from '../../util/autoPassword';
import { getGroup } from './group.db';
import { validateUser } from '../../util/validation';

// This file contains the data access layer for user-related operations.
// It includes functions to get users, insert users with or without groups, and delete users.
// The functions interact with the database using Knex.js and handle transactions where necessary.
// The functions are designed to be reusable and modular, allowing for easy integration into the rest of the application.



// Execute DB functions
const getUsers = async (macAddress: string , email?: string, uid?:string): Promise<User[]> => {
  try {
    let query = knex('radcheck')
      .select(
        'radcheck.*',
        'psk_reply.value as psk',
        'vlan_reply.value as vlan',
        'radusergroup.groupname as groupName',
      )
      .leftJoin({ psk_reply: 'radreply' }, function () {
        this.on('radcheck.username', '=', 'psk_reply.username')
          .andOn('psk_reply.attribute', '=', knex.raw('?', ['Cisco-AVPair']))
          .andOn('psk_reply.op', '=', knex.raw('?', ['+=']));
      })
      .leftJoin({ vlan_reply: 'radreply' }, function () {
        this.on('radcheck.username', '=', 'vlan_reply.username')
          .andOn('vlan_reply.attribute', '=', knex.raw('?', ['Tunnel-Private-Group-ID']));
      })
      .leftJoin('radusergroup', 'radcheck.username', 'radusergroup.username')
      .where('radcheck.attribute', 'Cleartext-Password')
      .andWhere('radcheck.username', '!=', 'DEFAULT');

    if (macAddress) {
      query = query.andWhere('radcheck.username', 'like', `%${macAddress}%`);
    }
    if (email) {
      query = query.andWhere('radcheck.email', 'like', `%${email}%`);
    }
    if (uid) {
      query = query.andWhere('radcheck.uid', 'like', `%${uid}%`);
    }

    const rows = await query;

    return rows.map((row) => {
      const cleanedPassword = row.psk ? row.psk.replace('psk=', '') : null;

      return new User({
        id: row.id,
        macAddress: row.username,
        email: row.email,
        uid: row.uid,
        password: cleanedPassword ?? row.psk,
        expiredAt: row.validUntil,
        active: row.isDisabled === 0 ? 1 : 0,
        description: row.description,
        vlan: row.vlan,
        groupName: row.groupName,
      });
    });
  } catch (err) {
    console.error('DB error fetching users:', err);
    throw new Error('Fetch failed');
  }
};

const updateUserFields = async (macAddress: string, updates: Partial<User>): Promise<void> => {
  return wrapWithTransaction(async (trx) => {
    const existingUser = await trx('radcheck')
      .select('username')
      .where('username', macAddress)
      .first();

    if (!existingUser) {
      throw new Error('User does not exist');
    }

    const updatePayload: Record<string, any> = {};
    if (updates.email) updatePayload.email = updates.email;
    if (updates.uid) updatePayload.uid = updates.uid;
    if (updates.expiredAt)
      updatePayload.validUntil = new Date(updates.expiredAt)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
    if (updates.description) updatePayload.description = updates.description;
    if (updates.active !== undefined) updatePayload.isDisabled = updates.active === 1 ? 0 : 1;

    if (Object.keys(updatePayload).length > 0) {
      await trx('radcheck')
        .where('username', macAddress)
        .update(updatePayload);
    }

    if (updates.groupName) {
      await trx('radusergroup')
        .where('username', macAddress)
        .update({ groupname: updates.groupName });
    }

    if (updates.vlan !== undefined) {
      await trx('radreply')
        .where('username', macAddress)
        .andWhere('attribute', 'Tunnel-Private-Group-ID')
        .update({ value: updates.vlan });
    }

    console.log(`User ${macAddress} updated successfully`);
  });
};

const insertUserWithoutGroup = async (user: User): Promise<User> => {
  return wrapWithTransaction(async (trx) => {
    await insertIntoRadcheck(trx, user);
    const randomPassword = generateRandomPassword();
    await insertIntoRadReply(trx, user, randomPassword, user.vlan || 30);
    console.log('User inserted without group');
    return user;
  });
};

const insertUserWithGroup = async (user: User): Promise<User> => {
  return wrapWithTransaction(async (trx) => {
    if (!user.groupName) throw new Error('Group name required');

    const group = await getGroup(user.groupName);
    if (!group || !group.password) throw new Error('Group not valid or missing password');

    await insertIntoRadcheck(trx, user);
    await insertIntoRadReply(trx, user, group.password, group.vlan ?? 30);
    await insertUserIntoRadUserGroup(trx, user.macAddress, user.groupName);

    console.log('User inserted with group');
    return user;
  });
};

const deleteUserFromDb = async (macAddress: string): Promise<void> => {
  return wrapWithTransaction(async (trx) => {
    await trx('radcheck').where('username', macAddress).del();
    await trx('radreply').where('username', macAddress).del();
    await trx('radusergroup').where('username', macAddress).del();
    console.log('User deleted successfully');
  });
};

const regenUserPassword = async (macAddress: string): Promise<void> => {
  return wrapWithTransaction(async (trx) => {
    const groupExists = await trx('radusergroup')
      .select('groupname')
      .where('username', macAddress)
      .first();

    if (groupExists) {
      console.error('User is in a group, cannot regenerate password');
      throw new Error('User is in a group, cannot regenerate password');
    }

    const randomPassword = generateRandomPassword();
    await trx('radreply')
      .where('username', macAddress)
      .andWhere('attribute', 'Cisco-AVPair')
      .andWhere('op', '+=') 
      .update({ value: `psk=${randomPassword}` });

    console.log('User password regenerated successfully');
  });
}

const addUserToGroup = async (macAddress: string, groupName: string): Promise<void> => {
  return wrapWithTransaction(async (trx) => {
    const group = await getGroup(groupName);

    if (!group) throw new Error('Group does not exist');

    await trx('radreply')
      .where('username', macAddress)
      .andWhere('attribute', 'Cisco-AVPair')
      .andWhere('op', '+=') 
      .update({ value: `psk=${group.password}` });
    
    await trx('radreply')
      .where('username', macAddress)
      .andWhere('attribute', 'Tunnel-Private-Group-ID')
      .update({ value: group.vlan });

    await insertUserIntoRadUserGroup(trx, macAddress, groupName);
    console.log('User added to group successfully');
  });
}

const removeUserFromGroup = async (macAddress: string, groupName: string): Promise<void> => {
  return wrapWithTransaction(async (trx) => {
    const groupExists = await trx('radusergroup')
      .select('groupname')
      .where('username', macAddress)
      .andWhere('groupname', groupName)
      .first();

    if (!groupExists) throw new Error('User not in group');

    await trx('radusergroup').where({ username: macAddress, groupname: groupName }).del();

    const randomPassword = generateRandomPassword();
    await trx('radreply')
      .where('username', macAddress)
      .andWhere('attribute', 'Cisco-AVPair')
      .andWhere('op', '+=') 
      .update({ value: `psk=${randomPassword}` });

    await trx('radreply')
      .where('username', macAddress)
      .andWhere('attribute', 'Tunnel-Private-Group-ID')
      .update({ value: 30 }); 
    
    console.log('User removed from group successfully');
  });
}

// helper functions
const wrapWithTransaction = async <T>(operation: (trx: any) => Promise<T>): Promise<T> => {
  const trx = await knex.transaction();
  try {
    const result = await operation(trx);
    await trx.commit();
    return result;
  } catch (err) {
    await trx.rollback();
    console.error('Transaction failed:', err);
    throw new Error('Database transaction failed');
  }
};

const insertIntoRadcheck = async (trx: any, user: User) => {
  const validUntil = new Date(user.expiredAt).toISOString().slice(0, 19).replace('T', ' ');

  await trx('radcheck').insert({
    uid: user.uid,
    username: user.macAddress,
    attribute: 'Cleartext-Password',
    email: user.email,
    op: ':=',
    value: user.macAddress,
    validUntil,
    isDisabled: 0,
    description: user.description,
  });
};

const insertIntoRadReply = async (trx: any, user: User, password: string, vlan: number) => {
  await trx('radreply').insert([
    {
      username: user.macAddress,
      attribute: 'Tunnel-Private-Group-ID',
      op: ':=',
      value: vlan,
    },
    {
      username: user.macAddress,
      attribute: 'Cisco-AVPair',
      op: '+=',
      value: `psk=${password}`,
    },
    {
      username: user.macAddress,
      attribute: 'Cisco-AVPair',
      op: ':=',
      value: 'psk-mode=ascii',
    },
  ]);
};

const insertUserIntoRadUserGroup = async (trx: any, macAddress: string, groupName:string ): Promise<void> => {
  const groupExists = await trx('groupname')
    .select('name')
    .where('name', groupName)
    .first();

  if (!groupExists) throw new Error('Group does not exist');

  await trx('radusergroup').insert({
    username: macAddress,
    groupname: groupName,
    priority: 0,
  });
};

export { getUsers, updateUserFields, insertUserWithoutGroup, insertUserWithGroup, deleteUserFromDb, regenUserPassword, addUserToGroup, removeUserFromGroup };