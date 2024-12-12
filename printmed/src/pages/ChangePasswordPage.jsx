import React, { useState } from 'react';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from "react-spinners";
import { globalSwalNoIcon, globalSwalWithIcon } from '../utils/globalSwal';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {showLoggedOut} from "../utils/fetch/showLoggedOut"
import { showError } from '../utils/fetch/showError';

const ChangePasswordPage = () => {
  const { token } = useContext(AppContext)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault()

    setError('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/

    if(!passwordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.")
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New and confirm passwords do not match');
      return;
    }

    globalSwalNoIcon.fire({
      title: 'Are you sure want to change your password?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)

          const res = await fetch('/api/change-password', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              current_password: currentPassword,
              new_password: newPassword,
              new_password_confirmation: confirmPassword
            }),
          });
    
          if(!res.ok) {
            if (res.status === 401) {
              setError("Old password is incorrect.")
              return
            } else if (res.status == 401 && data.message == "Unauthenticated.") {
              showLoggedOut()
              navigate('/')
              return
            } else {
              throw new Error("Something went wrong. Please try again later.")
            } 
          }
        
          globalSwalWithIcon.fire({
            showConfirmButton: false,
            title: 'Your password has been changed successfully!',
            icon: 'success',
            showCloseButton: true
          });

          navigate('/settings')
        }
        catch (err) {
          showError(err)
        }
        finally {
          setLoading(false)
        }
      }
    })
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[70%] md:ml-[25%] mt-[10%] relative">
        <div className="flex flex-col items-center justify-center mt-10 bg-[#98e6dd] bg-opacity-50 p-16 rounded-lg shadow-lg min-h-80">
          <div className="flex flex-col items-center min-w-96">
            <div className="absolute top-4 left-4 p-4">      
              <button onClick={() => navigate("/settings")} className="mr-4">
                <i className="bi bi-arrow-left text-2xl font-bold"></i>
              </button>
            </div>
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-30 z-50">
                <BounceLoader color="#6CB6AD" size={60} />
              </div>
            )}
            <form onSubmit={handleChangePassword} className='relative flex flex-col items-center'>
              <h2 className="text-xl font-bold mb-4">
                  Change Password
              </h2>

              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              <div className="relative w-96 mb-4">
                <input
                  type={visibility.current ? "text" : "password"}
                  placeholder="Old Password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <i
                  onClick={() => toggleVisibility('current')}
                  className={`absolute right-3 top-3 cursor-pointer ${
                    visibility.current ? 'bi bi-eye-slash' : 'bi bi-eye'
                  }`}
                ></i>
              </div>

              <div className="relative w-96 mb-4">
                <input
                  type={visibility.new ? "text" : "password"}
                  placeholder="New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <i
                  onClick={() => toggleVisibility('new')}
                  className={`absolute right-3 top-3 cursor-pointer ${
                    visibility.new ? 'bi bi-eye-slash' : 'bi bi-eye'
                  }`}
                ></i>
              </div>

              <div className="relative w-96 mb-4">
                <input
                  type={visibility.confirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <i
                  onClick={() => toggleVisibility('confirm')}
                  className={`absolute right-3 top-3 cursor-pointer ${
                    visibility.confirm ? 'bi bi-eye-slash' : 'bi bi-eye'
                  }`}
                ></i>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  disabled={loading}
                  type='submit'
                  className="px-4 py-2 bg-[#248176] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
