import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");

  // Fetch departments from API or mock data
  const fetchDepartments = async () => {
    // Replace with actual API call
    const response = await fetch("YOUR_API_URL/departments"); // Adjust this URL
    const data = await response.json();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle adding a new department
  const handleAddDepartment = async () => {
    if (!newDepartment) return;

    // Mock API call to add department (replace with actual API request)
    const newDept = { id: Date.now(), name: newDepartment };
    setDepartments([...departments, newDept]);
    setNewDepartment(""); // Clear input field
  };

  // Handle deleting a department
  const handleDeleteDepartment = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  // Handle editing department
  const handleEditDepartment = (id, name) => {
    setEditDepartmentId(id);
    setEditDepartmentName(name);
  };

  // Handle saving edited department
  const handleSaveEdit = () => {
    setDepartments(
      departments.map(dept =>
        dept.id === editDepartmentId ? { ...dept, name: editDepartmentName } : dept
      )
    );
    setEditDepartmentId(null);
    setEditDepartmentName("");
  };

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%] mt-10 p-4">
        <h2 className="text-2xl mb-4">Department Management</h2>

        {/* Add Department Form */}
        <div className="mb-6">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded"
            placeholder="New Department Name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <button onClick={handleAddDepartment} className="bg-[#6CB6AD] hover:bg-blue-600 text-white p-2 rounded ml-2">
            Add Department
          </button>
        </div>

        {/* Department List Table */}
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr>
              <th className="border-b border-gray-300 p-2">Department ID</th>
              <th className="border-b border-gray-300 p-2">Department Name</th>
              <th className="border-b border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td className="border-b border-gray-300 p-2">{dept.id}</td>
                <td className="border-b border-gray-300 p-2">
                  {editDepartmentId === dept.id ? (
                    <input
                      type="text"
                      className="border border-gray-300 p-1 rounded"
                      value={editDepartmentName}
                      onChange={(e) => setEditDepartmentName(e.target.value)}
                    />
                  ) : (
                    dept.name
                  )}
                </td>
                <td className="border-b border-gray-300 p-2">
                  {editDepartmentId === dept.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white p-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditDepartmentId(null)}
                        className="bg-gray-500 text-white p-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditDepartment(dept.id, dept.name)}
                        className="bg-yellow-500 text-white p-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DepartmentsPage;
