import { useState } from "react";
import { User, Vlan } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";
import { useTranslation } from "react-i18next";
import { IoMdRefresh } from "react-icons/io";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import UserService from "@/app/Services/UserService";
import { mutate } from "swr";

interface Group {
  id: number;
  groupName: string;
}

interface UserCardProps {
  user: User;
  groups: Group[];
  vlans: Vlan[];
  isGroupsLoading: boolean;
}

export default function UserCard({ user, groups, vlans, isGroupsLoading }: UserCardProps) {
  const { t } = useTranslation();
  const isExpired = user.expiredAt ? new Date(user.expiredAt) < new Date() : false;

  const [isEditing, setIsEditing] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [eventName: string]: boolean }>({});

  const [email, setEmail] = useState(user.email ?? '');
  const [uid, setUID] = useState(user.uid ?? '');
  const [vlanId, setVlanId] = useState<number | null>(user.vlan ?? null);
  const [description, setDescription] = useState(user.description ?? '');
  const [expiredAt, setExpiredAt] = useState(user.expiredAt ? new Date(user.expiredAt).toISOString().slice(0, 10) : '');
  const [active, setActive] = useState(user.active);
  const [groupName, setGroupName] = useState<string | null>(user.groupName ?? '');

  const handleDelete = async () => {
    try {
      await UserService.deleteUser(user.macAddress);
      mutate("users");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleRegeneratePassword = async () => {
    try {
      await UserService.regenUserPw(user.macAddress);
      mutate("users");
    } catch (err) {
      console.error("Failed to regenerate password:", err);
      alert("Failed to regenerate password.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updated = {
        email,
        uid,
        expiredAt: expiredAt ? new Date(expiredAt) : undefined,
        active: active ? 1 : 0,
        vlan: vlanId === null ? undefined : vlanId,
        description,
      };

      await UserService.updateUser(user.macAddress, updated);

      const oldGroup = user.groupName ?? '';
      const newGroup = groupName ?? '';

      if (oldGroup !== newGroup) {
        if (oldGroup) await UserService.removeFromGroup(user.macAddress, oldGroup);
        if (newGroup) await UserService.addToGroup(user.macAddress, newGroup);
      }

      setIsEditing(false);
      mutate("users");
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user.");
    }
  };

  const handleCancel = () => {
    setEmail(user.email ?? '');
    setUID(user.uid ?? '');
    setVlanId(user.vlan ?? null);
    setDescription(user.description ?? '');
    setExpiredAt(user.expiredAt ? new Date(user.expiredAt).toISOString().slice(0, 10) : '');
    setActive(user.active);
    setGroupName(user.groupName ?? '');
    setIsEditing(false);
  };

  const togglePasswordVisibility = (macAddress: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [macAddress]: !prev[macAddress]
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white text-left shadow-lg rounded-xl p-4 space-y-3 border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <p className="text-md font-semibold text-[#003366]">
            <strong>{user.macAddress}</strong>
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              isExpired
                ? "bg-orange-100 text-orange-800"
                : user.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            title={isExpired ? t('overview.expired') : user.active ? t("overview.active") : t("overview.disabled")}
          >
            {isExpired ? t('overview.expired') : user.active ? t("overview.active") : t("overview.disabled")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            title={t('overview.editUser')}
            className="text-blue-600 hover:text-blue-800"
          >
            <MdEdit size={21} />
          </button>
          <button
            onClick={handleDelete}
            title={t('overview.deleteUser')}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="text-[#003366] flex items-center gap-2">
          <p>
            <strong>{t('overview.password')}:</strong>{" "}
            {visiblePasswords[user.macAddress] ? user.password : '***********'}
          </p>
          <button
            onClick={() => togglePasswordVisibility(user.macAddress)}
            className="text-[#003366] hover:text-[#00509e] focus:outline-none mr-2"
            title={visiblePasswords[user.macAddress] ? t('overview.hidePassword') : t('overview.showPassword')}
          >
            {visiblePasswords[user.macAddress] ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {!user.groupName && (
          <button
            onClick={handleRegeneratePassword}
            title="Regenerate password"
            className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
          >
            <IoMdRefresh />
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <p className="text-sm text-[#003366]">
            <strong>{t('overview.group')}:</strong><br />
            <select
              value={groupName ?? ''}
              onChange={(e) => setGroupName(e.target.value)}
              className="input-style mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
              disabled={isGroupsLoading}
            >
              <option value="">{t('overview.noGroup')}</option>
              {groups.map((g) => (
                <option key={g.groupName} value={g.groupName}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </p>

          <p className="text-sm text-[#003366]">
            <strong>{t('overview.expirationDate')}:</strong><br />
            <input
              type="date"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
              className="input-style mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </p>

          <p className="text-sm text-[#003366]">
            <strong>Status:</strong><br />
            <select
              value={active ? 'true' : 'false'}
              onChange={(e) => setActive(e.target.value === 'true' ? 1 : 0)}
              className="input-style mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="true">{t("overview.active")}</option>
              <option value="false">{t("overview.disabled")}</option>
            </select>
          </p>

          <p className="text-sm text-[#003366]">
            <strong>Email:</strong><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-style mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Email"
            />
          </p>

          <p className="text-sm text-[#003366]">
            <strong>{t('overview.uid')}:</strong><br />
            <input
              value={uid}
              onChange={(e) => setUID(e.target.value)}
              className="input-style mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="UID"
            />
          </p>

          <p className="text-sm text-[#003366]">
            <strong>VLAN:</strong><br />
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
                --- {t('overview.select')} ---
              </option>
              {vlans.map((vlan, index) => (
                <option key={vlan.vlan} value={vlan.vlan}>
                  {vlan.vlan} - {vlan.name}
                </option>
              ))}
            </select>
          </p>

          <p className="text-sm text-[#003366]">
            <strong>{t('overview.description')}:</strong><br />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-style mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Description"
            />
          </p>

          <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800"
              >
                {t('overview.save')}
              </button>
              <button
                onClick={handleCancel}
                className="bg-[#003366] text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                {t('overview.cancel')}
              </button>
            </div>
        </>
      ) : (
        <>
          <p className="text-sm text-[#003366]"><strong>{t('overview.group')}:</strong> {user.groupName || 'No group'}</p>
          <p className="text-sm text-[#003366]"><strong>{t('overview.expirationDate')}:</strong> {formatDate(user?.expiredAt)}</p>
          <p className="text-sm text-[#003366]"><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p className="text-sm text-[#003366]"><strong>{t('overview.uid')}:</strong> {user.uid || 'N/A'}</p>
          <p className="text-sm text-[#003366]"><strong>VLAN:</strong> {user.vlan || 'N/A'}</p>
          <p className="text-sm text-[#003366]"><strong>{t('overview.description')}:</strong> {user.description || 'N/A'}</p>
        </>
      )}
    </div>
  );
}
