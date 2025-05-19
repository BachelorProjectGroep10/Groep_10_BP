import { Group } from "../domain/model/Group";
import { getGroups, insertGroup } from "../domain/data-access/group.db";

const getAllGroups = async (): Promise<Group[]> => {
    const groups = await getGroups();
    return groups.map(group => {
        return new Group({
            id: group.id,
            groupName: group.groupName,
            description: group.description,
            password: group.password,
            expiredAt: group.expiredAt,
        });
    });
};

const addGroup = async (group: Group): Promise<void> => {
    const newGroup = new Group({
        groupName: group.groupName,
        description: group.description,
        expiredAt: group.expiredAt,
    });
    await insertGroup(newGroup);
}

export default { getAllGroups, addGroup };