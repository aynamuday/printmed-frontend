import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from './AppContext';

const SecretaryContext = createContext();

export const SecretaryProvider = () => {
  const { token } = useContext(AppContext)

  const [physicians, setPhysicians] = useState([])
  const [registrations, setRegistrations] = useState([]);
  const [registrationsSearch, setRegistrationsSearch] = useState('');
  const [patients, setPatients] = useState('');
  const [searchPatient, setSearchPatient] = useState("")
  const [patientsFilters, setPatientsFilters] = useState({
    sortBy: '',
    orderBy: '',
  });

  useEffect(() => {
    fetchPhysicians()
  }, [])

  const fetchPhysicians = async () => {
    try {
      const res = await fetch('/api/physicians', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        setPhysicians(data);
      } else {
        console.error('Error fetching physicians:', res.statusText);
      }
    } catch (error) {
      console.error('Error fetching physicians:', error);
    }
  };

  return (
    <SecretaryContext.Provider value={{ 
      physicians, setPhysicians,
      registrations, setRegistrations,
      registrationsSearch, setRegistrationsSearch,
      patients, setPatients,
      searchPatient, setSearchPatient,
      patientsFilters, setPatientsFilters
    }}>
      <Outlet />
    </SecretaryContext.Provider>
  );
};

export default SecretaryContext;
