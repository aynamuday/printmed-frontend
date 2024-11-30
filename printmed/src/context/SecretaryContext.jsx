import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from './AppContext';

const SecretaryContext = createContext();

export const SecretaryProvider = () => {
  const [registrations, setRegistrations] = useState([]);
  const [registrationsSearch, setRegistrationsSearch] = useState('');
  const [patients, setPatients] = useState('');
  const [searchPatient, setSearchPatient] = useState("")
  const [patientsFilters, setPatientsFilters] = useState({
    sortBy: '',
    orderBy: '',
  });

  return (
    <SecretaryContext.Provider value={{
      registrations, setRegistrations,
      registrationsSearch, setRegistrationsSearch,
      patients, setPatients,
      searchPatient, setSearchPatient,
      patientsFilters, setPatientsFilters,
    }}>
      <Outlet />
    </SecretaryContext.Provider>
  );
};

export default SecretaryContext;
