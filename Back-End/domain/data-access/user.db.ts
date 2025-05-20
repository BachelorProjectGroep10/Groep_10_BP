import knex from '../../util/database';
import { User } from '../model/User';
import { encryptPassword, decryptPassword } from '../../util/crypto';
import { generateRandomPassword } from '../../util/autoPassword';

// Get all users
const getUsers = async (): Promise<User[]> => {
  const rows = await knex('users').select('*');
  return rows.map(row => {
    const decrypted = decryptPassword(row.password, row.iv);
    return new User({ ...row, password: decrypted });
  });
};

// Insert a user into the database
const insertUser = async (user: User): Promise<string> => {
  const trx = await knex.transaction();

  try {
    // Generate random password
    const randomPassword = generateRandomPassword();

    // Encrypt the generated password
    const { encrypted, iv } = encryptPassword(randomPassword);

    const expiredDate = new Date(user.expiredAt);

    await trx('users').insert({
      macAddress: user.macAddress,
      email: user.email,
      studentNumber: user.studentNumber,
      password: encrypted,
      iv,
      expiredAt: expiredDate.toISOString().slice(0, 19).replace('T', ' '),
      active: user.active,
      groupId: user.groupId,
      description: user.description,
    });

    await trx.commit();
    console.log('User inserted successfully');

    // Return the plain password so you can send it via email or show it
    return randomPassword;
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting user:', err);
    throw new Error('Insert failed');
  }
};

export { getUsers, insertUser };