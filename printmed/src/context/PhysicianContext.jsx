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
  const [isNext, setIsNext] = useState(false)
  const [addConsultationErrors, setAddConsultationErrors] = useState([])

  const resetPatientViewer = () => {
    setPatient(null)
    setConsultationComponentStatus(null)
    setConsultations([])
    setViewConsultationId(null)
    resetAddConsultation()
  }

  useEffect(() => {
    if (patient && patient.vital_signs) {
      const vitalSigns = patient.vital_signs

      setAddConsultationData((prevData) => ({
        ...prevData, 
        patient_id: patient.id,
        height: vitalSigns.height || "",
        height_unit: vitalSigns.height_unit || "",
        weight: vitalSigns.weight || "",
        weight_unit: vitalSigns.weight_unit || "",
        temperature: vitalSigns.temperature || "",
        systolic: vitalSigns.systolic || "",
        diastolic: vitalSigns.diastolic || ""
      }))
    }
  }, [patient])

  const resetAddConsultation = () => {
    setAddConsultationData({
      height: '',
      height_unit: '',
      weight: '',
      weight_unit: '',
      temperature: '',
      temperature_unit: 'C',
      blood_pressure: '',
      chief_complaint: '',
      present_illness_hx: '',
      family_hx: '',
      medical_hx: '',
      birth_maternal_hx: '',
      immunization: '',
      heads: '',
      pertinent_physical_examination: '',
      laboratory_diagnostics_tests: '',
      primary_diagnosis: '',
      diagnosis: '',
      prescriptions: [],
      follow_up_date: ''
    })
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
      isNext, setIsNext,
      addConsultationErrors, setAddConsultationErrors,
      resetAddConsultation
    }}>
      <Outlet />
    </PhysicianContext.Provider>
  );
};

export default PhysicianContext;
