import React, { useState } from 'react';

const UpdateEmailPage = ({ onClose }) => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateEmail = async () => {
    setError('');

    if (newEmail !== confirmEmail) {
      setError('Emails do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail }),
      });

      if (response.ok) {
        alert('Email updated successfully!');
        onClose(); // Close the page after updating
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update email');
      }
    } catch (err) {
      setError('An error occurred while updating the email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Update Email</h2>
      
      <input
        type="email"
        placeholder="Enter new email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <input
        type="email"
        placeholder="Confirm new email"
        value={confirmEmail}
        onChange={(e) => setConfirmEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex space-x-4">
        <button
          onClick={handleUpdateEmail}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Email'}
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

export default UpdateEmailPage;
