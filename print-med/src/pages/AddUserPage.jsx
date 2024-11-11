import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import logo from '../assets/images/logo.png';
import AppContext from "../context/AppContext";
import { BounceLoader } from "react-spinners";

const AddUserPage = () => {
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
    department_id: '',
  });
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Are you sure you want to add this user?',
      showCancelButton: true,
      confirmButtonText: 'Yes, add user',
      cancelButtonText: 'Cancel',
      customClass: {
        title: 'text-xl font-bold text-black text-center',
        confirmButton: 'bg-[#248176] text-white rounded-lg px-6 py-2 hover:bg-blue-700',
        cancelButton: 'bg-gray-700 border-2 rounded-lg px-6 py-2',
        popup: 'border-2 rounded-xl p-6'
      },
    }).then(async (result) => {
      setLoading(true)

      if (result.isConfirmed) {
        try {
          // removes empty values in form
          const filteredFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== '')
          );

          const res = await fetch('/api/register', {
            method: 'POST',
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

            Swal.fire({
              title: 'User Added Successfully!',
              confirmButtonText: 'OK',
            });
          } else {
            setErrors(data)
            console.log(data)
          }
        } catch (error) {
          console.error('Error adding user:', error);
        }
      }

      setLoading(false)
    });
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%] mt-10 mb-10 grid grid-cols-1 place-items-center relative">
        { loading ? (
            <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center bg-white bg-opacity-50 z-10'>
                <BounceLoader color="#6CB6AD" loading={true} size={60} className="mt-60" />
            </div>
        ) : <></>}

        <h2 className="text-2xl font-semibold text-center mb-4">Create New User</h2>

        <div className="w-full md:w-[70%] bg-gray-100 pt-12 pb-14 rounded-lg shadow-md mb-6">
          <div className="flex justify-center items-center rounded-md">
            <img src={logo} className="h-20" alt="Logo" />
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center">
            <div className="grid grid-cols-1 gap-4 w-[60%]">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Role</label>
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
                  <option value="queue_manager">Queue Manager</option>
                </select>
                {errors.errors && errors.role[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.role[0]}</p>}
              </div>

              {(formData.role === 'physician' || formData.role === 'secretary') && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700"></label>
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
                  {errors.errors && errors.department_id[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.department_id[0]}</p>}
                </div>
              )}

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Personnel Number</label>
                <input
                  type="text"
                  name="personnel_number"
                  placeholder="Personnel Number"
                  value={formData.personnel_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {errors.errors && errors.personnel_number[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.personnel_number[0]}</p>}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {errors.errors && errors.first_name[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.first_name[0]}</p>}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  placeholder="Middle Name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                />
                {errors.errors && errors.middle_name[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.middle_name[0]}</p>}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {errors.errors && errors.last_name[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.last_name[0]}</p>}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  placeholder="Suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                />
                {errors.errors && errors.suffix[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.suffix[0]}</p>}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Sex</label>
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
                {errors.errors && errors.sex[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.sex[0]}</p>}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  placeholder="Birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {errors.errors && errors.birthdate[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.birthdate[0]}</p>}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-500 rounded-md shadow-sm p-2"
                  required
                />
                {errors.errors && errors.email[0] && <p className="text-red-600 mt-1 mb-1">{errors.errors.email[0]}</p>}
              </div>

              {!errors.errors && errors.message && <p className="text-red-600 mt-4 mb-1 text-center">{errors.message}</p>}

              <button
                type="submit"
                className="mt-1 block w-full h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUserPage;
