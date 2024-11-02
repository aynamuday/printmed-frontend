import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AuditPage = () => {
  const [audits, setAudits] = useState([]);

  const fetchAudits = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/audits'); // Adjust to your actual API
    const data = await response.json();
    setAudits(data);
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  return (
    <>
    <Sidebar />
    <Header />
        <div className="w-full md:w-[75%] md:ml-[22%] mt-10 p-4">
      <h2 className="text-2xl mb-4">All Audits</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b border-gray-300 p-2">User</th>
            <th className="border-b border-gray-300 p-2">User Number</th>
            <th className="border-b border-gray-300 p-2">Date</th>
            <th className="border-b border-gray-300 p-2">Time</th>
            <th className="border-b border-gray-300 p-2">Changes</th>
          </tr>
        </thead>
        <tbody>
          {audits.length > 0 ? (
            audits.map((audit, index) => (
              <tr key={index}>
                <td className="border-b border-gray-300 p-2">{audit.user}</td>
                <td className="border-b border-gray-300 p-2">{audit.userNumber}</td>
                <td className="border-b border-gray-300 p-2">{audit.date}</td>
                <td className="border-b border-gray-300 p-2">{audit.time}</td>
                <td className="border-b border-gray-300 p-2">{audit.changes}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border-b border-gray-300 p-2 text-center">
                No audit records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AuditPage;
