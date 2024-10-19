import React, { useState, useEffect } from 'react';
import opdFindings from '../data/opdFindings.json';

const PatientDetails = ({ patient, onClose }) => {
  const [findings, setFindings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFinding, setNewFinding] = useState({
    presumption: '',
    dateConsulted: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    height: '',
    diagnosis: '',
    medication: '',
    advice: '',
    physician: '',
    paymentAmount: '',
  });
  const [selectedFinding, setSelectedFinding] = useState(null); // State for selected finding
  const [displayDate, setDisplayDate] = useState('');//State for selected date
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    
    // Format the date as YYYY-MM-DD for the input field
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Format the date as Month Day, Year for display
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const displayFormattedDate = currentDate.toLocaleDateString('en-US', options);

    setNewFinding((prev) => ({ ...prev, dateConsulted: formattedDate }));
    setDisplayDate(displayFormattedDate);

    const patientFindings = opdFindings.find(finding => finding.patientId === patient.id);
    if (patientFindings) {
      setFindings(patientFindings.findings);
    }
  }, [patient]);


  const handleAddFinding = () => {
    if (newFinding.presumption && newFinding.dateConsulted) {
      // Show the fingerprint modal for verification
      setShowFingerprintModal(true);
    } else {
      alert('Please fill out the required fields.');
    }
  };

  const handleFingerprintVerification = () => {
    // Simulate fingerprint verification
    const success = true; // Replace this with real fingerprint verification logic

    if (success) {
      saveFinding(); // Save finding if fingerprint is verified
    } else {
      alert('Fingerprint verification failed.');
    }
    setShowFingerprintModal(false);
  };

  const saveFinding = () => {
    const updatedFindings = [...findings, newFinding];
    setFindings(updatedFindings);
    setNewFinding({
      presumption: '',
      dateConsulted: '',
      bloodPressure: '',
      temperature: '',
      weight: '',
      height: '',
      diagnosis: '',
      medication: '',
      advice: '',
      physician: '',
      paymentAmount: '',
    });
    setShowForm(false);
  };

  const handleSelectFinding = (finding) => {
    setSelectedFinding(finding);
  };

  const handlePrintFinding = () => {
    const printContent = document.getElementById('findingDetails');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>OPD Finding</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h2 { color: #333; }
          .detail { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h2>OPD Finding Details</h2>
        <div>${printContent.innerHTML}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCloseFinding = () => {
    setSelectedFinding(null); // Clear selected finding
  };
  
  const handleCancelNewFinding = () => {
    setShowForm(false);
    setNewFinding({
      presumption: '',
      dateConsulted: '',
      bloodPressure: '',
      temperature: '',
      weight: '',
      height: '',
      diagnosis: '',
      medication: '',
      advice: '',
      physician: '',
      paymentAmount: '',
    });
  };

  return (
    <div className="mt-4 p-4 bg-white shadow-lg rounded">
      <h1 className="text-xl font-bold">Patient No. {patient.id}</h1>
      <div className="flex justify-between mt-4">
        
        <div className="w-1/2">
          <h2 className="text-lg font-semibold">Details</h2>
          <div className="mt-2">
            <p>Name: <span className="font-medium">{`${patient.firstName} ${patient.middleName} ${patient.lastName}`}</span></p>
            <p>Sex: <span className="font-medium">{patient.sex}</span></p>
            <p>Address: <span className="font-medium">{patient.address}</span></p>
            <p>Birthday: <span className="font-medium">{patient.birthday}</span></p>
            <p>Civil Status: <span className="font-medium">{patient.civilStatus}</span></p>
            <p>Religion: <span className="font-medium">{patient.religion}</span></p>
            <p>Mobile Number: <span className="font-medium">{patient.phoneNumber}</span></p>
          </div>
        </div>

        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-4 bg-red-500 p-2">
            <h2 className="text-lg font-semibold text-white">OPD Findings</h2>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => setShowForm(!showForm)}>
              <i className="bi bi-plus"></i>
            </button>
          </div>
          {showForm && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <h3 className="text-lg font-semibold">Add New Finding</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-1">Physician:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.physician}
                    onChange={(e) => setNewFinding({ ...newFinding, physician: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1">Date Consulted:</label>
                  <p>{displayDate}</p>
                </div>
                <div>
                  <label className="block mb-1">Presumption:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.presumption}
                    onChange={(e) => setNewFinding({ ...newFinding, presumption: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Blood Pressure:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.bloodPressure}
                    onChange={(e) => setNewFinding({ ...newFinding, bloodPressure: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1">Temperature:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.temperature}
                    onChange={(e) => setNewFinding({ ...newFinding, temperature: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1">Weight:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.weight}
                    onChange={(e) => setNewFinding({ ...newFinding, weight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1">Height:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.height}
                    onChange={(e) => setNewFinding({ ...newFinding, height: e.target.value })}
                  />
                </div>

                <div>
                </div>
                <div>
                  <label className="block mb-1">Diagnosis:</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded resize-y"
                    rows="3"
                    value={newFinding.diagnosis}
                    onChange={(e) => setNewFinding({ ...newFinding, diagnosis: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1">Medication:</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded resize-y"
                    rows="3"
                    value={newFinding.medication}
                    onChange={(e) => setNewFinding({ ...newFinding, medication: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-1">Advice:</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded resize-y"
                    rows="3"
                    value={newFinding.advice}
                    onChange={(e) => setNewFinding({ ...newFinding, advice: e.target.value })}
                  />
                </div>

                <div>
                </div>

                <div>
                  <label className="block mb-1">Payment Amount:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.paymentAmount}
                    onChange={(e) => setNewFinding({ ...newFinding, paymentAmount: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={handleAddFinding}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Finding
              </button>
              <button
                onClick={handleCancelNewFinding}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          )}
          
          {/* Modal for fingerprint verification */}
          {showFingerprintModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-4 rounded shadow-lg">
                <h3 className="text-lg font-semibold">Confirm with Fingerprint</h3>
                <p>Please scan the patient's fingerprint to confirm the new OPD finding.</p>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleFingerprintVerification} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                      Verify Fingerprint
                  </button>
                  <button
                    onClick={() => setShowFingerprintModal(false)}
                    className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
                    >
                      Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/*Lists of OPD Findings of a specific patient*/}
          <div className="mt-2">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left p-2">Presumption</th>
                  <th className="text-left p-2">Date Consulted</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((finding, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{finding.presumption}</td>
                    <td className="p-2">{finding.dateConsulted}</td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 underline"
                        onClick={() => handleSelectFinding(finding)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*Showed if the user wants to print a specific opd finding of a patient*/}
          {selectedFinding && (
            <div id="findingDetails" className="mt-4 p-4 border rounded bg-gray-100">
              <h3 className="text-lg font-semibold">Finding Details</h3>
              <p>Presumption: <strong>{selectedFinding.presumption}</strong></p>
              <p>Date Consulted: <strong>{selectedFinding.dateConsulted}</strong></p>
              <p>Blood Pressure: <strong>{selectedFinding.bloodPressure}</strong></p>
              <p>Temperature: <strong>{selectedFinding.temperature}</strong></p>
              <p>Weight: <strong>{selectedFinding.weight}</strong></p>
              <p>Height: <strong>{selectedFinding.height}</strong></p>
              <p>Diagnosis: <strong>{selectedFinding.diagnosis}</strong></p>
              <p>Medication: <strong>{selectedFinding.medication}</strong></p>
              <p>Advice: <strong>{selectedFinding.advice}</strong></p>
              <p>Physician: <strong>{selectedFinding.physician}</strong></p>
              <p>Payment Amount: <strong>{selectedFinding.paymentAmount}</strong></p>
              <button
                onClick={handlePrintFinding}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Print Finding
              </button>
              <button
                onClick={handleCloseFinding}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          )}

        </div>
      </div>
      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default PatientDetails;
