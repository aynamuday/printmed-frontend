import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PhysicianContext = createContext();

export const PhysicianProvider = () => {
  const [consultationStatus, setConsultationStatus] = useState(null)
  const [consultationId, setConsultationId] = useState(null)
  const [consultation, setConsultation] = useState(null)
  const [consultationPayment, setConsultationPayment] = useState(null)
  const [patientsAll, setPatientsAll] = useState([])
  const [patientsAllFilters, setPatientsAllFilters] = useState({
    search: '',
    sortField: '',
    sortOrder: ''
  })
  const [searchPatients, setSearchPatients] = useState("")
  return (
    <PhysicianContext.Provider value={{ 
      consultationStatus, setConsultationStatus,
      consultation, setConsultation,
      consultationPayment, setConsultationPayment,
      patientsAll, setPatientsAll,
      patientsAllFilters, setPatientsAllFilters,
      searchPatients, setSearchPatients
    }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext