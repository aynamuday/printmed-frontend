import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { fetchPatient } from '../utils/fetch/fetchPatient';
import { showError } from '../utils/fetch/showError';
import { showWarning } from '../utils/fetch/showWarning';

const PatientsTable = ({ patients, setLoading }) => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext)

  const viewPatient = async (patientId) => {
    setLoading(true)

    try {
      const patient = await fetchPatient(patientId, token)

      console.log(patient)
  
      sessionStorage.setItem('patient', JSON.stringify(patient))
      navigate(`/patient`)
    }
    catch (err) {
      if (err.message === "Not found") {
        showWarning("Patient not found.")
      } else if (err.message === "Unauthorized") {
        showWarning("You are not authorized to access this patient.")
      } else {
        showError(err)
      }
    }
    finally {
        setLoading(false)
    }
  }

  return (
    <>
      <div className="w-full overflow-x-auto mb-4">
        <table className="min-w-full border border-spacing-0 border-gray-300 text-sm sm:text-base">
          <thead>
            <tr>
              <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Patient ID</th>
              <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Last Name</th>
              <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">First Name</th>
              <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Middle Name</th>
              <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Birthdate</th>
              <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Sex</th>
              <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients && patients.length > 0 ? (
              patients.map((patient, index) => (
                <tr key={index}>
                  <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{patient.patient_number}</td>
                  <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{patient.last_name}</td>
                  <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{patient.first_name}</td>
                  <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{patient.middle_name}</td>
                  <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{patient.birthdate}</td>
                  <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{patient.sex}</td>
                  <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => viewPatient(patient.id)}
                        className="text-blue-600 hover:text-red-500 hover:underline px-4 py-0.5 rounded-lg "
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border p-2 border-[#828282] text-center">
                  No patients
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PatientsTable;
