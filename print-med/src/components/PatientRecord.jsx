import React, { useState } from 'react';
import PatientDetails from '../components/PatientDetails';
import patientsName from '../data/patientsName.json';

const PatientRecord = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [patientToView, setPatientToView] = useState(null);
  const [password, setPassword] = useState('');

  const [patientList, setPatientList] = useState(patientsName.patients);

  const handleView = (patient) => {
    setPatientToView(patient);
    setShowPasswordModal(true);
  };

  const verifyPassword = () => {
    if (password === 'admin') {
      setSelectedPatient(patientToView);
      setShowPasswordModal(false);
      setPassword(''); // Reset password field after verification
    } else {
      alert('Incorrect password!');
    }
  };

  const handleClose = () => {
    setSelectedPatient(null);
  };

  const verifyFingerprint = () => {
    const isVerified = window.confirm("Simulating: Is the fingerprint scan successful?");
    return isVerified;
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

      {/* Conditional Rendering: Show patient records or details */}
      {selectedPatient ? (
        <PatientDetails patient={selectedPatient} onClose={handleClose} />
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
                <td className="py-2 px-4">N/A</td>
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
              placeholder="Enter admin password"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-xl mb-4">Fingerprint Verification</h2>
            <p>Place your finger on the scanner to verify your identity.</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handleCancelDelete}
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
