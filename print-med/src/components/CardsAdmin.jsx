import React, { useState, useEffect } from 'react';

const CardsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All'); 
  const [departments, setDepartments] = useState(['All', 'Doctors', 'Nurses', 'Patients']); 

  // Sample data for users
  const sampleUsers = [
    { name: 'Dr. Smith', userNumber: '001', time: '10:00 AM', changes: 'Added new patient', department: 'Doctors' },
    { name: 'Nurse Jane', userNumber: '002', time: '10:30 AM', changes: 'Updated patient record', department: 'Nurses' },
    { name: 'Patient John', userNumber: '003', time: '11:00 AM', changes: 'Consulted doctor', department: 'Patients' },
    { name: 'Dr. Doe', userNumber: '004', time: '11:30 AM', changes: 'Prescribed medication', department: 'Doctors' },
    { name: 'Nurse Anna', userNumber: '005', time: '12:00 PM', changes: 'Administered vaccine', department: 'Nurses' },
    { name: 'Patient Sarah', userNumber: '006', time: '12:30 PM', changes: 'Follow-up visit', department: 'Patients' },
  ];

  useEffect(() => {
    // Simulate fetching users from an API
    setUsers(sampleUsers);
  }, []);

  // Function to handle department sorting
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  // Filter users by the selected department
  const filteredUsers = selectedDepartment === 'All'
    ? users
    : users.filter(user => user.department === selectedDepartment); 
  
  // Count registered users by department
  const countByDepartment = (department) => {
    return users.filter(user => user.department === department).length;
  };

  return (
    <div className="w-full md:w-[75%] md:ml-[22%]">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Number of Registered Doctors</h2>
          <p className="text-2xl font-bold">{countByDepartment('Doctors')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Number of Registered Nurses</h2>
          <p className="text-2xl font-bold">{countByDepartment('Nurses')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Number of Patients</h2>
          <p className="text-2xl font-bold">{countByDepartment('Patients')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Total Payments</h2>
          <p className="text-2xl font-bold">{/* Add logic to calculate total payments if available */}</p>
        </div>
      </div>

      {/* TABLE FOR USERS */}
      <div className="grid grid-cols-1 gap-4 mt-10 text-center">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b border-gray-300 p-2">User</th>
              <th className="border-b border-gray-300 p-2">User Number</th>
              <th className="border-b border-gray-300 p-2">Time</th>
              <th className="border-b border-gray-300 p-2">Changes</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className="border-b border-gray-300 p-2">{user.name}</td>
                  <td className="border-b border-gray-300 p-2">{user.userNumber}</td>
                  <td className="border-b border-gray-300 p-2">{user.time}</td>
                  <td className="border-b border-gray-300 p-2">{user.changes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border-b border-gray-300 p-2 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardsAdmin;
