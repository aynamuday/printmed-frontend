import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import AppContext from "../context/AppContext";

const Sidebar = () => {
  const {user} = useContext(AppContext)
  const navigate = useNavigate();
  const location = useLocation()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const linkClass = ({ isActive }) => isActive ? 
  `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer font-semibold bg-gray-700` : 
  "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer font-semibold hover:bg-blue-600";

  return (
    <>
      {!isSidebarOpen && (
        <span
          className="absolute text-white text-4xl top-2.5 left-4 cursor-pointer z-20 lg:hidden"
          onClick={toggleSidebar}
        >
          <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
        </span>
      )}

      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 duration-300
        p-2 w-[250px] md:w-[300px] overflow-y-auto text-center bg-[#6CB6AD] shadow h-screen z-20
        ${isSidebarOpen ? "left-0" : "left-[-250px] md:left-[-300px]"}`}
      >

        <div className="text-white text-3xl">
        <div className="relative p-2.5 mt-1 flex items-center rounded-md bg-[#FFFF00]">
          <img src={logo} className="h-100" alt="Logo" />
          <i
            className="bi bi-x text-black cursor-pointer absolute top-1 right-2 lg:hidden"
            onClick={toggleSidebar}
          ></i>
        </div>
          <hr className="my-2 text-white" />

          <div>
            { user.role === "admin" ? (
              <>
                <NavLink to="/" className={linkClass}>
                  <i className="bi bi-house-door-fill text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Dashboard</span>
                </NavLink>
                <NavLink to="/users" className={linkClass}>
                  <i className="bi bi-people text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Users</span>
                </NavLink>
                <NavLink to="/add-user" className={linkClass}>
                  <i className="bi bi-plus-circle text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Add User</span>
                </NavLink> 
                <NavLink to="/departments" className={linkClass}>
                  <i className="bi bi-building text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Departments</span>
                </NavLink>
                <NavLink to="/audits" className={linkClass}>
                  <i className="bi bi-file-earmark-bar-graph text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Audits</span>
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <i className="bi bi-gear-fill text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Settings</span>
                </NavLink>
              </>
            ) : ( user.role === "physician" ? (
              <>
                <NavLink to="/" className={linkClass}>
                  <i className="bi bi-person-fill text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Patient</span>
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <i className="bi bi-gear-fill text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Settings</span>
                </NavLink>
              </>
            ) : ( user.role === "secretary" ? (
              <>
                <NavLink to="/" className={({ isActive }) => `${linkClass({ isActive })} ${!isActive && location.pathname.includes('/patients') ? "bg-gray-700" : ""}`}>
                  <i className="bi bi-person-fill text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Patients</span>
                </NavLink>
                <NavLink to="/registrations" className={linkClass}>
                  <i className="bi bi-clipboard-check text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Registrations</span>
                </NavLink>
                <NavLink to="/add-patient" className={linkClass}>
                  <i className="bi bi-person-plus-fill text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Add Patient</span>
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <i className="bi bi-gear-fill text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Settings</span>
                </NavLink>
              </>
            ) : (<></>))) }
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
