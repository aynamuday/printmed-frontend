import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { ScaleLoader } from 'react-spinners';
import logo from '../assets/images/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    role: '',
    personnel_number: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState({
    token: '',
    email: '',
    code: ''
  }); 
  const [isOtpSent, setIsOtpSent] = useState(false); 
  const [error, setError] = useState('');

  // Function to handle input changes for login credentials
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    setError(''); // Clear error when user changes input
  };

  // Function to handle changes to the OTP input
  const handleOtpChange = (e) => {
    setOtp({
      ...otp,
      code: e.target.value
    });
  };

  // Function to handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Sending login credentials to the API
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    const data = await res.json();

    console.log('Login Response:', data); 

    setLoading(false);

    if (res.ok) {
      setIsOtpSent(true);

      setOtp({
        token: data.token,
        email: data.email,
        code: ''
      });

      setError('');
    } else {
      setError(data.error || 'Invalid credentials'); // Default to 'Invalid credentials' if no specific error is provided
    }
  };

  // Function to verify the OTP entered by the user
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify(otp),
    });

    const data = await res.json();

    console.log('Verify OTP Response:', data);

    setLoading(false);

    if (res.ok) { 
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate('/');
    } else {
      setError(data.error || 'Invalid OTP');
    }
  };

  const handleForgotPassword = () => {
    alert("Please contact the administrator.");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white-100">
      <div>
        <div className="flex flex-col items-center">
          <img src={logo} alt="Carmona Hospital and Medical Center" className="w-100 h-32" />
          <h2 className="text-center text-2xl font-bold mt-4">Patient Records Management System</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isOtpSent ? handleVerifyOtp : handleLogin}>
          {!isOtpSent ? (
            // Login Form
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="role" className="sr-only">Role</label>
                <select
                  name="role"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={credentials.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="physician">Physician</option>
                  <option value="secretary">Secretary</option>
                  <option value="queue manager">Queue Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="personnel_number" className="sr-only">Personnel Number</label>
                <input
                  name="personnel_number"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Personnel Number"
                  value={credentials.personnel_number}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            // Verify OTP Form
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                name="otp"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter OTP"
                value={otp.code}
                onChange={handleOtpChange}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={loading}
            >
              { loading ? ( // Show loader or button text based on loading state
                <div className="flex items-center">
                  <ScaleLoader color="#ffffff" height={20} width={5} radius={2} margin={2} />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : (
                isOtpSent ? 'Verify OTP' : 'Login'
              )}
              </button>
          </div>

          {!isOtpSent && (
            <div className="text-center">
              <button
                href="#"
                onClick={handleForgotPassword}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot Password
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
