import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import bgBuilding from "../assets/images/bg_building_2.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${bgBuilding})` }}
    >
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg text-center z-10">
        <img src={logo} alt="Logo" className="h-20 sm:h-24 md:h-28 lg:h-32 max-w-full object-contain mb-5" />
        <h1 className="text-lg font-semibold mb-4">
          Please select your destination
        </h1>
        <div className="space-y-4">
          {/* Button for OPD Personnel */}
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-[#B43C3A] transition"
          >
            Outpatient Department Staff
          </button>
          {/* Button for Patient Registration */}
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-[#1da796] text-white py-2 rounded-md hover:bg-[#248176] transition"
          >
            Patient Registration
          </button>
        </div>
        <p className="text-sm italic font-semibold mt-6 w-[90%] mx-auto mb-1">
          New patient to Carmona Hospital and Medical Center’s Outpatient Department?
        </p>
        <p className="text-sm italic w-[90%] text-center mx-auto font-light">
        Register today and claim your official Identification Card for a seamless healthcare experience!
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
