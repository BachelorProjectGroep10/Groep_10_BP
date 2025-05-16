import knex from '../../util/database';
import { User } from '../model/User';
import { encryptPassword, decryptPassword } from '../../util/crypto';

// Get all users
const getUsers = async (): Promise<User[]> => {
  const rows = await knex('users').select('*');
  return rows.map(row => {
    const decrypted = decryptPassword(row.password, row.iv);
    return new User({ ...row, password: decrypted });
  });
};

// Insert a user into the database
const insertUser = async (user: User): Promise<void> => {
  const trx = await knex.transaction();

  try {
    const { encrypted, iv } = encryptPassword(user.password);

    await trx('users').insert({
      macAddress: user.macAddress,
      email: user.email,
      studentNumber: user.studentNumber,
      password: encrypted,
      iv,
      timeNeeded: user.timeNeeded,
      active: user.active,
      groupId: user.groupId,
      description: user.description,
    });

    await trx.commit();
    console.log('User inserted successfully');
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting user:', err);
    throw new Error('Insert failed');
  }
};

export { getUsers, insertUser };