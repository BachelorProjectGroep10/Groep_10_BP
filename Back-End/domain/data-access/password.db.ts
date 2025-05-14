import knex from '../../util/database';
import { Password } from '../model/Password';
import { encryptPassword, decryptPassword } from '../../util/crypto';

// Get all passwords
export const getPasswords = async (): Promise<Password[]> => {
  const rows = await knex('password').select('*');
  return rows.map(row => {
    const decrypted = decryptPassword(row.password, row.iv);
    return new Password({ ...row, password: decrypted });
  });
};

// Get current password (valid = 1)
export const getCurrentPassword = async (): Promise<Password | null> => {
  const row = await knex('password').where({ valid: true }).first();
  if (!row) return null;

  const decrypted = decryptPassword(row.password, row.iv);
  return new Password({ ...row, password: decrypted });
};

// Insert a password into the database
export const insertPassword = async (password: string): Promise<void> => {
  const trx = await knex.transaction();

  try {
    const { encrypted, iv } = encryptPassword(password);

    await trx('password').update({ valid: false });

    await trx('password').insert({
      password: encrypted,
      iv,
      valid: true,
    });

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting password:', err);
    throw new Error('Insert failed');
  }
};

// Optional: only useful if you keep the encrypted version around and want to validate
export const verifyPassword = (enteredPassword: string, storedEncrypted: string, iv: string): boolean => {
  const decrypted = decryptPassword(storedEncrypted, iv);
  return enteredPassword === decrypted;
};
