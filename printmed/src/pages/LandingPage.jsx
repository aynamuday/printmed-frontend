import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import bgBuilding from "../assets/images/bg-building.png";

const LandingPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgBuilding})` }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
        <img src={logo} alt="Logo" className="mx-auto mb-6 w-30" />
        <h1 className="text-lg font-semibold italic mb-4">
          Please select your destination
        </h1>
        <div className="space-y-4">
          {/* Button for OPD Personnel */}
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#B43C3A] text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            OPD Personnel
          </button>
          {/* Button for Patient Registration */}
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-[#6CB6AD] text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Patient Registration
          </button>
        </div>
        <p className="text-sm font-semibold text-gray-600 mt-6">
          New to Carmona Hospital and Medical Center’s Outpatient Department?
        </p>
        <p className="text-sm text-gray-600">
          Register to avoid queues or contact identification card for a
          seamless healthcare experience!
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
