import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import bgBuilding from "../assets/images/bg_building_2.png";

const LandingPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgBuilding})` }}
    >
      {/* <div className="absolute inset-0 bg-black opacity-25"></div> */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center z-10">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-30" />
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
