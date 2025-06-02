import { Event } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useEffect, useState } from "react";
import EventService from "@/app/Services/EventService";
import { IoMdRefresh } from "react-icons/io";
import EventDetailsPopup from "../popups/EventDetailsPopUp";

interface EventsTableProps {
  events: Event[]
}

export default function EventsTable( { events }: EventsTableProps) {
  const {t} = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleExtraClick = (event: Event) => {
    setSelectedEvent(event);
    setShowPopUp(true);
  };

  const deleteEvent = async (eventName: string) => {
    try {
      await EventService.deleteEvent(eventName);
      setShowPopUp(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };
  
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#f0f4f8] text-[#003366] text-left shadow-sm">
          <tr>
            <th className="w-1/5 p-4 font-semibold">Event Name</th>
            <th className="w-1/5 p-4 font-semibold">Password</th>
            <th className="w-1/5 p-4 font-semibold">Start Date</th>
            <th className="w-1/5 p-4 font-semibold">End Date</th>
            <th className="w-1/5 p-4 font-semibold text-center">Extra</th>
          </tr>
        </thead>
      </table>
      <div className="max-h-[250px] overflow-y-auto">
        <table className="min-w-full table-fixed border-collapse">
          <tbody>
            {events.map((event: Event) => (
              <tr
                key={event.eventName}
                className="hover:bg-[#e6f3ff] text-[#003366] border-b border-gray-100 transition duration-150 text-left"
              >
                <td className="w-1/5 p-4 break-words">{event.eventName}</td>
                <td className="w-1/5 p-4 break-words">{event.password}</td>
                <td className="w-1/5 p-4 break-words">{formatDate(event.startDate)}</td>
                <td className="w-1/5 p-4 break-words">{formatDate(event.endDate)}</td>
                <td className="w-1/5 p-4 text-center">
                  <button
                    onClick={() => handleExtraClick(event)}
                    className="bg-[#003366] text-white text-sm px-4 py-1 rounded-full hover:bg-[#00509e] transition duration-200"
                  >
                    Extra Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pop Up */}
      {showPopUp && selectedEvent && (
        <EventDetailsPopup
          key={selectedEvent.eventName}
          event={selectedEvent}
          onClose={() => setShowPopUp(false)}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );

}