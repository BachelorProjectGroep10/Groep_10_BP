'use client';

import { useEffect, useState } from "react";
import UserService from "../../Services/UserService";
import { Group, User } from "../../Types";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import GroupService from "../../Services/GroupService";
import { formatDate } from "../formatDate"
import { useTranslation } from "react-i18next";
import '../../i18n'; 
import UsersTable from "./Tables/usersTable";
import GroupsTable from "./Tables/groupsTable";
import GroupCard from "./Cards/groupCard";
import UserCard from "./Cards/userCard";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


export default function OverviewComponent() {
  const [isUserTableOpen, setIsUserTableOpen] = useState(false); 
  const [isGroupTableOpen, setIsGroupTableOpen] = useState(false); 

  const {t} = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers();
      if (response.ok) {
        const data = await response.json();
        return(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await GroupService.getGroups();
      if (response.ok) {
        const data = await response.json();
        return(data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  const { data: users, isLoading: isUsersLoading } = useSWR('users', fetchUsers);
  const { data: groups, isLoading: isGroupsLoading } = useSWR('groups', fetchGroups);

  useInterval(() => {
    mutate('users', fetchUsers);
    mutate('groups', fetchGroups);
  }, 2000);

  return (
    <div className="flex flex-col items-center justify-start gap-5 w-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2">{t('overview.title')}</h1>
        <p className="text-gray-600 mb-4">{t('overview.subtitle')}</p>
      </div>
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-6xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2"> <IoPersonAddSharp size={25} />{t('overview.users')}</h1>
          <button
            onClick={() => setIsUserTableOpen(!isUserTableOpen)}
            className=" text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
          >
            {isUserTableOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
          </button>
        </div>
        {isUserTableOpen && (
          <>
            {/* Desktop view */}
            <div className="hidden md:block">
              <UsersTable users={users} />
            </div>

            <div className="grid grid-cols-1 gap-4 w-full md:hidden">
              {users.map((user: User) => (
                <UserCard user={user} groups={groups} isGroupsLoading={isGroupsLoading} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-6xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2"> <MdGroups size={35} />{t('overview.groups')}</h1>
          <button
            onClick={() => setIsGroupTableOpen(!isGroupTableOpen)}
            className=" text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out bg-[#002757] hover:bg-[#9FDAF9] focus:outline-none focus:ring-2 focus:ring-[#00509e] focus:ring-opacity-50"
          >
            {isGroupTableOpen ? <FaArrowAltCircleUp /> : <FaArrowAltCircleDown />}
          </button>
        </div>
        {isGroupTableOpen && (
          <> 
            {/* Desktop view */}
            <div className="hidden md:block">
              <GroupsTable groups={groups} />
            </div>

            {/* Mobile view */}
            <div className="grid grid-cols-1 gap-4 w-full md:hidden">
              {groups.map((group: Group) => (
                <GroupCard key={group.groupName} group={group} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
