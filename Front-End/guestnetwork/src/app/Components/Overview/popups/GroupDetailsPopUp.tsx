import GroupService from "@/app/Services/GroupService";
import { Group, Vlan } from "@/app/Types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdRefresh } from "react-icons/io";
import { mutate } from "swr";

interface Props {
  group: Group;
  vlans: Vlan[];
  onClose: () => void;
  onDelete: (groupName: string) => void;
  deleteError?: string | null
}

export default function GroupDetailsPopup({ group, vlans, onClose, onDelete, deleteError = null }: Props) {
  const { t } = useTranslation();

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [vlanId, setVlanId] = useState<number | null>(group.vlan ?? null);
  const [description, setDescription] = useState(group.description ?? '');

  const handleSave = async () => {
    try {
      const updatedVlan = Number(vlanId);

      const updated = {
        vlan: updatedVlan,
        description,
      };

      await GroupService.updateGroup(group.groupName, updated);

      setIsEditingDetails(false);
      onClose();
      mutate('groups');
    } catch (err) {
      console.error("Failed to update group:", err);
      alert("Failed to update group.");
    }
  };

  const handleRegeneratePassword = async () => {
    try {
      await GroupService.regengroupPw(group.groupName);
    } catch (err) {
      console.error("Failed to regenerate password:", err);
      alert("Failed to regenerate password.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-[#003366] hover:text-[#FA1651] text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4">Group Details</h2>

        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Groupname:</strong> {group.groupName}</p>

          <div>
            <p>
              <strong>Password:</strong> <span>{group.password}</span>
              <button
                onClick={handleRegeneratePassword}
                className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm ml-2"
              >
                <IoMdRefresh />
              </button>
            </p>
          </div>

          {!isEditingDetails ? (
            <>
              <p><strong>VLAN:</strong> {group.vlan || 'N/A'}</p>
              <p><strong>Description:</strong> {group.description || 'N/A'}</p>
            </>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <label className="block text-s font-semibold">VLAN:</label>
                <select
                  value={vlanId === null ? '' : vlanId}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const vlan = vlans.find((v) => v.vlan === selectedId) || null;
                    setVlanId(selectedId);
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled>
                    --- Select ---
                  </option>
                  {vlans.map((vlan) => (
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

        {/* Buttons container */}
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
                  setVlanId(group.vlan ?? null);
                  setDescription(group.description ?? '');
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
            onClick={() => onDelete(group.groupName)}
            className="bg-[#FA1651] text-white px-4 py-2 rounded hover:bg-[#fa1653c6]"
          >
            Delete
          </button>
        </div>

        {/* Error message below buttons */}
        {deleteError && (
          <p className="mt-4 text-red-600 text-sm font-semibold text-center">
            {deleteError}
          </p>
        )}
      </div>
    </div>
  );
}
