import React, { useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Reset Password
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: 'Email is required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/forget-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setStep(2);
      } else {
        setErrors({ email: data.error || 'Failed to send OTP.' });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ email: 'An error occurred. Please try again later.' });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!otp) {
      setErrors({ otp: 'OTP is required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setStep(3);
      } else {
        setErrors({ otp: data.error || 'Invalid OTP.' });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ otp: 'An error occurred. Please try again later.' });
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!newPassword) {
      setErrors({ newPassword: 'New password is required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('Password reset successful! You can now log in.');
        window.location.href = '/login'; // Redirect to login
      } else {
        setErrors({ newPassword: data.error || 'Failed to reset password.' });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ newPassword: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
            <img src={logo} alt="" className="w-100 h-28" />   
          <h2 className="text-center text-2xl font-bold mt-4">Forgot Password</h2>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpSubmit : handlePasswordReset}
        >
          {step === 1 && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="OTP"
                required
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            </div>
          )}

          {step === 3 && (
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Enter new password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none rounded-md w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="New Password"
                required
              />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? (
              <ScaleLoader color="#ffffff" height={20} width={5} radius={2} margin={2} />
            ) : step === 1 ? (
              'Send OTP'
            ) : step === 2 ? (
              'Verify OTP'
            ) : (
              'Reset Password'
            )}
          </button>
          <button
              onClick={() => navigate('/login')}
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 mt-4 w-full flex justify-center"
            >
              Login
            </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
