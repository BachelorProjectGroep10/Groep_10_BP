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

export default function EventApplyComponent({ isMobile }: EventInterface) {
  const [message, setMessage] = useState('');
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState('');     
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState(4);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setMessage("❌ Start date and end date are required.");
      return;
    }

    // Convert startDate string to Date and set time to end of day
    const startDateObj = new Date(startDate);
    startDateObj.setHours(23, 59, 59);

    // Convert endDate string to Date and set time to end of day
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59);

    const newEvent: Event = {
      eventName: eventName.trim(),
      startDate: startDateObj,
      endDate: endDateObj,
      description: description.trim() === '' ? undefined : description.trim(),
    };

    try {
      validateEvent(newEvent);

      const response = await EventService.addEvent(newEvent);
      const body = await response.json();
      if (response.ok) {
        setMessage(t('event.eventRegistrationSuccess'));
        setEventName('');
        setStartDate('');
        setEndDate('');
        setDescription('');
      } else {
        console.error('API error:', body);
        setMessage(t('event.eventRegistrationError'));
      }
    } catch (error: any) {
      setMessage(error.message || t('event.eventRegistrationError'));
    }
  };

  useEffect(() => {
    if (isMobile) {
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
              {t('event.eventRegistration')}
            </h2>
          </div>
          {!isMobile && (
            <button
              type="button"
              onClick={() => setIsEventFormOpen(!isEventFormOpen)}
              className="text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
            >
              {isEventFormOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
            </button>
          )}
        </div>

        <div className={`col-span-full ${isEventFormOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">{t('event.eventName')} *</label>
            <input
              type="text"
              placeholder={t('event.eventName')}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <label className="text-sm font-medium">{t('event.startDate')} *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <label className="text-sm font-medium">{t('event.endDate')} *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <label className="text-sm font-medium">{t('event.description')}</label>
            <textarea
              placeholder={t('event.optionalDescription')}
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
              {t('event.submit')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}