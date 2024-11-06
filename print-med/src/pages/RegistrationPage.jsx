import React, { useState } from 'react';
//import { Tooltip } from 'bootstrap';
import bgNurse from '../assets/images/bg-nurse.png';
import logo from '../assets/images/logo.png';
import { FaSmile } from 'react-icons/fa';

function RegistrationPage() {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        age: '',
        address: '',
        contact: '',
        idType: '',
        termsAccepted: false,
    });
    const [errors, setErrors] = useState({
        email: '',
        name: '',
        age: '',
        address: '',
        contact: '',
        idType: '',
        termsAccepted: '',
    });

    const [registrationSuccess, setRegistrationSuccess] = useState(false); // Track registration status
    const [confirmationId, setConfirmationId] = useState(null);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            email: '',
            name: '',
            age: '',
            address: '',
            contact: '',
            idType: '',
            otherIdType: '',
            termsAccepted: false,
        });
        setErrors({
            email: '',
            name: '',
            age: '',
            address: '',
            contact: '',
            idType: '',
            otherIdType: '',
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
                <div className="p-8 bg-[#6CB6AD]">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6"></h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-black"></label>
                            <input
                                type="email"
                                name="email"
                                className="bg-[#6CB6AD] placeholder-black w-full border-b border-gray-300 p-2 focus:outline-none focus:border-teal-500"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-black"></label>
                            <input
                                type="text"
                                name="name"
                                className="bg-[#6CB6AD] placeholder-black w-full border-b border-gray-300 p-2 focus:outline-none focus:border-teal-500"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-black"></label>
                            <input
                                type="number"
                                name="age"
                                className="bg-[#6CB6AD] placeholder-black w-full border-b border-gray-300 p-2 focus:outline-none focus:border-teal-500"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleChange}
                            />
                            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                        </div>

                        <div>
                            <label className="block text-black"></label>
                            <input
                                type="text"
                                name="address"
                                className="bg-[#6CB6AD] placeholder-black w-full border-b border-gray-300 p-2 focus:outline-none focus:border-teal-500"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-black"></label>
                            <input
                                type="tel"
                                name="contact"
                                className="bg-[#6CB6AD] placeholder-black w-full border-b border-gray-300 p-2 focus:outline-none focus:border-teal-500"
                                placeholder="Contact Number"
                                value={formData.contact}
                                onChange={handleChange}
                            />
                            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
                        </div>

                        <div className="relative">
                            <label className="flex items-center text-black">
                                Type of ID
                                <i
                                    className="bi bi-question-circle-fill ml-2 text-gray-500 cursor-pointer"
                                    onClick={toggleTooltip}
                                ></i>
                            </label>
                            <select
                                name="idType"
                                className="bg-[#6CB6AD] placeholder-black w-full border-b border-gray-300 p-2 focus:outline-none focus:border-teal-500"
                                value={formData.idType}
                                onChange={handleChange}
                            >
                                <option className="bg-[#E5E5E5]" value="">Select ID Type</option>
                                <option className="bg-[#E5E5E5]" value="Driver's License">Driver's License</option>
                                <option className="bg-[#E5E5E5]" value="Passport">Passport</option>
                                <option className="bg-[#E5E5E5]" value="National ID">National ID</option>
                                <option className="bg-[#E5E5E5]" value="Other">Other</option>
                            </select>
                            {errors.idType && <p className="text-red-500 text-sm">{errors.idType}</p>}

                            {/* Input for ID if 'Other' is selected */}
                            {formData.idType === 'Other' && (
                                <div>
                                    <label className="block text-black mt-2">Please specify your ID Type</label>
                                    <input
                                        type="text"
                                        name="otherIdType"
                                        className="bg-[#6CB6AD] placeholder-black w-full border-b border-gray-300 p-2 focus:outline-none focus:border-teal-500"
                                        placeholder="Type your ID"
                                        value={formData.otherIdType || ''}
                                        onChange={handleChange}
                                    />
                                    {errors.otherIdType && <p className="text-red-500 text-sm">{errors.otherIdType}</p>}
                                </div>
                            )}
                            {/* Tooltip message box */}
                            {showTooltip && (
                                <div className="absolute mt-2 p-4 bg-gray-100 border border-gray-300 rounded shadow-lg w-72 text-sm text-gray-600">
                                    The type of ID you input will be the ID you will present upon your in-person visit for verification.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
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
                            className="w-full bg-[#B43C3A] hover:bg-red-600 text-white font-bold py-2 rounded-md"
                        >
                            Register
                        </button>
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
                </div>
            )}

            {/* Show Success Message upon Registration */}
            {registrationSuccess && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-xl w-80 text-center">
                    <div className="flex justify-center items-center mb-4">
                        <FaSmile className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold">Registration Successful!</h3>
                    <p>Thank you for registering! Your registration is now complete.</p>
                    <p className="mt-4">Next Steps: Please visit Carmona Hospital and Medical Center (3rd Floor) for in-person verification. Be sure to bring a valid government-issued ID and your confirmation slip to complete the process.</p>
                    <p className="mt-4">Your Confirmation ID: {confirmationId}</p>
                    <button onClick={handleCloseSuccessMessage} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default RegistrationPage;
