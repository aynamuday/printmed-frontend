import React, { useState, useContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import logo from '../assets/images/logo.png';
import AppContext from "../context/AppContext";
import { BounceLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';  // Don't forget to include the styles

const Forms = () => {
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    birthdate: { day: '', month: '', year: '' },
    sex: '',
    civil_status: '',
    religion: '',
    address: '',
    phone_number: '',
    physician_id: '',
    photo: null
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Capitalize the first letter and make the rest lowercase
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  
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
  
    if (name === 'sex') {
      setFormData({
        ...formData,
        sex: value,
      });
      return;
    }

    // Civil status should only contain letters
    if (name === 'civil_status' && /[^a-zA-Z\s]/.test(value)) {
      setErrors({ ...errors, [name]: '' });
      return;
    }
  
    // Update form data with the capitalized value
    setFormData({
      ...formData,
      [name]: capitalizedValue,
    });
  };
  
  // handles for image profile
  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  // handle phone number
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
  
    // Remove non-digit characters
    const cleanedValue = value.replace(/\D/g, '');
  
    // Ensure the cleaned value length is exactly 11
    if (cleanedValue.length > 11) {
      return;
    }
  
    if (cleanedValue.length <= 11) {
      setFormData({ ...formData, phone_number: cleanedValue });
    }
  
    if (cleanedValue.length === 11) {
      setErrors({ ...errors, phone_number: '' });
    } else {
      setErrors({
        ...errors,
        phone_number: 'Phone number must be exactly 11 digits long',
      });
    }
  };
  
  
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to add this patient?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== '')
      );

      // Mock submission - Replace with actual API request
      const formDataToSubmit = new FormData();
      Object.keys(filteredFormData).forEach((key) => {
        formDataToSubmit.append(key, filteredFormData[key]);
      });

      // Placeholder API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire('Success!', 'Patient added successfully!', 'success');
      navigate('/patients');
    } catch (error) {
      console.error("Error:", error);
      setErrors({ message: "An error occurred. Please try again." });
      Swal.fire('Error', 'An error occurred. Please try again.', 'error');
    }

    setLoading(false);
  };

  // Generate year range from 1900 to current year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i);
    }
    return years;
  };

  // Generate month options
  const generateMonthOptions = () => {
    return [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
  };

  // Generate day options (1 to 31)
  const generateDayOptions = () => {
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
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
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                {errors.first_name && <p className="text-red-600 mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Middle Name (optional)</label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                {errors.last_name && <p className="text-red-600 mt-1">{errors.last_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Suffix (optional)</label>
                <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birthdate</label>
                <div className="flex gap-2">
                  <select
                    name="birthdate_day"
                    value={formData.birthdate.day}
                    onChange={handleChange}
                    className="mt-1 block w-[30%] border p-2 rounded-md"
                  >
                    <option value="">Day</option>
                    {generateDayOptions().map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    name="birthdate_month"
                    value={formData.birthdate.month}
                    onChange={handleChange}
                    className="mt-1 block w-[40%] border p-2 rounded-md"
                  >
                    <option value="">Month</option>
                    {generateMonthOptions().map((month, index) => (
                      <option key={index} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  <select
                    name="birthdate_year"
                    value={formData.birthdate.year}
                    onChange={handleChange}
                    className="mt-1 block w-[30%] border p-2 rounded-md"
                  >
                    <option value="">Year</option>
                    {generateYearOptions().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {errors.birthdate && <p className="text-red-600 mt-1">{errors.birthdate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handlePhoneNumberChange}
                  className="mt-1 block w-full border p-2 rounded-md"
                  maxLength="11" // This limits the input to 11 characters
                  placeholder="Enter phone number"
                />
                {errors.phone_number && <p className="text-red-600 mt-1">{errors.phone_number}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required>
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Civil Status</label>
                <input type="text" name="civil_status" value={formData.civil_status} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
                {errors.civil_status && <p className="text-red-600 mt-1">{errors.civil_status}</p>}

              </div>
              

              <div>
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <input type="text" name="religion" value={formData.religion} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Physician</label>
                <select name="physician_id" value={formData.physician_id} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md">
                  <option value="">Assign Physician</option>
                  {/* Map physicians */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <input type="file" name="photo" onChange={handleFileChange} className="mt-1 block w-full border p-2 rounded-md" accept="image/*" />
              </div>
            </div>

            <button type="submit" className="mt-8 w-[50%] bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 h-10">Add Patient</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forms;
