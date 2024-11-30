import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners'; // Import the loader
import AppContext from '../context/AppContext';
import Settings from '../components/Settings';
import {globalSwalWithIcon} from '../utils/globalSwal';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const UpdateEmailPage = () => {
    const { token, user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Tracks the current step: 1 - Enter new email, 2 - Verify OTP
    const [error, setError] = useState('');
    const [otpToken, setOtpToken] = useState(''); // Store OTP token here

    const handleSendOtp = async () => {
        setError('');
        if (!newEmail) {
            setError('Please enter a new email address.');
            return;
        }
        if (newEmail === user.email) {
            setError('The provided email is the same as the current email.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/update-email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ new_email: newEmail }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                setOtpToken(data.token);
                globalSwalWithIcon.fire({
                    title: 'OTP Sent',
                    text: 'An OTP has been sent to your current email. Please enter it below to confirm the new email.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
                setStep(2);
            } else {
                setError(data.message || 'Failed to send OTP.');
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        if (!otp) {
            setError('Please enter the OTP.');
            return;
        }
        if (!newEmail) {
            setError('Please enter the new email.');
            return;
        }
        if (!otpToken) {
            setError('OTP token is missing.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/update-email/verify-otp', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: otpToken, email: newEmail, code: otp }),
            });
            const data = await res.json();
            if (res.ok) {
                globalSwalWithIcon.fire({
                    title: 'Success',
                    text: 'Your email has been updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setUser({ ...user, email: newEmail });
                setNewEmail('');
                setOtp('');
                navigate('/settings');
            } else {
                setError(data.message || 'Failed to verify OTP.');
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Sidebar />
            <Header />

            <div className="w-full md:w-[70%] md:ml-[25%] mt-[10%] relative">
                <div className="flex flex-col items-center justify-center mt-10 bg-[#98e6dd] bg-opacity-50 p-16 rounded-lg shadow-lg min-h-80">
                    <div className="flex flex-col items-center min-w-96">
                        <div className="absolute top-4 left-4 p-4">
                            <button
                                onClick={() => navigate('/settings')}
                                className="focus:outline-none"
                            >
                                <i className="bi bi-arrow-left font-bold text-2xl"></i> {/* Left arrow icon */}
                            </button>
                        </div>
                        <h2 className="text-xl font-bold mt-12 mb-6">
                            Update Email
                        </h2>

                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        {loading ? (
                            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                                <BounceLoader color="#6CB6AD" size={50} /> {/* Loading spinner */}
                            </div>
                        ) : (
                            <>
                                {step === 1 && (
                                    <>
                                        <input
                                            type="email"
                                            placeholder="Enter new email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="w-full p-2 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        />
                                        <button
                                            onClick={handleSendOtp}
                                            className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
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
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full p-2 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        />
                                        <button
                                            onClick={handleVerifyOtp}
                                            className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                                        >
                                            Verify OTP
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateEmailPage;
