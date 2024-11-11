import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const SecretaryPhysicianContext = createContext();

export const SecretaryPhysicianProvider = () => {
  const [fetchedForDashboard, setFetchedForDashboard] = useState(false);
  const [usersCount, setUsersCount] = useState([]);
  const [paymentsToday, setPaymentsToday] = useState([]);
  const [paymentsTodayResource, setPaymentsTodayResource] = useState('');
  const [loadingPaymentsTodayDownload, setLoadingPaymentsTodayDownload] = useState(false);
  const [paymentsAll, setPaymentsAll] = useState([]);
  const [paymentsAllFilters, setPaymentsAllFilters] = useState({
    resource: '',
    dateFrom: '',
    dateUntil: ''
  });
  const [loadingPaymentsAllDownload, setLoadingPaymentsAllDownload] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [usersFilters, setUsersFilters] = useState({
    role: '',
    department_id: '',
    status: ''
  });

  return (
    <SecretaryPhysicianContext.Provider
      value={{
        fetchedForDashboard,
        setFetchedForDashboard,
        usersCount,
        setUsersCount,
        paymentsToday,
        setPaymentsToday,
        paymentsTodayResource,
        setPaymentsTodayResource,
        loadingPaymentsTodayDownload,
        setLoadingPaymentsTodayDownload,
        paymentsAll,
        setPaymentsAll,
        paymentsAllFilters,
        setPaymentsAllFilters,  // corrected camelCase here
        loadingPaymentsAllDownload,
        setLoadingPaymentsAllDownload,
        users,
        setUsers,
        searchUser,
        setSearchUser,
        usersFilters,
        setUsersFilters
      }}
    >
      <Outlet />
    </SecretaryPhysicianContext.Provider>
  );
};

export default SecretaryPhysicianContext;
