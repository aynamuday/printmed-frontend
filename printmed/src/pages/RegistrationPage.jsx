import React, { useEffect, useState } from 'react';

import bg_nurse from '../assets/images/bg-nurse.png';
import logo from '../assets/images/logo.png';

import { BounceLoader } from 'react-spinners';
import { capitalizedWords } from '../utils/wordUtils';
import Swal from 'sweetalert2';

function RegistrationPage() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        sex: '',
        birthdate: '',
        birthplace: '',
        civil_status: '',
        house_number: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        postal_code: '',
        religion: '',
        phone_number: '',
        email: '',
    });
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [showTerms, setShowTerms] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [registrationId, setRegistrationId] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        resetForm()
    }, [])

    const resetForm = () => {
        setFormData({
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            sex: '',
            birthdate: '',
            birthplace: '',
            civil_status: '',
            house_number: '',
            street: '',
            barangay: '',
            city: '',
            province: '',
            postal_code: '',
            religion: '',
            phone_number: '',
            email: '',
        });

        setErrors({});

        setTermsAccepted(false)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setErrors((prevErrors) => ({...prevErrors, [name]: ''}))
        const capitalizedValue = name !== "email" && name !== "suffix" ? capitalizedWords(value) : value

        // should not accept numbers and special characters    
        if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
            return;
        }
          
        // no symbols allowed
        if (name === 'house_number' || name === 'street' || name === 'barangay') {
            if (/[^a-zA-Z0-9\s]/.test(value)) {
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
                return;
            }
        }

        setFormData({ 
            ...formData, 
            [name]: capitalizedValue, 
        });
    };

    const handlePhoneNumberChange = (e) => {
        let value = e.target.value;
    
        setErrors({ ...errors, phone_number: '' });
      
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
    };

    const handleConfirm = (e) => {
        e.preventDefault();
    
        let newErrors = {};
        let formIsValid = true;
    
        setErrors({});

        if (formData.first_name.trim() === "") {
            newErrors.first_name = 'This field is required.';
            formIsValid = false;
        }

        if (formData.last_name.trim() === "") {
            newErrors.last_name = 'This field is required.';
            formIsValid = false;
        }

        if (formData.sex.trim() === "") {
            newErrors.sex = 'This field is required.';
            formIsValid = false;
        }

        if (formData.birthdate.trim() === "") {
            newErrors.birthdate = 'This field is required.';
            formIsValid = false;
        }

        if (formData.civil_status.trim() === "") {
            newErrors.civil_status = 'This field is required.';
            formIsValid = false;
        }

        if (formData.house_number.trim() === "") {
            newErrors.house_number = 'This field is required.';
            formIsValid = false;
        }

        if (formData.barangay.trim() === "") {
            newErrors.barangay = 'This field is required.';
            formIsValid = false;
        }

        if (formData.city.trim() === "") {
            newErrors.city = 'This field is required.';
            formIsValid = false;
        }

        if (formData.province.trim() === "") {
            newErrors.barangay = 'This field is required.';
            formIsValid = false;
        }
    
        if (formData.email.trim() !== "" && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            formIsValid = false;
        }

        if (formData.postal_code.trim() !== "" && (Number (formData.postal_code) < 1000 || Number (formData.postal_code) > 9999)) {
            newErrors.postal_code = 'Postal code must only range between 1000-9999';
        }
    
        if (formData.phone_number.length !== 11) {
            newErrors.phone_number = 'Please enter a valid phone number.';
            formIsValid = false;
        }
    
        if (!termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms and conditions.';
            formIsValid = false;
        }

        if (!formIsValid) {
            setErrors(newErrors);
            return
        }

        setShowConfirmation(true)
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        setShowConfirmation(false)

        setLoading(true);

        try {
            const filteredFormData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== '')
            );

            const res = await fetch('/api/registrations', {
                method: 'POST',
                body: JSON.stringify(filteredFormData),
            });

            if(!res.ok) {
                throw new Error("Something went wrong. Please try again later.")
            }

            const data = await res.json()

            setRegistrationId(data.registration_id);
            resetForm()
            setShowSuccess(true) 
        }
        catch (err) {
            let error = err.message ?? "Something went wrong. Please try again later."
            if (err.name === "TypeError") {
                error = "Something went wrong. Please try again later. You may refresh or check your Internet connection."
            }
            
            Swal.fire({
                icon: 'error',
                title: `${error}`,
                showConfirmButton: false,
                showCloseButton: true,
                customClass: {
                    title: 'text-xl font-bold text-black text-center',
                    popup: 'border-2 rounded-xl px-4 py-8',
                    icon: 'p-0 mx-auto my-0'
                }
            })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            { loading && (
                <div className='z-20 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
                    <BounceLoader className='' loading={loading} size={60} color='#6CB6AD' />
                </div>
            )}

            <div className="min-h-screen grid place-items-center lg:p-16 p-8 bg-cover bg-center bg-[url('assets/images/bg_nurse_transparent.png')]">
                <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
                    <div className="hidden md:block bg-cover bg-center col-span-2" style={{ backgroundImage: `url(${bg_nurse})` }}></div>

                    <div className="p-8 lg-p-10 pb-10 bg-gray-100 col-span-3">
                        <div className="flex justify-center items-center mb-4">
                            <img src={logo} alt="Carmona Hospital Logo" className="h-20" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Patient Registration Form</h2>
                        <form className="space-y-6">
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
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}}
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

                                {/* Sex */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Sex <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                        required
                                    >
                                        <option value="">Select Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.sex && (
                                        <p className="text-red-500 text-sm">{errors.sex}</p>
                                    )}
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
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}}
                                    />
                                    {errors.birthplace && (
                                        <p className="text-red-500 text-sm">{errors.birthplace}</p>
                                    )}
                                </div>

                                {/* Civil Status */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Civil Status <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="civil_status"
                                        value={formData.civil_status}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    {errors.civil_status && (
                                        <p className="text-red-500 text-sm">{errors.civil_status}</p>
                                    )}
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
                                        onChange={(e) => {handleChange(e)}}
                                        required
                                    />
                                    {errors.house_number && (
                                        <p className="text-red-500 text-sm">{errors.house_number}</p>
                                    )}
                                </div>

                                {/* Street */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Street
                                    </label>
                                    <input 
                                        type="text" 
                                        name="street" 
                                        className="mt-1 block w-full border p-2 rounded-md border-black" 
                                        value={formData.street} 
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}} 
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
                                        maxLength="4"
                                        minLength="4"
                                        onChange={(e) => {handleChange(e)}}
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
                                        onChange={(e) => {handleChange(e)}}
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
                                            value={formData.phone_number  || '09'}
                                            onChange={(e) => handlePhoneNumberChange(e)}
                                            className="mt-1 block w-full border p-2 rounded-md border-black"
                                            maxLength="11"
                                            minLength="11"
                                            required
                                        />
                                        {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                        +639
                                        </span> */}
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
                                        onChange={(e) => {handleChange(e)}}
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
                                        I agree to the <span className="underline text-blue-700 cursor-pointer" onClick={() => {setShowTerms(true)}}>
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
                                onClick={(e) => handleConfirm(e)}
                                className={`col-span-6 w-full bg-[#B43C3A] hover:bg-blue-700 text-white font-bold py-2 rounded-md ${loading && "cursor-not-allowed"}`}
                                disabled={loading}
                            >
                                Register
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
                                <button onClick={() => setShowTerms(false)} className="text-2xl">&times;</button>
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

                {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 max-w-[80%] lg:max-w-[40%] max-h-[90vh] rounded-lg shadow-lg overflow-y-auto">
                            <h3 className="text-xl font-bold text-center mb-4">Confirm Your Details</h3>
                            <div>
                                <div className='grid grid-cols-8 gap-y-2 gap-x-4'>
                                    <p className='col-span-3 font-semibold'>First Name </p>
                                    <p className='col-span-5'>{formData.first_name}</p>
                                    { formData.middle_name && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Middle Name </p>
                                            <p className='col-span-5'>{formData.middle_name}</p>
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>Last Name </p>
                                    <p className='col-span-5'>{formData.last_name}</p>
                                    { formData.suffix && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Suffix </p>
                                            <p className='col-span-5'>{formData.suffix}</p>      
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>Sex </p>
                                    <p className='col-span-5'>{formData.sex}</p>
                                    <p className='col-span-3 font-semibold'>Birthdate </p>
                                    <p className='col-span-5'>{formData.birthdate}</p>
                                    { formData.birthplace && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Birthplace </p>
                                            <p className='col-span-5'>{formData.birthplace}</p>      
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>Civil Status </p>
                                    <p className='col-span-5'>{formData.civil_status}</p>
                                    <p className='col-span-3 font-semibold'>House No. </p>
                                    <p className='col-span-5'>{formData.house_number}</p>
                                    { formData.street && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Street</p>
                                            <p className='col-span-5'>{formData.street}</p>    
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>Barangay</p>
                                    <p className='col-span-5'>{formData.barangay}</p>
                                    <p className='col-span-3 font-semibold'>City</p>
                                    <p className='col-span-5'>{formData.city}</p>
                                    <p className='col-span-3 font-semibold'>Province</p>
                                    <p className='col-span-5'>{formData.province}</p>
                                    <p className='col-span-3 font-semibold'>Phone No. </p>
                                    <p className='col-span-5'>09{formData.phone_number}</p>
                                    { formData.email && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Email </p>
                                            <p className='col-span-5'>{formData.email}</p>
                                        </>
                                    )}
                                </div>
                                <div className='flex justify-center items-center gap-4 mt-6'>
                                    <button onClick={(e) => handleSubmit(e)} className='text-white bg-[#408e85]  hover:bg-blue-700 px-4 py-2 rounded-md'>Continue</button>
                                    <button onClick={() => setShowConfirmation(false)} className='text-white bg-[#B43C3A] px-4 py-2 rounded-md'>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showSuccess && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 max-w-[80%] w-full lg:max-w-[30%] max-h-[90vh] rounded-lg shadow-lg overflow-y-auto relative">
                            <button onClick={() => setShowSuccess(false)} className="text-2xl absolute right-6 top-6">&times;</button>
                            <i className='bi bi-check-circle text-[#44b85a] text-6xl text-center block mb-4'></i>
                            <h3 className="text-xl font-bold text-center mb-2">Registration Successful!</h3>
                            <div className='text-center'>
                                <p>Your registration is now complete.</p>
                                <p className='mb-4'>Thank you for registering.</p>
                                <p>Here is your registration ID:</p>
                                <p className='text-2xl font-bold tracking-widest mb-4'>{registrationId}</p>
                                <p className='w-[90%] mx-auto'>Make sure to screenshot this or write the registration ID on your note.</p>
                                <p className='font-bold mt-4'>Next Step:</p>
                                <p>Visit Carmona Hospital and Medical Center's Outpatient Department (3rd Floor) for in-person verification. Bring a valid government-issued ID and present the registration ID above.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default RegistrationPage;
