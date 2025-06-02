import { Group, Vlan } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useEffect, useState } from "react";
import GroupService from "@/app/Services/GroupService";
import { IoMdRefresh } from "react-icons/io";
import GroupDetailsPopup from "../popups/GroupDetailsPopUp";
import { mutate } from "swr";

interface GroupsTableProps {
  groups: Group[]
  vlans: Vlan[]
}

export default function GroupsTable( { groups, vlans }: GroupsTableProps) {
  const {t} = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
  const selectedGroup = groups.find(u => u.groupName === selectedGroupName) ?? null;

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleExtraClick = (group: Group) => {
    setSelectedGroupName(group.groupName);
    setShowPopUp(true);
  };

  const deleteGroup = async (groupName: string) => {
    try {
      await GroupService.deleteGroup(groupName);
      setDeleteError(null);
      setShowPopUp(false);
    } catch (error: any) {
      setDeleteError(error.message || "Failed to delete group.");
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
        <tbody>
          {groups.map((group: Group) => (
              <tr
                key={group.id}
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

      {/* Pop Up */}
      {showPopUp && selectedGroup && (
        <GroupDetailsPopup
          key={selectedGroup.groupName}
          group={selectedGroup}
          vlans={vlans}
          onClose={() => {
            setShowPopUp(false);
            setDeleteError(null);
          }}
          onDelete={deleteGroup}
          deleteError={deleteError}  
        />
      )}
    </div>
  );

}