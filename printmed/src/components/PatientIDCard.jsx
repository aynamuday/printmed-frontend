import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import hospital from '../assets/images/bg-hospital.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PatientIDCard = () => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const navigate = useNavigate();

  // Dummy patient data
  const dummyData = {
    photo: "https://via.placeholder.com/100", // Replace with the real image
    qr_code_data: "https://dummy-qr-code-data.com/12345678910", // Default until API is called
    name: "LUMAOANG, SALMA FAE",
    patient_number: "12345678910",
    birthdate: "AUGUST 09, 2002",
    sex: "FEMALE",
    address: "BLK 17 LOT 23 SILCAS SOUTHWOODS, BIÑAN, LAGUNA 4024",
    valid_until: "AUGUST 9, 2027",
  };

  const {
    photo,
    qr_code_data,
    name,
    patient_number,
    birthdate,
    sex,
    address,
    valid_until,
  } = dummyData;

  // Use an effect to fetch the QR code data from API (or use dummy data)
  useEffect(() => {
    // Fetch QR code data from your API
    const fetchQrCode = async () => {
      try {
        const response = await fetch(""); // Replace with your API
        const data = await response.json();
        setQrCodeData(data.qr_code_data); // Assuming the API response has qr_code_data
      } catch (error) {
        console.error("Error fetching QR code:", error);
        setQrCodeData(qr_code_data); // Fallback to the default QR code if the API fails
      }
    };

    fetchQrCode();
  }, [qr_code_data]); // This will only run once when the component mounts

  const backgroundStyle = {
    backgroundImage: `url(${hospital})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '30vh',
  };

  // Handle print functionality
  const handlePrint = () => {
    // Hide the print button when printing
    document.querySelector('#print-button').style.display = 'none';
    window.print();
    setTimeout(() => {
      document.querySelector('#print-button').style.display = 'inline-block';
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center">
            {/* Back Button */}
            <button 
                onClick={() => navigate("/patients/:id")} 
                className="mr-4">
                <i className="bi bi-arrow-left text-xl"></i>
            </button>

            {/* Print Button */}
            <button
                id="print-button"
                onClick={handlePrint}
                className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <i className="fas fa-print">Print</i>
            </button>
      </div>
      {/* FRONT SIDE */}
      <div style={backgroundStyle} className="relative w-[3.375in] h-[2.125in] border border-black overflow-hidden rounded-md bg-white">
        {/* Logo */}
        <div className="flex justify-center items-center mt-1">
          <img src={logo} className="h-7" alt="Logo" />
        </div>
        {/* Title */}
        <div className="w-full bg-[#B43C3A] text-white text-center font-bold text-[10px] py-1">
          PATIENT IDENTIFICATION CARD
        </div>
        {/* Information Section */}
        <div className="grid grid-cols-3 gap-2 px-2 py-2 rounded-md mt-1 bg-white w-[95%] h-[65%] mx-auto">
          {/* Left Section (Photo) */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-[1in] h-[1in]">
              <img
                src={photo}
                alt="Patient"
                className="w-full h-full rounded object-cover"
              />
            </div>
            <p className="text-[6px] italic">Valid Until: {valid_until}</p>
          </div>
          {/* Center Section (Details) */}
          <div className="flex flex-col gap-1 text-[6px]">
            <div>
              <p>Patient Number</p>
              <p className="font-bold text-[8px]">{patient_number}</p>
            </div>
            <div>
              <p>Name</p>
              <p className="font-bold text-[8px]">{name}</p>
            </div>
            <div>
              <p>Address</p>
              <p className="font-bold text-[8px]">{address}</p>
            </div>
          </div>
          {/* Right Section (QR + Details) */}
          <div className="flex flex-col items-center gap-1">
            <div>
              <p className="text-[6px]">Birthdate</p>
              <p className="font-bold text-[8px]">{birthdate}</p>
              <p className="text-[6px]">Sex</p>
              <p className="font-bold text-[8px]">{sex}</p>
            </div>
            <div>
              {/* Only render QR code if qrCodeData is available */}
              {qrCodeData ? (
                <QRCodeCanvas
                  value={qrCodeData}
                  size={60}
                  className="w-full h-full"
                />
              ) : (
                <p>Loading QR Code...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div style={backgroundStyle} className="relative w-[3.375in] h-[2.125in] border border-black overflow-hidden rounded-md bg-white">
        {/* Logo */}
        <div className="flex justify-center items-center mt-1">
          <img src={logo} className="h-7" alt="Logo" />
        </div>
        {/* Title */}
        <div className="w-full bg-[#B43C3A] text-white text-center font-bold text-[10px] py-1">
          IN CASE OF LOSS
        </div>
        {/* Information Section */}
        <div className="flex flex-col items-center text-center text-[7px] px-3 py-3 gap-3 rounded-md mt-1 bg-white w-[95%] h-[65%] mx-auto">
          <p>
            If this ID is lost or stolen, please immediately report it to the
            hospital's registration desk or contact our support team to
            deactivate and reissue your ID.
          </p>
          <p>
            <span className="font-bold">Phone:</span> (02) 1234-5678
          </p>
          <p>
            <span className="font-bold">Email:</span> support@carmonamedical.com
          </p>
          <p className="italic text-[6px]">
            This QR code is used exclusively for accessing the patient’s record
            within the Patient Management Record System. Unauthorized use of
            this QR code is prohibited and may result in legal action.
          </p>
        </div>
      </div>

      {/* Print-specific CSS */}
      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background-color: white;
            font-family: Arial, sans-serif;
          }

          #print-button {
            display: none; /* Hide the print button during printing */
          }

          .flex {
            display: flex !important; /* Ensure flex elements are correctly displayed */
          }

          .gap-4 {
            gap: 10px !important; /* Adjust gap for print */
          }

          /* Maintain same layout, avoid drastic changes */
          .w-[3.375in] {
            width: 3.375in !important;
          }
          .h-[2.125in] {
            height: 2.125in !important;
          }

          /* Maintain text size */
          .text-[6px] {
            font-size: 8px !important;
          }

          /* Adjust grid styles for printing */
          .grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 0.5rem !important;
          }

          .w-[95%] {
            width: 95% !important;
          }

          .rounded-md {
            border-radius: 0.375rem !important; /* Keep rounded corners */
          }

          /* Ensure background and title appear in print */
          .relative {
            background-image: url(${hospital}) !important; /* Use background image */
            background-size: cover !important; /* Cover the full area */
            background-position: center !important; /* Center the background */
          }

          .bg-[#B43C3A] {
            background-color: #B43C3A !important; /* Keep the background color for the title */
          }
        }
      `}</style>
    </div>
  );
};

export default PatientIDCard;
