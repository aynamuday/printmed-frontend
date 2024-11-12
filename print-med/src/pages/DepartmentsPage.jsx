import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AppContext from "../context/AppContext";
import Swal from "sweetalert2";
import { BounceLoader } from "react-spinners";
import globalSwal from "../utils/globalSwal";

const DepartmentsPage = () => {
  const { token } = useContext(AppContext);
  const { departments, setDepartments } = useContext(AppContext);
  const [newDepartment, setNewDepartment] = useState("")
  const [editDepartment, setEditDepartment] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAddDepartment = async () => {
    if(newDepartment.trim() === "") {
      return
    }

    setLoading(true)

    if (departments.some(item => item.name.toLowerCase() === newDepartment.toLowerCase())) {
      setLoading(false)

      globalSwal.fire({
        showConfirmButton: false,
        title: 'Department already exists.',
        icon: 'error',
        showCloseButton: true
      })
      return;
    }
    
    try {
      const res = await fetch("/api/departments", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name: newDepartment}),
      });

      const data = await res.json();

      if (res.ok) {
        setDepartments(prevDepartments => [...prevDepartments, data]);
        setNewDepartment("");

        globalSwal.fire({
          showConfirmButton: false,
          title: 'Department added successfully!',
          icon: 'success',
          showCloseButton: true
        })
      } else {
        globalSwal.fire({
          showConfirmButton: false,
          title: "Error adding the department.",
          icon: 'error',
          showCloseButton: true
        })
      }
    } catch (error) {
      console.error("Error adding department:", error);
    }

    setLoading(false)
  };

  // Handle edit department
  const handleEditDepartmentChange = (department) => {
    setEditDepartment(department);
  };

  const handleSaveEdit = async () => {
    if (departments.some(item => item.name.toLowerCase() === editDepartment.name.toLowerCase())) {
      setLoading(false)

      globalSwal.fire({
        showConfirmButton: false,
        title: 'Department already exists.',
        icon: 'error',
        showCloseButton: true
      })
      return;
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/departments/${editDepartment.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name: editDepartment.name}),
      });

      const data = await res.json();

      console.log(data)

      if (res.ok) {
        setDepartments(
          departments.map(item =>
            item.id === editDepartment.id ? { ...item, name: data.name } : item
          )
        );
        setEditDepartment([]);

        globalSwal.fire({
          showConfirmButton: false,
          title: 'Department edited successfully!',
          icon: 'success',
          showCloseButton: true
        })
      } else {
        globalSwal.fire({
          showConfirmButton: false,
          title: "Error updating the department.",
          icon: 'error',
          showCloseButton: true
        })
      }
    } catch (error) {
      console.error("Error editing department:", error);
    }

    setLoading(false)
  };

  // Handle delete department
  const handleDeleteDepartment = (id) => {
    globalSwal.fire({
      title: 'Are you sure you want to delete this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/departments/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          const data = await res.json()

          if (res.ok) {
            setDepartments(departments.filter(dept => dept.id !== id));

            globalSwal.fire({
              showConfirmButton: false,
              title: 'Department deleted successfully!',
              icon: 'success',
              showCloseButton: true
            })
          } else {
            globalSwal.fire({
              showConfirmButton: false,
              title: "Department cannot be deleted.",
              icon: 'error',
              showCloseButton: true
            })
          }
        } catch (error) {
          console.error("Error deleting department:", error);
        }
      }
    });
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%] mt-8 mb-8 p-4 relative">
        { loading &&
            <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center bg-white bg-opacity-50 z-10'>
                <BounceLoader color="#6CB6AD" loading={true} size={60} className="mt-60" />
            </div>
        }

        <h2 className="text-2xl mb-4 font-bold">Departments</h2>

        {/* Add Department Form */}
        <div className="mb-6">
          <input
            type="text"
            className="border border-gray-600 p-2 rounded"
            placeholder="Name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <button onClick={handleAddDepartment} className="bg-[#248176] text-white py-2 px-8 rounded ml-2">
            Add
          </button>
        </div>

        {/* Department List Table */}
        <table className="w-[50%] border border-spacing-0 border-gray-300">
          <thead>
            <tr>
            <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">ID</th>
              <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Name</th>
              <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            { departments && departments.map((item) => (
              <tr key={item.id}>
                <td className="border p-2 border-[#828282] text-center">
                  {item.id}
                </td>
                <td className="border p-2 border-[#828282] text-center">
                  {editDepartment && editDepartment.id === item.id ? (
                    <input
                      type="text"
                      className="border border-gray-800 w-full h-full py-1 rounded text-center"
                      value={editDepartment.name}
                      onChange={(e) => {setEditDepartment({...editDepartment, name: e.target.value})}}
                    />
                  ) : (
                    <>{item.name}</>
                  )}
                </td>
                <td className="border p-2 border-[#828282]">
                  <div className='flex flex-row w-100 items-center justify-center gap-4'>
                    { editDepartment && editDepartment.id === item.id ? (
                        <>
                          <button onClick={() => {handleSaveEdit()}} className={`py-1 w-20 rounded-lg bg-green-500 text-white`}>
                            Save
                          </button>

                          <button onClick={() => {setEditDepartment(null)}} className='py-1 w-20 rounded-lg bg-gray-500 text-white'>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => {handleEditDepartmentChange(item)}} className={`py-1 w-20 rounded-lg bg-blue-500 text-white`}>
                            Edit
                          </button>

                          <button onClick={() => {handleDeleteDepartment(item.id)}} className='py-1 w-20 rounded-lg bg-red-500 text-white'>
                            Delete
                          </button>
                        </>
                      )}
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
