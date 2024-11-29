import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppContext from '../context/AppContext';

const PatientsTable = ({ patients, setLoading }) => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext)

  const handleViewPatient = (patientId) => {
    fetchPatient(patientId)
  };

  const fetchPatient = async (patientId) => {
    setLoading(true)

    try {
        const res = await fetch(`/api/patients/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(!res.ok) {
            if (res.status === 500) {
                throw new Error("Something went wrong. Please try again later.")
            } else if (res.status === 404) {
                throw new Error("Patient not found.")
            } else if (res.status === 403) {
                throw new Error("You are not authorized to perform this action.")
            } else {
                throw new Error("Something went wrong. Please try again later.")
            }
        }

        const patient = await res.json()

        navigate(`/patients/${patientId}`, {
          state: { patient }
        });
    }
    catch (err) {
      console.log(err)
      let error = err.message ?? "Something went wrong. Please try again later."

      if (err.name === "TypeError") {
          error = "Something went wrong. Please try again later. You may refresh or check your Internet connection."
      }
      
      Swal.fire({
          icon: 'error',
          title: `${error}`,
          showConfirmButton: false,
          showCloseButton: true,
          customClass: {
              title: 'text-xl font-bold text-black text-center',
              popup: 'border-2 rounded-xl px-4 py-8',
              icon: 'p-0 mx-auto my-0'
          }
      })
    }
    finally {
        setLoading(false)
    }
  }

  return (
    <>
      <table className="min-w-full border border-spacing-0 border-gray-300">
        <thead>
          <tr>
            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Patient No.</th>
            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">First Name</th>
            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Last Name</th>
            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Age</th>
            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Birthdate</th>
            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Sex</th>
            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients && patients.length > 0 ? (
            patients.map((patient, index) => (
              <tr key={index}>
                <td className="p-2 border text-center border-[#828282]">{patient.patient_number}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.first_name}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.last_name}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.age}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.birthdate}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.sex}</td>
                <td className="p-2 border text-center border-[#828282]">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewPatient(patient.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg "
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 border-[#828282] text-center">
                No patients
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default PatientsTable;
