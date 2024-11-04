import React, { useState } from 'react';

const AddFindingForm = ({
  newFinding,
  setNewFinding,
  onAddFinding, // Function for submitting the new finding
  onCancel,
  displayDate,
  showForm,
  setShowForm,
  patientId, // ID of the patient to update
  existingFindings // Existing findings of the patient
}) => {
  // Handle input changes for each form field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFinding((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFinding = async () => {
    try {
      // Make a PATCH request to update the specific patient's opdFindings array
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opdFindings: [...existingFindings, newFinding], // Append new finding to the opdFindings array
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update patient data');
      }

      const updatedPatient = await response.json();
      console.log('Patient updated successfully:', updatedPatient);

      // Clear form and hide it after successful submission
      setShowForm(false);
      setNewFinding({}); // Reset form fields
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      {/* Header with "OPD Findings" and "+" button */}
      <div className="flex justify-between items-center bg-red-500 text-white px-4 py-2 rounded-t-md">
        <h2 className="text-lg font-semibold">OPD Findings</h2>
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-plus"></i> {/* Add icon for plus */}
        </button>
      </div>

      {/* Table Header */}
      <div className="bg-white border border-t-0 rounded-b-md">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presumption</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Consulted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Table rows should go here */}
          </tbody>
        </table>
      </div>

      {/* Toggleable Form */}
      {showForm && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">Add New Finding</h3>
          <p>Date Consulted: <span className="font-medium">{displayDate}</span></p>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Presumption</label>
              <input
                type="text"
                name="presumption"
                value={newFinding.presumption}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
              <input
                type="text"
                name="bloodPressure"
                value={newFinding.bloodPressure}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={newFinding.temperature}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={newFinding.weight}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={newFinding.height}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={newFinding.diagnosis}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Medication</label>
              <textarea
                name="medication"
                value={newFinding.medication}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Advice</label>
              <textarea
                name="advice"
                value={newFinding.advice}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Physician</label>
              <input
                type="text"
                name="physician"
                value={newFinding.physician}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
              <input
                type="number"
                name="paymentAmount"
                value={newFinding.paymentAmount}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex mt-4">
            <button onClick={handleAddFinding} className="bg-green-500 text-white px-4 py-2 rounded">Add Finding</button>
            <button onClick={onCancel} className="ml-4 bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFindingForm;
