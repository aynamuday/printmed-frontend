import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {globalSwalNoIcon, globalSwalWithIcon} from "../utils/globalSwal";
import { BounceLoader } from "react-spinners";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import logo from '../assets/images/logo.png';

import AppContext from "../context/AppContext";

// for viewing/updating a user, and adding a new user
const UserPage = () => {
  const { departments, token } = useContext(AppContext)
  
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
    department_id: ''
  });
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  const location = useLocation()
  const navigate = useNavigate()
  const { userId } = useParams();

  if (location.pathname.includes('/view-user') && !userId) {
    navigate('/')
    return
  }

  useEffect(() => {
    if (location.pathname.includes('/view-user') && userId) {
      fetchUser()
    } else {
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
    }

    setErrors([])
  }, [userId])

  //fetches the user if route is for update
  const fetchUser = async () => {
    setLoading(true)

    const url = "/api/users/" + userId

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (res.ok) {
      const data = await res.json()

      setFormData({
        role: data.role,
        personnel_number: data.personnel_number,
        first_name: data.first_name,
        middle_name: data.middleName ?? '',
        last_name: data.last_name,
        suffix: data.suffix ?? '',
        sex: data.sex,
        birthdate: data.birthdate,
        email: data.email,
        department_id: data.department_id ?? ''
      })
    } else {
      globalSwalWithIcon.fire({
        showConfirmButton: false,
        title: 'User not found.',
        icon: 'error',
        showCloseButton: true,
      }).then((result) => {
            if(result.isDismissed) {
              navigate('/users')
            }
          });
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log('Changed:', name, value);
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
  
    if (name === 'birthdate_day' || name === 'birthdate_month' || name === 'birthdate_year') {
      setFormData({
        ...formData,
        birthdate: {
          ...formData.birthdate,
          [name.split('_')[1]]: value // Updates day, month, or year
        }
      });
      return;
    }
  
    // Name fields should not accept numbers and capitalize first letter
    if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
      setErrors({ ...errors, [name]: '' });
      return;
    }
  
    if (name === 'suffix') {
      setFormData({
        ...formData,
        suffix: value,
      });
      return;
    }
  
    if (name === 'sex') {
      setFormData({
        ...formData,
        sex: value,
      });
      return;
    }

    if (name === 'role') {
      setFormData({
        ...formData,
        role: value,
      });
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

    globalSwalNoIcon.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      setLoading(true)

      if (result.isConfirmed) {
        try {
          // removes empty values in form
          const filteredFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== '')
          );

          const url = userId ? '/api/users/' + userId + '/update-information' : '/api/users'
          const method = userId ? "PUT" : "POST"

          const res = await fetch(url, {
            method: method,
            headers: { 
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(filteredFormData),
          });

          const data = await res.json();

          if (res.ok) {
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
          } else {
            console.log(data)
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

      setLoading(false)
    });
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] mb-10 grid grid-cols-1 place-items-center relative">
        { loading && (
            <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center bg-white bg-opacity-50 z-10'>
                <BounceLoader color="#6CB6AD" loading={true} size={60} className="mt-60" />
            </div>
        )}
        
        <div className="w-full md:w-[70%] bg-gray-100 pt-8 pb-10 rounded-lg shadow-md mb-6">
          <div className="flex justify-center items-center rounded-md">
            <img src={logo} className="h-20" alt="Logo" />
          </div>

          <h2 className="text-xl text-center font-bold m-6">{userId ? "Update User Account" : "Create New Account"}</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-[70%]">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Role<span className="text-red-600 cursor-help" title="Required field">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="physician">Physician</option>
                  <option value="secretary">Secretary</option>
                </select>
                {/* {errors.errors && errors.role[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.role[0]}</p>} */}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Personnel Number<span className="text-red-600 cursor-help" title="Required field">*</span>
                </label>
                <input
                  type="text"
                  name="personnel_number"
                  placeholder="Personnel Number"
                  value={formData.personnel_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {/* {errors.errors && errors.personnel_number[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.personnel_number[0]}</p>} */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name<span className="text-red-600 cursor-help" title="Required field">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {/* {errors.errors && errors.first_name[0] && <p className="text-red-600 mt-1">{errors.errors.first_name[0]}</p>} */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Middle Name (optional)</label>
                <input
                  type="text"
                  name="middle_name"
                  placeholder="Middle Name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                />
                {/* {errors.errors && errors.middle_name[0] && <p className="text-red-600 mt-1">{errors.errors.middle_name[0]}</p>} */}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name<span className="text-red-600 cursor-help" title="Required field">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {/* {errors.errors && errors.last_name[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.last_name[0]}</p>} */}
              </div>

              <div className="mb-2 w-1/2">
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
                  {/* Add more options as needed */}
                </select>
              </div>

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
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {/* {errors.errors && errors.sex[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.sex[0]}</p>} */}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Birthdate<span className="text-red-600 cursor-help" title="Required field">*</span>
                </label>
                <input
                  type="date"
                  name="birthdate"
                  placeholder="Birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 25))
                    .toISOString()
                    .split("T")[0]} // Max date is today minus 25 years
                  min="1920-01-01" // Min date is 1920-01-01
                  required
                />
                {/* Optional validation message */}
                {formData.birthdate &&
                  new Date(formData.birthdate) >
                    new Date(new Date().setFullYear(new Date().getFullYear() - 25)) && (
                    <p className="text-red-600 mt-1">
                      You must be at least 25 years old.
                    </p>
                  )}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email<span className="text-red-600 cursor-help" title="Required field">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {/* {errors.errors && errors.email[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.email[0]}</p>} */}
              </div>

              {(formData.role === 'physician' || formData.role === 'secretary') && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department<span className="text-red-600 cursor-help" title="Required field">*</span>
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {/* {errors.errors && errors.department_id[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.department_id[0]}</p>} */}
                </div>
              )}
            </div>

            <div className="mt-8 w-full">
              {/* {!errors.errors && errors.message && <p className="text-red-600 mb-1 text-center">{errors.message}</p>} */}

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
