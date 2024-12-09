import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import AppContext from '../context/AppContext';
import { ScaleLoader } from "react-spinners";
import { globalSwalWithIcon } from '../utils/globalSwal';
import { showError } from '../utils/fetch/showError';
import backdrop from '../assets/images/Backdrop.png';

const ForgotPasswordPage = () => {
    const { token } = useContext(AppContext)
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // const handleEmailChange = (e) => {
    //     setError('')

    //     const value = e.target.value.trim().toLowerCase()
    //     const emailRegex = /^(?!.*[\.\+]{2,})(?!.*[^a-zA-Z0-9\s+.]).*$/

    //     console.log(value)

    //     if(!emailRegex.test(value)) {
    //         setError('Email username must begin with an alphanumeric character and may include non-consecutive dots and plus signs.')
    //         return
    //     }

    //     setUsername(value)
    // }

    const handleEmailChange = (e) => {
        setError('')

        const value = e.target.value.trim().toLowerCase()
        const emailRegex = /^(?!.*[\.\+]{2,})(?!.*[^a-zA-Z0-9\s+.]).*$/

        console.log(value)

        if(!emailRegex.test(value)) {
            setError('Email username must begin with an alphanumeric character and may include non-consecutive dots and plus signs.')
            return
        }

        setUsername(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email.endsWith('@gmail.com') || email.length < 16) {
            setError('Email not found.')
            return
        }

        try {
            setLoading(true)
      
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email }),
            });
      
            if(!res.ok) {
                if (res.status == 422 || res.status == 404) {
                    throw new Error("Email not found.")
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }
            
            globalSwalWithIcon.fire({
                icon: 'success',
                title: `Reset password link sent successfully!`,
                html: `<p style="color: black; font-size: 16px; margin: 0;">A reset password link has been sent to your email.</p>`,
                showConfirmButton: false,
                showCloseButton: true
            })

            navigate('/login')
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div 
            className="min-h-screen flex flex-col justify-center items-center bg-white-100"
            style={{
                backgroundImage: `url(${backdrop})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <div
                    className="absolute inset-0 bg-white bg-opacity-50"
                    aria-hidden="true"
                ></div>
            
            <div className="relative z-10 flex justify-center flex-col bg-gray-100 p-6 rounded-lg lg:w-[30%] md:w-[40%]">
                <div className="flex flex-col items-center mb-4">
                    <img src={logo} alt="" className="w-100 h-28" />
                    <h2 className="text-center text-2xl font-bold mt-4">Forgot Password</h2>
                </div>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                <form className="space-y-6 px-2" onSubmit={(e) => handleSubmit(e)}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {/* <div>
                            <label className='text-sm text-gray-700'>Email</label>
                            <div className='relative overflow-clip'>
                                <input
                                    name="email"
                                    type="email"
                                    className="appearance-none rounded-md w-full px-3 py-2 border border-gray-500 text-black focus:outline-none"
                                    placeholder="Email"
                                    value={username}
                                    onChange={(e) => handleEmailChange(e)}
                                    minLength={6}
                                    maxLength={30}
                                />
                                <span className="bg-gray-100 absolute right-0 top-0 bottom-0 flex items-center px-2 border border-gray-500 rounded-tr-md rounded-br-md">@gmail.com</span>
                            </div>
                        </div> */}
                        <div>
                            <label className='text-sm text-gray-700'>Email</label>
                            <input
                                name="email"
                                type="email"
                                className="appearance-none rounded-md w-full px-3 py-2 border border-black text-gray-900 focus:outline-none sm:text-sm"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
        
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={loading}
                    >
                        {loading ? <ScaleLoader color="#ffffff" height={20} width={5} radius={2} margin={2} /> : "Send Reset Link"}
                    </button>
        
                    <button
                        onClick={() => navigate('/login')}
                        type="button"
                        className="text-sm text-gray-600 hover:text-gray-900 mt-4 w-full flex justify-center"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage