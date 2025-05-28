import knex from '../../util/database';
import { Group } from '../model/Group';
import { generateRandomPassword } from '../../util/autoPassword';

// Get all groups
const getGroups = async (name: string, vlan: number): Promise<Group[]> => {
  try {
    let query = knex('groupname')
      .select(
        'groupname.*', 
        'psk_reply.value as psk',
        'vlan_reply.value as vlan'
      )
      .leftJoin({ psk_reply: 'radgroupreply' }, function () {
        this.on('groupname.name', '=', 'psk_reply.groupname')
          .andOn('psk_reply.attribute', '=', knex.raw('?', ['Cisco-AVPair']))
          .andOn('psk_reply.op', '=', knex.raw('?', ['+=']));
      })
      .leftJoin({ vlan_reply: 'radgroupreply' }, function () {
        this.on('groupname.name', '=', 'vlan_reply.groupname')
          .andOn('vlan_reply.attribute', '=', knex.raw('?', ['Tunnel-Private-Group-ID']));
      })
      .where('groupname.name', '!=', 'NULL');

    if (name) {
      query = query.andWhere('groupname.name', 'like', `%${name}%`);
    }
    if (vlan) {
      query = query.andWhere('vlan_reply.value', '=', vlan);
    }

    const rows = await query;
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


const getGroup = async (groupName: string): Promise<Group | null> => {
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
          .andOn('psk_reply.op', '=', knex.raw('?', ['+=']));
      })
      .leftJoin({ vlan_reply: 'radgroupreply' }, function () {
        this.on('groupname.name', '=', 'vlan_reply.groupname')
          .andOn('vlan_reply.attribute', '=', knex.raw('?', ['Tunnel-Private-Group-ID']));
      })
      .where('groupname.name', groupName);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return new Group({
      id: row.id,
      groupName: row.name,
      description: row.description,
      password: row.psk ? row.psk.replace('psk=', '') : null,
      vlan: row.vlan,
    });
  } catch (err) {
    console.error('DB error fetching group:', err);
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
      value: group.vlan,
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

const checkGroupHasUsers = async (groupname: string): Promise<boolean> => {
  try {
    const countResult = await knex('radusergroup')
      .where('groupname', groupname)
      .count('* as count')
      .first();

    const userCount = countResult && countResult.count !== undefined ? Number(countResult.count) : 0;
    return userCount > 0;
  } catch (err) {
    console.error('DB error checking group users:', err);
    throw new Error('Check failed');
  }
}

const deleteGroupFromDB = async (groupname: string): Promise<void> => {
  const trx = await knex.transaction();

  try {
    const hasUsers = await checkGroupHasUsers(groupname);
    if (hasUsers) {
      await trx.rollback();
      throw new Error('Group has users, cannot delete');
    }

    await trx('radgroupreply')
      .where('groupname', groupname)
      .del();

    await trx('radusergroup')
      .where('groupname', groupname)
      .del();

    await trx('groupname')
      .where('name', groupname)
      .del();

    await trx.commit();
    console.log('Group deleted successfully');
  } catch (err) {
    await trx.rollback();
    console.error('DB error deleting group:', err);
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error('Unknown error occurred while deleting group');
    }
  }
}


const getUsersInGroup = async (groupName: string): Promise<string[]> => {
  try {
    const users = await knex('radusergroup')
      .select('username')
      .where('groupname', groupName);

    return users.map(user => user.username);
  } catch (err) {
    console.error('DB error fetching users in group:', err);
    throw new Error('Fetch failed');
  }
}

const regenGroupPassword = async (groupName: string): Promise<void> => {
  const trx = await knex.transaction();
  const randomPassword = generateRandomPassword();

  try {
    await trx('radgroupreply')
      .where('groupname', groupName)
      .andWhere('attribute', 'Cisco-AVPair')
      .andWhere('op', '+=') 
      .update({ value: `psk=${randomPassword}` });

    const users = await getUsersInGroup(groupName);
    for (const user of users) {
      await trx('radreply')
        .where('username', user)
        .andWhere('attribute', 'Cisco-AVPair')
        .andWhere('op', '+=') 
        .update({ value: `psk=${randomPassword}` });
    }

    await trx.commit();
    console.log('Group password regenerated successfully');
  } catch (err) {
    await trx.rollback();
    console.error('DB error regenerating group password:', err);
    throw new Error('Regeneration failed');
  }
}


export { getGroups, insertGroup, deleteGroupFromDB, checkGroupHasUsers, getGroup, regenGroupPassword };