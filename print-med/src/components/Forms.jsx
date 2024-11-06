import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/images/logo.png';
import AppContext from '../context/AppContext';
import Swal from 'sweetalert2';

const Forms = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthday: '',
    sex: '',
    address: '',
    civilStatus: '',
    religion: '',
    phoneNumber: '',
    physician: '',
  });

  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { token, user } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/patients/')
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));

    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        physician: user.username,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      formIsValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      formIsValid = false;
    }
    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
      formIsValid = false;
    }
    if (!formData.sex) {
      newErrors.sex = 'Sex is required';
      formIsValid = false;
    }
    if (!formData.civilStatus) {
      newErrors.civilStatus = 'Civil status is required';
      formIsValid = false;
    }
    if (!formData.religion) {
      newErrors.religion = 'Religion is required';
      formIsValid = false;
    }
    if (!formData.address) {
      newErrors.address = 'Address is required';
      formIsValid = false;
    }
    if (!formData.phoneNumber || isNaN(formData.phoneNumber) || formData.phoneNumber.length !== 11) {
      newErrors.phoneNumber = 'Please enter a valid phone number (11 digits)';
      formIsValid = false;
    }
    if (!formData.physician) {
      newErrors.physician = 'Physician is requires';
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
    
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      Swal.fire({
        title: 'Are you sure you want to add this patient?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add patient!',
        cancelButtonText: 'Cancel',
        position: 'center',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          setIsSubmitting(true);
          const newPatient = {
            id: patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 0,
            ...formData,
          };
  
          fetch('/api/patients/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newPatient),
          })
            .then((response) => response.json())
            .then((data) => {
              setPatients((prevPatients) => [...prevPatients, data]);
              setIsSubmitting(false);
              setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                suffix: '',
                birthday: '',
                sex: '',
                address: '',
                civilStatus: '',
                religion: '',
                phoneNumber: '',
                physician: '',
              });
  
              Swal.fire({
                title: 'Patient Added Successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
                position: 'center',
              }).then(() => {
                // Redirect to forms or reset the form view here
                window.location.reload(); // Optionally reloads the page to return to form
                // If using a router (e.g., React Router), you can also use history.push('/forms') if forms is a route
              });
            })
            .catch((error) => {
              console.error('Error adding patient:', error);
              setIsSubmitting(false);
            });
        }
      });
    }
  };
  

  return (
    <div className="flex flex-col h-screen bg-white items-center justify-center w-full md:w-[100%]">
      <div className="w-full md:w-[70%] md:ml-[20%]">
        <h2 className="text-2xl font-semibold text-center mb-4 -mt-10">Add Patient Record</h2>
      </div>

      <div className="w-full md:w-[70%] md:ml-[20%] bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="p-2.5 mt-1 flex justify-center items-center rounded-md bg-gray-100">
          <img src={logo} className="h-20" alt="Logo" />
        </div>
        <form onSubmit={handleSubmit} className="px-8">
          <div className="grid grid-cols-7 gap-4">

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                value={formData.middleName || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="suffix"
                placeholder="Suffix"
                value={formData.suffix || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.suffix && <p className="text-red-500 text-sm">{errors.suffix}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Sex:</label>
              <select
                name="sex"
                value={formData.sex || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="" disabled>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Civil Status:</label>
              <select
                name="civilStatus"
                value={formData.civilStatus || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="" disabled>Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="It's Complicated">It's Complicated</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>
              {errors.civilStatus && <p className="text-red-500 text-sm">{errors.civilStatus}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Religion:</label>
              <select
                name="religion"
                value={formData.religion || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="" disabled>Select Your Religion</option>
                <option value="Roman Catholic">Roman Catholic</option>
                <option value="Muslim">Muslim</option>
                <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                <option value="Jehovas Witnesses">Jehovas Witnesses</option>
                <option value="Born Again">Born Again</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Hindu">Hindu</option>
                <option value="Others">Others</option>
              </select>
              {errors.religion && <p className="text-red-500 text-sm">{errors.religion}</p>}
            </div>

            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700"></label>
              <input
                type="text"
                name="physician"
                placeholder="Physician"
                value={formData.physician || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.physician && <p className="text-red-500 text-sm">{errors.physician}</p>}
            </div>

            <div className="mt-6 col-end-8 col-span-2">
              <button
                type="submit"
                className={`w-full p-2 text-white bg-[#6CB6AD] hover:bg-blue-600 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Add Patient'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forms;
