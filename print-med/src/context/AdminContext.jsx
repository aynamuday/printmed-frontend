import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // for Admin
  const [fetchedForDashboard, setFetchedForDashboard] = useState(false)
  const [usersCount, setUsersCount] = useState([])
  const [auditsToday, setAuditsToday] = useState([])
  const [auditsTodayResource, getAuditsTodayResource] = useState([])
  const [loadingAuditsDownload, setLoadingAuditsDownload] = useState(false)

  return (
    <AdminContext.Provider value={{ fetchedForDashboard, setFetchedForDashboard,
                                  usersCount, setUsersCount, 
                                  auditsToday, setAuditsToday,
                                  auditsTodayResource, getAuditsTodayResource,
                                  loadingAuditsDownload, setLoadingAuditsDownload
    }}>
      <Outlet />
    </AdminContext.Provider>
  );
};

export default AdminContext;