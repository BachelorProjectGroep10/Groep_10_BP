import knex from '../../util/database';
import { Group } from '../model/Group';
import { generateRandomPassword } from '../../util/autoPassword';

// Get all groups
const getGroups = async (): Promise<Group[]> => {
  try {
    const rows = await knex('radgroupcheck')
      .select('radgroupcheck.*', 'radgroupreply.value as psk')
      .leftJoin('radgroupreply', 'radgroupcheck.groupname', 'radgroupreply.groupname')
      .where('radcheck.attribute', 'Cleartext-Password')
      .andWhere('radgroupreply.attribute', 'Cisco-AVPair')
      .andWhere('radgroupreply.op', '+='); 

    return rows.map((row) => {
      return new Group({
        id: row.id,
        groupName: row.groupname,
        description: row.description,
        password: row.value,
      });
    });
  } catch (err) {
    console.error('DB error fetching groups:', err);
    throw new Error('Fetch failed');
  }
}


// Insert a group into the database
const insertGroup = async (group: Group): Promise<Group> => {
  const trx = await knex.transaction();

  try {
    await trx('radgroupcheck').insert({
      groupname: group.groupName,
      attribute: 'Cleartext-Password',
      op: ':=',
      value: group.groupName,
      description: group.description,
    });

    insertIntoRadGroupReply(group);

    await trx.commit();
    console.log('User inserted successfully');

    return group 
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting user:', err);
    throw new Error('Insert failed');
  }
};

const insertIntoRadGroupReply = async (group: Group): Promise<void> => {
  const trx = await knex.transaction();
  const randomPassword = generateRandomPassword();

  try {
    await trx('radgroupreply').insert({
      groupname: group.groupName,
      attribute: 'Tunnel-Private-Group-ID',
      op: ':=',
      value: 30,
    });

    await trx('radgroupreply').insert({
      groupname: group.groupName,
      attribute: 'Cisco-AVPair',
      op: '+=',
      value: `psk=${randomPassword}`,
    });

    await trx('radgroupreply').insert({
      groupname: group.groupName,
      attribute: 'Cisco-AVPair',
      op: ':=',
      value: 'psk-mode=ascii',
    });

    await trx.commit();
    console.log('User inserted into radreply successfully');
  } catch (err) {
    await trx.rollback();
    console.error('DB error inserting user into radreply:', err);
    throw new Error('Insert failed');
  }
}

export { getGroups, insertGroup };