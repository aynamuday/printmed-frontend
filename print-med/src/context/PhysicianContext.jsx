import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PhysicianContext = createContext();

export const PhysicianProvider = () => {
  const [consultation, setConsultation] = useState(null)
  const [addConsultation, setAddConsultation] = useState(null)
  const [editConsultation, setEditConsultation] = useState(null)

  return (
    <PhysicianContext.Provider value={{ 
      consultation, setConsultation,
      addConsultation, setAddConsultation,
      editConsultation, setEditConsultation
     }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext