import { useState } from "react";
import { User } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";
import { useTranslation } from "react-i18next";
import { IoMdRefresh } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import UserService from "@/app/Services/UserService";
import { mutate } from "swr";

interface Group {
  id: number;
  groupName: string;
}

interface UserCardProps {
  user: User;
  groups: Group[];
  isGroupsLoading: boolean;
}

export default function UserCard({ user, groups, isGroupsLoading }: UserCardProps) {
  const { t } = useTranslation();
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const isExpired = user.expiredAt ? new Date(user.expiredAt) < new Date() : false;
  const [groupName, setGroupName] = useState<string | null>(user.groupName ?? '');

  const handleDelete = async () => {
    try {
      await UserService.deleteUser(user.macAddress);
      mutate("users");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleRegeneratePassword = async () => {
    try {
      await UserService.regenUserPw(user.macAddress);
      mutate("users");
    } catch (err) {
      console.error("Failed to regenerate password:", err);
      alert("Failed to regenerate password.");
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
      mutate('users');
    } catch (err) {
      console.error("Failed to update group:", err);
      alert("Failed to update group.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white text-left shadow-lg rounded-xl p-4 space-y-3 border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="text-md font-semibold text-[#003366]">{user.macAddress}</div>
        <button
          onClick={handleDelete}
          title="Delete user"
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      </div>

      <div className="text-sm flex items-center gap-2">
        <span>
          <strong className="text-black">Password:</strong> {user.password}
        </span>
        <button
          onClick={handleRegeneratePassword}
          title="Regenerate password"
          className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
        >
          <IoMdRefresh />
        </button>
      </div>

      <div className="text-sm text-[#003366] space-y-1">
        <p>{user.email}</p>
        <p className="font-semibold">{user.uid}</p>
      </div>

      <div className="text-sm text-[#003366]">
        <p><strong>User ID:</strong> {user.id}</p>

        <label className="block mt-2"><strong>Group:</strong></label>

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
              disabled={isGroupsLoading}
            >
              <option value="">No group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.groupName}>
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
                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-[#003366]">
        <strong>Expires At:</strong> {formatDate(user?.expiredAt)}
      </p>

      {isExpired ? (
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
          Expired
        </span>
      ) : (
        <span
          className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
            user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {user.active ? t('overview.active') : t('overview.disabled')}
        </span>
      )}
    </div>
  );
}