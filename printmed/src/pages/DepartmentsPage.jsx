import React, { useState, useContext, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AppContext from "../context/AppContext";
import { BounceLoader } from "react-spinners";
import {globalSwalWithIcon} from "../utils/globalSwal";

const DepartmentsPage = () => {
  const { token } = useContext(AppContext);
  const { departments, setDepartments } = useContext(AppContext);
  const [newDepartment, setNewDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const availableDepartments = [
    "Pediatrics",
    "Obstetrics and Gynecology (OB-GYN)",
    "Cardiology",
    "Oncology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Ophthalmology",
    "Psychiatry",
    "Nephrology",
    "Pulmonology",
    "Gastroenterology",
    "Radiology",
  ];

  // Filter out departments already in the system
  const departmentsList = availableDepartments.filter(
    (department) => !departments.some((item) => item.name === department)
  );

  const handleAddDepartment = async () => {
    if (!newDepartment) return;

    setLoading(true);

    // Check if the department is already in the list
    if (departments.some((item) => item.name.toLowerCase() === newDepartment.toLowerCase())) {
      setLoading(false);
      globalSwalWithIcon.fire({
        showConfirmButton: false,
        title: 'Department already exists.',
        icon: 'error',
        showCloseButton: true
      });
      return;
    }

    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDepartment }),
      });

      const data = await res.json();

      if (res.ok) {
        setDepartments((prevDepartments) => [...prevDepartments, data]);
        setNewDepartment(""); // Clear the selection

        globalSwalWithIcon.fire({
          showConfirmButton: false,
          title: 'Department added successfully!',
          icon: 'success',
          showCloseButton: true
        });
      } else {
        globalSwalWithIcon.fire({
          showConfirmButton: false,
          title: "Error adding the department.",
          icon: 'error',
          showCloseButton: true
        });
      }
    } catch (error) {
      console.error("Error adding department:", error);
    }

    setLoading(false);
  };

  const handleDeleteDepartment = (id) => {
    globalSwalWithIcon.fire({
      title: 'Are you sure you want to delete this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        try {
          const res = await fetch(`/api/departments/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          if (res.ok) {
            setDepartments(departments.filter((department) => department.id !== id));

            globalSwalWithIcon.fire({
              showConfirmButton: false,
              title: 'Department deleted successfully!',
              icon: 'success',
              showCloseButton: true
            });
          } else {
            globalSwalWithIcon.fire({
              showConfirmButton: false,
              title: "Department cannot be deleted.",
              text: "This department is used to identify users and records.",
              icon: 'error',
              showCloseButton: true
            });
          }
        } catch (error) {
          console.error("Error deleting department:", error);
        }

        setLoading(false);
      }
    });
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[25%] mt-[8%] mb-8 p-4 relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center bg-white bg-opacity-50 z-10">
            <BounceLoader color="#6CB6AD" loading={true} size={60} className="mt-60" />
          </div>
        )}

        <h2 className="text-2xl mb-4 font-bold">Departments</h2>

        {/* Add Department Dropdown */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <select
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            className="border border-gray-600 p-2 rounded h-10 w-full sm:w-1/2 mr-5"
          >
            <option value="" disabled>Select Department</option>
            {departmentsList.length > 0 ? (
              departmentsList.map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))
            ) : (
              <option value="" disabled>No departments available</option>
            )}
          </select>
          <button
            onClick={handleAddDepartment}
            className="bg-[#248176] hover:bg-[#37c9b8] text-white px-8 rounded h-10"
          >
            Add
          </button>
        </div>

        {/* Departments List Table */}
        <table className="w-full sm:w-[80%] border border-spacing-0 border-gray-300">
          <thead>
            <tr>
              <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">ID</th>
              <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Name</th>
              <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments && departments.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2 border-[#828282] text-center">{index + 1}</td>
                <td className="border p-2 border-[#828282] text-center">{item.name}</td>
                <td className="border p-2 border-[#828282]">
                  <div className="flex flex-row w-100 items-center justify-center gap-4">
                    <button onClick={() => handleDeleteDepartment(item.id)} className="py-1 w-20 rounded-lg bg-red-500 hover:bg-[#a43331] text-white">
                      Delete
                    </button>
                  </div>
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
