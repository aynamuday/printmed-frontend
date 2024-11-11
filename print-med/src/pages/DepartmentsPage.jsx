import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AppContext from "../context/AppContext";
import Swal from "sweetalert2";

const DepartmentsPage = () => {
  const { token } = useContext(AppContext);
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");

  const fetchDepartments = async () => {
    if (!token) {
      console.error("No token available.");
      return;
    }

    try {
      const response = await fetch("/api/departments", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDepartments(data);
      console.log("API fetched successfully:", data);

    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [token]);

  // Handle adding a new department with confirmation and duplication check
  const handleAddDepartment = async () => {
    if (!newDepartment) return;

    // Check if department already exists
    const departmentExists = departments.some(dept => dept.name.toLowerCase() === newDepartment.toLowerCase());

    if (departmentExists) {
      Swal.fire('Error', 'This department already exists, please add a new one.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure you want to add this department?',
      text: newDepartment,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newDept = { name: newDepartment };
        try {
          const response = await fetch("/api/departments", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newDept),
          });

          if (response.ok) {
            const data = await response.json();
            setDepartments([...departments, data]);
            setNewDepartment(""); // Clear input field
            Swal.fire('Success!', 'Department added successfully', 'success');
          } else {
            throw new Error('Error adding department');
          }
        } catch (error) {
          console.error("Error adding department:", error);
        }
      }
    });
  };

  // Handle deleting a department
  const handleDeleteDepartment = (id) => {
    Swal.fire({
      title: 'Are you sure you want to delete this department?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/departments/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          if (response.ok) {
            // Remove department from the state after deletion
            setDepartments(departments.filter(dept => dept.id !== id));
            Swal.fire('Deleted!', 'Your department has been deleted.', 'success');
          } else {
            throw new Error('Error deleting department');
          }
        } catch (error) {
          console.error("Error deleting department:", error);
        }
      }
    });
  };

  // Handle editing department
  const handleEditDepartment = (id, name) => {
    setEditDepartmentId(id);
    setEditDepartmentName(name);
  };

  // Handle saving edited department
  const handleSaveEdit = async () => {
    const updatedDept = { name: editDepartmentName };
    try {
      const response = await fetch(`/api/departments/${editDepartmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedDept),
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(
          departments.map(dept =>
            dept.id === editDepartmentId ? { ...dept, name: data.name } : dept
          )
        );
        setEditDepartmentId(null);
        setEditDepartmentName("");
        Swal.fire('Success!', 'Department edited successfully', 'success');
      } else {
        throw new Error('Error saving department changes');
      }
    } catch (error) {
      console.error("Error editing department:", error);
    }
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
                        className="bg-[#6CB6AD] text-white p-1 rounded mr-2"
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
