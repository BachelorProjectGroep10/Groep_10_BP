import { User } from "@/app/Types";
import formatDate from "../../formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useState } from "react";

interface UserTableProps {
  users: User[]
}

export default function UsersTable({ users }: UserTableProps) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { t } = useTranslation();

  const handleExtraClick = (user: User) => {
    setSelectedUser(user);
    setShowPopUp(true);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#f0f4f8] text-[#003366] text-left shadow-sm">
          <tr>
            <th className="w-1/5 p-4 font-semibold">{t('overview.macAddress')}</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.password')}</th>
            <th className="w-1/5 p-4 font-semibold">{t('overview.expirationDate')}</th>
            <th className="w-1/5 p-4 font-semibold text-center">{t('overview.active')}</th>
            <th className="w-1/5 p-4 font-semibold text-center">Actions</th>
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
            onClick={() => setShowPopUp(false)}
            aria-label="Close popup"
            className="absolute top-4 right-6 text-[#003366] hover:text-[#FA1651] text-2xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-lg font-bold mb-4">User Details</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>MAC Address:</strong> {selectedUser.macAddress}</p>
            <p><strong>Password:</strong> {selectedUser.password}</p>
            <p><strong>Expires:</strong> {formatDate(selectedUser.expiredAt)}</p>
            <p><strong>Active:</strong> {selectedUser.active ? t('overview.yes') : t('overview.no')}</p>
            <p><strong>Group:</strong> {selectedUser.groupName || 'No group'}</p>
            <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
            <p><strong>VLAN:</strong> {selectedUser.vlan || 'N/A'}</p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => {
                // Add your delete logic here, for example:
                // deleteUser(selectedUser.macAddress);
                console.log("Delete user:", selectedUser.macAddress);
                setShowPopUp(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition duration-200"
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
