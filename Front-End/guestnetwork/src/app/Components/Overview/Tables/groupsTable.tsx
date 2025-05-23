import { Group } from "@/app/Types";
import { formatDate } from "../../formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useEffect, useState } from "react";
import GroupService from "@/app/Services/GroupService";
import { IoMdRefresh } from "react-icons/io";
import GroupDetailsPopup from "../../GroupDetailsPopUp";

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
            <th className="w-1/5 p-4 font-semibold text-center">Extra</th>
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
        <GroupDetailsPopup
          group={selectedGroup}
          onClose={() => setShowPopUp(false)}
          onDelete={deleteGroup}
        />
      )}
    </div>
  );

}