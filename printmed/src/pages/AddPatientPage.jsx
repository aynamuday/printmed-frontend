import React, { useState, useContext, useEffect } from "react";

import AppContext from "../context/AppContext";
import SecretaryContext from "../context/SecretaryContext";

import { BounceLoader } from "react-spinners";
import { useLocation, useNavigate } from 'react-router-dom';
import globalSwal from "../utils/globalSwal";
import logo from '../assets/images/logo.png';

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const AddPatientPage = () => {
  const { token } = useContext(AppContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { 
    physicians,
    duplicatePatients, setDuplicatePatients, 
  } = useContext(SecretaryContext);
  
  
  const patientData = state?.registration || {};
  const [formData, setFormData] = useState({
    first_name: patientData.first_name || '',
    middle_name: patientData.middle_name || '',
    last_name: patientData.last_name || '',
    suffix: patientData.suffix || '',
    sex: patientData.sex || '',
    birthdate: patientData.birthdate || '',
    birthplace: patientData.birthplace || '',
    civil_status: patientData.civil_status || '',
    house_number: patientData.house_number || '',
    street: patientData.street || '',
    barangay: patientData.barangay || '',
    city: patientData.city || '',
    province: patientData.province || '',
    postal_code: patientData.postal_code || '',
    religion: patientData.religion || '',
    email: patientData.email || '',
    phone_number: patientData.phone_number || '',
    registration_id: patientData.id || '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  //handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = value
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

        if (name === 'birthdate_day' || name === 'birthdate_month' || name === 'birthdate_year') {
            setFormData({
              ...formData,
              birthdate: {
                ...formData.birthdate,
                [name.split('_')[1]]: value
              }
            });
            return;
        }
          // Name fields should not accept numbers and capitalize first letter
        if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
            setErrors({ ...errors, [name]: 'Enter a valid name' });
            return;
        } else {
          // Clear the error if the value is valid
          setErrors({ ...errors, [name]: '' });
      }

          // Address validations (house_number, street, barangay, etc.)
        if (name === 'house_number' || name === 'street' || name === 'barangay') {
            // No symbols allowed
            if (/[^a-zA-Z0-9\s]/.test(value)) {
              setErrors({ ...errors, [name]: 'Enter a valid address' });
              return;
            }
        } else {
          // Clear the error if the value is valid
          setErrors({ ...errors, [name]: '' });
      }
      
        if (name === 'city' || name === 'province') {
            // No numbers allowed
            if (/[^a-zA-Z\s]/.test(value)) {
              setErrors({ ...errors, [name]: 'nter a valid address' });
              return;
            }
        }
      
        if (name === 'postal_code') {
            // Only numbers allowed and ensure length is 6
            if (/[^0-9]/.test(value)) {
              setErrors({ ...errors, [name]: '' });
              return;
            }
            if (value.length > 4) {
              setErrors({ ...errors, [name]: '' });
              return;
            }
        }
      
        if (name === 'sex') {
            setFormData({
              ...formData,
              sex: value,
            });
            return;
        }
        
        if (name === 'suffix') {
          setFormData({
            ...formData,
            suffix: value,
          });
          return;
        }

        if (name === 'civil_status') {
            setFormData({
              ...formData,
              civil_status: value,
            });
            return;
        }

    setFormData({ 
        ...formData, 
        [name]: capitalizedValue, 
    });
  };

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
  
    if (!/^\d*$/.test(value)) {
      return;
    }
  
    if (value.length === 1 && value !== '0') {
      value = '09' + value;
    }
  
    if (value.length < 3) {
      value = '09';
    }
  
    if (value.length > 11) {
      return;
    }
  
    setFormData({
      ...formData,
      phone_number: value,
    });
  
    setErrors({ ...errors, phone_number: '' });
  };
  
  // handle submit
  const handleSubmit = async (e) => {
      e.preventDefault();
    
      let newErrors = {};
      let formIsValid = true;
    
      setErrors({});
      setLoading(true);
    
      // Validate required fields
      if (!formData.first_name) {
          newErrors.first_name = 'First name is required';
          formIsValid = false;
      }
      if (!formData.last_name) {
          newErrors.last_name = 'Last name is required';
          formIsValid = false;
      }
      if (!formData.phone_number) {
        newErrors.phone_number = 'Phone number is required';
        formIsValid = false;
      } else if (formData.phone_number.length !== 11) {
        newErrors.phone_number = 'Phone number must be exactly 11 digits';
        formIsValid = false;
      }
    
      // Set errors and prevent submission if form is invalid
      setErrors(newErrors);
    
      if (!formIsValid) {
          // Show swal alert for validation errors
          globalSwal.fire({
              icon: 'error',
              title: 'Invalid Form',
              text: 'Please use a valid information in each fields.',
              showConfirmButton: true,
          });
          setLoading(false);
          return;
      }
    
      try {
          const queryParams = new URLSearchParams({
              first_name: formData.first_name,
              last_name: formData.last_name,
              birthdate: formData.birthdate,
              sex: formData.sex,
          }).toString();
    
          const duplicateCheckResponse = await fetch(`/api/duplicate-patients?${queryParams}`, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
          });
    
          const duplicateData = await duplicateCheckResponse.json();
          console.log(duplicateData);
    
          if (duplicateCheckResponse.ok && duplicateData.length > 0) {
              setDuplicatePatients(duplicateData);
              setLoading(false);
              showDuplicatePatientsSwal();
              return;
          } else {
              setDuplicatePatients([]);
          }
    
      } catch (error) {
          setErrors({ message: 'An error occurred while checking for duplicates.' });
          setLoading(false);
          return;
      }
    
      // Proceed with adding the patient if no duplicates are found
      globalSwal.fire({
          title: 'Are you sure?',
          text: 'Do you want to add this patient?',
          showCancelButton: true,
          confirmButtonText: 'Yes, add it!',
          cancelButtonText: 'Cancel',
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  const filteredFormData = Object.fromEntries(
                      Object.entries(formData).filter(([key, value]) => value !== '')
                  );
    
                  const res = await fetch('/api/patients', {
                      method: 'POST',
                      headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(filteredFormData),
                  });
    
                  const data = await res.json();
                  console.log(data);
    
                  if (res.ok) {
                      setFormData({
                          first_name: '',
                          middle_name: '',
                          last_name: '',
                          suffix: '',
                          birthdate: '',
                          birthplace: '',
                          phone_number: '',
                          sex: '',
                          civil_status: '',
                          religion: '',
                          email: '',
                          house_number: '',
                          barangay: '',
                          street: '',
                          city: '',
                          province: '',
                          postal_code: '',
                      });
    
                      globalSwal.fire({
                          icon: 'success',
                          title: 'Patient added successfully!',
                          showConfirmButton: false,
                          showCloseButton: true,
                      });
    
                      navigate('/patient-registration', {
                          state: { removedId: formData.registration_id },
                      });
                  }
              } catch (error) {
                  globalSwal.fire({
                      icon: 'error',
                      title: 'Error!',
                      text: 'An error occurred while adding a new patient. Please check the information and try again.',
                      showConfirmButton: true,
                  });
              } finally {
                  setLoading(false);
              }
          } else {
              // This block runs if the user clicks the Cancel button
              setLoading(false);  // Stop loading
          }
      });
  };

  // Add logic to display Swal when there are duplicates
  useEffect(() => {
    if (duplicatePatients && duplicatePatients.length > 0) {
      showDuplicatePatientsSwal();
    }
  }, [duplicatePatients]);

  useEffect(() => {
    // Clear duplicatePatients state when the Add Patient page loads
    setDuplicatePatients([]);
  }, []); // Empty dependency array ensures this runs only on mount
  
  const showDuplicatePatientsSwal = () => {
    const safeDuplicatePatients = duplicatePatients || [];

    globalSwal.fire({
      icon: 'warning',
      title: 'Duplicate Patient Found',
      html: `
        <table style="width: 100%; border-collapse: collapse; text-align: left;" id="duplicateTable">
          <thead>
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Patient Number</th>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Name</th>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${duplicatePatients.map(patient => `
              <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${patient.patient_number}</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${patient.full_name}</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">
                  <button 
                    style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
                    class="view-patient-btn"
                    data-id="${patient.id}"
                  >
                    View
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `,
      showConfirmButton: true,
      showCancelButton: true,
      didOpen: () => {
        // Attach React event handlers after Swal renders
        document.querySelectorAll('.view-patient-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const patientId = e.target.getAttribute('data-id');
            navigate(`/patients/${patientId}`);
          });
        });
      },
    });
  };

  return (
    <>
        <Sidebar />
        <Header />
        <>
          {loading && (
            <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white bg-opacity-40 z-10'>
              <BounceLoader color="#6CB6AD" loading={true} size={60} />
            </div>
          )}

          <div className="w-full md:w-[75%] md:ml-[22%] mt-14 mb-10 flex justify-center items-center">
            <div className="w-full md:w-[70%] bg-gray-100 pt-8 pb-10 rounded-lg shadow-md mb-6">
              <div className="flex justify-center items-center rounded-md">
                <img src={logo} className="h-20" alt="Logo" />
              </div>
              <h2 className="text-2xl text-center font-bold m-6">Add New Patient</h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center">
                <div className="grid grid-cols-2 gap-4 gap-x-6 w-[80%]">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium">
                      First Name <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="first_name" 
                      value={formData.first_name} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                    {errors.first_name && <p className="text-red-600 mt-1">{errors.first_name}</p>}
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-medium">Middle Name</label>
                    <input 
                      type="text" 
                      name="middle_name" 
                      value={formData.middle_name} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium">
                      Last Name <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="last_name" 
                      value={formData.last_name} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                    {errors.last_name && <p className="text-red-600 mt-1">{errors.last_name}</p>}
                  </div>

                  {/* Suffix */}
                  <div>
                      <label className="block text-sm font-medium">Suffix</label>
                      <select
                        name="suffix"
                        value={formData.suffix}
                        onChange={handleChange}
                        className="mt-1 block w-full border p-2 rounded-md border-black bg-white"
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
                  <div>
                    <label className="block text-sm font-medium">
                      Sex <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <select 
                      name="sex" 
                      value={formData.sex} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black bg-white" 
                      required
                    >
                      <option value="">Select Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Birthdate */}
                  <div>
                    <label className="block text-sm font-medium">
                      Birthdate <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                      max={new Date().toISOString().split("T")[0]}
                      min="1920-01-01"
                      required
                    />
                  </div>

                  {/* Birthplace */}
                  <div>
                      <label className="block text-sm font-medium">
                        Birthplace
                      </label>
                      <input 
                        type="text" 
                        name="birthplace" 
                        value={formData.birthplace} 
                        onChange={handleChange} 
                        className="mt-1 block w-full border p-2 rounded-md border-black"
                      />
                    </div>
                  
                  {/* Civil Status */}
                  <div>
                    <label className="block text-sm font-medium">
                      Civil Status <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <select 
                      name="civil_status" 
                      value={formData.civil_status} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black bg-white" 
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  {/* House No */}
                  <div>
                    <label className="block text-sm font-medium">
                      House No. <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="house_number" 
                      value={formData.house_number} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium">
                      Street <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="street" 
                      value={formData.street} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required
                    />
                  </div>

                  {/* Barangay */}
                  <div>
                    <label className="block text-sm font-medium">
                      Barangay <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="barangay" 
                      value={formData.barangay} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium">
                      City <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium">
                      Province <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="province" 
                      value={formData.province} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium">
                      Postal Code
                    </label>
                    <input 
                      type="number" 
                      name="postal_code" 
                      value={formData.postal_code} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                    />
                  </div>

                  {/* Religion */}
                  <div>
                    <label className="block text-sm font-medium">Religion</label>
                    <input 
                      type="text" 
                      name="religion" 
                      value={formData.religion} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium">
                      Phone Number <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone_number || '09'}  // Ensure '09' is always visible
                      onChange={handlePhoneNumberChange}
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      maxLength="11"  // Limit input length to 11
                      placeholder="Enter phone number"
                      required
                    />
                    {errors.phone_number && <p className="text-red-600 mt-1">{errors.phone_number}</p>}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                    />
                  </div>

                  {/* Physician */}
                  <div>
                    <label className="block text-sm font-medium">
                      Physician <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <select
                      name="physician_id"
                      value={formData.physician_id}
                      onChange={handleChange}
                      className="mt-1 block w-full border p-2 rounded-md border-black bg-white"
                      required
                    >
                      <option value="">Assign Physician</option>
                      {loading ? (
                        <option>Loading physicians...</option>
                      ) : (
                        physicians.map((physician) => (
                          <option key={physician.id} value={physician.id}>
                            {physician.department_name} - {physician.full_name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <button type="submit" className="mt-8 w-[50%] bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 h-10">Add Patient</button>
              </form>
            </div>
          </div>
        </>
    </>
  )
}

export default AddPatientPage