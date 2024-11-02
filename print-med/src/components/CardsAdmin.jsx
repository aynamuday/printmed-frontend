import React, { useState, useEffect } from 'react';

const CardsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All'); // Default to show all
  const [departments, setDepartments] = useState(['All', 'Doctors', 'Nurses', 'Patients']); // Example departments, update from API

  // Sample fetch function to simulate getting data from an API
  const fetchUsers = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/users'); // Update to your actual users API
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle department sorting
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  // Filter users by the selected department
  const filteredUsers = selectedDepartment === 'All'
    ? users
    : users.filter(user => user.department === selectedDepartment); // Adjust based on your data structure

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
