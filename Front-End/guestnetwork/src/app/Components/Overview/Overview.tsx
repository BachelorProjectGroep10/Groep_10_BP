'use client';

import { useEffect, useState } from "react";
import UserService from "../../Services/UserService";
import { Event, Group, User, Vlan } from "../../Types";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdGroups, MdEvent } from "react-icons/md";
import GroupService from "../../Services/GroupService";
import { useTranslation } from "react-i18next";
import '../../i18n'; 
import UsersTable from "./Tables/usersTable";
import GroupsTable from "./Tables/groupsTable";
import GroupCard from "./Cards/groupCard";
import UserCard from "./Cards/userCard";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import EventsTable from "./Tables/eventsTable";
import EventService from "@/app/Services/EventService";
import EventCard from "./Cards/eventCard";
import { PiSlidersHorizontal } from "react-icons/pi";
import VlanService from "@/app/Services/VlanService";

export default function OverviewComponent() {
  const [vlans, setVlans] = useState<Vlan[]>([]);
  
  const [isUserTableOpen, setIsUserTableOpen] = useState(false); 
  const [isGroupTableOpen, setIsGroupTableOpen] = useState(false); 
  const [isEventTableOpen, setIsEventTableOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isFilterGroupDropdownOpen, setIsFilterGroupDropdownOpen] = useState(false);
  const [isFilterEventDropdownOpen, setIsFilterEventDropdownOpen] = useState(false);

  const [searchMac, setSearchMac] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchVlan, setSearchVlan] = useState('');
  const [searchEvent, setSearchEvent] = useState('');

  const {t} = useTranslation();

  const fetchUsers = async () => {
    const params = {
      macAddress: searchMac,
      email: searchEmail,
      uid: searchName,
    }
    try {
      const response = await UserService.getUsers(params);
      if (response.ok) {
        const data = await response.json();
        return(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGroups = async () => {
    const params = {
      name: searchGroup,
      vlan: searchVlan,
    }
    try {
      const response = await GroupService.getGroups(params);
      if (response.ok) {
        const data = await response.json();
        return(data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await EventService.getEvents();
      if (response.ok) {
        const data = await response.json();
        return(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  const fetchVlans = async () => {
    try {
      const response = await VlanService.getVlans();
      if (response.ok) {
        const data: Vlan[] = await response.json();
        setVlans(data);
      } else {
        console.error('Failed to fetch VLANs');
      }
    } catch (error) {
      console.error('Error fetching VLANs:', error);
    }
  };

  useEffect(() => {
    fetchVlans();
  })

  const { data: users, isLoading: isUsersLoading } = useSWR('users', fetchUsers);
  const { data: groups, isLoading: isGroupsLoading } = useSWR('groups', fetchGroups);
  const { data: events, isLoading: isEventsLoading } = useSWR('events', fetchEvents);

  useInterval(() => {
    mutate('users', fetchUsers);
    mutate('groups', fetchGroups);
    mutate('events', fetchEvents);
  }, 1500);

  return (
    <div className="flex flex-col items-center justify-start gap-5 w-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2">{t('overview.title')}</h1>
        <p className="text-gray-600 mb-4">{t('overview.subtitle')}</p>
      </div>

      {/* USERS */}
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-6xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2">
            <IoPersonAddSharp size={25} />{t('overview.users')}
          </h1>
          <div className="flex items-center justify-center gap-4">
            {isUserTableOpen && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search on MAC Address"
                  value={searchMac}
                  autoComplete="off"
                  className="hidden sm:block w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                  onChange={(e) => setSearchMac(e.target.value)}
                />

                <div className="relative lg:static">
                  {isFilterDropdownOpen && (
                    <div
                      className="absolute top-full left-0 sm:left-auto sm:right-0 mt-6 bg-white lg:bg-transparent border border-gray-300 rounded-lg shadow-lg p-4 lg:p-0 lg:py-1 flex flex-col gap-2 lg:static lg:mt-0 lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:shadow-none transform -translate-x-6/11 sm:translate-x-0"
                      style={{ zIndex: 9999 }}
                    >
                      <input
                        type="text"
                        placeholder="Search on MAC Address"
                        value={searchMac}
                        autoComplete="off"
                        className="sm:hidden w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                        onChange={(e) => setSearchMac(e.target.value)}
                      />
                      <span className="font-semibold hidden lg:inline"> - </span>
                      <input
                        type="text"
                        placeholder="Search by Email"
                        value={searchEmail}
                        className="w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                        onChange={(e) => setSearchEmail(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Search by uid"
                        value={searchName}
                        className="w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                      <span className="font-semibold hidden lg:inline"> | </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="transition duration-300 p-2 rounded-md ease-in-out text-white hover:text-black bg-[#002757] hover:bg-[#9FDAF9] cursor-pointer"
                >
                  <PiSlidersHorizontal size={20} />
                </button>
              </div>
            )}

            <button
              onClick={() => setIsUserTableOpen(!isUserTableOpen)}
              className=" text-white cursor-pointer px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
            >
              {isUserTableOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
            </button>
          </div>
        </div>
        {isUserTableOpen && (
          <>
            {/* Desktop view */}
            <div className="hidden md:block">
              <UsersTable users={users} groups={groups} />
            </div>

            <div className="grid grid-cols-1 gap-4 w-full md:hidden">
              {users?.map((user: User) => (
                <UserCard key={user.id} user={user} groups={groups} isGroupsLoading={isGroupsLoading} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* GROUPS */}
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-6xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2">
            <MdGroups size={35} />{t('overview.groups')}
          </h1>
          <div className="flex items-center justify-center gap-4">
            {isGroupTableOpen && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search on Group Name"
                  value={searchGroup}
                  autoComplete="off"
                  className="hidden sm:block w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                  onChange={(e) => setSearchGroup(e.target.value)}
                />

                <div className="relative lg:static">
                  {isFilterGroupDropdownOpen && (
                    <div
                      className="absolute top-full left-0 sm:left-auto sm:right-0 mt-6 bg-white lg:bg-transparent border border-gray-300 rounded-lg shadow-lg p-4 lg:p-0 lg:py-1 flex flex-col gap-2 lg:static lg:mt-0 lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:shadow-none transform -translate-x-6/11 sm:translate-x-0"
                      style={{ zIndex: 9999 }}
                    >
                      <input
                        type="text"
                        placeholder="Search on Group Name"
                        value={searchGroup}
                        autoComplete="off"
                        className="sm:hidden w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                        onChange={(e) => setSearchGroup(e.target.value)}
                      />
                      <span className="font-semibold hidden lg:inline"> - </span>
                      <input
                        type="text"
                        placeholder="Search by VLAN"
                        value={searchVlan}
                        className="w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                        onChange={(e) => setSearchVlan(e.target.value)}
                      />
                      <span className="font-semibold hidden lg:inline"> | </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsFilterGroupDropdownOpen(!isFilterGroupDropdownOpen)}
                  className="transition duration-300 p-2 rounded-md ease-in-out text-white hover:text-black bg-[#002757] hover:bg-[#9FDAF9] cursor-pointer"
                >
                  <PiSlidersHorizontal size={20} />
                </button>
              </div>
            )}

            <button
              onClick={() => setIsGroupTableOpen(!isGroupTableOpen)}
              className=" text-white cursor-pointer px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
            >
              {isGroupTableOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
            </button>
          </div>
        </div>
        {isGroupTableOpen && (
          <>
            {/* Desktop view */}
            <div className="hidden md:block">
              <GroupsTable groups={groups} vlans={vlans} />
            </div>

            <div className="grid grid-cols-1 gap-4 w-full md:hidden">
              {groups?.map((group: Group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* EVENTS */}
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-6xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2">
            <MdEvent size={35} />Events
          </h1>
          <div className="flex items-center justify-center gap-4">
            {isEventTableOpen && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search on Event Name"
                  value={searchEvent}
                  autoComplete="off"
                  className="hidden sm:block w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                  onChange={(e) => setSearchEvent(e.target.value)}
                />

                <div className="relative lg:static">
                  {isFilterEventDropdownOpen && (
                    <div
                      className="absolute top-full left-0 sm:left-auto sm:right-0 mt-6 bg-white lg:bg-transparent border border-gray-300 rounded-lg shadow-lg p-4 lg:p-0 lg:py-1 flex flex-col gap-2 lg:static lg:mt-0 lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:shadow-none transform -translate-x-6/11 sm:translate-x-0"
                      style={{ zIndex: 9999 }}
                    >
                      <input
                        type="text"
                        placeholder="Search on Event Name"
                        value={searchEvent}
                        autoComplete="off"
                        className="sm:hidden w-50 border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:border-transparent"
                        onChange={(e) => setSearchEvent(e.target.value)}
                      />
                      <span className="font-semibold hidden lg:inline"> | </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsFilterEventDropdownOpen(!isFilterEventDropdownOpen)}
                  className="transition duration-300 p-2 rounded-md ease-in-out text-white hover:text-black bg-[#002757] hover:bg-[#9FDAF9] cursor-pointer"
                >
                  <PiSlidersHorizontal size={20} />
                </button>
              </div>
            )}

            <button
              onClick={() => setIsEventTableOpen(!isEventTableOpen)}
              className=" text-white cursor-pointer px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
            >
              {isEventTableOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
            </button>
          </div>
        </div>
        {isEventTableOpen && (
          <>
            {/* Desktop view */}
            <div className="hidden md:block">
              <EventsTable events={events} />
            </div>

            <div className="grid grid-cols-1 gap-4 w-full md:hidden">
              {events?.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}