import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import AppContext from "../context/AppContext";
import { globalSwalNoIcon } from "../utils/globalSwal";
import { showError } from "../utils/fetch/showError";

const Sidebar = () => {
  const { user, setUser, setToken, token } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const linkClass = ({ isActive }) => 
    isActive 
      ? `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer font-semibold bg-gray-700` 
      : `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer font-semibold hover:bg-blue-600`;

  const handleLogout = async () => {
    const result = await globalSwalNoIcon.fire({
      title: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch("api/logout", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

        if (!res.ok) {
          throw  new Error('There was an issue logging out. Please try again.');
        }

        await res.json();

        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
      } catch (err) {
        showError(err);
      }
    }
  };
  
  return (
    <>
      <button
        className="absolute text-white text-3xl top-2 left-4 z-30 lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? '' : '☰'}
      </button>

      <div className={`fixed top-0 left-0 h-full z-20 bg-[#6CB6AD] text-white shadow-lg duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        w-[250px] md:w-[300px] lg:translate-x-0 lg:w-[250px] overflow-y-auto`}>

        <div className="relative p-2.5 mt-1 flex items-center rounded-md bg-[#FFFF00]">
          <img src={logo} className="h-100" alt="Logo" />
          <i
            className="bi bi-x text-black cursor-pointer absolute top-1 right-2 lg:hidden"
            onClick={toggleSidebar}
          ></i>
        </div>

        <hr className="my-2 text-white" />

        <div className="px-4">
          { user.role === "admin" || user.role === "super admin" ? (
            <>
              <NavLink to="/" className={linkClass}>
                <i className="bi bi-house-door-fill text-2xl"></i>                  
                <span className="text-xl ml-4 text-white">Dashboard</span>
              </NavLink>
              <NavLink to="/users" className={({ isActive }) => `${linkClass({ isActive })} ${!isActive && location.pathname.includes('/users') ? "bg-gray-700" : ""}`}>
                <i className="bi bi-people text-2xl"></i>
                <span className="text-xl ml-4 text-white">Users</span>
              </NavLink>
              <NavLink to="/add-user" className={linkClass}>
                <i className="bi bi-plus-circle text-2xl"></i>
                <span className="text-xl ml-4 text-white">Add User</span>
              </NavLink> 
              {user.role === "super admin" && 
                <NavLink to="/departments" className={linkClass}>
                  <i className="bi bi-building text-2xl"></i>
                  <span className="text-xl ml-4 text-white">Departments</span>
                </NavLink>
              }
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
                <NavLink to="/" className={({ isActive }) => `${linkClass({ isActive })} ${!isActive && location.pathname.includes('/patient') ? "bg-gray-700" : ""}`}>
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
            ) : (<></>))) 
          }
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 mt-3 text-white rounded-md hover:bg-[#a43331] focus:outline-none flex items-center justify-start"
          >
            <i className="bi bi-box-arrow-right text-2xl"></i>
            <span className="text-xl ml-4 font-bold text-white">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
