import { Event } from "@/app/Types";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../Utils/formatDate";

interface Props {
  event: Event;
  onClose: () => void;
}

export default function EventDetailsPopup({ event, onClose }: Props) {
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

        <h2 className="text-lg font-bold mb-4">Event Details</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Event Name:</strong> {event.eventName}</p>
          <p><strong>Password:</strong> {event.password}</p>
          <p><strong>Start Date:</strong> {formatDate(event.startDate)}</p>
          <p><strong>End Date:</strong> {formatDate(event.startDate)}</p>
        </div>
      </div>
    </div>
  );
}
