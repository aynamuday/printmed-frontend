import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgNurse from '../assets/images/bg-nurse.png';
import logo from '../assets/images/logo.png';
import { FaSmile } from 'react-icons/fa';
import globalSwal from '../utils/globalSwal';

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
        termsAccepted: false,
    });
    const [errors, setErrors] = useState({
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
        termsAccepted: '',
    });
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationId, setConfirmationId] = useState('');
    
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

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            termsAccepted: e.target.checked, // Set termsAccepted to true if checked, false otherwise
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let newErrors = {};
        let formIsValid = true;
    
        setErrors({});
        setLoading(true);
    
        // Validate email
        if (!formData.email) {
            newErrors.email = 'Email is required';
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            formIsValid = false;
        }
    
        // Validate phone number
        if (!formData.phone_number) {
            newErrors.phone_number = 'Phone number is required';
            formIsValid = false;
        } else if (formData.phone_number.length !== 10) {
            newErrors.phone_number = 'Please enter a valid phone number';
            formIsValid = false;
        }
    
        // Validate terms acceptance
        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms and conditions';
            formIsValid = false;
        }
    
        setErrors(newErrors);
    
        // If form is valid, show confirmation dialog
        if (formIsValid) {
            // Build the confirmation message
            const confirmationMessage = `
                First Name: ${formData.first_name}<br>
                Middle Name: ${formData.middle_name}<br>
                Last Name: ${formData.last_name}<br>
                Email: ${formData.email}<br>
                Phone Number: ${formData.phone_number}<br>
                Address: ${formData.house_number}, ${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.postal_code}<br>
                Terms Accepted: ${formData.termsAccepted ? 'Yes' : 'No'}
            `;
    
            // Display confirmation dialog with form data
            globalSwal.fire({
                title: 'Please confirm your details',
                html: confirmationMessage,
                showCancelButton: true,
                confirmButtonText: 'Yes, submit',
                cancelButtonText: 'Cancel',
            }).then(async (result) => {
                setLoading(true);
    
                // If user confirms, proceed with the registration
                if (result.isConfirmed) {
                    try {
                        // Remove empty values from form data
                        const filteredFormData = Object.fromEntries(
                            Object.entries(formData).filter(([key, value]) => value !== '' && key !== 'termsAccepted')
                        );
    
                        const res = await fetch('/api/registrations', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(filteredFormData),
                        });
    
                        const data = await res.json();
    
                        if (res.ok) {
                            // Set confirmationId after the API response is successful
                            setConfirmationId(data.registration_id);
    
                            // Reset form data on success
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
                                termsAccepted: false, // Reset the checkbox
                            });
    
                            // Show success message along with the confirmation ID
                            globalSwal.fire({
                                icon: 'success',
                                html: `
                                    <div class="text-center">
                                        <h3 class="text-xl font-bold">Registration Successful!</h3>
                                        <p>Thank you for registering! Your registration is now complete.</p>
                                        <p class="mt-4">Next Steps: Please visit Carmona Hospital and Medical Center (3rd Floor) for in-person verification. Be sure to bring a valid government-issued ID and your confirmation slip to complete the process.</p>
                                        <p class="mt-4 text-lg font-bold">Your Confirmation ID: ${data.registration_id}</p>
                                        <p class="mt-4">Please visit Carmona Hospital and Medical Center for verification.</p>
                                    </div>
                                `,
                                showConfirmButton: false,
                                showCloseButton: true,
                            });
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        setErrors({ message: 'An error occurred while registering' });
                        globalSwal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'An error occurred while registering. Please try again.',
                            showConfirmButton: true,
                        });
                    }
                }
    
                setLoading(false);
            });
        } else {
            setLoading(false); // If form is invalid, stop loading
        }
    };
    
           
    const resetForm = () => {
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
            termsAccepted: '',
        });
        setErrors({
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
        setConfirmationId('');
    };

    const handleConfirm = () => {
        setShowConfirmation(false); // Close confirmation modal
        setRegistrationSuccess(true); // Show success message
        console.log('Form submitted');

        resetForm();
    };

    return (
        <div className="min-h-screen bg-teal-200 grid place-items-center p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
                {/* Left section with image */}
                <div
                    className="hidden md:block bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgNurse})` }}
                >
                    <img
                    src={logo}
                    alt="Carmona Hospital Logo"
                    className="mt-4 ml-4 h-12"
                    />
                </div>

                {/* Right section with form */}
                <div className="p-6 sm:p-8 bg-gray-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-6">
                        Registration
                    </h2>
                    {registrationSuccess && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
                        Registration successful!
                    </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name<span className="text-red-600" title="Required field">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    required
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                                )}
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md"
                                />
                                {errors.middle_name && (
                                    <p className="text-red-500 text-sm">{errors.middle_name}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Name<span className="text-red-600" title="Required field">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    required
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                                )}
                            </div>

                            {/* Suffix */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Suffix
                                </label>
                                <input
                                    type="text"
                                    name="suffix"
                                    value={formData.suffix}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md"
                                />
                                {errors.suffix && (
                                    <p className="text-red-500 text-sm">{errors.suffix}</p>
                                )}
                            </div>

                            {/* Birthdate */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Birthdate<span className="text-red-600" title="Required field">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    max={new Date().toISOString().split("T")[0]}
                                    min="1920-01-01"
                                    required
                                />
                                {errors.birthdate && (
                                    <p className="text-red-500 text-sm">{errors.birthdate}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number<span className="text-red-600" title="Required field">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handlePhoneNumberChange}
                                    className="mt-1 block w-full border p-2 rounded-md pl-12"
                                    maxLength="10"
                                    required
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                                    +63
                                    </span>
                                </div>
                                {errors.phone_number && (
                                    <p className="text-red-600 mt-1">{errors.phone_number}</p>
                                )}
                            </div>

                            {/* Sex */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Sex<span className="text-red-600" title="Required field">*</span>
                                </label>
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    required
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Civil Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Civil Status<span className="text-red-600" title="Required field">*</span>
                                </label>
                                <select
                                    name="civil_status"
                                    value={formData.civil_status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>

                            {/* Religion */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Religion
                                </label>
                                <input
                                    type="text"
                                    name="religion"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.religion}
                                    onChange={handleChange}
                                />
                                {errors.religion && (
                                    <p className="text-red-500 text-sm">{errors.religion}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="mt-1 block w-full border p-2 rounded-md"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            {/* Address fields */}
                                {/* House Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        House No.<span className="text-red-600" title="Required field">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="house_number"
                                        className="mt-1 block w-full border p-2 rounded-md"
                                        value={formData.house_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Barangay */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Barangay<span className="text-red-600" title="Required field">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="barangay"
                                        className="mt-1 block w-full border p-2 rounded-md"
                                        value={formData.barangay}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Street */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Street
                                    </label>
                                    <input 
                                        type="text" 
                                        name="street" 
                                        className="mt-1 block w-full border p-2 rounded-md" 
                                        value={formData.street} 
                                        onChange={handleChange} 
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        City<span className="text-red-600 cursor-help" title="Required field">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        className="mt-1 block w-full border p-2 rounded-md"
                                        value={formData.city} 
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Province */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Province<span className="text-red-600 cursor-help" title="Required field">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="province" 
                                        className="mt-1 block w-full border p-2 rounded-md"
                                        value={formData.province} 
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>

                                {/* Postal Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Postal Code<span className="text-red-600 cursor-help" title="Required field">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="postal_code" 
                                        className="mt-1 block w-full border p-2 rounded-md" 
                                        value={formData.postal_code} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            
                            {/* Birthplace */}
                            <div className="col-span-1 sm:col-span-2"> 
                                <label className="block text-sm font-medium text-gray-700">
                                    Birthplace<span className="text-red-600 cursor-help" title="Required field">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="birthplace" 
                                    className="mt-1 block w-full border p-2 rounded-md" 
                                    value={formData.birthplace} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Terms and Submit */}
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                className="mr-2 sm:mr-4"
                                checked={formData.termsAccepted}
                                onChange={(e) =>
                                setFormData({ ...formData, termsAccepted: e.target.checked })
                                }
                            />

                            {/* Text */}
                            <p className="text-sm text-gray-600">
                                I agree to the{" "}
                                <button
                                type="button"
                                className="underline text-blue-500 ml-1"
                                onClick={openTermsModal}
                                >
                                Terms and Conditions and Privacy Policy
                                </button>
                                . I understand that my information will be used for registration and
                                verification purposes only, in accordance with data protection
                                regulations.
                            </p>

                            {/* Error Message */}
                            {errors.termsAccepted && (
                                <p className="text-red-500 text-sm mt-2 sm:mt-0">{errors.termsAccepted}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`col-span-6 w-full bg-[#B43C3A] hover:bg-red-600 text-white font-bold py-2 rounded-md ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                            >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Terms and Conditions Message */}
            {showTerms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 max-w-[50%] max-h-[90vh] w-full rounded-lg shadow-lg overflow-y-auto">
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
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-bold mb-4">Confirm Your Details</h3>
                        <p>Please review your information. Do you wish to proceed?</p>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {registrationSuccess && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-xl w-80 text-center">
                    <h3 className="text-xl font-bold">Registration Successful!</h3>
                    <p>Thank you for registering! Your registration is now complete.</p>
                    <p className="mt-4">
                        Next Steps: Please visit Carmona Hospital and Medical Center (3rd Floor) for in-person verification.
                        Be sure to bring a valid government-issued ID and your confirmation slip to complete the process.
                    </p>
                    <p className="mt-4 text-lg font-bold">Your Confirmation ID: {confirmationId}</p>
                    <p className="mt-4">Please visit Carmona Hospital and Medical Center for verification.</p>
                    <button onClick={handleCloseSuccessMessage} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default RegistrationPage;
