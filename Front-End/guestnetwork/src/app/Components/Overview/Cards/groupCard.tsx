import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Group, Vlan } from "@/app/Types";
import GroupService from "@/app/Services/GroupService";
import { mutate } from "swr";
import { MdEdit } from "react-icons/md";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

interface GroupCardProps {
  group: Group;
  vlans: Vlan[];
}

export default function GroupCard({ group, vlans }: GroupCardProps) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [groupName: string]: boolean }>({});

  const [vlanId, setVlanId] = useState<number | null>(group.vlan ?? null);
  const [description, setDescription] = useState(group.description ?? "");

  const handleDelete = async () => {
    try {
      await GroupService.deleteGroup(group.groupName);
      mutate("groups");
    } catch (err) {
      console.error("Error deleting group:", err);
      alert("Failed to delete group.");
    }
  };

  const handleRegeneratePassword = async () => {
    try {
      await GroupService.regengroupPw(group.groupName);
      mutate("groups");
    } catch (err) {
      console.error("Failed to regenerate password:", err);
      alert("Failed to regenerate password.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedVlan = Number(vlanId);

      const updatedGroup = {
        vlan: updatedVlan,
        description,
      };

      await GroupService.updateGroup(group.groupName, updatedGroup);

      setIsEditing(false);
      mutate("groups");
    } catch (err) {
      console.error("Failed to update group:", err);
      alert("Failed to update group.");
    }
  };

  const handleCancel = () => {
    setDescription(group.description ?? "");
    setVlanId(group.vlan ?? null);
    setIsEditing(false);
  };

  const togglePasswordVisibility = (groupName: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white text-left shadow-lg rounded-xl p-4 space-y-3 border border-gray-200">
      <div className="flex justify-between items-center">
        <p className="text-md font-semibold text-[#003366]">
          <strong>{group.groupName}</strong>
        </p>
        {!isEditing && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              title="Edit group"
              className="text-blue-600 hover:text-blue-800"
            >
              <MdEdit size={21} />
            </button>
            <button
              onClick={handleDelete}
              title="Delete group"
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Always show password + regenerate button */}
      <div className="flex items-center gap-2 text-sm">
        <div className="text-[#003366] flex items-center gap-2">
          <p>
            <strong>{t('overview.password')}:</strong>{" "}
            {visiblePasswords[group.groupName] ? group.password : '***********'}
          </p>
          <button
            onClick={() => togglePasswordVisibility(group.groupName)}
            className="text-[#003366] hover:text-[#00509e] focus:outline-none mr-2"
            title={visiblePasswords[group.groupName] ? t('overview.hidePassword') : t('overview.showPassword')}
          >
            {visiblePasswords[group.groupName] ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          onClick={handleRegeneratePassword}
          title="Regenerate password"
          className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
        >
          <IoMdRefresh />
        </button>
      </div>

      {/* VLAN: toggle between text and selector */}
      <p className="text-sm text-[#003366]">
        <strong>VLAN:</strong>{" "}
        {isEditing ? (
          <select
            value={vlanId === null ? "" : vlanId}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              setVlanId(selectedId);
            }}
            className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="" disabled>
              --- {t('overview.select')} ---
            </option>
            {vlans.map((vlan) => (
              <option key={vlan.vlan} value={vlan.vlan}>
                {vlan.vlan} - {vlan.name}
              </option>
            ))}
          </select>
        ) : (
          group.vlan
        )}
      </p>

      {/* Description: toggle between text and input */}
      <p className="text-sm text-[#003366]">
        <strong>{t('overview.description')}:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-style mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ) : (
          group.description || "N/A"
        )}
      </p>

      {/* Edit mode buttons */}
      {isEditing && (
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
      )}
    </div>
  );
}
