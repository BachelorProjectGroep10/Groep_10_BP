import { Event } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import EventService from "@/app/Services/EventService";
import { mutate } from "swr";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);

  const [startDate, setStartDate] = useState(event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '')
  const [endDate, setEndDate] = useState(event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '')
  const [description, setDescription] = useState(event.description ?? "");

  const handleDelete = async () => {
    try {
      await EventService.deleteEvent(event.eventName);
      mutate("events");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedEvent = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        description: description
      };

      await EventService.updateEvent(event.eventName, updatedEvent);

      setIsEditing(false);
      mutate("events");
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("Failed to update event.");
    }
  };

  const handleCancel = () => {
    setStartDate(event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '')
    setEndDate(event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '')
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white text-left shadow-lg rounded-xl p-4 space-y-3 border border-gray-200">
      <div className="flex justify-between items-center">
        <p className="text-md font-semibold text-[#003366]">
          <strong>{event.eventName}</strong>
        </p>
        {!isEditing && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              title="Edit event"
              className="text-blue-600 hover:text-blue-800"
            >
              <MdEdit size={21} />
            </button>
            <button
              onClick={handleDelete}
              title="Delete event"
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Password always visible */}
      <p className="text-sm text-[#003366]">
        <strong>{t('overview.password')}:</strong> {event.password?.map(pwd => pwd.value).join(', ')}
      </p>

      {/* Start Date toggle */}
      <p className="text-sm text-[#003366]">
        <strong>{t('overview.startDate')}:</strong>{" "}
        {isEditing ? (
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ) : (
          formatDate(event.startDate)
        )}
      </p>

      {/* End Date toggle */}
      <p className="text-sm text-[#003366]">
        <strong>{t('overview.endDate')}:</strong>{" "}
        {isEditing ? (
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ) : (
          formatDate(event.endDate)
        )}
      </p>

      {/* Description toggle */}
      <p className="text-sm text-[#003366]">
        <strong>{t('overview.description')}:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        ) : (
          event.description
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

