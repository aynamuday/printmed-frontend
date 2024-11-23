import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import Settings from '../components/Settings';
import globalSwal from '../utils/globalSwal';

const UpdateEmailPage = () => {
    const { token, user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Tracks the current step: 1 - Enter new email, 2 - Verify OTP
    const [error, setError] = useState('');
    const [otpToken, setOtpToken] = useState(''); // Store OTP token here

    // Step 1: Send OTP to current email
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
            console.log(data);

            if (res.ok) {
                // Save the token received from backend exactly as is
                if (data.token) {
                    setOtpToken(data.token); // Store the OTP token returned by backend
                } else {
                    setError('OTP token is missing from the response.');
                    return;
                }

                globalSwal.fire({
                    title: 'OTP Sent',
                    text: 'An OTP has been sent to your current email. Please enter it below to confirm the new email.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
                setStep(2); // Proceed to OTP verification step
            } else {
                setError(data.message || 'Failed to send OTP.');
            }
        } catch (error) {
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

        console.log('Sending request to verify OTP:', {
            otpToken: otpToken,      // The token received when sending OTP
            email: newEmail,   // The new email to be updated
            code: otp,         // The OTP entered by the user
        });
    
        try {
            const res = await fetch('/api/update-email/verify-otp', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    token: otpToken,
                    email: newEmail,
                    code: otp,
                }),
            });
    
            const data = await res.json();
            console.log('Response from OTP verification:', data);
    
            if (res.ok) {
                globalSwal.fire({
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
        } catch (error) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Settings
            children={
                <div className="flex flex-col items-center min-w-96">
                    <h2 className="text-xl font-bold mb-6">
                        <button onClick={() => navigate('/settings')} className="mr-4">
                            <i className="bi bi-arrow-left text-xl"></i> {/* Left arrow icon */}
                        </button>
                        Update Email
                    </h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {step === 1 && (
                        <>
                            {/* New Email Input */}
                            <input
                                type="email"
                                placeholder="Enter new email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full p-2 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />

                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* OTP Input */}
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-2 mb-4 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </>
                    )}
                </div>
            }
        />
    );
};

export default UpdateEmailPage;
