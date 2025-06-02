import { Event } from "@/app/Types";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../Utils/formatDate";
import { useState } from "react";
import { mutate } from "swr";
import EventService from "@/app/Services/EventService";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

interface Props {
  event: Event;
  onClose: () => void;
  onDelete: (eventName: string) => void;
}

export default function EventDetailsPopup({ event, onClose, onDelete }: Props) {
  const { t } = useTranslation();

  const [isEditingDetails, setIsEditingDetails] = useState(false);

  const [startDate, setStartDate] = useState(event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '');
  const [endDate, setEndDate] = useState(event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '');

  const handleSaveChanges = async () => {
    try {
      const updatedEvent = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      };

      await EventService.updateEvent(event.eventName, updatedEvent);

      setIsEditingDetails(false);
      mutate("events");
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("Failed to update event.");
    }
  };

  const handleCancel = () => {
    setStartDate(event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '');
    setEndDate(event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '');
    setIsEditingDetails(false);
  };

  const handleDelete = () => {
    onDelete(event.eventName);
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

        <h2 className="text-lg font-bold mb-4">Event Details</h2>

        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Event Name:</strong> {event.eventName}</p>
          <p><strong>Password:</strong> {event.password}</p>

          {!isEditingDetails ? (
            <>
              <p><strong>Start Date:</strong> {formatDate(event.startDate)}</p>
              <p><strong>End Date:</strong> {formatDate(event.endDate)}</p>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          {isEditingDetails ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
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
            onClick={handleDelete}
            className="bg-[#FA1651] text-white px-4 py-2 rounded hover:bg-[#fa1653c6]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}