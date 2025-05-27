import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import '../../i18n'; 
import { Vlan, Event } from '../../Types';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { MdEvent } from "react-icons/md";
import VlanService from '../../Services/VlanService';
import { validateEvent } from '../../Utils/validation';
import EventService from '@/app/Services/EventService';

interface EventInterface {
  isMobile: boolean;
}

export default function EventApplyComponent( {isMobile}: EventInterface) {
  const [message, setMessage] = useState('');
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState(4);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  const {t} = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: Event = {
      name: eventName.trim(),
      startDate: startDate!,
      endDate: endDate!,
      description: description.trim() === '' ? undefined : description.trim(),
    };

    try {
      validateEvent(newEvent);

      const response = await EventService.addEvent(newEvent);
      const body = await response.json();
      if (response.ok) {
        setMessage("✅ Event registered successfully!");
        setEventName('');
        setStartDate(null);
        setEndDate(null);
        setDescription('');
      } else {
        console.error('API error:', body);
        setMessage(`❌ Event registration failed`);
      }
    } catch (error: any) {
      setMessage(error.message || `❌ Event registration failed`);
    }
  };

  useEffect(() => {
    if(isMobile) {
      setIsEventFormOpen(true);
    }
    const handleResize = () => {
      setRows(window.innerWidth <= 768 ? 3 : 4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center w-full space-y-2 bg-white rounded-lg shadow-md p-4">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-x-8 gap-y-2 w-full form-grid-collapse"
      >
        <div className="col-span-full flex items-center justify-between mb-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-[#002757] flex items-center justify-center gap-2 pr-4">
            <MdEvent className="text-4xl" />

              Event Registration
            </h2>
          </div>  
          {!isMobile && (<button
            type="button"
            onClick={() => setIsEventFormOpen(!isEventFormOpen)}
            className=" text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
          >
            {isEventFormOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
          </button>)}
        </div>

        <div className={`col-span-full ${isEventFormOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Event Name *</label>
            <input
              type="text"
              placeholder={"Event Name"}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <label className="text-sm font-medium">Start Date *</label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <label className="text-sm font-medium">End Date *</label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder={"Description"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              rows={rows}
            />
          </div>

          {/* Message Display */}
          {message && (
            <div className="text-sm col-span-full text-center text-black px-4 rounded-md mt-2">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="col-span-full flex justify-center mt-2">
            <button
              type="submit"
              className="bg-[#002757] hover:bg-[#FA1651] text-white py-1 px-4 rounded-md text-sm"
            >
              Submit
            </button>
          </div>
        </div>

      </form>
    </div>
  );
} 