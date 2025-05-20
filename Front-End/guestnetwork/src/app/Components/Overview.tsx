'use client';

import { useEffect, useState } from "react";
import UserService from "../Services/UserService";
import { Group, User } from "../Types";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import GroupService from "../Services/GroupService";
import formatDate from "./formatDate";
import { useTranslation } from "react-i18next";
import '../i18n'; 


export default function OverviewComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isUserTableOpen, setIsUserTableOpen] = useState(false); 
  const [isGroupTableOpen, setIsGroupTableOpen] = useState(false); 

  const {t} = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers();
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
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
        setGroups(data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start gap-5 w-full p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#003366] flex items-center justify-center gap-2">{t('overview.title')}</h1>
        <p className="text-gray-600 mb-4">{t('overview.subtitle')}</p>
      </div>
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-6xl p-6">
        {/* Header + Toggle */}
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
          <div className="overflow-x-auto border-t border-gray-200 pt-4 bg-white rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className=" text-[#003366] text-left">
                  <th className="px-6 py-3 font-semibold">{t('overview.macAddress')}</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.groupId')}</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.studentNumber')}</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.password')}</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.timeNeeded')}</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.active')}</th>
                </tr>
              </thead>
            </table>

            {/* Scrollable tbody */}
            <div className="max-h-[225px] overflow-y-auto">
              <table className="min-w-full table-auto border-collapse">
                <tbody>
                  {users.map((user: User, idx: number) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#9FDAF9]  text-[#003366] text-left border-b border-gray-200"
                    >
                      <td className="px-6 py-4">{user.macAddress}</td>
                      <td className="px-6 py-4">{user.groupId}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.studentNumber}</td>
                      <td className="px-6 py-4">{user.password}</td>
                      <td className="px-6 py-4">{user.timeNeeded} {t('overview.days')}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.active ? t('overview.yes') : t('overview.no')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 rounded-2xl shadow-lg w-full max-w-6xl p-6">
        {/* Header + Toggle */}
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
          <div className="overflow-x-auto border-t border-gray-200 pt-4 bg-white rounded-lg">
            <table className="min-w-full table-auto border-collapse ">
              <thead>
                <tr className=" text-[#003366] text-left">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.groupName')}</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.description')}</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.password')}</th>
                  <th className="px-6 py-3 font-semibold">{t('overview.expirationDate')}</th>
                </tr>
              </thead>
            </table>

            {/* Scrollable tbody */}
            <div className="max-h-[225px] overflow-y-auto">
              <table className="min-w-full table-auto border-collapse">
                <tbody>
                  {groups.map((group: Group, idx: number) => (
                    <tr
                      key={group.id}
                      className="hover:bg-[#9FDAF9] text-[#003366] text-center border-b border-gray-200"
                    >
                      <td className="px-6 py-4">{group.id}</td>
                      <td className="px-6 py-4">{group.groupName}</td>
                      <td className="px-6 py-4">{group.description}</td>
                      <td className="px-6 py-4">{group.password}</td>
                      <td className="px-6 py-4">{formatDate(group.expiredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
