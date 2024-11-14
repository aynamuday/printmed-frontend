import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PhysicianContext = createContext();

export const PhysicianProvider = () => {
  const [consultationStatus, setConsultationStatus] = useState(null)
  const [consultationId, setConsultationId] = useState(null)
  const [consultation, setConsultation] = useState(null)
  const [consultationPayment, setConsultationPayment] = useState(null)

  return (
    <PhysicianContext.Provider value={{ 
      consultationStatus, setConsultationStatus,
      consultation, setConsultation,
      consultationPayment, setConsultationPayment
     }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext