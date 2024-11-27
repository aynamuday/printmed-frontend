import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BounceLoader } from "react-spinners"; // Import the BounceLoader
import AppContext from '../context/AppContext';
import Settings from '../components/Settings';
import {globalSwalWithIcon} from '../utils/globalSwal';

const EditAdminInfoPage = () => {
  const { user, setUser, token } = useContext(AppContext);
  const navigate = useNavigate();
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

  // Loading state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

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
      setLoading(false); // Set loading to false after receiving response

      if (!res.ok) {
        throw new Error('Update failed');
      }

      globalSwalWithIcon.fire({
        title: 'User updated successfully!',
        icon: 'success',
      });
      setUser({ ...user, ...formData });
      navigate('/settings');
    } catch (error) {
      setLoading(false); // Set loading to false if there's an error
      console.error('Error updating user:', error);
      globalSwalWithIcon.fire({
        title: 'There was an error updating the information.',
        text: 'Please try again later.',
        icon: 'error',
      });
    }
  };

  // Handle cancel action
  const handleCancel = () => {
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
    navigate('/settings');
  };

  return (
    <Settings children={(
      <>
        <h2 className="text-4xl font-semibold text-center mb-4">Edit Profile</h2>
        
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <BounceLoader color="#248176" size={60} />
          </div>
        ) : (
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
                  Email
                </label>
                <input 
                  type="email" 
                  name="email" value={formData.email} 
                  onChange={handleChange} 
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
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
                  className="mt-1 block w-[50%] h-10 bg-gray-500 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </>
    )}
    />
  );
};

export default EditAdminInfoPage;
