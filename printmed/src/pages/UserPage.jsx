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
  
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    let user;
    if (location.pathname.includes('/users') && location.state.user != undefined) {
      user = location.state.user
    }

    setFormData({
      role: user ? user.role : '',
      personnel_number: user ? user.personnel_number : '',
      first_name: user ? user.first_name : '',
      middle_name: user ? user.middleName ?? '' : '',
      last_name: user ? user.last_name : '',
      suffix: user ? user.suffix ?? '' : '',
      sex: user ? user.sex : '',
      birthdate: user ? user.birthdate : '',
      email: user ? user.email : '',
      department_id: user ? user.department_id ?? '' : ''
    })

    setErrors([])
  }, [userId])

  // fetches the user if route is for update
  // const fetchUser = async () => {
  //   try {
  //     setLoading(true)

  //     const res = await fetch(`/api/users/${userId}`, {
  //       headers: {
  //           Authorization: `Bearer ${token}`
  //       }
  //     })

  //    if(!res.ok) {
  //       if (res.status === 404) {
  //         throw new Error("Account not found.")
  //       } else {
  //         throw new Error("An error occured while finding the account. Please try again later.")
  //       }
  //    }

  //     const data = await res.json()

  //     setFormData({
  //       role: data.role,
  //       personnel_number: data.personnel_number,
  //       first_name: data.first_name,
  //       middle_name: data.middleName ?? '',
  //       last_name: data.last_name,
  //       suffix: data.suffix ?? '',
  //       sex: data.sex,
  //       birthdate: data.birthdate,
  //       email: data.email,
  //       department_id: data.department_id ?? ''
  //     })
  //   }
  //   catch (err) {
  //     showError(err)  
  //   }
  //   finally {
  //     setLoading(false)
  //   }
  // }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = (name != "email" && name != "personnel_number" && name != "suffix" && name != "role") ? capitalizedWords(value) : value

    setErrors({ ...errors, [name]: '' });
  
    // letters only
    if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: capitalizedValue,
    });
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

    globalSwalNoIcon.fire({
      title: `Are you sure you want to ${userId ? "update" : "add"} this account?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)

          let filteredFormData = formData
          if (!userId) {
            filteredFormData = Object.fromEntries(
              Object.entries(formData).filter(([key, value]) => value !== '')
            );
          }

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
                <input
                  type="text"
                  name="personnel_number"
                  placeholder="Personnel Number"
                  value={formData.personnel_number || "PN-"} 
                  onChange={(e) => handlePersonnelNumberChange(e)}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                  minLength="10"
                  maxLength="10"
                  required
                />
                {errors.personnel_number && <p className="text-red-600 text-sm mt-1 mb-1">{errors.errors.personnel_number}</p>}
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
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm p-2"
                  required
                />
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
