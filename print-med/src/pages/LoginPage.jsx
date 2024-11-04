import React, { useContext, useState } from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

const LoginPage = () => {
  const { setToken } = useContext(AppContext); // Access context to set authentication token
  const navigate = useNavigate(); // Hook to programmatically navigate to other routes
  const [credentials, setCredentials] = useState({
    role: '',
    personnel_number: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState(''); // State to hold OTP entered by the user
  const [isOtpSent, setIsOtpSent] = useState(false); // State to determine if OTP has been sent
  const [error, setError] = useState(''); // State for error messages

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
    setOtp(e.target.value);
  };

  // Function to handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sending login credentials to the API
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials), // Convert credentials to JSON format
    });

    const data = await res.json(); // Parse the JSON response from the API

    console.log('Login Response:', data); // Log the response for debugging

    if (res.ok) {
      localStorage.setItem("token", data.token); // Save the token in localStorage for future requests
      localStorage.setItem("role", data.role); // Save the user role in localStorage
      setToken(data.token); // Update context with the new token
      setIsOtpSent(true); // Indicate that OTP has been sent to the user
      setError(''); // Clear any previous error messages
    } else {
      // Set error message if login fails
      setError(data.error || 'Invalid credentials'); // Default to 'Invalid credentials' if no specific error is provided
    }
  };

  // Function to verify the OTP entered by the user
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // Sending OTP verification request to the API
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email, // Email used for the OTP
        code: otp, // Change this from `otp` to `code` to match backend requirements
        token: token, // Include the token in the request body
      }),
    });

    const data = await res.json(); // Parse the JSON response from the API

    console.log('Verify OTP Response:', data); // Log the OTP verification response

    if (res.ok) { // Check if the response indicates success
      navigate('/dashboard'); // Redirect to the dashboard upon successful verification
    } else {
      setError(data.error || 'Invalid OTP'); // Display error message if OTP verification fails
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
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your personnel number"
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
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isOtpSent ? 'Verify OTP' : 'Login'} {/* Change button text based on OTP state */}
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
