import { Group } from "../domain/model/Group";
import { deleteGroupFromDB, getGroups, insertGroup } from "../domain/data-access/group.db";

const getAllGroups = async (): Promise<Group[]> => {
    const groups = await getGroups();
    return groups.map(group => {
        return new Group({
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
        description: group.description
    });
    await insertGroup(newGroup);
}

const deleteGroup = async (groupName: string): Promise<void> => {
    await deleteGroupFromDB(groupName);
}

export default { getAllGroups, addGroup, deleteGroup };