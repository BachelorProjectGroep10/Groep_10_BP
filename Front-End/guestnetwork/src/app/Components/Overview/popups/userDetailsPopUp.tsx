import { useTranslation } from "react-i18next";
import { IoMdRefresh } from "react-icons/io";
import { formatDate } from "../../Utils/formatDate";
import UserService from "@/app/Services/UserService";
import { mutate } from "swr";
import { User } from "@/app/Types";

interface Group {
  id: number;
  groupName: string;
}

interface Props {
  user: User;
  groups: Group[];
  isGroupsLoading: boolean;
  onClose: () => void;
}

import { useState } from "react";

export default function UserDetailsPopup({ user, groups, isGroupsLoading, onClose }: Props) {
  const { t } = useTranslation();
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupName, setGroupName] = useState<string | null>(user.groupName ?? '');

  const handleDelete = async () => {
    try {
      await UserService.deleteUser(user.macAddress);
      onClose();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleGroupSave = async () => {
    try {
      const oldGroup = user.groupName ?? '';
      const newGroup = groupName ?? '';

      if (oldGroup && oldGroup !== newGroup) {
        await UserService.removeFromGroup(user.macAddress, oldGroup);
      }

      if (newGroup && oldGroup !== newGroup) {
        await UserService.addToGroup(user.macAddress, newGroup);
      }

      setIsEditingGroup(false);
      onClose();
      mutate('users');
    } catch (err) {
      console.error("Failed to update group:", err);
      alert("Failed to update group.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-black">
        <button onClick={onClose} className="absolute top-4 right-6 text-[#003366] hover:text-[#FA1651] text-2xl font-bold">
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4">User Details</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>MAC Address:</strong> {user.macAddress}</p>

          <div>
            <label><strong>Password:</strong></label>
            <div className="flex items-center gap-2">
              <span>{user.password}</span>
              <button
                onClick={async () => {
                  try {
                    await UserService.regenUserPw(user.macAddress);
                  } catch (err) {
                    console.error("Failed to regenerate password:", err);
                    alert("Failed to regenerate password.");
                  }
                }}
                className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
              >
                <IoMdRefresh />
              </button>
            </div>
          </div>

          <p><strong>Expires:</strong> {formatDate(user.expiredAt)}</p>
          <p><strong>Active:</strong> {user.active ? t('overview.yes') : t('overview.no')}</p>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700"><strong>Group:</strong></label>

            {!isEditingGroup ? (
              <div className="flex items-center gap-2">
                <span>{user.groupName || 'No group'}</span>
                <button
                  onClick={() => setIsEditingGroup(true)}
                  className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <select
                  value={groupName ?? ''}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">No group</option>
                  {groups?.map((g, index) => (
                    <option key={index} value={g.groupName}>
                      {g.groupName}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={handleGroupSave}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setGroupName(user.groupName ?? '');
                      setIsEditingGroup(false);
                    }}
                    className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>VLAN:</strong> {user.vlan || 'N/A'}</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleDelete}
            className="bg-[#FA1651] text-white px-4 py-2 rounded hover:bg-[#fa1653c6]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
