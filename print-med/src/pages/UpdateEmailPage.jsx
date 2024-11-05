import React, { useState } from 'react';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Settings from '../components/Settings'

const UpdateEmailPage = () => {
    const { token, user, setUser } = useContext(AppContext)
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleUpdateEmail = async () => {
        setError('');

        if (newEmail === user.email) {
            setError('The provided email is the same as current email.')
            return
        }

        setLoading(true);

        const res = await fetch('/api/update-email', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ new_email: newEmail }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Email updated successfully!');
            setUser({
                ...user,
                email: newEmail
            })
            navigate('/settings')
        } else {
            setError(data.message)
        }

        setLoading(false);
    };
    
  return (
    <Settings children={<>
        <div className="flex flex-col items-center min-w-96">
            <h2 className="text-xl font-bold mb-6">Update Email</h2>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2 mb-8 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <div className="flex space-x-4">
                <button
                onClick={handleUpdateEmail}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                {loading ? 'Updating...' : 'Save'}
                </button>
            </div>
        </div>
    </>}/>
  )
}

export default UpdateEmailPage