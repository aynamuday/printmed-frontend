import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientsTable = ({ patients, handleViewClickProp }) => {
  const navigate = useNavigate();

  // Rename this function to avoid conflict
  const handleViewPatient = (index) => {
    navigate(`/patients/${index}`);
  };

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
