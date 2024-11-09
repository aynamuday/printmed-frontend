import React, { createContext, useEffect, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from './AppContext';

const AdminContext = createContext();

export const AdminProvider = () => {
  const [fetchedForDashboard, setFetchedForDashboard] = useState(false)
  const [usersCount, setUsersCount] = useState([])
  const [auditsToday, setAuditsToday] = useState([])
  const [auditsTodayResource, setAuditsTodayResource] = useState('')
  const [loadingAuditsTodayDownload, setLoadingAuditsTodayDownload] = useState(false)
  const [auditsAll, setAuditsAll] = useState([])
  const [auditsAllFilters, setAuditsAllFilters] = useState({
    resource: '',
    dateFrom: '',
    dateUntil: ''
  })
  const [loadingAuditsAllDownload, setLoadingAuditsAllDownload] = useState(false)
  const [users, setUsers] = useState([])
  const [searchUser, setSearchUser] = useState("")
  const [usersFilters, setUsersFilters] = useState({
    role: '',
    department_id: '',
    status: ''
  })

  return (
    <AdminContext.Provider value={{ fetchedForDashboard, setFetchedForDashboard,
                                  usersCount, setUsersCount, 
                                  auditsToday, setAuditsToday,
                                  auditsTodayResource, setAuditsTodayResource,
                                  loadingAuditsTodayDownload, setLoadingAuditsTodayDownload,
                                  auditsAll, setAuditsAll,
                                  auditsAllFilters, setAuditsAllFilters,
                                  loadingAuditsAllDownload, setLoadingAuditsAllDownload,
                                  users, setUsers,
                                  searchUser, setSearchUser,
                                  usersFilters, setUsersFilters
    }}>
      <Outlet />
    </AdminContext.Provider>
  );
};

export default AdminContext;