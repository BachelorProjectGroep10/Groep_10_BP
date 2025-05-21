import knex from '../../util/database';
import { Group } from '../model/Group';
import { generateRandomPassword } from '../../util/autoPassword';

// Get all groups
const getGroups = async (): Promise<Group[]> => {
  try {
    const rows = await knex('groupname')
      .select(
        'groupname.*', 
        'psk_reply.value as psk',
        'vlan_reply.value as vlan'
      )
      .leftJoin({ psk_reply: 'radgroupreply' }, function () {
        this.on('groupname.name', '=', 'psk_reply.groupname')
          .andOn('psk_reply.attribute', '=', knex.raw('?', ['Cisco-AVPair']))
          .andOn('psk_reply.op', '=', knex.raw('?', [':=']));
      })
      .leftJoin({ vlan_reply: 'radgroupreply' }, function () {
        this.on('groupname.name', '=', 'vlan_reply.groupname')
          .andOn('vlan_reply.attribute', '=', knex.raw('?', ['Tunnel-Private-Group-ID']));
      })
      .where('groupname.name', '!=', 'NULL')

    return rows.map((row) => {
      return new Group({
        id: row.id,
        groupName: row.name,
        description: row.description,
        password: row.psk ? row.psk.replace('psk=', '') : null,
        vlan: row.vlan,
      });
    });

  } catch (err) {
    console.error('DB error fetching groups:', err);
    throw new Error('Fetch failed');
  }
}

const insertGroup = async (group: Group): Promise<Group> => {
  const trx = await knex.transaction();

  try {
    const checkGroup = await trx('groupname').where('name', group.groupName).first();
    
    if (checkGroup) {
      console.error('Group already exists');
      await trx.rollback();
      throw new Error('Group already exists');
    }

    await trx('groupname').insert({
      name: group.groupName,
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