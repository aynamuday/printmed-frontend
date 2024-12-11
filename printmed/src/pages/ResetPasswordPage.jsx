import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import AppContext from '../context/AppContext';
import { ScaleLoader } from "react-spinners";
import { globalSwalWithIcon } from '../utils/globalSwal';
import backdrop from '../assets/images/Backdrop.png';

const ResetPasswordPage = () => {
  const { bearerToken } = useState(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const [formData, setFormData] = useState({ personnelNumber: '', personnelNumberInput: '', birthdate: '', password: '', passwordConfirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  const handleChange = (e) => {
    setError('')
    
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handlePersonnelNumberChange = (e) => {
    let value = e.target.value;
  
    setFormData((prevData) => ({
      ...prevData,
      personnelNumberInput: value,
      personnelNumber: "PN-" + value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')

    const { personnelNumber, birthdate, password, passwordConfirmation } = formData;

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    if(password.length < 8 || !passwordRegex.test(passwordConfirmation)) {
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
          // first_name: firstName,
          personnel_number: personnelNumber,
          birthdate: birthdate,
          token: token, 
          email: email, 
          password: password, 
          password_confirmation: passwordConfirmation
        })
      });

      if(!res.ok) {
        if (res.status === 400) {
          setError("Reset link is not valid.");
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
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="" className="w-100 h-28" />
          <h2 className="text-center text-2xl font-bold mt-4">Reset Your Password</h2>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form className="space-y-6 px-2" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className='text-sm'>Personnel Number</label>
              <div className="relative">
                <div className="flex items-center border rounded-md border-black overflow-hidden">
                  <span className="bg-gray-100 p-2">PN-</span>
                  <input
                      type="text"
                      name="personnelNumberInput"
                      placeholder="Personnel Number"
                      value={formData.personnelNumberInput}
                      onChange={(e) => handlePersonnelNumberChange(e)}
                      className="flex-1 p-2 border-l border-black focus:outline-none"
                      maxLength="7"
                      minLength="7"
                      required
                  />
                </div>
              </div>
            </div>
            <div>
              <label className='text-sm'>Birthdate</label>
              <input
                name="birthdate"
                type="date"
                className="appearance-none rounded-md w-full px-3 py-2 border border-black text-black focus:outline-none"
                placeholder="Birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='text-sm'>New Password</label>
              <input
                name="password"
                type="password"
                className="appearance-none rounded-md w-full px-3 py-2 border border-black text-gray-900 focus:outline-none sm:text-sm"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className='text-sm'>Confirm New Password</label>
              <input
                name="passwordConfirmation"
                type="password"
                className="appearance-none rounded-md w-full px-3 py-2 border border-black text-gray-900 focus:outline-none sm:text-sm"
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
