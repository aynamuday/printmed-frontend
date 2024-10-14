import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import loginData from '../data/loginData.json';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    // Check if the credentials match any entry in loginData.json
    const user = loginData.loginData.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      navigate('/dashboard'); // Redirect to dashboard on success
    } else {
      setError('Invalid username or password'); // Display error if credentials are wrong
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {/* Card Container */}
      <div>
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Carmona Hospital and Medical Center"
            className="w-100 h-20"
          />
          <h2 className="text-center text-2xl font-bold mt-4">Carmona Hospital and Medical Center</h2>
          <p className="text-center text-gray-600">Patient Management Record System</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange} // Update username and password via handleChange
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange} // Update password
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Login
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Forgot Password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
