import { User } from "@/app/Types";
import formatDate from "../../formatDate";
import { useTranslation } from "react-i18next";

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md mx-auto bg-white text-left shadow-lg rounded-xl p-4 space-y-2">
      <div className="text-md font-semibold text-[#003366]">{user.macAddress}</div>
      <div className="text-sm">
        <strong className="text-black">Password:</strong> {user.password}
      </div>
      <div className="text-sm text-[#003366] space-y-1">
        <p>{user.email}</p>
        <p className="font-semibold">{user.uid}</p>
      </div>

      <div className="text-sm text-[#003366]">
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Group Name:</strong> {user.groupName}</p>
      </div>

      <p className="text-sm text-[#003366]">
        <strong>Expires At:</strong> {formatDate(user?.expiredAt)}
      </p>

      <span
        className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
          user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {user.active ? t("overview.yes") : t("overview.no")}
      </span>
    </div>
  );
}
