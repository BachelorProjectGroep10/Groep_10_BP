import { User } from "@/app/Types";
import { formatDate, formatDateInput } from "../../formatDate";
import { IoMdRefresh } from "react-icons/io";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useEffect, useState } from "react";
import UserService from "../../../Services/UserService"
import GroupService from "@/app/Services/GroupService";
import useInterval from "use-interval";
import useSWR, { mutate } from "swr";

interface UserTableProps {
  users: User[]
}

export default function UsersTable({ users }: UserTableProps) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupName, setGroupName] = useState<string | null>(null);

  const { t } = useTranslation();

  const handleExtraClick = (user: User) => {
    setSelectedUser(user);
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
    setSelectedUser(null);
    setIsEditingGroup(false);
    setGroupName(null);
  }

  const deleteUser = async (macAddress: string) => {
    try {
      await UserService.deleteUser(macAddress);
      setShowPopUp(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  async function fetchGroups(): Promise<{ id: number; groupName: string }[]> {
    try {
      const response = await GroupService.getGroups();
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      return data.map((g: any) => ({
        id: g.id,          
        groupName: g.groupName,
      }));
    } catch (err) {
      console.error('Error fetching groups:', err);
      return [];
    }
  }
  
  const { data: groups, isLoading: isGroupsLoading } = useSWR('groups', fetchGroups);

  useInterval(() => {
    mutate('groups', fetchGroups);
  }, 2000);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#f0f4f8] text-[#003366] text-left shadow-sm">
          <tr>
            <th className="w-1/5 p-4 font-semibold">{t('overview.macAddress')}</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.password')}</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.expirationDate')}</th>
            <th className="w-1/5 p-4 font-semibold text-center">{t('overview.active')}</th>
            <th className="w-1/5 p-4 font-semibold text-center">Extra Info</th>
          </tr>
        </thead>
      </table>

      <div className="max-h-[250px] overflow-y-auto">
        <table className="min-w-full table-fixed border-collapse">
          <tbody>
            {users.map((user: User) => (
              <tr
                key={user.id}
                className="hover:bg-[#e6f3ff] text-[#003366] border-b border-gray-100 transition duration-150 text-left"
              >
                <td className="w-1/5 p-4 break-words">{user.macAddress}</td>
                <td className="w-1/5 p-4 break-words">{user.password}</td>
                <td className="w-1/5 p-4">{formatDate(user?.expiredAt)}</td>
                <td className="w-1/5 p-4 text-center">
                  <span
                    className={`inline-block p-2 rounded-full text-xs font-semibold ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.active ? t('overview.yes') : t('overview.no')}
                  </span>
                </td>
                <td className="w-1/5 p-4 text-center">
                  <button
                    onClick={() => handleExtraClick(user)}
                    className="bg-[#003366] text-white text-sm px-4 py-1 rounded-full hover:bg-[#00509e] transition duration-200"
                  >
                    Extra Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pop Up */}
      {showPopUp && selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-black">
            <button
              onClick={() => closePopUp()}
              className="absolute top-4 right-6 text-[#003366] hover:text-[#FA1651] text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>MAC Address:</strong> {selectedUser.macAddress}</p>

              <div>
                <label><strong>Password:</strong></label>
                <div className="flex items-center gap-2">
                  <span>
                    {selectedUser.password}
                  </span>
                  <button
                    onClick={async () => {
                      try {
                        await UserService.regenUserPw(selectedUser.macAddress);
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

              <p><strong>Expires:</strong> {formatDate(selectedUser.expiredAt)}</p>
              <p><strong>Active:</strong> {selectedUser.active ? t('overview.yes') : t('overview.no')}</p>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700"><strong>Group:</strong></label>

                {!isEditingGroup ? (
                  <div className="flex items-center gap-2">
                    <span>{selectedUser.groupName || 'No group'}</span>
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
                      value={groupName ?? selectedUser.groupName ?? ''}
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
                        onClick={async () => {
                          if (!selectedUser) return;

                          const oldGroup = selectedUser.groupName ?? '';
                          const newGroup = groupName ?? '';

                          try {
                            if (oldGroup && oldGroup !== newGroup) {
                              await UserService.removeFromGroup(selectedUser.macAddress, oldGroup);
                            }

                            if (newGroup && oldGroup !== newGroup) {
                              await UserService.addToGroup(selectedUser.macAddress, newGroup);
                            }

                            alert('Group updated successfully');
                            setIsEditingGroup(false);
                            setShowPopUp(false);
                            mutate('users'); // Optional: refresh user list if you're using SWR for it
                          } catch (err) {
                            console.error('Failed to update group:', err);
                            alert('Failed to update group');
                          }
                        }}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800 text-sm"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setGroupName(selectedUser.groupName ?? '');
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
            

              <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
              <p><strong>VLAN:</strong> {selectedUser.vlan || 'N/A'}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  if (selectedUser) {
                    deleteUser(selectedUser.macAddress);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
