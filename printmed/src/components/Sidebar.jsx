import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
// import "bootstrap-icons/font/bootstrap-icons.css"; 
import logo from '../assets/images/logo.png';
import AppContext from "../context/AppContext";

const Sidebar = () => {
  const {user, setUser, token, setToken} = useContext(AppContext)
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const linkClass = ({ isActive }) => isActive ? 
  "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700" : 
  "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600";

  const handleLogout = () => {
    setUser(null); // Clear user data
    setToken(null); // Clear token
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <span
        className="absolute text-white text-4xl top-5 left-4 cursor-pointer"
        onClick={toggleSidebar}
      >
        <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
      </span>

      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 duration-1000
          p-2 w-[250px] overflow-y-auto text-center bg-[#6CB6AD] shadow h-screen
          ${isSidebarOpen ? "left-0" : "left-[-300px]"}`}
      >
        <div className="text-white text-xl">
          <div className="p-2.5 mt-1 flex items-center rounded-md bg-[#FFFF00]">
            <img src={logo} className="h-100" alt="Logo" />
            <i className="bi bi-x ml-20 cursor-pointer lg:hidden" onClick={toggleSidebar}></i>
          </div>

          <hr className="my-2 text-white" />

          <div>
            { user.role === "admin" ? (
              <>
                <NavLink to="/" className={linkClass}>
                  <i className="bi bi-house-door-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Dashboard</span>
                </NavLink>
                <NavLink to="/users" className={linkClass}>
                  <i className="bi bi-people"></i>
                  <span className="text-[15px] ml-4 text-white">Users</span>
                </NavLink>
                <NavLink to="/add-user" className={linkClass}>
                  <i className="bi bi-plus-circle"></i>
                  <span className="text-[15px] ml-4 text-white">Add User</span>
                </NavLink> 
                <NavLink to="/departments" className={linkClass}>
                  <i className="bi bi-building"></i>
                  <span className="text-[15px] ml-4 text-white">Departments</span>
                </NavLink>
                <NavLink to="/audits" className={linkClass}>
                  <i className="bi bi-file-earmark-bar-graph"></i>
                  <span className="text-[15px] ml-4 text-white">Audits</span>
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <i className="bi bi-gear-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Settings</span>
                </NavLink>
              </>
            ) : ( user.role === "physician" ? (
              <>
                <NavLink to="/" className={linkClass}>
                  <i className="bi bi-person-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Patients</span>
                </NavLink>
                <NavLink to="/add-patient" className={linkClass}>
                  <i className="bi bi-person-plus-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Add Patient</span>
                </NavLink>
                {/* <NavLink to="/patient" className={linkClass}>
                  <i className="bi bi-search"></i>
                  <span className="text-[15px] ml-4 text-white">Patient Viewer</span>
                </NavLink> */}
                <NavLink to="/settings" className={linkClass}>
                  <i className="bi bi-gear-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Settings</span>
                </NavLink>
              </>
            ) : ( user.role === "secretary" ? (
              <>
                <NavLink to="/" className={linkClass}>
                  <i className="bi bi-person-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Patients</span>
                </NavLink>
                <NavLink to="/add-patient" className={linkClass}>
                  <i className="bi bi-person-plus-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Add Patient</span>
                </NavLink>
                <NavLink to="/patient-registration" className={linkClass}>
                  <i className="bi bi-clipboard-check"></i>
                  <span className="text-[15px] ml-4 text-white">Patient Registration</span>
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                  <i className="bi bi-gear-fill"></i>
                  <span className="text-[15px] ml-4 text-white">Settings</span>
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
