import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PhysicianContext = createContext();

export const PhysicianProvider = () => {
  const [patient, setPatient] = useState(null)
  const [consultationComponentStatus, setConsultationComponentStatus] = useState(null);
  const [consultations, setConsultations] = useState([])
  const [viewConsultationId, setViewConsultationId] = useState([])
  const [addConsultationData, setAddConsultationData] = useState([])

  return (
    <PhysicianContext.Provider value={{
      patient, setPatient,
      consultationComponentStatus, setConsultationComponentStatus,
      consultations, setConsultations,
      viewConsultationId, setViewConsultationId,
      addConsultationData, setAddConsultationData
    }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext;
