import { Group } from "@/app/Types";
import { formatDate } from "../../formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useEffect, useState } from "react";
import GroupService from "@/app/Services/GroupService";
import { IoMdRefresh } from "react-icons/io";

interface GroupsTableProps {
  groups: Group[]
}

export default function GroupsTable( { groups }: GroupsTableProps) {
  const {t} = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleExtraClick = (group: Group) => {
    setSelectedGroup(group);
    setShowPopUp(true);
  };

  const deleteGroup = async (groupName: string) => {
    try {
      await GroupService.deleteGroup(groupName);
      setShowPopUp(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };
  
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#f0f4f8] text-[#003366] text-left shadow-sm">
          <tr>
            <th className="w-1/5 p-4 font-semibold">{t('overview.groupName')}</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.password')}</th>
            <th className="w-1/5 p-4 font-semibold">VLAN</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.description')}</th>
            <th className="w-1/5 p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
      </table>
      <div className="max-h-[250px] overflow-y-auto">
        <table className="min-w-full table-fixed border-collapse">
          <tbody>
            {groups.map((group: Group) => (
              <tr
                key={group.groupName}
                className="hover:bg-[#e6f3ff] text-[#003366] border-b border-gray-100 transition duration-150 text-left"
              >
                <td className="w-1/5 p-4 break-words">{group.groupName}</td>
                <td className="w-1/5 p-4 break-words">{group.password}</td>
                <td className="w-1/5 p-4 break-words">{group.vlan}</td>
                <td className="w-1/5 p-4 break-words">{group.description}</td>
                <td className="w-1/5 p-4 text-center">
                  <button
                    onClick={() => handleExtraClick(group)}
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
      {showPopUp && selectedGroup && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-black">
            <button
              onClick={() => setShowPopUp(false)}
              className="absolute top-4 right-6 text-[#003366] hover:text-[#FA1651] text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-lg font-bold mb-4">Group Details</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Groupname:</strong> {selectedGroup.groupName}</p>
              <p><strong>Password:</strong> {selectedGroup.password}</p>
              <p><strong>VLAN:</strong> {selectedGroup.vlan || 'N/A'}</p>
              <p><strong>Description:</strong> {selectedGroup.description || 'N/A'}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  if (selectedGroup) {
                    deleteGroup(selectedGroup.groupName);
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