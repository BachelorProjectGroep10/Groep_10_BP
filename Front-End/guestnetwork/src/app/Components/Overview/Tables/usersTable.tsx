import { User } from "@/app/Types";
import formatDate from "../../formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';

interface UserTableProps {
  users: User[]
}

export default function UsersTable( { users }: UserTableProps) {
  const {t} = useTranslation();
  
  return (
    <div className="overflow-x-auto border-t border-gray-200 pt-4 bg-white rounded-lg">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className=" text-[#003366] text-left">
            <th className="px-6 py-3 font-semibold">{t('overview.macAddress')}</th>
            <th className="px-6 py-3 font-semibold">{t('overview.groupName')}</th>
            <th className="px-6 py-3 font-semibold">Email</th>
            <th className="px-6 py-3 font-semibold">{t('overview.uid')}</th>
            <th className="px-6 py-3 font-semibold">{t('overview.password')}</th>
            <th className="px-6 py-3 font-semibold">{t('overview.expirationDate')}</th>
            <th className="px-6 py-3 font-semibold">VLAN</th>
            <th className="px-6 py-3 font-semibold">{t('overview.active')}</th>
          </tr>
        </thead>
      </table>

      <div className="max-h-[225px] overflow-y-auto">
        <table className="min-w-full table-auto border-collapse">
          <tbody>
            {users.map((user: User, idx: number) => (
              <tr
                key={user.id}
                className="hover:bg-[#9FDAF9] text-[#003366] text-left border-b border-gray-200"
              >
                <td className="px-6 py-4">{user.macAddress}</td>
                <td className="px-6 py-4">{user.groupName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.uid}</td>
                <td className="px-6 py-4">{user.password}</td>
                <td className="px-6 py-4">{formatDate(user?.expiredAt)}</td>
                <td className="px-6 py-4">{user.vlan}</td>                  
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.active ? t('overview.yes') : t('overview.no')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}