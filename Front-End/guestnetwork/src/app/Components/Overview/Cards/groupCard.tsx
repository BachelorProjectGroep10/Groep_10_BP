import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Group } from "@/app/Types";
import GroupService from "@/app/Services/GroupService";
import { mutate } from "swr";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);

  const [groupName, setGroupName] = useState(group.groupName);
  const [description, setDescription] = useState(group.description ?? "");
  const [password, setPassword] = useState(group.password ?? "");

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
      const updatedGroup = {
        groupName,
        description,
        password,
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
    setGroupName(group.groupName);
    setDescription(group.description ?? "");
    setPassword(group.password ?? "");
    setIsEditing(false);
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
        <p className="text-[#003366]">
          <strong>Password:</strong> {group.password}
        </p>
        <button
          onClick={handleRegeneratePassword}
          title="Regenerate password"
          className="bg-[#003366] text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
        >
          <IoMdRefresh />
        </button>
      </div>

      {/* Description: toggle between text and input */}
      <p className="text-sm text-[#003366]">
        <strong>Description:</strong>{" "}
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
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-[#003366] text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
