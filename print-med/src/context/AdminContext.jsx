import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
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

  return (
    <AdminContext.Provider value={{ fetchedForDashboard, setFetchedForDashboard,
                                  usersCount, setUsersCount, 
                                  auditsToday, setAuditsToday,
                                  auditsTodayResource, setAuditsTodayResource,
                                  loadingAuditsTodayDownload, setLoadingAuditsTodayDownload,
                                  auditsAll, setAuditsAll,
                                  auditsAllFilters, setAuditsAllFilters,
                                  loadingAuditsAllDownload, setLoadingAuditsAllDownload
    }}>
      <Outlet />
    </AdminContext.Provider>
  );
};

export default AdminContext;