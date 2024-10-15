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

  useEffect(() => {
    const patientFindings = opdFindings.find(finding => finding.patientId === patient.id);
    if (patientFindings) {
      setFindings(patientFindings.findings);
    }
  }, [patient]);

  const handleAddFinding = () => {
    if (newFinding.presumption && newFinding.dateConsulted) {
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
    } else {
      alert('Please fill out the required fields.');
    }
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
              onClick={() => setShowForm(!showForm)}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
          {showForm && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <h3 className="text-lg font-semibold">Add New Finding</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
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
                  <label className="block mb-1">Date Consulted:</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.dateConsulted}
                    onChange={(e) => setNewFinding({ ...newFinding, dateConsulted: e.target.value })}
                    required
                  />
                </div>
                {/* Other input fields */}
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
                  <label className="block mb-1">Diagnosis:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.diagnosis}
                    onChange={(e) => setNewFinding({ ...newFinding, diagnosis: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1">Medication:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.medication}
                    onChange={(e) => setNewFinding({ ...newFinding, medication: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1">Advice:</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newFinding.advice}
                    onChange={(e) => setNewFinding({ ...newFinding, advice: e.target.value })}
                  />
                </div>
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
