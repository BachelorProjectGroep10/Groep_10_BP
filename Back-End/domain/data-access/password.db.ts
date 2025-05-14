import knex from '../../util/database';
import { Password } from '../model/Password';

// Get all passwords
export const getPasswords = async (): Promise<Password[]> => {
  const rows = await knex('password').select('*');
  return rows.map(row => new Password(row));
};

// Get current password (valid = true)
export const getCurrentPassword = async (): Promise<Password | null> => {
  const row = await knex('password').where({ valid: true }).first();
  return row ? new Password(row) : null;
};

// Insert a new password and mark it as valid, setting all others to invalid
export const insertPassword = async (password: string): Promise<void> => {
  const trx = await knex.transaction();

  try {
    // Invalidate all previous passwords
    await trx('password').update({ valid: false });

    // Insert new one marked as valid
    await trx('password').insert({ password, valid: true });

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting password:', err);
    throw new Error('Insert failed');
  }
};
