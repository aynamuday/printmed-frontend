import React, { useState } from 'react';
//import { Tooltip } from 'bootstrap';
import bgNurse from '../assets/images/bg-nurse.png';
import logo from '../assets/images/logo.png';
import { FaSmile } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        birthdate: '',
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
        termsAccepted: false,
    });
    const [errors, setErrors] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        birthdate: '',
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
        termsAccepted: '',
    });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };
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
                setErrors({ ...errors, [name]: 'Input a valid name' });
                return;
            }
              // suffix validation and capitalize first letter
            if (name === 'suffix') {
                if (/[^a-zA-Z\s]/.test(value)) {
                  setErrors({ ...errors, [name]: 'Input a valid suffix' });
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
                  setErrors({ ...errors, [name]: 'No symbols allowed' });
                  return;
                }
            }
          
            if (name === 'city' || name === 'province') {
                // No numbers allowed
                if (/[^a-zA-Z\s]/.test(value)) {
                  setErrors({ ...errors, [name]: 'Numbers are not allowed' });
                  return;
                }
            }
          
            if (name === 'postal_code') {
                // Only numbers allowed and ensure length is 6
                if (/[^0-9]/.test(value)) {
                  setErrors({ ...errors, [name]: 'Only numbers are allowed' });
                  return;
                }
                if (value.length > 4) {
                  setErrors({ ...errors, [name]: 'Postal code must be at most 6 digits' });
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
    const handlePhoneNumberChange = (e) => {
        let value = e.target.value;
        // If the value is already starting with +63, allow only numbers after it
        if (value.startsWith('+63')) {
          // Remove any non-digit characters after +63 and ensure we only get the next 10 digits
          value = '+63' + value.slice(3).replace(/\D/g, '').slice(0, 10);
        } else {
          // If for some reason the value doesn't start with +63, keep it as is (or handle error)
          value = '+63' + value.slice(3).replace(/\D/g, '').slice(0, 10);
        }
      
        setFormData({
          ...formData,
          phone_number: value,
        });
      
        // Error handling for phone number length
        if (value.length === 13) { // 11 digits + +63 makes it 13 characters
          setErrors({ ...errors, phone_number: '' });
        } else {
          setErrors({
            ...errors,
            phone_number: 'Use a valid phone number',
          });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};
        let formIsValid = true;

        if (!formData.email) {
            newErrors.email = 'Email is required';
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            formIsValid = false;
        }

        if (!formData.name) {
            newErrors.name = 'Name is required';
            formIsValid = false;
        }

        if (!formData.age) {
            newErrors.age = 'Age is required';
            formIsValid = false;
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
            formIsValid = false;
        }

        if (!formData.contact) {
            newErrors.contact = 'Contact Number is required';
            formIsValid = false;
        } else if (isNaN(formData.contact) || formData.contact.length !== 11) {
            newErrors.contact = 'Please enter a valid contact number (exactly 11 digits)';
            formIsValid = false;
        }        

        if (!formData.idType) {
            newErrors.idType = 'ID Type is required';
            formIsValid = false;
        }

        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms and conditions';
            formIsValid = false;
        }

        setErrors(newErrors);

        if (formIsValid) {
            console.log('Form submitted');
            setConfirmationId('ABC123456'); // Example confirmation ID
            setRegistrationSuccess(true); // Show success message

            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
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
            termsAccepted: false,
        });
        setErrors({
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
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
            termsAccepted: '',
        });
    };

    const openTermsModal = () => {
        setShowTerms(true); 
    };

    const closeTermsModal = () => {
        setShowTerms(false);
    };

    const handleCloseSuccessMessage = () => {
        setRegistrationSuccess(false);
    };

    return (
        <div className="min-h-screen bg-teal-200 relative grid place-items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
                {/* Left section with image */}
                <div className="hidden md:block bg-cover bg-center" style={{ backgroundImage: `url(${bgNurse})` }}>
                    <img src={logo} alt="Carmona Hospital Logo" className="mt-4 ml-4 h-12" />
                </div>

                {/* Right section with form */}
                <div className="p-8 bg-gray-100">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Registration</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-6 gap-4">
                        
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Middle Name (optional)</label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                />
                                {errors.middle_name && <p className="text-red-500 text-sm">{errors.middle_name}</p>}
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Suffix (optional)</label>
                                <input
                                    type="text"
                                    name="suffix"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.suffix}
                                    onChange={handleChange}
                                />
                                {errors.suffix && <p className="text-red-500 text-sm">{errors.suffix}</p>}
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Birthdate</label>
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
                                {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    maxLength="13"
                                    value={formData.phone_number}
                                    onChange={handlePhoneNumberChange}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Sex</label>
                                <select name="sex" value={formData.sex} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required>
                                    <option value="">Select Sex</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Civil Status</label>
                                <select name="civil_status" value={formData.civil_status} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" required>
                                    <option value="">Select Status</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Religion</label>
                                <input
                                    type="text"
                                    name="religion"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.religion}
                                    onChange={handleChange}
                                />
                                {errors.religion && <p className="text-red-500 text-sm">{errors.religion}</p>}
                            </div>
                            <div className="col-span-3 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div className="col-span-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700">House No.</label>
                                <input 
                                    type="text" 
                                    name="house_number"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.house_number} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-span-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Barangay</label>
                                <input 
                                    type="text" 
                                    name="barangay" 
                                    className="mt-1 block w-full border p-2 rounded-md" 
                                    value={formData.barangay} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-span-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                <input 
                                    type="text" 
                                    name="street" 
                                    className="mt-1 block w-full border p-2 rounded-md" 
                                    value={formData.street} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-span-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input 
                                    type="text" 
                                    name="city" 
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.city} 
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Province</label>
                                <input 
                                    type="text" 
                                    name="province" 
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.province} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="col-span-2 gap-4">
                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input 
                                    type="number" 
                                    name="postal_code" 
                                    className="mt-1 block w-full border p-2 rounded-md" 
                                    value={formData.postal_code} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-span-6 gap-4 flex items-center">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    className="mr-2"
                                    checked={formData.termsAccepted}
                                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                                />
                                <p className="text-sm text-gray-600">
                                    I agree to the
                                    <button type="button" className="underline text-blue-500 ml-1" onClick={openTermsModal}>
                                        Terms and Conditions and Privacy Policy
                                    </button>
                                    . I understand that my information will be used for registration and verification purposes only, in accordance with data protection regulations
                                </p>
                                {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
                            </div>
                            <button
                                type="submit"
                                className="col-span-6 gap-4w-full bg-[#B43C3A] hover:bg-red-600 text-white font-bold py-2 rounded-md"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Terms and Conditions Message */}
            {showTerms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 max-w-[90%] max-h-[90vh] w-full rounded-lg shadow-lg overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Terms and Conditions</h3>
                            <button onClick={closeTermsModal} className="text-gray-600 text-xl">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <p>1. Acceptance of Terms. By using this registration portal, you agree to these Terms and Conditions. These terms govern the collection, processing, and usage of your personal information, which is necessary to facilitate your appointment and verification at our hospital.</p>
                            <p>2. Information Collection and Use. You agree to provide accurate and complete information during the registration process. Your information will be used solely for appointment management, in-person verification, and patient identification purposes. This information will be securely stored and managed in compliance with applicable data protection laws.</p>
                            <p>3. In-Person Verification RequirementUpon completing your online registration, you will receive a confirmation slip or ID number. You are required to bring a valid government-issued ID and the confirmation slip or ID number to the hospital for in-person verification. Failure to provide these documents may result in delays or inability to complete the registration process.</p>
                            <p>4. Data Privacy and Security. We are committed to protecting your personal information. All data provided will be stored securely and accessed only by authorized personnel. We will not share your information with any third parties without your consent, except where required by law.</p>
                            <p>5. Appointment Scheduling and Cancellations. Appointment availability is subject to change. While we strive to meet your scheduling preferences, we cannot guarantee a specific appointment time. You will be notified of any necessary adjustments. If you need to reschedule or cancel, please contact us at least 24 hours in advance</p>
                            <p>6. Limitation of Liability. The hospital is not responsible for any delays or inconveniences caused by incomplete or inaccurate information provided by you. Additionally, the hospital is not liable for any issues arising from technical failures during the registration process.</p>
                            <p>7. Updates to Terms. We reserve the right to modify these Terms and Conditions at any time. Updates will be posted on the registration portal, and your continued use of the portal constitutes acceptance of any changes.</p>
                            <p>8. Contact Information. For any questions or concerns regarding these Terms and Conditions or our privacy practices, please contact our patient support team at 123-456-789</p>
                        </div>
                    </div>
                </div>)}
        </div>
    );
}

export default RegistrationPage;
