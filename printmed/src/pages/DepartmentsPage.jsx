import React, { useState, useContext, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AppContext from "../context/AppContext";
import { BounceLoader } from "react-spinners";
import {globalSwalWithIcon} from "../utils/globalSwal";
import { fetchDepartments } from "../utils/fetch/fetchDepartments";

const DepartmentsPage = () => {
  const { token } = useContext(AppContext)
  
  const [departments, setDepartments] = useState([]);
  const [ newDepartment, setNewDepartment ] = useState("");
  const [loading, setLoading] = useState(false);

  let departmentsList = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "ENT (Ear, Nose, and Throat)",
    "Gastroenterology",
    "General Medicine",
    "Nephrology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Rheumatology",
    "Ophthalmology"
  ];

  useEffect(() => {
    const getDepartments = async () => {
      setDepartments(await fetchDepartments(token))
    }
    
    getDepartments()
  }, [])

  useContext(() => {
    if (departments) {
      departmentsList = departmentsList.filter(
        (department) => !departments.some((item) => item.name === department)
      );
    }
  }, [departments])

  const addDepartment = async () => {
    if (!newDepartment) return

    try {
      setLoading(true)

      const res = await fetch("/api/departments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDepartment }),
      });

      if(!res.ok) {
        throw new Error("Something went wrong. Please try again later.")
      }

      const data = await res.json()  
      
      setDepartments((prevDepartments) => ([...prevDepartments, data]))
      setNewDepartment("")

      globalSwalWithIcon.fire({
        showConfirmButton: false,
        title: 'Department added successfully!',
        icon: 'success',
        showCloseButton: true
      });
    }
    catch (err) {
      showError(err)
    }
    finally {
      setLoading(false)
    }
  };

  const deleteDepartment = (id) => {
    globalSwalWithIcon.fire({
      title: 'Are you sure you want to delete this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        try {
          setLoading(true)
    
          const res = await fetch(`/api/departments/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
    
          if(!res.ok) {
            throw new Error("Something went wrong. Please try again later.")
          }

          setDepartments(departments.filter((department) => department.id !== id));

          globalSwalWithIcon.fire({
            showConfirmButton: false,
            title: 'Department deleted successfully!',
            icon: 'success',
            showCloseButton: true
          });
        }
        catch (err) {
          showError(err)
        }
        finally {
          setLoading(false)
        }
      }
    });
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white bg-opacity-40 z-50">
          <BounceLoader color="#6CB6AD" loading={true} size={60} />
        </div>
      )}

      <Sidebar />
      <Header />
      <div className="mb-8 p-4 relative w-full md:w-[55%] md:ml-[22%] mt-[10%] px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-4">
          <h2 className="text-2xl font-bold">Departments</h2>

          {/* add department */}
          {departmentsList.length > 0 && 
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="border border-black rounded-md shadow-sm bg-white p-2 w-full"
              >
                <option value="">Select Department</option>
                { departmentsList.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>

              <button onClick={addDepartment} className="bg-[#248176] hover:bg-blue-700 text-white px-6 rounded">Add</button> 
            </div>
          }
        </div>

        {/* departments table */}
        <table className="w-full border border-spacing-0 border-gray-300">
          <thead>
            <tr>
              <th className="bg-[#D9D9D9] border border-[#828282] p-0.5 text-center w-[10%]">ID</th>
              <th className="bg-[#D9D9D9] border border-[#828282] p-0.5 text-center">Name</th>
              <th className="bg-[#D9D9D9] border border-[#828282] p-0.5 text-center w-[30%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {departments && departments.length > 0 ? (
              departments.map((item, index) => (
                <tr key={item.id}>
                  <td className="border p-0.5 border-[#828282] text-center">{index + 1}</td>
                  <td className="border p-0.5 border-[#828282] text-center">{item.name}</td>
                  <td className="border p-0.5 border-[#828282]">
                    <div className="flex flex-row w-full items-center justify-center">
                      { item.users_count < 1 &&
                        <button onClick={() => deleteDepartment(item.id)} className="py-0.5 w-20 rounded-lg text-red-600 hover:underline">
                          Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="3" className="border p-2 border-[#828282] text-center">No departments</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DepartmentsPage;
