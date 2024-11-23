import React, { useState } from 'react';

import bg_nurse from '../assets/images/bg-nurse.png';
import logo from '../assets/images/logo.png';

import globalSwal from '../utils/globalSwal';
import { ScaleLoader } from 'react-spinners';
import { capitalizedWords } from '../utils/wordUtils';

function RegistrationPage() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        birthdate: '',
        birthplace: '',
        sex: '',
        civil_status: '',
        house_number: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        postal_code: '',
        phone_number: '',
        religion: '',
        email: '',
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
    const [showTerms, setShowTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationId, setConfirmationId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setErrors((prevErrors) => ({...prevErrors, [name]: ''}))
        const capitalizedValue = name !== "email" ? capitalizedWords(value) : value

        // should not accept numbers and special characters    
        if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
            return;
        }
          
        // no symbols allowed
        if (name === 'house_number' || name === 'street' || name === 'barangay') {
            if (/[^a-zA-Z0-9\s-]/.test(value)) {
                return;
            }
        }
          
        // no numbers and symbols allowed
        if (name === 'city' || name === 'province') {
            if (/[^a-zA-Z\s]/.test(value)) {
                return;
            }
        }
          
        if (name === 'postal_code') {
            if (/[^0-9]/.test(value)) {
                return;
            }
            if (value.length > 4 ) {
                setErrors({ ...errors, [name]: 'Postal code must be at most 4 digits.' });
                return;
            }
        }

        setFormData({ 
            ...formData, 
            [name]: capitalizedValue, 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let newErrors = {};
        let formIsValid = true;
    
        setErrors({});
    
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            formIsValid = false;
        }

        if (formData.postal_code.trim() !== "" && (Number (formData.postal_code) < 1000 || Number (formData.postal_code) > 9999)) {
            newErrors.postal_code = 'Postal code must only range between 1000-9999';
        }
    
        if (formData.phone_number.length !== 9) {
            newErrors.phone_number = 'Please enter a valid phone number.';
            formIsValid = false;
        }
    
        // Validate terms acceptance
        if (!termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms and conditions.';
            formIsValid = false;
        }
    
        setErrors(newErrors);

        if (!formIsValid) {
            setLoading(false)
            return
        }
    
        
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
            // If user confirms, proceed with the registration
            if (result.isConfirmed) {
                setLoading(true);
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
        <div className="min-h-screen bg-[#6CB6AD] grid place-items-center lg:p-16 p-8 bg-cover bg-center bg-[url('assets/images/bg_nurse_transparent.png')]">
            <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
                <div className="hidden md:block bg-cover bg-center col-span-2" style={{ backgroundImage: `url(${bg_nurse})` }}></div>

                <div className="p-8 lg-p-10 pb-10 bg-gray-100 col-span-3">
                    <div className="flex justify-center items-center mb-4">
                        <img src={logo} alt="Carmona Hospital Logo" className="h-20" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Patient Registration Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium">
                                    First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-black p-2 rounded-md"
                                    required
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                                )}
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-black p-2 rounded-md"
                                />
                                {errors.middle_name && (
                                    <p className="text-red-500 text-sm">{errors.middle_name}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-black p-2 rounded-md"
                                    required
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                                )}
                            </div>

                            {/* Suffix */}
                            <div>
                                <label className="block text-sm font-medium">Suffix</label>
                                <select
                                    name="suffix"
                                    value={formData.suffix}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                >
                                    <option value="">Select Suffix</option>
                                    <option value="Jr.">Jr.</option>
                                    <option value="Sr.">Sr.</option>
                                    <option value="II">II</option>
                                    <option value="III">III</option>
                                    <option value="IV">IV</option>
                                </select>
                            </div>

                            {/* Birthdate */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Birthdate <span className="text-red-600">*</span>
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
                                {errors.birthdate && (
                                    <p className="text-red-500 text-sm">{errors.birthdate}</p>
                                )}
                            </div>

                            {/* Birthplace */}
                            <div> 
                                <label className="block text-sm font-medium">
                                    Birthplace
                                </label>
                                <input 
                                    type="text" 
                                    name="birthplace" 
                                    className="mt-1 block w-full border p-2 rounded-md border-black" 
                                    value={formData.birthplace} 
                                    onChange={handleChange}
                                />
                                {errors.birthplace && (
                                    <p className="text-red-500 text-sm">{errors.birthplace}</p>
                                )}
                            </div>

                            {/* Sex */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Sex <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                    required
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Civil Status */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Civil Status <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="civil_status"
                                    value={formData.civil_status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>

                            {/* House Number */}
                            <div>
                                <label className="block text-sm font-medium">
                                    House Number <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="house_number"
                                    className="mt-1 block w-full border p-2 rounded-md border-black"
                                    value={formData.house_number}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.house_number && (
                                    <p className="text-red-500 text-sm">{errors.house_number}</p>
                                )}
                            </div>

                            {/* Street */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Street <span className="text-red-600">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="street" 
                                    className="mt-1 block w-full border p-2 rounded-md border-black" 
                                    value={formData.street} 
                                    onChange={handleChange} 
                                    required
                                />
                                {errors.street && (
                                    <p className="text-red-500 text-sm">{errors.street}</p>
                                )}
                            </div>

                            {/* Barangay */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Barangay <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="barangay"
                                    className="mt-1 block w-full border p-2 rounded-md border-black"
                                    value={formData.barangay}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.barangay && (
                                    <p className="text-red-500 text-sm">{errors.barangay}</p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium">
                                    City <span className="text-red-600 cursor-help">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="city" 
                                    className="mt-1 block w-full border p-2 rounded-md border-black"
                                    value={formData.city} 
                                    onChange={handleChange}
                                    required
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm">{errors.city}</p>
                                )}
                            </div>

                            {/* Province */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Province <span className="text-red-600 cursor-help">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="province" 
                                    className="mt-1 block w-full border p-2 rounded-md border-black"
                                    value={formData.province} 
                                    onChange={handleChange} 
                                    required
                                />
                                {errors.province && (
                                    <p className="text-red-500 text-sm">{errors.province}</p>
                                )}
                            </div>

                            {/* Postal Code */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Postal Code 
                                </label>
                                <input 
                                    type="number" 
                                    name="postal_code" 
                                    className="mt-1 block w-full border p-2 rounded-md border-black" 
                                    value={formData.postal_code} 
                                    maxLength={4}
                                    onChange={handleChange}
                                />
                                {errors.postal_code && (
                                    <p className="text-red-500 text-sm">{errors.postal_code}</p>
                                )}
                            </div>

                            {/* Religion */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Religion
                                </label>
                                <input
                                    type="text"
                                    name="religion"
                                    className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                    value={formData.religion}
                                    onChange={handleChange}
                                />
                                {errors.religion && (
                                    <p className="text-red-500 text-sm">{errors.religion}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Phone Number <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border p-2 rounded-md pl-14 border-black"
                                        maxLength="9"
                                        required
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                    +639
                                    </span>
                                </div>
                                {errors.phone_number && (
                                    <p className="text-red-600 text-sm">{errors.phone_number}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="mt-1 block w-full border p-2 rounded-md border-black"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Terms */}
                        <div>
                            <div className="flex flex-row items-center gap-4 justify-center">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={() => setTermsAccepted(!termsAccepted)}
                                />

                                {/* Text */}
                                <p className="text-sm">
                                    I agree to the <span className="underline text-blue-700 cursor-pointer" onClick={openTermsModal}>
                                        Terms and Conditions and Privacy Policy
                                    </span>. I understand that my information will be used for registration and verification purposes only, in accordance with data protection
                                    regulations.
                                </p>
                            </div>
                            {/* Error Message */}
                            {errors.termsAccepted && (
                                <p className="text-red-500 text-sm mt-2 text-center">{errors.termsAccepted}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`col-span-6 w-full bg-[#B43C3A] hover:bg-blue-700 text-white font-bold py-2 rounded-md ${loading ? "cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            { loading ? <ScaleLoader loading={loading} color="#ffffff" height={20} width={5} radius={2} margin={2} /> : 'Register' }
                        </button>
                    </form>
                </div>
            </div>

            {/* Terms and Conditions Message */}
            {showTerms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 max-w-[80%] lg:max-w-[40%] max-h-[90vh] w-full rounded-lg shadow-lg overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Terms and Conditions</h3>
                            <button onClick={closeTermsModal} className="text-2xl">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <div className='flex gap-4'>
                                <p className='font-semibold'>1.</p>
                                <p><span className='font-semibold'>Acceptance of Terms. </span>By using this registration portal, you agree to these Terms and Conditions. These terms govern the collection, processing, and usage of your personal information, which is necessary to facilitate your registration at our hospital.</p>
                            </div>
                            <div className='flex gap-4'>
                                <p className='font-semibold'>2.</p>
                                <p><span className='font-semibold'>Information Collection and Use. </span>You agree to provide accurate and complete information during the registration process. Your information will be used for in-person verification and patient identification purposes. This information will be securely stored and managed in compliance with applicable data protection laws.</p>
                            </div>
                            <div className='flex gap-4'>
                                <p className='font-semibold'>3.</p>
                                <p><span className='font-semibold'>In-Person Verification Requirements. </span>Upon completing your online registration, you will receive a registration ID number. You are required to bring a valid government-issued ID and present the registration ID number to the hospital for in-person verification. Failure to provide these documents may result in delays or inability to complete the registration process.</p>
                            </div>
                            <div className='flex gap-4'>
                                <p className='font-semibold'>4.</p>
                                <p><span className='font-semibold'>Data Privacy and Security.  </span>We are committed to protecting your personal information. All data provided will be stored securely and accessed only by authorized personnel. We will not share your information with any third parties without your consent, except where required by law.</p>
                            </div>
                            <div className='flex gap-4'>
                                <p className='font-semibold'>5.</p>
                                <p><span className='font-semibold'>Limitation and Liability.  </span>The hospital is not responsible for any delays or inconveniences caused by incomplete or inaccurate information provided by you. Additionally, the hospital is not liable for any issues arising from technical failures during the registration process.</p>
                            </div>
                            <div className='flex gap-4'>
                                <p className='font-semibold'>6.</p>
                                <p><span className='font-semibold'>Updates to Terms.  </span>We reserve the right to modify these Terms and Conditions at any time. Updates will be posted on the registration portal, and your continued use of the portal constitutes acceptance of any changes.</p>
                            </div>
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
