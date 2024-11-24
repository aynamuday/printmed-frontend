import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';

import AppContext from '../context/AppContext';

import logo from '../assets/images/logo.png';

const LoginPage = () => {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    role: '',
    //personnel_number: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState({
    token: '',
    email: '',
    code: ''
  });
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Error states for each field
  const [errors, setErrors] = useState({
    role: '',
    //personnel_number: '',
    email: '',
    password: '',
    otp: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleOtpChange = (e) => {
    setOtp({
      ...otp,
      code: e.target.value
    });
    setErrors({ ...errors, otp: '' });
  };

  const handleLogin = async (e) => {
    setErrors('')

    e.preventDefault();

    const newErrors = {};
    if (!credentials.role) newErrors.role = 'Please select your role.';
    //if (!credentials.personnel_number) newErrors.personnel_number = 'Personnel number is required.';
    if (!credentials.email) newErrors.email = 'Email is required.';
    if (!credentials.password) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setIsOtpSent(true);
      setOtp({
        token: data.token,
        email: data.email,
        code: ''
      });
    } else {
      setErrors({ ...errors, general: data.error || 'Invalid credentials' });
    }
  };

  const handleVerifyOtp = async (e) => {
    setErrors([])

    e.preventDefault();

    if (!otp.code) {
      setErrors({ ...errors, otp: 'OTP is required.' });
      return;
    }

    setLoading(true);

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify(otp),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate('/');
    } else {
      setErrors({ ...errors, otp: data.error || 'Invalid OTP' });
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const hanldeRegister = () => {
    navigate('/register');
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white-100">
      <div>
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
                  className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={credentials.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="physician">Physician</option>
                  <option value="secretary">Secretary</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>

              

              <div>
                <input
                  name="email"
                  type="email"
                  className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div>
                <input
                  name="password"
                  type="password"
                  className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                name="otp"
                type="text"
                className="appearance-none rounded-md w-full px-3 py-2 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter OTP"
                value={otp.code}
                onChange={handleOtpChange}
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            </div>
          )}

          {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? <ScaleLoader color="#ffffff" height={20} width={5} radius={2} margin={2} /> : isOtpSent ? 'Verify OTP' : 'Login'}
          </button>

          {!isOtpSent && (
            <button
              onClick={handleForgotPassword}
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 mt-4 w-full flex justify-center"
            >
              Forgot Password?
            </button>
          )}

            <button
              onClick={hanldeRegister}
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 mt-4 w-full flex justify-center"
            >
              Register
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
