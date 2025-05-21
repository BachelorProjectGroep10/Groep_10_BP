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
    <div className="overflow-x-auto border-t border-gray-200 pt-4 bg-white rounded-lg">
      <table className="min-w-full table-auto border-collapse ">
        <thead>
          <tr className=" text-[#003366] text-left">
            <th className="px-6 py-3 font-semibold">{t('overview.groupName')}</th>
            <th className="px-6 py-3 font-semibold">{t('overview.description')}</th>
            <th className="px-6 py-3 font-semibold">{t('overview.password')}</th>
          </tr>
        </thead>
      </table>
      <div className="max-h-[225px] overflow-y-auto">
        <table className="min-w-full table-auto border-collapse">
          <tbody>
            {groups.map((group: Group, idx: number) => (
              <tr
                key={group.id}
                className="hover:bg-[#9FDAF9] text-[#003366] text-left border-b border-gray-200"
              >
                <td className="px-6 py-4">{group.groupName}</td>
                <td className="px-6 py-4">{group.description}</td>
                <td className="px-6 py-4">{group.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}