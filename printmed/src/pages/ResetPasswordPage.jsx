import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import AppContext from '../context/AppContext';
import { ScaleLoader } from "react-spinners";
import { capitalizedWords } from '../utils/wordUtils';
import { globalSwalWithIcon } from '../utils/globalSwal';

const ResetPasswordPage = () => {
  const { bearerToken } = useState(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const [formData, setFormData] = useState({ firstName: '', lastName: '', birthdate: '', password: '', passwordConfirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError('')
    
    const { name, value } = e.target;
    const capitalizedValue = name == "firstName" || name == "lastName" ? capitalizedWords(value) : value

    setFormData({ ...formData, [name]: capitalizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')

    const { firstName, lastName, birthdate, password, passwordConfirmation } = formData;

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    if(!passwordRegex.test(passwordConfirmation)) {
      setError("Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.")
      return;
    }

    setLoading(false);

    try {
      setLoading(true)

      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`
        },
        body: JSON.stringify({ 
          first_name: firstName,
          last_name: lastName,
          birthdate: birthdate,
          token: token, 
          email: email, 
          password: password, 
          password_confirmation: passwordConfirmation
        })
      });

      if(!res.ok) {
        if (res.status === 400) {
          setError("This request is invalid.");
          return
        } else if (res.status === 410) {
          setError("Reset link is expired.");
          return
        } else if (res.status === 401) {
          setError("The provided credentials are invalid.");
          return
        } else {
          throw new Error("Something went wrong. Please try again later.")
        }
      }

      globalSwalWithIcon.fire({
        title: "Password reset successfully!",
        icon: 'success',
        showConfirmButton: false,
        showCloseButton: true
      })

      navigate('/login');
    }
    catch (err) {
      showError(err)
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white-100">
      <div className="bg-white px-4 rounded-lg lg:w-[30%] md:w-[40%]">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="" className="w-100 h-28" />
          <h2 className="text-center text-2xl font-bold mt-4">Patient Records Management System</h2>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form className="space-y-6 px-2" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className='text-sm text-gray-700'>First Name</label>
              <input
                name="firstName"
                type="text"
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Last Name</label>
              <input
                name="lastName"
                type="text"
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="First Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Birthdate</label>
              <input
                name="birthdate"
                type="date"
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='text-sm text-gray-700'>New Password</label>
              <input
                name="password"
                type="password"
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Confirm New Password</label>
              <input
                name="passwordConfirmation"
                type="password"
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? <ScaleLoader color="#ffffff" height={20} width={5} radius={2} margin={2} /> : "Reset Password"}
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
