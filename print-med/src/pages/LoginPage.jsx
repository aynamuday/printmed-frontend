import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    role: '',
    personnel_number: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Send login credentials and request OTP
      await axios.post('http://127.0.0.1:8000/api/login', {
        role: credentials.role,
        personnel_number: credentials.personnel_number,
        email: credentials.email,
        password: credentials.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // OTP sent successfully, show OTP input
      setIsOtpSent(true);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid login credentials');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Retrieve token from storage (assuming it was saved in localStorage)
      const token = localStorage.getItem('authToken'); // Replace 'authToken' with your token's key
  
      const response = await axios.post(
        'http://127.0.0.1:8000/api/verify-otp',
        {
          email: credentials.email, // Email value for OTP verification
          otp: enteredOtp,          // OTP entered by the user
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add token to the request headers
          },
        }
      );
  
      if (response.data.success) {
        navigate('/dashboard');  // Redirect to dashboard on successful verification
      } else {
        setError('Invalid OTP'); // Display error message on failed OTP
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'OTP verification failed');
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div>
        <div className="flex flex-col items-center">
          <img src={logo} alt="Carmona Hospital and Medical Center" className="w-100 h-40" />
          <h2 className="text-center text-2xl font-bold mt-4">Patient Management Record System</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit}>
          {!isOtpSent ? (
            // Initial Login Form
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="role" className="sr-only">Role</label>
                <select
                  name="role"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={credentials.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="physician">Physician</option>
                  <option value="secretary">Secretary</option>
                  <option value="queue manager">Queue Manager</option>
                </select>
              </div>

              <div>
                <label htmlFor="personnel_number" className="sr-only">Personnel Number</label>
                <input
                  name="personnel_number"
                  type="text"
                  value={credentials.personnel_number}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your personnel number"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            // OTP Input Form
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                name="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter OTP"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isOtpSent ? 'Verify OTP' : 'Login'}
            </button>
          </div>

          {!isOtpSent && (
            <div className="text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Forgot Password</a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
