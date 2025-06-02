import { useTranslation } from "react-i18next";
import { IoMdRefresh } from "react-icons/io";
import { formatDate } from "../../Utils/formatDate";
import UserService from "@/app/Services/UserService";
import { mutate } from "swr";
import { User, Vlan } from "@/app/Types";
import { useState } from "react";

interface Group {
  id: number;
  groupName: string;
}

interface Props {
  user: User;
  groups: Group[];
  vlans: Vlan[];
  onClose: () => void;
}

export default function UserDetailsPopup({ user, groups, vlans, onClose }: Props) {
  const { t } = useTranslation();
  const isExpired = user.expiredAt ? new Date(user.expiredAt) < new Date() : false;

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [email, setEmail] = useState(user.email ?? '');
  const [uid, setUID] = useState(user.uid ?? '');
  const [vlanId, setVlanId] = useState<number | null>(user.vlan ?? null);
  const [description, setDescription] = useState(user.description ?? '');
  const [expiredAt, setExpiredAt] = useState(
    user.expiredAt ? new Date(user.expiredAt).toISOString().slice(0, 10) : ''
  );
  const [active, setActive] = useState(user.active);
  const [groupName, setGroupName] = useState<string | null>(user.groupName ?? '');

  const handleDelete = async () => {
    try {
      await UserService.deleteUser(user.macAddress);
      onClose();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleSave = async () => {
    try {
      // Prepare expiredAt date with end of day time if expiredAt is set
      let expiredAtDate: Date | undefined;
      if (expiredAt) {
        expiredAtDate = new Date(expiredAt);
        expiredAtDate.setHours(23, 59, 59);
      }

      const updated = {
        email,
        uid,
        expiredAt: expiredAtDate,
        active: active ? 1 : 0,
        vlan: vlanId ?? undefined,
        description,
      };

      await UserService.updateUser(user.macAddress, updated);

      const oldGroup = user.groupName ?? '';
      const newGroup = groupName ?? '';

      if (oldGroup !== newGroup) {
        if (oldGroup) await UserService.removeFromGroup(user.macAddress, oldGroup);
        if (newGroup) await UserService.addToGroup(user.macAddress, newGroup);
      }

      setIsEditingDetails(false);
      onClose();
      mutate('users');
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user.");
    }
  };

  const handleRegeneratePassword = async () => {
    try {
        await UserService.regenUserPw(user.macAddress);
      } catch (err) {
        console.error("Failed to regenerate password:", err);
        alert("Failed to regenerate password.");
      }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-black">
        <button onClick={onClose} className="absolute top-4 right-6 text-[#003366] hover:text-[#FA1651] text-2xl font-bold">
          &times;
        </button>

        <h2 className="text-lg font-bold mb-1">User Details</h2>
        
        <span
          className={`inline-block px-4 py-1 rounded-full text-xs font-bold mb-3 ${
            isExpired
              ? "bg-orange-100 text-orange-800"
              : user.active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isExpired ? "Expired" : user.active ? t("overview.active") : t("overview.disabled")}
        </span>

        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>MAC Address:</strong> {user.macAddress}</p>

          <div>
            <p>
              <strong>Password:</strong> <span>{user.password}</span>
              {!user.groupName && (
                <button
                  onClick={handleRegeneratePassword}
                  className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm ml-2"
                >
                  <IoMdRefresh />
                </button>
              )}
            </p>
          </div>

          {!isEditingDetails ? (
            <>
              <p><strong>Group:</strong> {user.groupName || 'No group'}</p>
              <p><strong>Expires:</strong> {formatDate(user.expiredAt)}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>UID:</strong> {user.uid || 'N/A'}</p>
              <p><strong>VLAN:</strong> {user.vlan || 'N/A'}</p>
              <p><strong>Description:</strong> {user.description || 'N/A'}</p>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <div>
                <label className="block text-s font-semibold">Group:</label>
                <select
                  value={groupName ?? ''}
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
              </div>

              <div>
                <label className="block text-s font-semibold">Expiration Date:</label>
                <input
                  type="date"
                  value={expiredAt}
                  onChange={(e) => setExpiredAt(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-s font-semibold">Status:</label>
                <select
                  value={active ? 'true' : 'false'}
                  onChange={(e) => setActive(e.target.value === 'true' ? 1 : 0)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-s font-semibold">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-s font-semibold">UID:</label>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUID(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-s font-semibold">VLAN:</label>
                <select
                  value={vlanId === null ? '' : vlanId}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const vlan = vlans.find((v) => v.id === selectedId) || null;
                    setVlanId(selectedId);
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled>
                    --- Select ---
                  </option>
                  {vlans.map((vlan, index) => (
                    <option key={vlan.vlan} value={vlan.vlan}>
                      {vlan.vlan} - {vlan.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-s font-semibold">Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          {isEditingDetails ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEmail(user.email ?? '');
                  setUID(user.uid ?? '');
                  setVlanId(user.vlan ?? null);
                  setDescription(user.description ?? '');
                  setExpiredAt(user.expiredAt ? new Date(user.expiredAt).toISOString().slice(0, 10) : '');
                  setActive(user.active);
                  setGroupName(user.groupName ?? '');
                  setIsEditingDetails(false);
                }}
                className="bg-[#003366] text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDetails(true)}
              className="bg-[#003366] text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update
            </button>
          )}

          <button
            onClick={handleDelete}
            className="bg-[#FA1651] text-white px-4 py-2 rounded hover:bg-[#fa1653c6]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}