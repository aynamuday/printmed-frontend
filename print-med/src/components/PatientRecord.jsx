import React, { useState } from 'react';
import PatientDetails from '../components/PatientDetails';

const PatientRecord = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [patientToView, setPatientToView] = useState(null);
  const [password, setPassword] = useState('');

  const patients = [
    { id: '001', name: 'John Doe', age: 20, dateCheck: '08/25/24' },
    { id: '002', name: 'Jane Smith', age: 15, dateCheck: '06/15/2024' },
    { id: '003', name: 'Alex Johnson', age: 25, dateCheck: '02/10/24' },
    { id: '004', name: 'Emily Davis', age: 32, dateCheck: '08/09/2024' },
  ];

  const [patientList, setPatientList] = useState(patients);

  // Password verification function for viewing details
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

  // Fingerprint verification for deleting records
  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const verifyFingerprint = () => {
    const isVerified = window.confirm("Simulating: Is the fingerprint scan successful?");
    return isVerified;
  };

  const handleConfirmDelete = () => {
    if (verifyFingerprint()) {
      setPatientList(patientList.filter(patient => patient.id !== patientToDelete.id));
      setShowDeleteModal(false);
      setPatientToDelete(null);
      alert("Patient record deleted successfully.");
    } else {
      alert("Fingerprint verification failed. Record not deleted.");
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPatientToDelete(null);
  };

  return (
    <div className="w-full mr-10 md:w-[75%] md:ml-[25%]">
      <h2 className="text-2xl mb-4 mt-4">Patient Records</h2>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Patient No.</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Age</th>
            <th className="py-2 px-4 border">Date Check</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {patientList.map((patient) => (
            <tr key={patient.id} className="border-b">
              <td className="py-2 px-4">{patient.id}</td>
              <td className="py-2 px-4">{patient.name}</td>
              <td className="py-2 px-4">{patient.age}</td>
              <td className="py-2 px-4">{patient.dateCheck}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleView(patient)}
                >
                  View
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteClick(patient)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <PatientDetails patient={selectedPatient} onClose={handleClose} />
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
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
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
