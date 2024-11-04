import React, { useContext, useState } from "react";
import { NavLink, Link } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; 
import logo from '../assets/images/logo.png';
import AppContext from "../context/AppContext";

const Sidebar = () => {
  const {user} = useContext(AppContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const linkClass= ({ isActive }) => isActive ? 
  "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700" : 
  "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600";

  return (
    <div className="">
      <span
        className="absolute text-white text-4xl top-5 left-4 cursor-pointer"
        onClick={toggleSidebar}
      >
        <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
      </span>

      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 duration-1000
          p-2 w-[300px] overflow-y-auto text-center bg-[#6CB6AD] shadow h-screen
          ${isSidebarOpen ? "left-0" : "left-[-300px]"}`}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center rounded-md bg-[#FFFF00]">
            <img src={logo} className="h-100" alt="Logo" />
            <i className="bi bi-x ml-20 cursor-pointer lg:hidden" onClick={toggleSidebar}></i>
          </div>

          <hr className="my-2 text-gray-600" />

          <div className="">

            <NavLink to="/dashboard" className={linkClass}>
              <i className="bi bi-house-door-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Dashboard</span>
            </NavLink>

            <NavLink to="/patient-records" className={linkClass}>
              <i className="bi bi-person-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Patient Records</span>
            </NavLink>

            <NavLink to="/add-records" className={linkClass}>
              <i className="bi bi-person-plus-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Add Record</span>
            </NavLink>

            <NavLink to="/settings" className={linkClass}>
              <i className="bi bi-gear-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Settings</span>
            </NavLink>

            <NavLink to="/queue-view" className={linkClass}>
              <i className="bi bi-inbox-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Queue - View</span>
            </NavLink>

            <NavLink to="/queue" className={linkClass}>
              <i className="bi bi-inbox-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Queue</span>
            </NavLink>

            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600">
              <i className="bi bi-box-arrow-in-right"></i>
              <Link to='/' className="text-[20px] ml-4 text-gray-200">Logout</Link>
            </div>

            <NavLink to="/dashboard-admin" className={linkClass}>
              <i className="bi bi-house-door-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Dashboard - Admin</span>
            </NavLink>

            <NavLink to="/department" className={linkClass}>
              <i className="bi bi-building"></i>
              <span className="text-[20px] ml-4 text-gray-200">Department</span>
            </NavLink>

            <NavLink to="/user-management" className={linkClass}>
              <i class="bi bi-people"></i>
              <span className="text-[20px] ml-4 text-gray-200">User Management</span>
            </NavLink>

            <NavLink to="/settings" className={linkClass}>
              <i className="bi bi-gear-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Settings</span>
            </NavLink>

            <NavLink to="/reports" className={linkClass}>
              <i class="bi bi-file-earmark-bar-graph"></i>
              <span className="text-[20px] ml-4 text-gray-200">Reports</span>
            </NavLink>

            <NavLink to="/audit" className={linkClass}>
              <i class="bi bi-journal-check"></i>
              <span className="text-[20px] ml-4 text-gray-200">Audit</span>
            </NavLink>

            <NavLink to="/add-account" className={linkClass}>
              <i class="bi bi-plus-circle"></i>
              <span className="text-[20px] ml-4 text-gray-200">Add Account</span>
            </NavLink>      

            <NavLink to="/queue-view" className={linkClass}>
              <i className="bi bi-inbox-fill"></i>
              <span className="text-[20px] ml-4 text-gray-200">Queue - View</span>
            </NavLink>      

            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600">
              <i className="bi bi-box-arrow-in-right"></i>
              <Link to='/' className="text-[20px] ml-4 text-gray-200">Logout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
