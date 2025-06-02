import { Group } from "../domain/model/Group";
import { deleteGroupFromDB, getGroups, insertGroup, regenGroupPassword, updateGroupFields } from "../domain/data-access/group.db";

const getAllGroups = async (name:string, vlan:number): Promise<Group[]> => {
    const groups = await getGroups(name, vlan);
    return groups.map(group => {
        return new Group({
            id: group.id,
            groupName: group.groupName,
            description: group.description,
            password: group.password,
            vlan: group.vlan
        });
    });
};

const addGroup = async (group: Group): Promise<void> => {
    const newGroup = new Group({
        groupName: group.groupName,
        description: group.description,
        vlan: group.vlan,
    });
    await insertGroup(newGroup);
}

const updateGroupByName = async (groupName: string, updates: Partial<Group>): Promise<void> => {
  
  if (updates.vlan !== undefined && typeof updates.vlan !== 'number') {
    throw new Error('Invalid VLAN number');
  }

  if (updates.groupName) {
    throw new Error('Group name cannot be changed');
  }

  await updateGroupFields(groupName, updates);
};

const deleteGroup = async (groupName: string): Promise<void> => {
    await deleteGroupFromDB(groupName);
}

const regenGroupPW = async (groupName: string): Promise<void> => {
    await regenGroupPassword(groupName);
}

export default { getAllGroups, addGroup, updateGroupByName, deleteGroup, regenGroupPW };