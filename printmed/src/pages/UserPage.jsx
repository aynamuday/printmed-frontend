import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {globalSwalNoIcon, globalSwalWithIcon} from "../utils/globalSwal";
import { capitalizedWords } from "../utils/wordUtils";
import { BounceLoader } from "react-spinners";
import {showError} from "../utils/fetch/showError";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import logo from '../assets/images/logo.png';

import AppContext from "../context/AppContext";

// for viewing/updating a user, and adding a new user
const UserPage = () => {
  const { departments, token } = useContext(AppContext)

  const location = useLocation()
  const navigate = useNavigate()
  const { userId } = useParams();

  if (location.pathname.includes('/users') && !userId && location.state.user == undefined) {
    navigate('/')
    return
  }
  
  const [formData, setFormData] = useState({
    role: '',
    personnel_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    sex: '',
    birthdate: '',
    email: '',
    email_username: '',
    department_id: '',
    personnel_number_input: '',
  });
  console.log(formData);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (location.pathname.includes('/users') && location.state.user != undefined) {
      const user = location.state.user

      setFormData({
        role: user ? user.role : '',
        personnel_number: user ? user.personnel_number : '',
        personnel_number_input: user ? user.personnel_number?.replace('PN-', '') ?? '' : '',
        first_name: user ? user.first_name : '',
        middle_name: user ? user.middleName ?? '' : '',
        last_name: user ? user.last_name : '',
        suffix: user ? user.suffix ?? '' : '',
        sex: user ? user.sex : '',
        birthdate: user ? user.birthdate : '',
        email: user ? user.email : '',
        email_username: user ? user.email?.replace('@gmail.com', '') ?? '' : '',
        department_id: user ? user.department_id ?? '' : ''
      })
    }

    setErrors([])
  }, [userId])

  const handleEmailChange = (e) => {
    const emailUsername = e.target.value;
    setFormData({
        ...formData,
        email_username: emailUsername,  // Update only the username part
        email: emailUsername + "@gmail.com", // Construct the full email
    });

    // Email Validation
    let newErrors = { ...errors };  // Clone errors to modify
    if (!emailUsername.trim()) {
        newErrors.email = 'Email username is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+$/.test(emailUsername)) {
        newErrors.email = 'Email username contains invalid characters.';
    } else {
        // Construct full email
        const fullEmail = `${emailUsername}@gmail.com`;
        if (!/\S+@\S+\.\S+/.test(fullEmail)) {
            newErrors.email = 'Please enter a valid email address.';
        } else {
            newErrors.email = '';  // Clear any email errors if valid
        }
    }

    setErrors(newErrors); // Update the errors state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);

    const capitalizedValue = (name != "suffix" && name != "role") ? capitalizedWords(value) : value

    setErrors({ ...errors, [name]: '' });
  
    // letters only
    if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Cannot contain numbers or special characters.',
      }));
      return;
    }

    if (name === 'personnel_number' && /[^\d]/g.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Please enter only numbers for Personnel Number.',
      }));
      return;
    }

    setFormData({
      ...formData,
      [name]: capitalizedValue,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([])

    let filteredFormData = formData
    if (!userId) {
      filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== '')
      );
    } else {
      const user = location.state.user

      filteredFormData = Object.keys(formData).reduce((acc, key) => {
        if (String(formData[key]).trim() == "" && (user[key] == null || String(user[key]).trim() == "")) {
            return acc
        }

        if ((formData[key] !== user[key])) {
            acc[key] = formData[key]
        }

        return acc;
      }, {});

      if (!Object.keys(filteredFormData).length > 0) {
        navigate("/users")
        return
      }
    }

    globalSwalNoIcon.fire({
      title: `Are you sure you want to ${userId ? "update" : "add"} this account?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)

          const url = userId ? '/api/users/' + userId + '/update-information' : '/api/users'
          const method = userId ? "PUT" : "POST"

          const res = await fetch(url, {
            method: method,
            headers: { 
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(filteredFormData),
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
          
          setFormData({
            role: '',
            personnel_number: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            sex: '',
            birthdate: '',
            email: '',
            department_id: '',
          });

          const dialogTitle = userId ? "User updated successfully!" : "User added successfully!"
          globalSwalWithIcon.fire({
            icon: "success",
            title: dialogTitle,
            showConfirmButton: false,
            showCloseButton: true
          });

          navigate('/users')
        }
        catch (err) {
          showError(err)
        }
        finally {
          setLoading(false)
        }
      }
    });
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] mb-10 grid grid-cols-1 place-items-center relative">
        { loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-white bg-opacity-40 flex justify-center items-center z-50">
                <BounceLoader color="#6CB6AD" loading={loading} size={60} />
            </div>
        )}
        
        <div className="relative w-full md:w-[70%] bg-gray-100 pt-8 pb-10 rounded-lg shadow-md mb-6">
          <div className="flex justify-center items-center rounded-md">
            <img src={logo} className="h-20" alt="Logo" />
          </div>
          {userId && (
            <div className="absolute top-4 left-4 p-4">      
              <button onClick={() => navigate("/users")} className="mr-4">
                <i className="bi bi-arrow-left text-2xl font-bold"></i>
              </button>
            </div>
          )}

          <h2 className="text-2xl text-center font-bold m-6">{userId ? "Update User Account" : "Create New Account"}</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-[90%] sm:w-[70%]">
              <div className="mb-2">
                <label className="block text-sm font-medium">
                  Role <span className="text-red-600 cursor-help">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border bg-white border-black rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="physician">Physician</option>
                  <option value="secretary">Secretary</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">
                    Personnel Number <span className="text-red-600 cursor-help">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center border rounded-md border-black overflow-hidden">
                    <span className="bg-gray-100 p-2 text-gray-700">PN-</span>
                      <input
                        type="text"
                        name="personnel_number"
                        placeholder="Personnel Number"
                        value={formData.personnel_number_input}
                        onChange={(e) => {
                          const personnelNumber = e.target.value.replace(/\D/g, '');
                          const limitedValue = personnelNumber.slice(0, 7);
                            setFormData({
                              ...formData,
                              personnel_number_input: limitedValue,
                              personnel_number: "PN-" +  limitedValue,
                            });

                            if (/[^0-9]/.test(e.target.value)) {
                              setErrors({
                                ...errors,
                                personnel_number: 'Only numeric characters are allowed.',
                              });
                            } else {
                              setErrors({
                                ...errors,
                                personnel_number: '',
                              });
                            }
                          }}
                        className="flex-1 p-2 border-l border-black focus:outline-none"
                        maxLength="7"
                        required
                      />
                    </div>
                  {errors.personnel_number && (<p className="text-red-600 text-sm">{errors.personnel_number}</p>)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  First Name <span className="text-red-600 cursor-help">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                  required
                />
                {errors.first_name && (<p className="text-red-500 text-sm">{errors.first_name}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  placeholder="Middle Name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                />
                {errors.middle_name && (<p className="text-red-500 text-sm">{errors.middle_name}</p>)}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">
                  Last Name <span className="text-red-600 cursor-help">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                  required
                />
                {errors.last_name && (<p className="text-red-500 text-sm">{errors.last_name}</p>)}
              </div>

              <div className="mb-2 w-1/2">
                <label className="block text-sm font-medium">Suffix</label>
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

              <div className="mb-2">
                <label className="block text-sm font-medium">
                  Sex <span className="text-red-600 cursor-help">*</span>
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="mt-1 block w-full border bg-white border-black rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">
                  Birthdate <span className="text-red-600 cursor-help">*</span>
                </label>
                <input
                  type="date"
                  name="birthdate"
                  placeholder="Birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]} // min age is 18
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]} // max age is 100
                  required
                />
                {formData.birthdate &&
                  new Date(formData.birthdate) > new Date(new Date().setFullYear(new Date().getFullYear() - 18)) && (
                    <p className="text-red-600 text-sm mt-1">
                      User must be at least 18 years old.
                    </p>
                  )
                }
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">
                    Email <span className="text-red-600 cursor-help">*</span>
                </label>
                  <div className="flex items-center border rounded-md border-black overflow-hidden">
                    <input
                      type="text"
                      name="email_username"
                      placeholder="Email"
                      value={formData.email_username}  
                      onChange={handleEmailChange}
                      className="w-full p-2 focus:outline-none"
                      required
                    />
                    <span className="bg-gray-100 text-gray-600 px-2">@gmail.com</span>  {/* Display domain externally */}
                  </div>
                {errors.email && <p className="text-red-600 text-sm mt-1 mb-1">{errors.email}</p>}
              </div>

              {(formData.role === 'physician' || formData.role === 'secretary') && (
                <div className="mb-2">
                  <label className="block text-sm font-medium">
                    Department <span className="text-red-600 cursor-help">*</span>
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="mt-1 block w-full border bg-white border-black rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-8 w-full">
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                    { userId ? "Save" : "Create Account" }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserPage;
