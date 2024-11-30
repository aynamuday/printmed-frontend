import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import AppContext from '../context/AppContext';

const ResetPasswordPage = () => {
  const { bearerToken } = useState(AppContext);
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const [formData, setFormData] = useState({ password: '', passwordConfirmation: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, passwordConfirmation } = formData;
    const symbolPattern = /[!@#$%^&*(),.?":{}|<>]/;

    // Validate passwords
    if (!password || !passwordConfirmation) {
      setError('Please fill in both fields.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!symbolPattern.test(password)) {
      setError('Password must contain at least one special character.');
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify({ token: token, email: email, password: password, password_confirmation: passwordConfirmation})
    });

    if (!res.ok) {
      console.log(await res.json())
      return
    }

    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white-100">
      <div className="bg-white p-8 rounded-lg">
        <div className="flex flex-col items-center">
          <img src={logo} alt="" className="w-100 h-28" />
          <h2 className="text-center text-2xl font-bold mt-4">Patient Records Management System</h2>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                name="password"
                type="password"
                className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                name="passwordConfirmation"
                type="password"
                className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#6CB6AD] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            Reset Password
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
};

export default ResetPasswordPage;
