import React, { useState, useEffect } from 'react';

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
  const [displayDate, setDisplayDate] = useState(''); // State for selected date

  useEffect(() => {
    const currentDate = new Date();
    
    // Format the date as YYYY-MM-DD for the input field
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Format the date as Month Day, Year for display
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const displayFormattedDate = currentDate.toLocaleDateString('en-US', options);

    setNewFinding((prev) => ({ ...prev, dateConsulted: formattedDate }));
    setDisplayDate(displayFormattedDate);

    if (patient) {
      setFindings(patient.opdFindings);
    }
  }, [patient]);

  const handleAddFinding = () => {
    if (newFinding.presumption && newFinding.dateConsulted) {
      saveFinding(); // Directly save the finding
    } else {
      alert('Please fill out the required fields.');
    }
  };

  const saveFinding = () => {
    const updatedFinding = {
      ...newFinding,
      patientId: patient.id, // Add patient ID to the new finding
    };

    // POST request to add the new finding to the server
    fetch(`http://localhost:8000/patients/${patient.id}`, {
      method: 'PATCH', // Use PATCH to update the existing patient record
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        opdFindings: [...findings, updatedFinding], // Append new finding to the existing ones
      }),
    })
    .then(response => response.json())
    .then(updatedPatient => {
      setFindings(updatedPatient.opdFindings); // Update local state with the new findings
      // Reset newFinding and hide the form
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
    })
    .catch(error => console.error('Error updating patient findings:', error));
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
            <p>Physician: <span className="font-medium">{patient.physician}</span></p>
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
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                onClick={handleCancelNewFinding}
                className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          )}
          <ul className="mt-4">
            {findings.length > 0 ? (
              findings.map((finding, index) => (
                <li key={index} className="p-2 border-b">
                  <h3 className="font-semibold">{finding.presumption} - {finding.dateConsulted}</h3>
                  <p>Diagnosis: {finding.diagnosis}</p>
                  <p>Medication: {finding.medication}</p>
                  <p>Advice: {finding.advice}</p>
                </li>
              ))
            ) : (
              <li>No findings recorded for this patient.</li>
            )}
          </ul>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-4 bg-gray-300 text-black px-4 py-2 rounded">
        Close
      </button>
    </div>
  );
};

export default PatientDetails;
