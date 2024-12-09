import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import AppContext from '../context/AppContext';
import {globalSwalWithIcon} from '../utils/globalSwal';
import {showError} from '../utils/fetch/showError';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { validateEmail } from '../utils/formValidations/validateEmail';

const UpdateEmailPage = () => {
    const { token, user, setUser } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [newEmailUsername, setNewEmailUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Tracks the current step: 1 - Enter new email, 2 - Verify OTP
    const [otpToken, setOtpToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNewEmailUsernameChange = (e) => {
        setError('')
        const value = e.target.value.toLowerCase();

        // only allows letters, numbers, dot
        if (!/^[a-zA-Z0-9.]*$/.test(value)) {
            setError("Can only contain letters, numbers, and dot.");
            return
        }

        setNewEmailUsername(value)
        setNewEmail(value + "@gmail.com")
    }

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setError('');

        if (newEmail === user.email) {
            setError('The provided email is the same as the current email.');
            return;
        } else {
            const error = validateEmail(newEmail)
            if(error.trim() != "") {
                setError(error)
                return
            }
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
            // globalSwalWithIcon.fire({
            //     title: 'An OTP has been sent to your new email.',
            //     icon: 'info',
            //     showConfirmButton: false,
            //     showCloseButton: true
            // });
            setStep(2);   
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
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
                method: 'POST',
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

    const handleResendOtp = async (e) => {
        e.preventDefault();
    
        if (!otpToken || !newEmail) {
          return;
        }
        setError('')
        setOtp('')
    
        try {
            setLoading(true)
        
            const res = await fetch("/api/resend-update-email-otp", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({token: otpToken, email: newEmail}),
            });
        
            if(!res.ok) {
                console.log(res.status)
                if (res.status === 400) {
                    setError('This request is invalid.')
                    return
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }
        
            globalSwalWithIcon.fire({
                title: "New OTP sent!",
                icon: 'success',
                showConfirmButton: false,
                showCloseButton: true
            });
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
                <div className="mt-10 bg-[#98e6dd] bg-opacity-50 p-16 rounded-lg shadow-lg min-h-80">
                    <div className="flex flex-col items-center min-w-96">
                        <div className="absolute top-4 left-4 p-4">
                            <button
                                onClick={() => {step === 1 ? navigate('/settings') : setStep(1)}}
                                className="focus:outline-none"
                            >
                                <i className="bi bi-arrow-left font-bold text-2xl"></i> {/* Left arrow icon */}
                            </button>
                        </div>
                        <h2 className="text-xl font-bold mb-4">
                            {step == 1 ? "Update Email" : "Verify OTP"}
                        </h2>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        {step === 1 && (
                            <form onSubmit={(e) => handleSendOtp(e)} className='flex flex-col items-center justify-center '>
                                <div className="flex items-center border rounded-md border-black overflow-hidden mb-6 mt-2">
                                    <input
                                        type="text"
                                        name="email_username"
                                        placeholder="Email"
                                        value={newEmailUsername}
                                        onChange={(e) => {handleNewEmailUsernameChange(e)}}
                                        className="w-full p-2 focus:outline-none border-r border-r-black"
                                        required
                                    />
                                    <span className="bg-gray-100 p-2">@gmail.com</span>
                                </div>
                                <button
                                    type='submit'
                                    className="mt-1 block w-[50%] h-10 bg-[#248176] text-white rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Send OTP
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={(e) => handleVerifyOtp(e)} className='flex flex-col items-center justify-center '>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => {setError(''); setOtp(e.target.value);}}
                                    className="w-full min-w-[290px] p-2 mb-4 border border-black rounded-md focus:outline-none"
                                    maxLength="6"
                                />
                                <button
                                    type='submit'
                                    className="mt-1 block w-[50%] h-10 bg-[#248176] text-white rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Verify OTP
                                </button>
                                <p className='text-sm mt-4'>
                                    Didn't get an email? <button type='submit' disabled={loading} onClick={(e) => handleResendOtp(e)} className='text-red-600 hover:underline'>Resend</button>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateEmailPage;
