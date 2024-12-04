import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BounceLoader } from "react-spinners";
import AppContext from '../context/AppContext';
import {globalSwalWithIcon} from '../utils/globalSwal';
import { showError } from '../utils/fetch/showError';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const EditProfilePage = () => {
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
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    personnel_number: '',
  });

  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    formattedValue = capitalizeName(formattedValue);
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePersonnelNumberChange = (e) => {
    let value = e.target.value;

    setErrors((prevErrors) => ({ ...prevErrors, personnel_number: '' }));
  
    const personnelNumberRegex = /^PN-\d*$/
    if (!personnelNumberRegex.test(value)) {
      return
    }

    if (value.length < 4) {
      value = 'PN-';
    }
  
    setFormData((prevData) => ({
      ...prevData,
      personnel_number: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([])

    if (!formData.first_name || !formData.last_name || !formData.personnel_number) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        first_name: formData.first_name ? '' : 'First Name is required',
        last_name: formData.last_name ? '' : 'Last Name is required',
        personnel_number: formData.personnel_number ? '' : 'Personnel Number is required',
      }));
      return;
    }

    try {
      setLoading(true)

      const formDataToSubmit = Object.keys(formData).reduce((acc, key) => {
        if (formData[key].trim() == "" && (user[key] == null || user[key].trim() == "")) {
          return acc
        }

        if ((formData[key] !== user[key])) {
          acc[key] = formData[key]
        }

        return acc;
      }, {});

      if (!Object.keys(formDataToSubmit).length > 0) {
        navigate('/settings');
        return
      }

      const res = await fetch(`/api/users/${user.id}/update-information`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json()

      if(!res.ok) {
        if (res.status === 422 && data.field == "email") {
          throw new Error("Email is already taken.")
        } else if (res.status === 422 && data.field == "personnel_number") {
          throw new Error("Personnel number is already taken.")
        } else {
          throw new Error("Something went wrong. Please try again later.")
        }
      }
	  
      globalSwalWithIcon.fire({
        showConfirmButton: false,
        title: 'Profile updated successfully!',
        icon: 'success',
        showCloseButton: true
      });

      setUser(data);
      navigate('/settings');
    }
    catch (err) {
      showError(err)
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[70%] md:ml-[25%] mt-[10%] relative">
        <div className="flex flex-col items-center justify-center mt-10 bg-[#98e6dd] bg-opacity-50 p-16 rounded-lg shadow-lg min-h-80 mb-12">
          <div className="flex flex-col items-center min-w-96 lg:w-[60%]">
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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center w-full mt-6 px-4 sm:px-6">
              <h2 className="text-2xl font-bold mb-8">
                  Edit Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* Personnel Number */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black">
                    Personnel Number <span className="text-red-600 cursor-help">*</span>
                  </label>
                  <input
                    type="text"
                    name="personnel_number"
                    value={formData.personnel_number || "PN-"}
                    onChange={(e) => handlePersonnelNumberChange(e)}
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                    minLength="10"
                    maxLength="10"
                    placeholder='Personnel Number'
                    required
                  />
                  {errors.personnel_number && (
                    <p className="text-red-600 text-xs">{errors.personnel_number}</p>
                  )}
                </div>

                {/* First Name */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black">
                    First Name <span className="text-red-600 cursor-help">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleNameChange}
                    placeholder='First Name'
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                    required
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-xs">{errors.first_name}</p>
                  )}
                </div>

                {/* Middle Name */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleNameChange}
                    placeholder='Middle Name'
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                  />
                </div>

                {/* Last Name */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black">
                    Last Name <span className="text-red-600 cursor-help">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleNameChange}
                    placeholder='Last Name'
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                    required
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-xs">{errors.last_name}</p>
                  )}
                </div>

                {/* Suffix */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black">Suffix</label>
                  <select
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                    className="mt-1 block w-full border bg-white border-black rounded-md shadow-sm p-2"
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
                  <label className="block text-sm font-medium text-black">
                    Sex <span className="text-red-600 cursor-help">*</span>
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-black rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Birthdate */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black">
                    Birthdate <span className="text-red-600 cursor-help">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                    required
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
