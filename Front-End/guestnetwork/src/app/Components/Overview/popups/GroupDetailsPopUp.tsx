import { Group } from "@/app/Types";
import { useTranslation } from "react-i18next";

interface Props {
  group: Group;
  onClose: () => void;
  onDelete: (groupName: string) => void;
}

export default function GroupDetailsPopup({ group, onClose, onDelete }: Props) {
  const { t } = useTranslation();

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
          <p><strong>Password:</strong> {group.password}</p>
          <p><strong>VLAN:</strong> {group.vlan || 'N/A'}</p>
          <p><strong>Description:</strong> {group.description || 'N/A'}</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => onDelete(group.groupName)}
            className="bg-[#FA1651] text-white px-4 py-2 rounded hover:bg-[#fa1653c6]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
