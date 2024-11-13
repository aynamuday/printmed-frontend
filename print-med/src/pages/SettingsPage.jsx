import React from 'react'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppContext from '../context/AppContext'
import Settings from '../components/Settings'
import globalSwal from '../utils/globalSwal'

const SettingsPage = () => {
  const { user, setUser, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
      const result = await globalSwal.fire({
        title: 'Are you sure you want to log out?',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
      });
  
    if (result.isConfirmed) {
      try {
        const res = await fetch("api/logout", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`  // Fixed header format
          }
        });
  
        if (!res.ok) {
          throw new Error('Logout failed');
        }
  
        await res.json();
  
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
      } catch (error) {
        console.error('Logout Error:', error);
        globalSwal.fire({
          title: 'There was an issue logging out.',
          text: 'You may refresh or check your Internet connection.',
          icon: 'error',
        });
      }
    }
  };  

  return (
    <Settings children={<>
      <h2 className="text-4xl font-bold">{user.full_name.toUpperCase()}</h2>
        <p className="text-black-500">{user.personnel_number}</p>
        <p className="text-black-500">{user.email}</p>

      <div className='min-h-10'></div>

      <div className='grid grid-cols-2 gap-x-14 gap-y-0'>
        {user.role === "physician" ? (
          <>
            <p>Department:</p>
            <p><strong>{user.department_name}</strong></p>
            <p>Room Assigned:</p>
            <p><strong>{user.room_assigned}</strong></p>
          </>
        ) : (user.role === "secretary" ? (
          <>
            <p>Department:</p>
            <p><strong>{user.department_name}</strong></p>
          </>
        ) : (<></>))}

        <p>Sex:</p>
        <p><strong>{user.sex}</strong></p>
        <p>Birthdate:</p>
        <p><strong>{user.birthdate}</strong></p>
      </div>

      <div className='min-h-10'></div>

      <div className="mt-6 space-y-4 w-full flex flex-col items-center">
        <Link
          to="/settings/update-email"
          className="w-48 px-4 py-2 bg-[#51918a] rounded-md hover:bg-[#41837b] focus:outline-none text-center text-white"
        >
          Update Email
        </Link>
        <Link
          to="/settings/change-password"
          className="w-48 px-4 py-2 bg-[#51918a] rounded-md hover:bg-[#41837b] focus:outline-none text-center text-white"
        >
          Change Password
        </Link>
        <div className='min-h-3'></div>
        <button
          onClick={handleLogout}
          className="w-48 px-4 py-2 bg-[#b43c39] text-white rounded-md hover:bg-[#a43331] focus:outline-none"
        >
          Logout
        </button>
      </div>
    </>}/>
  );
};

export default SettingsPage;
