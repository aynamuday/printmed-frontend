import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext'; // Import the context

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [usersData, setUsersData] = useState([]); // State to store fetched users
  const navigate = useNavigate();
  const { setCurrentUser } = useUser(); // Get the setCurrentUser function from context

  // Fetch users from the server
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetch('http://localhost:8000/users');
        const data = await response.json();
        setUsersData(data); // Store fetched users in state
      } catch (error) {
        console.error('Failed to fetch users data:', error);
      }
    };

    fetchUsersData();
  }, []); // Fetch data when component mounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    // Check if the credentials match any entry in fetched users data
    const user = usersData.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setCurrentUser(user); // Set the logged-in user in the context
      navigate('/dashboard'); // Redirect to dashboard on success
    } else {
      setError('Invalid username or password'); // Display error if credentials are wrong
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div>
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Carmona Hospital and Medical Center"
            className="w-100 h-20"
          />
          <h2 className="text-center text-2xl font-bold mt-4">
            Carmona Hospital and Medical Center
          </h2>
          <p className="text-center text-gray-600">
            Patient Management Record System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
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
                onChange={handleChange}
              />
            </div>

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
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Login
            </button>
          </div>

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
