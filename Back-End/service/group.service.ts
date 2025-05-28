import { Group } from "../domain/model/Group";
import { deleteGroupFromDB, getGroups, insertGroup, regenGroupPassword } from "../domain/data-access/group.db";

const getAllGroups = async (name:string, vlan:number): Promise<Group[]> => {
    const groups = await getGroups(name, vlan);
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
        description: group.description,
        vlan: group.vlan,
    });
    await insertGroup(newGroup);
}

const deleteGroup = async (groupName: string): Promise<void> => {
    await deleteGroupFromDB(groupName);
}

const regenGroupPW = async (groupName: string): Promise<void> => {
    await regenGroupPassword(groupName);
}

export default { getAllGroups, addGroup, deleteGroup, regenGroupPW };