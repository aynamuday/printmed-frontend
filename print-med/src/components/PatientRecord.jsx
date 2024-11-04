import React, { useState, useContext } from 'react';
import PatientDetails from '../components/PatientDetails';
import patientsName from '../data/patientsName.json';
import opdFindings from '../data/opdFindings.json'; // Importing the opdFindings data
import AppContext from '../context/AppContext'; // Import AppContext

const PatientRecord = () => {
  const { user } = useContext(AppContext); // Access user from AppContext
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [patientToView, setPatientToView] = useState(null);
  const [patientList] = useState(patientsName.patients);

  const handleView = (patient) => {
    setPatientToView(patient);
    setShowPasswordModal(true); // Show password modal
  };

  const verifyPassword = () => {
    if (password === user.password) { // Use user password from AppContext
      setSelectedPatient(patientToView); // Select patient after successful password verification
      setShowPasswordModal(false);
      setPassword(''); // Reset password field
    } else {
      alert('Incorrect password!');
    }
  };

  const handleFindingClick = (finding) => {
    setSelectedFinding(finding); // Show specific OPD finding details
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setSelectedFinding(null);
  };

  const getPatientFindings = (patientId) => {
    const patientFindings = opdFindings.find((entry) => entry.patientId === patientId);
    return patientFindings ? patientFindings.findings : [];
  };

  return (
    <div className="w-full mr-10 md:w-[75%] md:ml-[25%]">
      <div className="grid grid-cols-2 gap-4 mt-10">
        <h2 className="text-2xl mb-4 mt-4">Patient Records</h2>
        <div className="flex items-center rounded-md px-4 duration-300 cursor-pointer bg-[#D9D9D9] w-[90%] h-[80%]">
          <i className="bi bi-search text-sm"></i>
          <input
            className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Conditional Rendering: Show patient records, patient details or OPD finding details */}
      {selectedFinding ? (
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-xl mb-4">OPD Finding Details</h3>
          <p><strong>Presumption:</strong> {selectedFinding.presumption}</p>
          <p><strong>Date Consulted:</strong> {selectedFinding.dateConsulted}</p>
          <p><strong>Blood Pressure:</strong> {selectedFinding.details.bloodPressure}</p>
          <p><strong>Temperature:</strong> {selectedFinding.details.temperature}</p>
          <p><strong>Weight:</strong> {selectedFinding.details.weight}</p>
          <p><strong>Height:</strong> {selectedFinding.details.height}</p>
          <p><strong>Diagnosis:</strong> {selectedFinding.details.diagnosis}</p>
          <p><strong>Medication:</strong> {selectedFinding.details.medication}</p>
          <p><strong>Advice:</strong> {selectedFinding.details.advice}</p>
          <p><strong>Physician:</strong> {selectedFinding.details.physician}</p>
          <p><strong>Payment Amount:</strong> {selectedFinding.details.paymentAmount}</p>
          <button
            className="bg-gray-300 px-4 py-2 rounded mt-4"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      ) : selectedPatient ? (
        <div className="bg-white p-4 shadow rounded-lg">
          <PatientDetails patient={selectedPatient} onClose={handleClose} />
          <ul>
            {getPatientFindings(selectedPatient.id).map((finding, index) => (
              <li key={index} className="mb-2">
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleFindingClick(finding)}
                >
                  {finding.presumption} - {finding.dateConsulted}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <table className="min-w-[95%] bg-white shadow rounded-lg">
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
                <td className="py-2 px-4">{patient.sex}</td>
                <td className="py-2 px-4">{patient.physician}</td>
                <td className="py-2 px-4">N/A</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleView(patient)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Password Modal for Viewing Details */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-xl mb-4">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Enter your password"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={verifyPassword}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecord;
