import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from "react-spinners";
import AppContext from '../context/AppContext';
import {globalSwalWithIcon} from '../utils/globalSwal';
import { showError } from '../utils/fetch/showError';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { validateUserDetails } from '../utils/formValidations/validateUserDetails';
import { validateEmail } from '../utils/formValidations/validateEmail';
import { validateUserBirthdate } from '../utils/formValidations/validateUserBirthdate';
import { showWarning } from '../utils/fetch/showWarning';

const EditProfilePage = () => {
  const { user, setUser, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personnel_number: user?.personnel_number || '',
    personnel_number_input: user?.personnel_number?.replace('PN-', '') || '',
    first_name: user?.first_name || '',
    middle_name: user?.middleName || '',
    last_name: user?.last_name || '',
    suffix: user?.suffix || '',
    sex: user?.sex || '',
    birthdate: user?.birthdate || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    validateUserDetails(e, setErrors, setFormData, formData)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])

    if (formData.sex == "Female") {
      setFormData(prevData => ({ ...prevData, suffix: ""})) 
    }

    let newErrors = {};
    let isFormValid = true

    if (formData.email) {
      const error = validateEmail(formData.email_username)
      if (error.trim() != "") {
        newErrors.email = error
        isFormValid = false
      } 
    }

    if (formData.birthdate) {
      const error = validateUserBirthdate(formData.birthdate)
      if (error.trim() != "") {
        newErrors.birthdate = error
        isFormValid = false
      }
    }
  
    if (!isFormValid) {
      setErrors(newErrors);
      return;
    }

    const formDataToSubmit = Object.keys(formData).reduce((acc, key) => {
      if ((String(formData[key]).trim() == "" && (user[key] == null || String(user[key]).trim() == "")) || key == "email_username" || key == 'personnel_number_input') {
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

    try {
      setLoading(true)

      const res = await fetch(`/api/users/${user.id}/update-information`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json()

      if(!res.ok) {
        if (res.status === 422 && data.field == "personnel_number") {
          showWarning("Personnel number is already taken.")
          return
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
                  <div className="relative">
                    <div className="flex items-center border rounded-md border-black overflow-hidden">
                      <span className="bg-gray-100 p-2">PN-</span>
                      <input
                          type="text"
                          name="personnel_number_input"
                          placeholder="Personnel Number"
                          value={formData.personnel_number_input}
                          onChange={handleChange}
                          className="flex-1 p-2 border-l border-black focus:outline-none"
                          maxLength="7"
                          minLength="7"
                          required
                      />
                    </div>
                  </div>
                  {errors.personnel_number && (
                    <p className="text-red-600 text-sm">{errors.personnel_number}</p>
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
                    onChange={handleChange}
                    placeholder='First Name'
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                    required
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-sm">{errors.first_name}</p>
                  )}
                </div>

                {/* Middle Name */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-black">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    placeholder='Middle Name'
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                  />
                  {errors.middle_name && (
                    <p className="text-red-600 text-sm">{errors.middle_name}</p>
                  )}
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
                    onChange={handleChange}
                    placeholder='Last Name'
                    className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                    required
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-sm">{errors.last_name}</p>
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
                  {errors.birthdate && (
                    <p className="text-red-600 text-sm">{errors.birthdate}</p>
                  )}
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
