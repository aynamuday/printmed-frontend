import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import AppContext from '../context/AppContext';
import {globalSwalWithIcon} from '../utils/globalSwal';
import {showError} from '../utils/fetch/showError';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const UpdateEmailPage = () => {
    const { token, user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Tracks the current step: 1 - Enter new email, 2 - Verify OTP
    const [otpToken, setOtpToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setError('');

        if (!newEmail) {
            return;
        }
        if (newEmail === user.email) {
            setError('The provided email is the same as the current email.');
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(newEmail)) {
            setError('Please provide a valid email.');
            return;
        }

        try {
            setLoading(true)

            const res = await fetch('/api/update-email', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ new_email: newEmail }),
            });
     
            if(!res.ok) {
                if (res.status === 422) {
                    setError('Email is already taken.');
                    return;
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }
     
            const data = await res.json()
     
            setOtpToken(data.token);
            globalSwalWithIcon.fire({
                title: 'An OTP has been sent to your new email.',
                icon: 'info',
                showConfirmButton: false,
                showCloseButton: true
            });
            setStep(2);   
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
        }
    };

    const handleVerifyOtp = async () => {
        setError('');

        if (!otp) {
            return;
        }
        if (!otpToken || !newEmail) {
            setStep(1)
            return;
        }

        try {
            setLoading(true)

            const res = await fetch('/api/update-email/verify-otp', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: otpToken, email: newEmail, code: otp }),
            });

            if(!res.ok) {
                if (res.status === 400) {
                    setError('This request is invalid.');
                    return;
                } else if (res.status === 410) {
                    setError('OTP is expired.');
                    return;
                } else if (res.status === 401) {
                    setError('OTP is invalid.');
                    return;
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }

            globalSwalWithIcon.fire({
                title: 'Email updated successfully!',
                icon: 'success',
                showConfirmButton: false,
                showCloseButton: true
            });
            setUser({ ...user, email: newEmail });
            setNewEmail('');
            setOtp('');
            setStep(1)
            navigate('/settings');
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <>
            <Sidebar />
            <Header />

            { loading && (
                <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-white bg-opacity-40 flex justify-center items-center z-50">
                    <BounceLoader color="#6CB6AD" loading={loading} size={60} />
                </div>
            )}

            <div className="w-full md:w-[70%] md:ml-[25%] mt-[10%] relative">
                <div className="flex flex-col items-center justify-center mt-10 bg-[#98e6dd] bg-opacity-50 p-16 rounded-lg shadow-lg min-h-80">
                    <div className="flex flex-col items-center min-w-96">
                        <div className="absolute top-4 left-4 p-4">
                            <button
                                onClick={() => {step === 1 ? navigate('/settings') : setStep(1)}}
                                className="focus:outline-none"
                            >
                                <i className="bi bi-arrow-left font-bold text-2xl"></i> {/* Left arrow icon */}
                            </button>
                        </div>
                        <h2 className="text-xl font-bold mb-6">
                            {step == 1 ? "Update Email" : "Verify OTP"}
                        </h2>

                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        {step === 1 && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Enter new email"
                                    value={newEmail}
                                    onChange={(e) => {setError(''); setNewEmail(e.target.value);}}
                                    className="w-full p-2 mb-4 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                                />
                                <button
                                    onClick={handleSendOtp}
                                    className="mt-1 block w-[50%] h-10 bg-[#248176] text-white rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Send OTP
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => {setError(''); setOtp(e.target.value);}}
                                    className="w-full p-2 mb-4 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                                    maxLength="6"
                                />
                                <button
                                    onClick={handleVerifyOtp}
                                    className="mt-1 block w-[50%] h-10 bg-[#248176] text-white rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Verify OTP
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateEmailPage;
