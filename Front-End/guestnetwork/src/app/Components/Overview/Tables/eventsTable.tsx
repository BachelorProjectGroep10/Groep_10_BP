import { Event } from "@/app/Types";
import { formatDate } from "../../Utils/formatDate";
import { useTranslation } from "react-i18next";
import '../../../i18n';
import { useState } from "react";
import EventService from "@/app/Services/EventService";
import EventDetailsPopup from "../popups/EventDetailsPopUp";
import { RiFileDownloadLine } from "react-icons/ri";
import html2canvas from "html2canvas";
import React from "react";
import jsPDF from "jspdf";
import QRCodePdfLayout from "../../dashboard/qrCodePdfLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface EventsTableProps {
  events: Event[]
}

export default function EventsTable( { events }: EventsTableProps) {
  const {t} = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [visiblePasswords, setVisiblePasswords] = useState<{ [eventName: string]: boolean }>({});
  const pdfRef = React.useRef<HTMLDivElement | null>(null);

  const ssid = 'BP Groep 10 - Gast Test';

  const handleDownloadPdf = async (event: Event) => {
    setSelectedEvent(event); 

    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true 
    });

    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'px', 'a4'); 
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${event.eventName}_qr_code.pdf`);
  };


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

  const togglePasswordVisibility = (eventName: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [eventName]: !prev[eventName]
    }));
  };
  
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#f0f4f8] text-[#003366] text-left shadow-sm">
          <tr>
            <th className="w-1/6 p-4 font-semibold">{t('overview.eventName')}</th>
            <th className="w-1/6 p-4 font-semibold">{t('overview.password')}</th>
            <th className="w-1/6 p-4 font-semibold">{t('overview.startDate')}</th>
            <th className="w-1/6 p-4 font-semibold">{t('overview.endDate')}</th>
            <th className="w-1/6 p-4 font-semibold text-center">Extra</th>
            <th className="w-1/6 p-4 font-semibold text-center">Download</th>
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
                <td className="w-1/6 p-4 break-words">{event.eventName}</td>
                <td className="w-1/6 p-4 break-words flex items-center gap-2">
                  {visiblePasswords[event.eventName]
                    ? event.password?.map(pwd => pwd.value).join(', ')
                    : '***********'}
                  <button
                    onClick={() => togglePasswordVisibility(event.eventName)}
                    className="text-[#003366] hover:text-[#00509e] focus:outline-none"
                  >
                    {visiblePasswords[event.eventName] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </td>
                <td className="w-1/6 p-4 break-words">{formatDate(event.startDate)}</td>
                <td className="w-1/6 p-4 break-words">{formatDate(event.endDate)}</td>
                <td className="w-1/6 p-4 text-center">
                  <button
                    onClick={() => handleExtraClick(event)}
                    className="bg-[#003366] text-white text-sm px-4 py-1 rounded-full hover:bg-[#00509e] transition duration-200"
                  >
                    Extra Info
                  </button>
                </td>
                <td className="w-1/6 p-4 text-center">
                  <button
                    onClick={() => handleDownloadPdf(event)} 
                    className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-2 transition duration-200"
                  >
                    <RiFileDownloadLine size={14} /> Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden PDF layout for download */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div
          ref={pdfRef}
          style={{ width: '794px', height: '1123px' }}
          className="flex flex-col items-center justify-around"
        >
          {selectedEvent && (
            <QRCodePdfLayout
              name={selectedEvent.eventName}
              ssid={ssid}
              password={selectedEvent.password}
              showBackground={true}
              startDate={formatDate(selectedEvent.startDate)}
              endDate={formatDate(selectedEvent.endDate)}
            />
          )}
        </div>
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