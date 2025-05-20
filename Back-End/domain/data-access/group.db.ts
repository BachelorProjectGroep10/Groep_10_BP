import knex from '../../util/database';
import { Group } from '../model/Group';
import { encryptPassword, decryptPassword } from '../../util/crypto';
import { generateRandomPassword } from '../../util/autoPassword';

// Get all groups
const getGroups = async (): Promise<Group[]> => {
    const rows = await knex('groups').select('*');
    return rows.map(row => {
        const decrypted = decryptPassword(row.password, row.iv);
        return new Group({ ...row, password: decrypted });
    });
}


// Insert a group into the database
const insertGroup = async (group: Group): Promise<string> => {
  const trx = await knex.transaction();

  try {
    // Generate random password
    const randomPassword = generateRandomPassword();

    // Encrypt the generated password
    const { encrypted, iv } = encryptPassword(randomPassword);

    await trx('groups').insert({
      groupName: group.groupName,
      description: group.description,
      password: encrypted,
      iv,
    });

    await trx.commit();
    console.log('Group inserted successfully');

    // Return the plain password so you can use it as needed
    return randomPassword;
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting group:', err);
    throw new Error('Insert failed');
  }
};

export { getGroups, insertGroup };