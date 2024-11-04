import React, { useState } from 'react';

const ChangePasswordPage = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        onClose();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred while changing the password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      
      <input
        type="password"
        placeholder="Enter current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex space-x-4">
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
