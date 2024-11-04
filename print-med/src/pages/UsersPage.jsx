import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [departments, setDepartments] = useState(['All', 'Admin', 'Doctor', 'Nurse']);

  // Sample fetch function to simulate getting data from an API
  const fetchUsers = async () => {
    // const response = await fetch('YOUR_API_URL'); // Replace with your API URL
    // const data = await response.json();
    // setUsers(data);

    // Simulating user data for demonstration purposes
    const simulatedUsers = [
      { userNumber: '1', name: 'John Doe', dateRegistered: '2024-01-15', role: 'Admin' },
      { userNumber: '2', name: 'Jane Smith', dateRegistered: '2024-01-16', role: 'Doctor' },
      { userNumber: '3', name: 'Emily Johnson', dateRegistered: '2024-01-17', role: 'Nurse' },
      // Add more simulated user objects as needed
    ];
    setUsers(simulatedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle department sorting
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  // Actions for each button
  const sendResetLink = (userId) => {
    // Logic to send a reset link to the user
    console.log(`Send reset link to user with ID: ${userId}`);
    // API call to send reset link
  };

  const unrestrictUser = (userId) => {
    // Logic to unrestrict the user
    console.log(`Unrestrict user with ID: ${userId}`);
    // API call to unrestrict the user
  };

  const lockUser = (userId) => {
    // Logic to lock the user
    console.log(`Lock user with ID: ${userId}`);
    // API call to lock the user
  };

  // Filter users by the selected department
  const filteredUsers = selectedDepartment === 'All'
    ? users
    : users.filter(user => user.role === selectedDepartment);

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%] mt-10">
        <div className="grid grid-cols-2 gap-4 mt-10">
          <h2 className="text-2xl mb-4 mt-4">User Management</h2>
          <div className="flex items-center rounded-md px-4 duration-300 cursor-pointer bg-[#D9D9D9] w-[90%] h-[80%]">
            <i className="bi bi-search text-sm"></i>
            <input
              className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center space-x-4">
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

        <div className="grid grid-cols-1 gap-4 mt-10 text-center">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">User Number</th>
                <th className="border-b border-gray-300 p-2">User Name</th>
                <th className="border-b border-gray-300 p-2">Date Registered</th>
                <th className="border-b border-gray-300 p-2">Role</th>
                <th className="border-b border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="border-b border-gray-300 p-2">{user.userNumber}</td>
                    <td className="border-b border-gray-300 p-2">{user.name}</td>
                    <td className="border-b border-gray-300 p-2">{user.dateRegistered}</td>
                    <td className="border-b border-gray-300 p-2">{user.role}</td>
                    <td className="border-b border-gray-300 p-2 space-x-2">
                      {/* Action buttons */}
                      <button
                        onClick={() => sendResetLink(user.userNumber)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Reset Link
                      </button>
                      <button
                        onClick={() => unrestrictUser(user.userNumber)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Unrestrict
                      </button>
                      <button
                        onClick={() => lockUser(user.userNumber)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Lock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border-b border-gray-300 p-2 text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default UsersPage;
