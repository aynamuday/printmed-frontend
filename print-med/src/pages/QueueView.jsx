import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const QueueView = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [queueData, setQueueData] = useState([]);

  // Example data, replace with actual data fetching logic
  useEffect(() => {
    setQueueData([
      { id: 1, name: 'John Doe', department: 'PEDIA', time: '10:00 AM', isPaid: false },
      { id: 2, name: 'Jane Smith', department: 'NEURO', time: '10:30 AM', isPaid: true },
      { id: 3, name: 'Alice Johnson', department: 'ENT', time: '11:00 AM', isPaid: false },
      { id: 4, name: 'Mike Wilson', department: 'PEDIA', time: '11:30 AM', isPaid: true },
    ]);
  }, []);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const togglePaymentStatus = (id) => {
    setQueueData((prevData) => 
      prevData.map(item =>
        item.id === id ? { ...item, isPaid: !item.isPaid } : item
      )
    );
  };

  const filteredQueueData = selectedDepartment === 'All'
    ? queueData
    : queueData.filter(item => item.department === selectedDepartment);

  const departments = ['All', 'PEDIA', 'NEURO', 'ENT'];

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%] mt-10 p-4">
        <h2 className="text-2xl font-bold mb-6">Patient Queue</h2>

        {/* Department Filter */}
        <div className="mt-10 flex items-center space-x-4">
          <h2 className="text-gray-500">SORT BY:</h2>
          <select
            className="p-2 border border-gray-300 rounded"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            {departments.map(department => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueueData.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.time}</td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePaymentStatus(item.id)}
                      className={`w-full px-3 py-1 rounded-md text-white ${
                        item.isPaid ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {item.isPaid ? 'Paid' : 'Unpaid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default QueueView;
