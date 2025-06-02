import { Group, User, Vlan } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";
import { IoMdRefresh } from "react-icons/io";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useEffect, useState } from "react";
import GroupService from "@/app/Services/GroupService";
import useInterval from "use-interval";
import useSWR, { mutate } from "swr";
import UserDetailsPopup from "../popups/userDetailsPopUp"

interface UserTableProps {
  users: User[]
  groups: Group[];
  vlans: Vlan[];
}

export default function UsersTable({ users, groups, vlans }: UserTableProps) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedMac, setSelectedMac] = useState<string | null>(null);
  const selectedUser = users.find(u => u.macAddress === selectedMac) ?? null;

  const { t } = useTranslation();

  const handleExtraClick = (user: User) => {
    setSelectedMac(user.macAddress);
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
    setSelectedMac(null);
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#f0f4f8] text-[#003366] text-left shadow-sm">
          <tr>
            <th className="w-1/5 p-4 font-semibold">{t('overview.macAddress')}</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.password')}</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.expirationDate')}</th>
            <th className="w-1/5 p-4 font-semibold text-center">Status</th>
            <th className="w-1/5 p-4 font-semibold text-center">Extra</th>
          </tr>
        </thead>
      </table>

      <div className="max-h-[250px] overflow-y-auto">
        <table className="min-w-full table-fixed border-collapse">
          <tbody>
            {users.map((user: User) => {
              const isExpired = user.expiredAt ? new Date(user.expiredAt) < new Date() : false;

              return (
                <tr
                  key={user.id}
                  className="hover:bg-[#e6f3ff] text-[#003366] border-b border-gray-100 transition duration-150 text-left"
                >
                  <td className="w-1/5 p-4 break-words">{user.macAddress}</td>
                  <td className="w-1/5 p-4 break-words">{user.password}</td>
                  <td className="w-1/5 p-4">{formatDate(user?.expiredAt)}</td>
                  <td className="w-1/5 p-4 text-center">
                    {isExpired ? (
                      <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                        {t('overview.expired')}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pop Up */}
      {showPopUp && selectedUser && (
        <UserDetailsPopup
          key={selectedUser.id}
          user={selectedUser}
          groups={(groups || []).filter((g): g is Group & { id: number } => typeof g.id === "number")}
          vlans={vlans}
          onClose={closePopUp}
        />
      )}
    </div>
  );
}