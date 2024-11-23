import React, { useState, useContext, useEffect } from "react";
import logo from '../assets/images/logo.png';
import AppContext from "../context/AppContext";
import { BounceLoader } from "react-spinners";
import { useLocation, useNavigate } from 'react-router-dom';
import globalSwal from "../utils/globalSwal";
import PhysicianContext from "../context/PhysicianContext";
import SecretaryContext from "../context/SecretaryContext";

const Forms = () => {
  const { token } = useContext(AppContext);
  const { state } = useLocation();
  const { setSelectedPatient, duplicatePatients, setDuplicatePatients, physicians, setPhysicians } = useContext(SecretaryContext);
  
  
  const patientData = state?.patient || {};
  const [formData, setFormData] = useState({
    physician_id: patientData.full_name || '',
    registration_id: patientData.id,
    first_name: patientData.first_name || '',
    middle_name: patientData.middle_name || '',
    last_name: patientData.last_name || '',
    suffix: patientData.suffix || '',
    birthdate: patientData.birthdate || '',
    birthplace: patientData.birthplace || '',
    sex: patientData.sex || '',
    civil_status: patientData.civil_status || '',
    religion: patientData.religion || '',
    house_number: patientData.house_number || '',
    street: patientData.street || '',
    city: patientData.city || '',
    province: patientData.province || '',
    postal_code: patientData.postal_code || '',
    barangay: patientData.barangay || '',
    email: patientData.email || '',
    phone_number: patientData.phone_number || '',
    physician_id: patientData.physician_id || '',
    //photo: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = value
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .split(' ') // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join words with a single space

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
            setErrors({ ...errors, [name]: '' });
            return;
        }
          // suffix validation and capitalize first letter
        if (name === 'suffix') {
            if (/[^a-zA-Z\s]/.test(value)) {
              setErrors({ ...errors, [name]: '' });
              return;
            }
        
            if (value.length > 3) {
              setErrors({ ...errors, [name]: '' });
              return;
            }
            setErrors({ ...errors, [name]: '' });
        }
      
          // Address validations (house_number, street, barangay, etc.)
        if (name === 'house_number' || name === 'street' || name === 'barangay') {
            // No symbols allowed
            if (/[^a-zA-Z0-9\s]/.test(value)) {
              setErrors({ ...errors, [name]: '' });
              return;
            }
        }
      
        if (name === 'city' || name === 'province') {
            // No numbers allowed
            if (/[^a-zA-Z\s]/.test(value)) {
              setErrors({ ...errors, [name]: '' });
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
  // handles for image profile
  const handleFileChange = (e) => {
  const file = e.target.files[0];

  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    setErrors({ ...errors, photo: 'Please upload a valid image file.' });
    return;
  }

  // Check if file is PNG
  if (file.type !== 'image/png') {
    setErrors({ ...errors, photo: 'The photo must be a PNG file.' });
    return;
  }

  // Check image dimensions
  const img = new Image();
  img.onload = () => {
    if (img.width < 200 || img.height < 200) {
      setErrors({ ...errors, photo: 'The photo must have at least 200x200 dimensions.' });
    } else {
      setFormData({ ...formData, photo: file });
      setErrors({});
    }
  };
  img.src = URL.createObjectURL(file);
  };
  
  // handle phone number
  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
  
    setFormData({
      ...formData,
      phone_number: value,
    });
  
    // Error handling for phone number length
    if (value.length === 12) { // 11 digits + +63 makes it 13 characters
      setErrors({ ...errors, phone_number: 'Use a valid phone number' });
    } else {
      setErrors({
        ...errors,
        phone_number: '',
      });
    }
  };
  
  const handleViewPatient = (patientId) => {
    navigate(`/patients/${patientId}`, { state: { duplicatePatients } });
  };

  //fetch physicians
  useEffect(() => {
    const fetchPhysicians = async () => {
      try {
        const response = await fetch('/api/physicians', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          console.log(data);
          
          setPhysicians(data); // Set physicians in state
        } else {
          console.error('Error fetching physicians:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching physicians:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhysicians();
  }, []);

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
    if (!formData.email) {
        newErrors.email = 'Email is required';
        formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        formIsValid = false;
    }

    if (!formData.phone_number) {
        newErrors.phone_number = 'Phone number is required';
        formIsValid = false;
    } else if (formData.phone_number.length !== 10) {
        newErrors.phone_number = 'Please enter a valid phone number';
        formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
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
            
        } 
        catch (error) {
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
                } 
                catch (error) {
                    globalSwal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while adding a new patient. Please check the information and try again.',
                        showConfirmButton: true,
                });
                } 
                finally {
                  setLoading(false);
                }
            }
        });
    }
  };

  return (
    <>
      <div className="w-full md:w-[75%] md:ml-[22%] mt-14 mb-10 grid grid-cols-1 place-items-center relative">
        {loading && (
          <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center bg-white bg-opacity-50 z-10'>
            <BounceLoader color="#6CB6AD" loading={true} size={60} className="mt-60" />
          </div>
        )}
        <div className="w-full md:w-[70%] bg-gray-100 pt-8 pb-10 rounded-lg shadow-md mb-6">
          <div className="flex justify-center items-center rounded-md">
            <img src={logo} className="h-20" alt="Logo" />
          </div>
          <h2 className="text-xl text-center font-bold m-6">Add New Patient</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-[70%]">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name 
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                </label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                {errors.first_name && <p className="text-red-600 mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Middle Name (optional)</label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                </label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                {errors.last_name && <p className="text-red-600 mt-1">{errors.last_name}</p>}
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Suffix (optional)</label>
                  <select
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                    className="mt-1 block w-full border p-2 rounded-md"
                  >
                    <option value="">Select Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Birthdate
                <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="mt-1 block w-full border p-2 rounded-md"
                  max={new Date().toISOString().split("T")[0]} // Max date is today
                  min="1920-01-01" // Min date is 1920-01-01
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handlePhoneNumberChange}
                    className="mt-1 block w-full border p-2 rounded-md pl-12" // Add padding-left for the + sign
                    maxLength="10" // Allow the + to be included
                    required
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">+63</span> {/* The +63 prefix inside the input */}
                </div>
                {errors.phone_number && <p className="text-red-600 mt-1">{errors.phone_number}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sex
                <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                </label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required>
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Civil Status
                <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                </label>
                <select name="civil_status" value={formData.civil_status} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required>
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <input type="text" name="religion" value={formData.religion} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border p-2 rounded-md"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 col-span-2">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">House No.
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                  </label>
                  <input type="text" name="house_number" value={formData.house_number} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Barangay
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                  </label>
                  <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Street</label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">City
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                  </label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Province
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                  </label>
                  <input type="text" name="province" value={formData.province} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Postal Code
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                  </label>
                  <input type="number" name="postal_code" value={formData.postal_code} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                </div>
                <div className="col-span-3 gap-4">
                  <label className="block text-sm font-medium text-gray-700">Birthplace
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                  </label>
                  <input type="text" name="birthplace" value={formData.birthplace} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Physician
                  <span className="text-red-600 cursor-help" title="Required field">
                    *
                  </span>
                </label>
                <select
                  name="physician_id"
                  value={formData.physician_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border p-2 rounded-md"
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <input type="file" name="photo" onChange={handleFileChange} className="mt-1 block w-full border p-2 rounded-md" accept="image/*" />
              </div> */}
            </div>
            <button type="submit" className="mt-8 w-[50%] bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 h-10">Add Patient</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forms;
