import knex from '../../util/database';
import { User } from '../model/User';
import { generateRandomPassword } from '../../util/autoPassword';
import { getGroup } from './group.db';

// Get all users
const getUsers = async (): Promise<User[]> => {
  try {
    const rows = await knex('radcheck')
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
      .where('radcheck.attribute', 'Cleartext-Password');


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

// Insert a user into the database


const insertUserWithoutGroup = async (user: User): Promise<User> => {
  return wrapWithTransaction(async (trx) => {
    await insertIntoRadcheck(trx, user);
    const randomPassword = generateRandomPassword();
    await insertIntoRadReply(trx, user, randomPassword);
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
    await insertIntoRadReply(trx, user, group.password);
    await insertUserIntoRadUserGroup(trx, user);

    console.log('User inserted with group');
    return user;
  });
};


// const insertUserWithoutGroup = async (user: User): Promise<User> => {
//   const trx = await knex.transaction();
//   try {
//     const validUntil = new Date(user.expiredAt);

//     await trx('radcheck').insert({
//       uid: user.uid,
//       username: user.macAddress,
//       attribute: 'Cleartext-Password',
//       email: user.email,
//       op: ':=',
//       value: user.macAddress,
//       validUntil: validUntil.toISOString().slice(0, 19).replace('T', ' '),
//       isDisabled: 0,
//       description: user.description,
//     });

//     const randomPassword = generateRandomPassword();
//     insertIntoRadReply(user, randomPassword);

//     await trx.commit();
//     console.log('User inserted successfully');

//     return user 
//   } catch (err) {
//     await trx.rollback();
//     console.error('DB error inserting user:', err);
//     throw new Error('Insert failed');
//   }
// };


// const insertUserWithGroup = async (user: User): Promise<User> => {
//   const trx = await knex.transaction();

//   try {
//     const validUntil = new Date(user.expiredAt);

//     await trx('radcheck').insert({
//       uid: user.uid,
//       username: user.macAddress,
//       attribute: 'Cleartext-Password',
//       email: user.email,
//       op: ':=',
//       value: user.macAddress,
//       validUntil: validUntil.toISOString().slice(0, 19).replace('T', ' '),
//       isDisabled: 0,
//       description: user.description,
//     });

//     if (!user.groupName) {
//       console.error('User groupName is undefined');
//       await trx.rollback();
//       throw new Error('User groupName is undefined');
//     }
//     const group = await getGroup(user.groupName);
//     if (!group) {
//       console.error('Group does not exist');
//       await trx.rollback();
//       throw new Error('Group does not exist');
//     }

//     if (!group.password) {
//       await trx.rollback();
//       console.error('Group password is undefined');
//       throw new Error('Group password is undefined');
//     }
//     await insertIntoRadReply(user, group.password);
//     await insertUserIntoRadUserGroup(user);

//     await trx.commit();
//     console.log('User inserted successfully');

//     return user 
//   } catch (err) {
//     await trx.rollback();
//     console.error('DB error inserting user:', err);
//     throw new Error('Insert failed');
//   }
// }

// const insertIntoRadReply = async (user: User, password: string): Promise<void> => {
//   const trx = await knex.transaction();
//   try {
//     await trx('radreply').insert({
//       username: user.macAddress,
//       attribute: 'Tunnel-Private-Group-ID',
//       op: ':=',
//       value: 30,
//     });

//     await trx('radreply').insert({
//       username: user.macAddress,
//       attribute: 'Cisco-AVPair',
//       op: '+=',
//       value: `psk=${password}`,
//     });

//     await trx('radreply').insert({
//       username: user.macAddress,
//       attribute: 'Cisco-AVPair',
//       op: ':=',
//       value: 'psk-mode=ascii',
//     });

//     await trx.commit();
//     console.log('User inserted into radreply successfully');
//   } catch (err) {
//     await trx.rollback();
//     console.error('DB error inserting user into radreply:', err);
//     throw new Error('Insert failed');
//   }
// }


// const insertUserIntoRadUserGroup = async (user: User): Promise<void> => {
//   const trx = await knex.transaction();

//   try {
//     const checkGroup = await trx('groupname')
//       .select('name')
//       .where('name', user.groupName)
//       .first();

//     if (!checkGroup) {
//       console.error('Group does not exist');
//       await trx.rollback();
//       throw new Error('Group does not exist');
//     }

//     await trx('radusergroup').insert({
//       username: user.macAddress,
//       groupname: user.groupName,
//       priority: 0,
//     });

//     await trx.commit();
//     console.log('User inserted into radusergroup successfully');
//   } catch (err) {
//     await trx.rollback();
//     console.error('DB error inserting user into radusergroup:', err);
//     throw new Error('Insert failed');
//   }
// }

const deleteUserFromDb = async (macAddress: string): Promise<void> => {
  return wrapWithTransaction(async (trx) => {
    await trx('radcheck').where('username', macAddress).del();
    await trx('radreply').where('username', macAddress).del();
    await trx('radusergroup').where('username', macAddress).del();
    console.log('User deleted successfully');
  });
};

// const deleteUserFromDb = async (macAddress: string): Promise<void> => {
//   const trx = await knex.transaction();

//   try {
//     await trx('radcheck').where('username', macAddress).del();
//     await trx('radreply').where('username', macAddress).del();
//     await trx('radusergroup').where('username', macAddress).del();

//     await trx.commit();
//     console.log('User deleted successfully');
//   } catch (err) {
//     await trx.rollback();
//     console.error('DB error deleting user:', err);
//     throw new Error('Delete failed');
//   }
// };



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

const insertIntoRadReply = async (trx: any, user: User, password: string) => {
  await trx('radreply').insert([
    {
      username: user.macAddress,
      attribute: 'Tunnel-Private-Group-ID',
      op: ':=',
      value: 30,
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

const insertUserIntoRadUserGroup = async (trx: any, user: User): Promise<void> => {
  const groupExists = await trx('groupname')
    .select('name')
    .where('name', user.groupName)
    .first();

  if (!groupExists) throw new Error('Group does not exist');

  await trx('radusergroup').insert({
    username: user.macAddress,
    groupname: user.groupName,
    priority: 0,
  });
};

export { getUsers, insertUserWithoutGroup,insertUserWithGroup, deleteUserFromDb };