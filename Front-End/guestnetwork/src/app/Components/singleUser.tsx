import React, { useEffect, useState } from 'react';
import UserService from '../Services/UserService';
import { User } from '../Types';
import GroupService from '../Services/GroupService';
import { useTranslation } from "react-i18next";
import '../i18n'; 

export default function SingleUserComponent() {
  const [message, setMessage] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [email, setEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [timeNeeded, setTimeNeeded] = useState('');
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState<{ id: number; groupName: string }[]>([]);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [rows, setRows] = useState(6);

  const {t} = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(timeNeeded) < 1) {
      alert('Days needed must be at least 1.');
      return;
    }

    // Build newUser object conditionally
    const newUser: User = {
      macAddress,
      email,
      studentNumber,
      timeNeeded: parseInt(timeNeeded),
      active: 1,
      description,
    };

    if (groupId !== null) {
      (newUser as any).groupId = groupId;
    }

    try {
      const response = await UserService.addUser(newUser);
      if (response.ok) {
        setMessage(t('user.userRegistrationSuccess'));
        // Reset form fields
        setMacAddress('');
        setEmail('');
        setStudentNumber('');
        setTimeNeeded('');
        setDescription('');
        setGroupId(null);
      } else {
        setMessage(t('user.userRegistrationError'));
      }
    } catch (error) {
      console.error(error);
      setMessage(t('user.userRegistrationError'));
    }
  };

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await GroupService.getGroups();
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        const simplifiedGroups = data.map((g: any) => ({
          id: g.id,
          groupName: g.groupName,
        }));
        setGroups(simplifiedGroups);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    }

    fetchGroups();

    function handleResize() {
      setRows(window.innerWidth <= 768 ? 3 : 6);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center w-full space-y-2 bg-white rounded-lg shadow-md p-4">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-x-8 gap-y-2 w-full form-grid-collapse"
      >
        <h3 className="text-xl font-bold pb-2 col-span-full text-center">{t('user.userRegistration')}</h3>

        {/* Left Column */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">{t('user.macAddress')} *</label>
          <input
            type="text"
            placeholder="XX:XX:XX:XX:XX:XX"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <label className="text-sm font-medium">{t('user.daysNeeded')} *</label>
          <input
            type="number"
            placeholder="7"
            value={timeNeeded}
            onChange={(e) => setTimeNeeded(e.target.value)}
            min={1}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <label className="text-sm font-medium">Email</label>
          <input
            type="text"
            placeholder="XX.XX@XX.X"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="text-sm font-medium">{t('user.studentNumber')}</label>
          <input
            type="text"
            placeholder='X0000000'
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">{t('user.selectGroup')}</label>
          <select
            value={groupId === null ? '' : groupId}
            onChange={(e) =>
              setGroupId(e.target.value === '' ? null : Number(e.target.value))
            }
            className="bg-gray-300 text-black rounded-lg px-2 pr-6 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">{t('user.noGroup')}</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.groupName}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium">{t('user.description')}</label>
          <textarea
            placeholder={t('user.optionalDescription')}
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
            {t('user.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
