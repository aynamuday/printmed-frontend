import React from 'react';

const FindingDetails = ({ finding, onClose }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('findingDetails').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Finding Details</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div id="findingDetails" className="mt-4 p-4 border rounded bg-gray-100">
      <h3 className="text-lg font-semibold">Finding Details</h3>
      <p><strong>Presumption:</strong> {finding.presumption}</p>
      <p><strong>Date Consulted:</strong> {finding.dateConsulted}</p>
      <p><strong>Blood Pressure:</strong> {finding.bloodPressure}</p>
      <p><strong>Temperature:</strong> {finding.temperature} °C</p>
      <p><strong>Weight:</strong> {finding.weight} kg</p>
      <p><strong>Height:</strong> {finding.height} cm</p>
      <p><strong>Diagnosis:</strong> {finding.diagnosis}</p>
      <p><strong>Medication:</strong> {finding.medication}</p>
      <p><strong>Advice:</strong> {finding.advice}</p>
      <p><strong>Physician:</strong> {finding.physician}</p>
      <p><strong>Payment Amount:</strong> ₱{finding.paymentAmount}</p>

      <div className="flex mt-4">
        <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded">Print</button>
        <button onClick={onClose} className="ml-4 bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default FindingDetails;
