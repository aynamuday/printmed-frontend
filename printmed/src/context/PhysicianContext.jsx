import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PhysicianContext = createContext();

export const PhysicianProvider = () => {
  const [patient, setPatient] = useState(null)
  const [consultationComponentStatus, setConsultationComponentStatus] = useState(null);
  const [consultations, setConsultations] = useState([])
  const [viewConsultationId, setViewConsultationId] = useState([])
  const [addConsultationData, setAddConsultationData] = useState({
    height: '',
    height_unit: '',
    weight: '',
    weight_unit: '',
    temperature: '',
    blood_pressure: '',
    chief_complaint: '',
    present_illness_hx: '',
    family_hx: '',
    medical_hx: '',
    pediatrics_h: '',
    pediatrics_e: '',
    pediatrics_a: '',
    pediatrics_d: '',
    primary_diagnosis: '',
    diagnosis: '',
    prescriptions: [
      { name: '', dosage: '', instruction: '' },
      { name: '', dosage: '', instruction: '' }
    ],
    follow_up_date: ''
  })
  const [isPediatrics, setIsPediatrics] = useState(false)
  const [isNext, setIsNext] = useState(false)

  return (
    <PhysicianContext.Provider value={{
      patient, setPatient,
      consultationComponentStatus, setConsultationComponentStatus,
      consultations, setConsultations,
      viewConsultationId, setViewConsultationId,
      addConsultationData, setAddConsultationData,
      isPediatrics, setIsPediatrics,
      isNext, setIsNext
    }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext;
