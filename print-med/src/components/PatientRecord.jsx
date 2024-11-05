import React, { useState, useContext } from 'react';
import AppContext from '../context/AppContext';

const PatientRecord = () => {
  const { user } = useContext(AppContext); // Access user from AppContext
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);

  // Proxy data for patients
  const patientList = [
    {
      id: 1,
      firstName: 'Salma',
      middleName: 'Fae',
      lastName: 'Lumaogang',
      suffix: 'A.',
      birthday: '2003-08-09',
      address: 'Blk 17 Lot 23 Silcas Southwoods Laguna City',
      birthplace: 'Parańaque City',
      civilStatus: 'Married',
      gender: 'Female',
      religion: 'Catholic',
      phoneNumber: '09217376109',
      findings: [
        {
          presumption: 'Migraine',
          dateConsulted: '2020-08-09',
          details: {
            bloodPressure: '80/120',
            temperature: '38°C',
            weight: '50 kg',
            height: "5'5\"",
            diagnosis: 'Vomiting and sudden pass out',
            medication: 'Medicol 500 mg every 6 hours',
            advice: 'Avoid exposure to light, drink more water',
            otherComplaints: 'N/A',
            physician: 'Dr. Wilhelmina Lopez',
            paymentAmount: '₱ 1000.00',
          },
        },
        {
          presumption: 'Flu',
          dateConsulted: '2020-10-15',
          details: {
            bloodPressure: '120/80',
            temperature: '37.5°C',
            weight: '55 kg',
            height: "5'6\"",
            diagnosis: 'Sore throat and fever',
            medication: 'Paracetamol 500 mg every 6 hours',
            advice: 'Rest and drink plenty of fluids',
            otherComplaints: 'N/A',
            physician: 'Dr. John Doe',
            paymentAmount: '₱ 500.00',
          },
        },
      ],
    },
    // Additional patients can be added here
  ];

  const handleView = (patient) => {
    setSelectedPatient(patient); // Select patient without password verification
  };

  const handleFindingClick = (finding) => {
    setSelectedFinding(finding); // Show specific OPD finding details
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setSelectedFinding(null);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-section').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to reset the content
  };

  return (
    <div className="w-full mr-10 md:w-[75%] md:ml-[25%]">
      <div className="grid grid-cols-2 gap-4 mt-10">
        {!selectedPatient ? (
          <>
            <h2 className="text-2xl mb-4 mt-4">Patient Records</h2>
            <div className="flex items-center rounded-md px-4 duration-300 cursor-pointer bg-[#D9D9D9] w-[90%] h-[80%]">
              <i className="bi bi-search text-sm"></i>
              <input
                className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
                placeholder="Search"
              />
            </div>
          </>
        ) : (
          <h2 className="text-2xl mb-4 mt-4">Patient No. {selectedPatient.id}</h2>
        )}
      </div>

      <div className="w-full flex flex-col items-center mt-10">
        {!selectedPatient ? (
          // Patient List Table
          <table className="min-w-[90%] bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Patient No.</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Birthday</th>
                <th className="py-2 px-4 border">Sex</th>
                <th className="py-2 px-4 border">Physician</th>
                <th className="py-2 px-4 border">Last Visit</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {patientList.map((patient) => (
                <tr key={patient.id} className="border-b">
                  <td className="py-2 px-4">{patient.id}</td>
                  <td className="py-2 px-4">{`${patient.firstName} ${patient.middleName} ${patient.lastName} ${patient.suffix}`}</td>
                  <td className="py-2 px-4">{patient.birthday}</td>
                  <td className="py-2 px-4">{patient.gender}</td>
                  <td className="py-2 px-4">{patient.findings[0]?.details.physician || 'N/A'}</td>
                  <td className="py-2 px-4">N/A</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleView(patient)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Patient Details and OPD Findings Display
          <div className="flex w-3/4 bg-white shadow rounded-lg">
            {/* Patient Details Section */}
            <div className="w-1/2 p-4 border-r">
              <h3 className="text-xl font-semibold mb-2 bg-[#B43C3A] text-white">Details</h3>
              <p><strong>Name:</strong> {`${selectedPatient.firstName} ${selectedPatient.middleName} ${selectedPatient.lastName} ${selectedPatient.suffix}`}</p>
              <p><strong>Age:</strong> {new Date().getFullYear() - new Date(selectedPatient.birthday).getFullYear()}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Birthday:</strong> {selectedPatient.birthday}</p>
              <p><strong>Birthplace:</strong> {selectedPatient.birthplace}</p>
              <p><strong>Civil Status:</strong> {selectedPatient.civilStatus}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Religion:</strong> {selectedPatient.religion}</p>
              <p><strong>Phone Number:</strong> {selectedPatient.phoneNumber}</p>
            </div>

            {/* OPD Findings Section */}
            <div className="w-1/2 p-4">
            <div className="flex justify-between items-center mb-2 bg-[#B43C3A] text-white">
              <h3 className="text-xl font-semibold ">OPD Findings</h3>
              <button 
                className="text-white" 
                onClick={handlePrint} 
                aria-label="Print"
              >
                <i className="bi bi-printer text-xl"></i> {/* Adjust the size of the icon here */}
              </button>
            </div>
            {selectedFinding ? (
              <div id="print-section">
                <p><strong>History of Illness:</strong> {selectedFinding.presumption}</p>
                <p><strong>Blood Pressure:</strong> {selectedFinding.details.bloodPressure}</p>
                <p><strong>Temperature:</strong> {selectedFinding.details.temperature}</p>
                <p><strong>Weight:</strong> {selectedFinding.details.weight}</p>
                <p><strong>Height:</strong> {selectedFinding.details.height}</p>
                <p><strong>Diagnosis:</strong> {selectedFinding.details.diagnosis}</p>
                <p><strong>Medication:</strong> {selectedFinding.details.medication}</p>
                <p><strong>Advice:</strong> {selectedFinding.details.advice}</p>
                <p><strong>Other Complaints:</strong> {selectedFinding.details.otherComplaints}</p>
                <p><strong>Physician:</strong> {selectedFinding.details.physician}</p>
                <p><strong>Date Consulted:</strong> {selectedFinding.dateConsulted}</p>
                <p><strong>Payment Amount:</strong> {selectedFinding.details.paymentAmount}</p>
                <button
                  className="bg-gray-300 px-4 py-2 rounded mt-4"
                  onClick={() => setSelectedFinding(null)}
                >
                  Back to Findings
                </button>
              </div>
              ) : (
                <>
                  <div className="flex items-center rounded-md px-4 duration-300 cursor-pointer bg-[#D9D9D9] mb-4 h-10">
                    <i className="bi bi-search text-sm"></i>
                    <input
                      className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
                      placeholder="Search OPD Findings"
                    />
                  </div>
                  <table className="min-w-full bg-white shadow rounded-lg">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4 border">History of Illness</th>
                        <th className="py-2 px-4 border">Date Consulted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatient.findings.map((finding, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4">
                            <button
                              className="text-blue-500 underline"
                              onClick={() => handleFindingClick(finding)}
                            >
                              {finding.presumption}
                            </button>
                          </td>
                          <td className="py-2 px-4">{finding.dateConsulted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <button
                className="bg-gray-300 px-4 py-2 rounded mt-4"
                onClick={handleClose}
              >
                Close Patient Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecord;
