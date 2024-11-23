import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const PhysicianContext = createContext();

export const PhysicianProvider = () => {
  const [patientPageLoading, setPatientPageLoading] = useState(false)
  const [patient, setPatient] = useState(null)
  const [consultationComponentStatus, setConsultationComponentStatus] = useState(null);
  const [consultations, setConsultations] = useState([])
  const [viewConsultationId, setViewConsultationId] = useState(null)
  const [addConsultationData, setAddConsultationData] = useState([])
  const [isPediatrics, setIsPediatrics] = useState(false)
  const [isNext, setIsNext] = useState(false)
  const [addConsultationErrors, setAddConsultationErrors] = useState([])

  const resetPatientViewer = () => {
    setPatient(null)
    setConsultationComponentStatus(null)
    setConsultations([])
    setViewConsultationId(null)
    resetAddConsultation()
  }

  const resetAddConsultation = () => {
    setAddConsultationData({
      height: '165',
      height_unit: 'cm',
      weight: '50',
      weight_unit: 'kg',
      temperature: '36.9',
      temperature_unit: 'C',
      blood_pressure: '120/80',
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
      prescriptions: [],
      follow_up_date: ''
    })
    setIsPediatrics(false)
    setIsNext(false)
    setAddConsultationErrors({
      general: '',
      height: '',
      weight: '',
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
      prescriptions: '',
      follow_up_date: ''
    })
  }

  useEffect(() => {
    resetPatientViewer()
  }, [])

  return (
    <PhysicianContext.Provider value={{
      patientPageLoading, setPatientPageLoading,
      resetPatientViewer,
      patient, setPatient,
      consultationComponentStatus, setConsultationComponentStatus,
      consultations, setConsultations,
      viewConsultationId, setViewConsultationId,
      addConsultationData, setAddConsultationData,
      isPediatrics, setIsPediatrics,
      isNext, setIsNext,
      addConsultationErrors, setAddConsultationErrors,
      resetAddConsultation
    }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext;
