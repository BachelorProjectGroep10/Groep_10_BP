import { Event } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white text-left shadow-lg rounded-xl p-4 space-y-2">
      <div className="text-md font-semibold text-[#003366]">
        {event.name}
      </div>

      <div className="text-sm text-[#003366] space-y-1">
        <p><strong>Password:</strong> {event.password}</p>
        <p><strong>Start Date:</strong> {formatDate(event.startDate)}</p>
        <p><strong>Start Date:</strong> {formatDate(event.endDate)}</p>
      </div>
    </div>
  );
}
