import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import logo from '../assets/images/logo.png';
import axios from 'axios';

const AddAccount = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    role: '',
    personnel_number: '',
    first_name: '',
    last_name: '',
    sex: '',
    birthdate: '',
    email: '',
    department_id: '' // Added for department selection
  });

  const [departments, setDepartments] = useState([]); // State to hold departments
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/departments'); // Adjust API endpoint accordingly
        setDepartments(response.data); // Assuming the response data is an array of departments
      } catch (error) {
        console.error('Error fetching departments:', error);
        setErrorMessage('Unable to load departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      console.log('Account created successfully:', response.data);
      // Clear the form after submission
      setFormData({
        role: '',
        personnel_number: '',
        first_name: '',
        last_name: '',
        sex: '',
        birthdate: '',
        email: '',
        department_id: '',
      });
    } catch (error) {
      console.error('Error creating account:', error);
      setErrorMessage('There was an error creating the account. Please check your inputs and try again.');
    }
  };

  return (
    <>
      <Sidebar />
      <Header />

      <div className="flex flex-col h-screen bg-white items-center justify-center w-full md:w-[100%]">
        <div className="w-full md:w-[70%] md:ml-[20%]">
          <h2 className="text-2xl font-semibold text-center mb-4">Add Account</h2>
        </div>

        <div className="w-full md:w-[70%] md:ml-[20%] bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="p-2.5 mt-1 flex justify-center items-center rounded-md bg-gray-100">
            <img src={logo} className="h-20" alt="Logo" />
          </div>
        </div>

        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

        <form className="px-8 w-full md:w-[70%] md:ml-[20%] bg-gray-100 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="physician">Physician</option>
                <option value="secretary">Secretary</option>
                <option value="queue_manager">Queue Manager</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Personnel Number:</label>
              <input
                type="text"
                name="personnel_number"
                value={formData.personnel_number}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Sex:</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Birthdate:</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {formData.role === 'physician' || formData.role === 'secretary' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Department:</label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>
                      {department.name} {/* Adjust according to your API response structure */}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full h-10 mt-5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddAccount;
