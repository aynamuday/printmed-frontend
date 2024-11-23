import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import Settings from '../components/Settings';
import globalSwal from '../utils/globalSwal';

const SettingsPage = () => {
  const { user, setUser, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    role: user.role || '',
    personnel_number: user.personnel_number || '',
    full_name: user.full_name || '',
    first_name: user.first_name || '',
    middle_name: user.middle_name || '',
    last_name: user.last_name || '',
    suffix: user.suffix || '',
    sex: user.sex || '',
    birthdate: user.birthdate || '',
    email: user.email || '',
  });

  // Handle logout functionality
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
            Authorization: `Bearer ${token}`,
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

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${user.id}/update-information`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error('Update failed');
      }

      globalSwal.fire({
        title: 'User updated successfully!',
        icon: 'success',
      });
      setIsEditing(false); // Close the edit form after submission
      setUser({ ...user, ...formData }); // Update the user in context
    } catch (error) {
      console.error('Error updating user:', error);
      globalSwal.fire({
        title: 'There was an error updating the information.',
        text: 'Please try again later.',
        icon: 'error',
      });
    }
  };

  return (
    <Settings children={(
      <>
        <h2 className="text-4xl font-bold">{user.full_name.toUpperCase()}</h2>
        <p className="text-black-500">{user.personnel_number}</p>
        <p className="text-black-500">{user.email}</p>

        <div className="min-h-10"></div>

        {/* Conditionally Render Edit Button */}
        {user.role === 'admin' && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-48 px-4 py-2 bg-[#248176] rounded-md hover:bg-[#41837b] focus:outline-none text-center text-white"
          >
            Edit
          </button>
        )}

        {/* Edit Form */}
        {isEditing && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center mt-6">
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Personnel Number */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Personnel Number<span className="text-red-600 cursor-help" title="Required field">*</span>
                  </label>
                  <input
                    type="text"
                    name="personnel_number"
                    value={formData.personnel_number}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                {/* First Name */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name<span className="text-red-600 cursor-help" title="Required field">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                {/* Middle Name */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Middle Name (optional)</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  />
                </div>

                {/* Last Name */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name<span className="text-red-600 cursor-help" title="Required field">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                {/* Suffix */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Suffix (optional)</label>
                  <select
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>

                {/* Sex */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sex<span className="text-red-600 cursor-help" title="Required field">*</span>
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Birthdate */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Birthdate<span className="text-red-600 cursor-help" title="Required field">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium test-gray-700">
                    Email<span className="text-red-600 cursor-help" title="Required field">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" value={formData.email} 
                    onChange={handleChange} 
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-8 w-full">
                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        role: user.role || '',
                        personnel_number: user.personnel_number || '',
                        full_name: user.full_name || '',
                        first_name: user.first_name || '',
                        middle_name: user.middle_name || '',
                        last_name: user.last_name || '',
                        suffix: user.suffix || '',
                        sex: user.sex || '',
                        birthdate: user.birthdate || '',
                        email: user.email || '',
                      });
                      setIsEditing(false);
                    }}
                    className="mt-1 block w-[50%] h-10 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {/* Update Email, Change Password, and Logout (Hidden when editing) */}
        {!isEditing && (
          <>
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
            </div>
            <div className='min-h-3'></div>
            <button
              onClick={handleLogout}
              className="w-48 px-4 py-2 bg-[#b43c39] text-white rounded-md hover:bg-[#a43331] focus:outline-none"
            >
              Logout
            </button>
          </>
        )}
      </>
    )}/>

  );
};

export default SettingsPage;
