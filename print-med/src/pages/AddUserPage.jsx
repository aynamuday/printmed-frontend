import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import logo from '../assets/images/logo.png';

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    role: '',
    personnel_number: '',
    first_name: '',
    last_name: '',
    sex: '',
    birthdate: '',
    email: '',
    department_id: '',
  });

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Uncomment and adjust the endpoint as needed
        // const response = await fetch('http://127.0.0.1:8000/api/departments');
        // setDepartments(await response.json());
      } catch (error) {
        console.error('Error fetching departments:', error);
        setErrorMessage('Unable to load departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let formIsValid = true;

    // Validation checks
    if (!formData.email) {
      newErrors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      formIsValid = false;
    }

    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
      formIsValid = false;
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
      formIsValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
      formIsValid = false;
    }

    if (!formData.personnel_number) {
      newErrors.personnel_number = 'Personnel number is required';
      formIsValid = false;
    }

    if (!formData.sex) {
      newErrors.sex = 'Sex is required';
      formIsValid = false;
    }

    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
      formIsValid = false;
    }

    if (!formData.department_id && (formData.role === 'physician' || formData.role === 'secretary')) {
      newErrors.department_id = 'Department is required for physicians and secretaries';
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) {
      Swal.fire({
        icon: 'error',
        title: 'Complete The Forms',
        text: 'Please fill in all the input field.',
      });
      return;
    }

    // Confirmation prompt
    Swal.fire({
      title: 'Are you sure you want to add this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add user',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Uncomment and adjust API call as needed
          // const response = await fetch('http://127.0.0.1:8000/api/register', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(formData),
          // });
          // const data = await response.json();
          
          // For now, just log the formData to console
          console.log('User added successfully:', formData);

          // Reset form data
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

          Swal.fire({
            icon: 'success',
            title: 'User Added Successfully!',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error('Error adding user:', error);
          setErrorMessage('There was an error adding the user. Please try again.');
        }
      }
    });
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
              <label className="block text-sm font-medium text-gray-700"></label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="physician">Physician</option>
                <option value="secretary">Secretary</option>
                <option value="queue_manager">Queue Manager</option>
              </select>
              {errors.role && <p className="text-red-600">{errors.role}</p>}
            </div>

            {(formData.role === 'physician' || formData.role === 'secretary') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700"></label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && <p className="text-red-600">{errors.department_id}</p>}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="personnel_number"
                placeholder="Personnel Number"
                value={formData.personnel_number}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.personnel_number && <p className="text-red-600">{errors.personnel_number}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.first_name && <p className="text-red-600">{errors.first_name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.last_name && <p className="text-red-600">{errors.last_name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700"></label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.sex && <p className="text-red-600">{errors.sex}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="date"
                name="birthdate"
                placeholder="Birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.birthdate && <p className="text-red-600">{errors.birthdate}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            <button
              type="submit"
              className="mt-1 block w-full h-10 bg-[#6CB6AD] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUserPage;
