import { Group } from "@/app/Types";
import formatDate from "../../formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';

interface GroupsTableProps {
  groups: Group[]
}

export default function GroupsTable( { groups }: GroupsTableProps) {
  const {t} = useTranslation();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#f0f4f8] text-[#003366] text-left shadow-sm">
          <tr>
            <th className="w-1/4 p-4 font-semibold">{t('overview.groupName')}</th>
            <th className="w-1/4 p-4 font-semibold">{t('overview.password')}</th>
            <th className="w-1/4 p-4 font-semibold">VLAN</th>
            <th className="w-1/4 p-4 font-semibold">{t('overview.description')}</th>
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
                <td className="w-1/4 p-4 break-words">{group.groupName}</td>
                <td className="w-1/4 p-4 break-words">{group.password}</td>
                <td className="w-1/4 p-4 break-words">{group.vlan}</td>
                <td className="w-1/4 p-4 break-words">{group.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}