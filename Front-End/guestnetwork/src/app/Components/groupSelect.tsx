import React, { useEffect, useState } from 'react';
import GroupService from '../Services/GroupService';
import { useTranslation } from "react-i18next";
import '../i18n'; 
import { Group, Vlan } from '../Types';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import VlanService from '../Services/VlanService';

interface GroupInterface {
  isMobile: boolean;
}

export default function GroupSelectComponent( {isMobile}: GroupInterface) {
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [vlans, setVlans] = useState<Vlan[]>([]);
  const [vlanId, setVlanId] = useState<number | null>(null);
  const [rows, setRows] = useState(4);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [selectedVlan, setSelectedVlan] = useState<Vlan | null>(null);

  const {t} = useTranslation();

  const fetchVlans = async () => {
    try {
      const response = await VlanService.getVlans();
      if (response.ok) {
        const data: Vlan[] = await response.json();
        setVlans(data);

        const defaultVlan = data.find(vlan => vlan.isDefault === 1);
        if (defaultVlan && typeof defaultVlan.id === 'number') {
          setVlanId(defaultVlan.id);
          setSelectedVlan(defaultVlan);
        }
      } else {
        console.error('Failed to fetch VLANs');
      }
    } catch (error) {
      console.error('Error fetching VLANs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!selectedVlan) {
      setMessage('❌ Please select a VLAN.');
      return;
    }

    const newGroup: Group = {
      groupName,
      description: description.trim() === '' ? undefined : description.trim(),
      vlan: selectedVlan.vlan
    };


    try {
      const response = await GroupService.addGroup(newGroup);
      const body = await response.json();
      if (response.ok) {
        setMessage('✅ Group added successfully!');
        setGroupName('');
        setDescription('');
        setVlanId(null);
        setSelectedVlan(null);
      } else {
        console.error('API error:', body);
        setMessage('❌ Error adding group.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ An error occurred while submitting.');
    }
  };

  useEffect(() => {
    if(isMobile) {
      setIsGroupFormOpen(true);
    }
    fetchVlans();
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
              <MdGroups className="text-4xl" />
              
              {t('group.groupRegistration')}
            </h2>
          </div>  
          {!isMobile && (<button
            type="button"
            onClick={() => setIsGroupFormOpen(!isGroupFormOpen)}
            className=" text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
          >
            {isGroupFormOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
          </button>)}
        </div>

        <div className={`col-span-full ${isGroupFormOpen ? 'block' : 'hidden'}`}>
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

            <label className="text-sm font-medium">{t('user.selectVlan')}</label>
            <select
              value={vlanId === null ? '' : vlanId}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const vlan = vlans.find((v) => v.id === selectedId) || null;
                setVlanId(selectedId);
                setSelectedVlan(vlan);
              }}
              className="bg-gray-300 text-black rounded-lg px-2 pr-6 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="" disabled>
                --- Select ---
              </option>
              {vlans.map((vlan: Vlan, index) => (
                <option key={index} value={vlan.id}>
                  {vlan.vlan} - {vlan.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-2 mt-2">
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
              {t('group.submit')}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
} 