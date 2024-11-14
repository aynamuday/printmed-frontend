import React, { useState } from 'react';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Settings from '../components/Settings'

const ChangePasswordPage = () => {
  const { token } = useContext(AppContext)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault()

    setError('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    if(!passwordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).")
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New and confirm passwords do not match');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/change-password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ 
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
        }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Password changed successfully!');
      navigate('/settings')
    } else {
      setError(data.message || 'Failed to change password');
    }

    setLoading(false);
  };

  return (
    <Settings children={
      <>
        <div className="w-80">
          <form onSubmit={handleChangePassword} className='flex flex-col items-center'>
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <input
              type="password"
              placeholder="Old Password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 mb-4 mt-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <div className="flex space-x-4 mt-4">
              <button
                disabled={loading}
                type='submit'
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </>
    }/> 
  );
};

export default ChangePasswordPage;
