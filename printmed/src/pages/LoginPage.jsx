import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { showError } from '../utils/fetch/showError'

import AppContext from '../context/AppContext';

import logo from '../assets/images/logo.png';
import { globalSwalWithIcon } from '../utils/globalSwal';
import backdrop from '../assets/images/Backdrop.png';

const LoginPage = () => {
  const { setToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    role: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState({
    token: '',
    email: '',
    code: ''
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errors, setErrors] = useState({
    role: '',
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);

  const [visibility, setVisibility] = useState({
    password: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: '', general: ''});

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleOtpChange = (e) => {
    setErrors({ ...errors, otp: '', general: ''});

    setOtp({
      ...otp,
      code: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors('')

    try {
      setLoading(true)

      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });

      if(!res.ok) {
        if (res.status === 404 || res.status === 401) {
          setErrors({ ...errors, general: "The provided credentials are incorrect." });
          return
        } else if (res.status === 403) {
          setErrors({ ...errors, general: "This account is temporarily restricted due to multiple failed login attempts. You may wait for an hour or contact the admin."});
          return
        } else {
          throw new Error("Something went wrong. Please try again later.")
        }
      }

      const data = await res.json()

      setIsOtpSent(true);
      setOtp({
        token: data.token,
        email: data.email,
        code: ''
      });
    }
    catch (err) {
      showError(err)
    }
    finally {
      setLoading(false)
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.code) {
      return;
    }
    setErrors([])

    try {
      setLoading(true)

      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify(otp),
      });

      if(!res.ok) {
          if (res.status === 400) {
            setErrors({ ...errors, general: "This request is invalid." });
            return
          } else if (res.status === 410) {
            setErrors({ ...errors, general: "OTP is expired." });
            return
          } else if (res.status === 401) {
            setErrors({ ...errors, general: "OTP is invalid." });
            return
          } else {
              throw new Error("Something went wrong. Please try again later.")
          }
      }

      const data = await res.json()  
	  
      localStorage.setItem("token", data.token)
      setUser(data.user)
      setToken(data.token)
      navigate('/')
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

    if (!otp.token || !otp.email) {
      return;
    }
    setErrors([])
    setOtp({...otp, code: ''})

    try {
      setLoading(true)

      const res = await fetch("/api/resend-otp", {
        method: "POST",
        body: JSON.stringify(otp),
      });

      if(!res.ok) {
          if (res.status === 400) {
            setErrors({ ...errors, general: "This request is invalid." });
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
    <div 
      className="min-h-screen flex flex-col justify-center items-center"
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
      <div className='relative z-10 flex justify-center flex-col lg:w-[30%] md:w-[40%] bg-gray-100 p-6 rounded-md'>
        <div className="flex flex-col items-center">
          <img src={logo} alt="" className="w-100 h-28" />
          <h2 className="text-center text-2xl font-bold mt-4">Patient Records Management System</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isOtpSent ? handleVerifyOtp : handleLogin}>
          {!isOtpSent ? (
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <select
                  name="role"
                  className="appearance-none rounded-md w-full px-3 py-2 border border-black text-gray-900 focus:outline-none sm:text-sm"
                  value={credentials.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="physician">Physician</option>
                  <option value="secretary">Secretary</option>
                  <option value="admin">Admin</option>
                  <option value="super admin">Super Admin</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  className="appearance-none rounded-md w-full px-3 py-2 border border-black text-gray-900 focus:outline-none sm:text-sm"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="relative">
                <input
                  name="password"
                  type={visibility.password ? "text" : "password"}
                  className="appearance-none rounded-md w-full px-3 py-2 border border-black text-gray-900 focus:outline-none sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <i
                  onClick={() => toggleVisibility('password')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                    visibility.password ? 'bi bi-eye-slash' : 'bi bi-eye'
                  }`}
                ></i>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                name="otp"
                type="text"
                className="appearance-none rounded-md w-full px-3 py-2 border border-black focus:outline-none sm:text-sm"
                placeholder="Enter OTP"
                value={otp.code}
                maxLength="6"
                minLength="6"
                onChange={handleOtpChange}
                required
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            </div>
          )}

          {errors.general && <p className="text-red-500 text-center text-sm">{errors.general}</p>}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? <ScaleLoader color="#ffffff" height={20} width={5} radius={2} margin={2} /> : isOtpSent ? 'Verify OTP' : 'Login'}
          </button>

          {isOtpSent && (
            <div className='flex gap-2 mt-4 justify-center'>
              <span className='text-sm text-gray-600'>Didn't get the code?</span>
              <button
                onClick={handleResendOtp}
                type="button"
                disabled={loading}
                className="text-sm text-red-600 hover:underline"
              >
                Resend
              </button>
            </div>
          )}

          {!isOtpSent && (
            <button
              type='button'
              onClick={() => {navigate('/forgot-password')}}
              className="text-sm text-gray-600 hover:text-gray-900 mt-4 w-full flex justify-center"
            >
              Forgot Password?
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
