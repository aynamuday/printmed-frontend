import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PhysicianContext = createContext();

export const PhysicianProvider = () => {
  const [consultationStatus, setConsultationStatus] = useState(null);
  const [consultationId, setConsultationId] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [physicians, setPhysicians] = useState([]);
  const [consultationPayment, setConsultationPayment] = useState(null);
  const [patientsAll, setPatientsAll] = useState([]);
  const [patientsAllFilters, setPatientsAllFilters] = useState({
    search: '',
    sortField: '',
    sortOrder: '',
  });
  const [searchPatients, setSearchPatients] = useState('');
  
  // Add selectedPatient state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [duplicatePatients, setDuplicatePatients] = useState([]);

  return (
    <PhysicianContext.Provider value={{
      consultationStatus, setConsultationStatus,
      consultation, setConsultation,
      consultationPayment, setConsultationPayment,
      patientsAll, setPatientsAll,
      patientsAllFilters, setPatientsAllFilters,
      searchPatients, setSearchPatients,
      selectedPatient, setSelectedPatient,
      duplicatePatients, setDuplicatePatients,
      physicians, setPhysicians
    }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext;
