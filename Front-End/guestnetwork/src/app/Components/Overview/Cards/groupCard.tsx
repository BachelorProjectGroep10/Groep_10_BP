import { Group } from "@/app/Types";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white text-left shadow-lg rounded-xl p-4 space-y-2">
      <div className="text-md font-semibold text-[#003366]">
        {group.groupName}
      </div>

      <div className="text-sm text-[#003366] space-y-1">
        <p><strong>Description:</strong> {group.description}</p>
        <p><strong>Password:</strong> {group.password}</p>
      </div>
    </div>
  );
}
