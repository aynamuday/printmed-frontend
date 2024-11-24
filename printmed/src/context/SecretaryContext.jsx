import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const SecretaryContext = createContext();

export const SecretaryProvider = () => {
  const [registrations, setRegistrations] = useState([])
  const [searchRegistration, setSearchRegistration] = useState("")


  const [patient, setPatient] = useState(null)

  const [consultationStatus, setConsultationStatus] = useState(null);
  const [consultationId, setConsultationId] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [physicians, setPhysicians] = useState([]);
  const [loadingDuplicate, setLoading] = useState(false);
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

  const checkForDuplicatePatient = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/duplicate-patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          birthdate: formData.birthdate,
          sex: formData.sex,
        }),
      });

      const result = await response.json();
      setLoading(false);
      
      if (response.ok) {
        if (result.length > 0) {
          return { isDuplicate: true, message: 'Patient already exists.' };
        } else {
          return { isDuplicate: false };
        }
      } else {
        throw new Error('Failed to check for duplicates');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error checking for duplicates:', error);
      return { isDuplicate: false, message: 'Error checking for duplicates.' };
    }
  };

  return (
    <SecretaryContext.Provider value={{ 
      patient, setPatient,

      consultationStatus, setConsultationStatus,
      consultation, setConsultation,
      patientsAll, setPatientsAll,
      patientsAllFilters, setPatientsAllFilters,
      searchPatients, setSearchPatients,
      selectedPatient, setSelectedPatient,
      duplicatePatients, setDuplicatePatients,
      physicians, setPhysicians,
      loadingDuplicate, checkForDuplicatePatient
    }}>
      <Outlet />
    </SecretaryContext.Provider>
  );
};

export default SecretaryContext;
