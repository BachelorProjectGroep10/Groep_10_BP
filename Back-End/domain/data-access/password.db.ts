import knex from '../../util/database';
import { Password } from '../model/Password';

// Get current password (valid = 1)
export const getCurrentPassword = async (): Promise<Password | null> => {
  const rows = await knex('radreply')
    .select('radreply.*')
    .where('radreply.username', 'DEFAULT')
    .andWhere('radreply.attribute', 'Cisco-AVPair')
    .andWhere('radreply.op', '+='); 
  if (rows.length === 0) {
    return null;
  }
  const row = rows[0];

  const cleanedPassword = row.value.replace('psk=', '');
  return new Password({
    id: row.id,
    password: cleanedPassword,
  });
};

// Insert a password into the database
export const insertPassword = async (password: string): Promise<void> => {
const trx = await knex.transaction();

  try {
    const affectedRows = await trx('radreply')
      .where({
        username: 'DEFAULT',
        attribute: 'Cisco-AVPair',
        op: '+=',
      })
      .update({
        value: `psk=${password}`,
      });

    if (affectedRows === 0) {
      await trx('radreply').insert({
        username: 'DEFAULT',
        attribute: 'Cisco-AVPair',
        op: '+=',
        value: `psk=${password}`,
      });
    }

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    console.error('DB error updating password:', err);
    throw new Error('Update failed');
  }
};

