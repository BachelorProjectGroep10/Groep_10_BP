import React, { useEffect, useState } from 'react';
import GroupService from '../Services/GroupService';
import { useTranslation } from "react-i18next";
import '../i18n'; 
import { Group } from '../Types';

export default function GroupSelectComponent() {
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState(4);

  const {t} = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newGroup: Group = {
      groupName,
      description,
    };

    try {
      const response = await GroupService.addGroup(newGroup);

      if (response.ok) {
        setMessage('✅ Group added successfully!');
        setGroupName('');
        setDescription('');
      } else {
        setMessage('❌ Error adding group.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ An error occurred while submitting.');
    }
  };

  useEffect(() => {
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
        <h3 className="text-xl font-bold pb-2 col-span-full text-center">{t('group.groupRegistration')}</h3>

        {/* Left Column */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">{t('group.groupName')} *</label>
          <input
            type="text"
            placeholder={t('group.groupName')}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">{t('group.description')}</label>
          <textarea
            placeholder={t('group.optionalDescription')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            rows={rows}
          />
        </div>

        {/* Message Display */}
        {message && (
          <div className="text-sm col-span-full text-center text-black px-4 rounded-md">
            {message}
          </div>
        )}

        {/* Submit Button */}
        <div className="col-span-full flex justify-center">
          <button
            type="submit"
            className="bg-[#002757] hover:bg-[#FA1651] text-white py-1 px-4 rounded-md text-sm"
          >
            {t('group.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}