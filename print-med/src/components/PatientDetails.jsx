import React, { useState, useEffect } from 'react';
import opdFindings from '../data/opdFindings.json';

const PatientDetails = ({ patient, onClose }) => {
  useEffect(() => {

    // Load findings for the selected patient
    const patientFindings = opdFindings.find(finding => finding.patientId === patient.id);
    if (patientFindings) {
      setFindings(patientFindings.findings);
    }
  }, [patient]);

  const handleAddFinding = () => {
    if (newFinding.presumption && newFinding.dateConsulted) {
      setFindings([...findings, newFinding]);
      setNewFinding({ presumption: '', dateConsulted: '' }); // Reset new finding input
    } else {
      alert('Please fill out both fields.');
    }
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
            <div className="grid grid-cols-2 gap-4 bg-red-500">
              <h2 className="text-lg font-semibold">OPD Findings</h2>
              <button
                className="bg-blue-500 text-black px-2 py-1 rounded ml-2"
                onClick={handleAddFinding}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            <div className="mt-2">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border">Presumption</th>
                    <th className="py-2 px-4 border">Date Consulted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4">
                      <a href="findings.html" className="text-blue-600">Migraine</a>
                    </td>
                    <td className="py-2 px-4">08-09-2021</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    );
  };

  export default PatientDetails;