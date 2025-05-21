'use client';
import React, { useEffect, useState } from 'react';
import UserService from '../Services/UserService';
import { User } from '../Types';
import GroupService from '../Services/GroupService';
import { useTranslation } from "react-i18next";
import '../i18n'; 
import { IoPersonAddSharp } from 'react-icons/io5';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import useInterval from 'use-interval';
import useSWR, { mutate } from 'swr';
import { Tooltip } from 'react-tooltip';
import { FaInfoCircle } from "react-icons/fa";


interface SingleUserProps {
  isMobile: boolean;
}

export default function SingleUserComponent( {isMobile}: SingleUserProps) {
  const [message, setMessage] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [expiredAt, setExpiredAt] = useState('');
  const [description, setDescription] = useState('');
  const [groupName, setGroupName] = useState<string | null>(null);
  const [rows, setRows] = useState(6);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);


  const {t} = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!expiredAt) {
      alert('Please select an expiration date.');
      return;
    }

    // Build newUser object conditionally
    const newUser: User = {
      macAddress,
      email,
      uid,
      expiredAt: new Date(expiredAt),
      active: 1,
      description,
    };

    try {
      const response = await UserService.addUser(newUser);
      if (response.ok) {
        setMessage(t('user.userRegistrationSuccess'));
        // Reset form fields
        setMacAddress('');
        setEmail('');
        setUid('');
        setExpiredAt('');
        setDescription('');
      } else {
        setMessage(t('user.userRegistrationError'));
      }
    } catch (error) {
      console.error(error);
      setMessage(t('user.userRegistrationError'));
    }
  };

  async function fetchGroups(): Promise<{ id: number; groupName: string }[]> {
    try {
      const response = await GroupService.getGroups();
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      return data.map((g: any) => ({
        id: g.id,           // assuming your group object has an id property
        groupName: g.groupName,
      }));
    } catch (err) {
      console.error('Error fetching groups:', err);
      return [];
    }
  }

  useEffect(() => {
    if(isMobile) {
      setIsUserFormOpen(true);
    }

    function handleResize() {
      setRows(window.innerWidth <= 768 ? 3 : 6);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: groups, isLoading: isGroupsLoading } = useSWR('groups', fetchGroups);

  useInterval(() => {
    mutate('groups', fetchGroups);
  }, 2000);

  return (
    <div className="flex flex-col items-center w-full space-y-2 bg-white rounded-lg shadow-md p-4">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-x-8 gap-y-2 w-full form-grid-collapse"
      >
       <div className="col-span-full flex items-center justify-between mb-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-[#002757] flex items-center justify-center gap-2 pr-4">
              <IoPersonAddSharp className="text-3xl" />
              {t('user.userRegistration')}
            </h2>
          </div>
        {!isMobile && (
          <button
            type="button"
            onClick={() => setIsUserFormOpen(!isUserFormOpen)}
            className=" text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
          >
            {isUserFormOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
          </button>)}
        </div>

        <div className={`col-span-full ${isUserFormOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">
                {t('user.macAddress')} *
              </label>
              <FaInfoCircle
                data-tooltip-id="macTip"
                data-tooltip-content={t('user.macAddressTooltip')}
                className="text-[#002757] cursor-pointer"
              />
              <Tooltip
                id="macTip"
                place="right"
                className="!max-w-[250px] !text-sm !p-2 !bg-gray-800 !text-white !rounded-md shadow-md"
              />
            </div>
            <input
              type="text"
              placeholder={t('user.macAddress')} 
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />

            <label className="text-sm font-medium">{t('user.expiredAt')} *</label>
            <input
              type="date"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />

            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">{t('user.uid')}</label>
              <FaInfoCircle
                data-tooltip-id="uidTip"
                data-tooltip-content={t('user.uidTooltip')}
                className="text-[#002757] cursor-pointer"
              />
              <Tooltip
                id="uidTip"
                place="right"
                className="!max-w-[250px] !text-sm !p-2 !bg-gray-800 !text-white !rounded-md shadow-md"
              />
            </div>
            <input
              type="text"
              placeholder='X0000000'
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-2 mt-2">
            <label className="text-sm font-medium">{t('user.selectGroup')}</label>
            <select
              value={groupName === null ? '' : groupName}
              onChange={(e) =>
                setGroupName(e.target.value === '' ? null : e.target.value)
              }
              className="bg-gray-300 text-black rounded-lg px-2 pr-6 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">{t('user.noGroup')}</option>
              {(groups ?? []).map((group) => (
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
          <div className="col-span-full flex justify-center mt-2">
            <button
              type="submit"
              className="bg-[#002757] hover:bg-[#FA1651] text-white py-1 px-4 rounded-md text-sm"
            >
              {t('user.submit')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
