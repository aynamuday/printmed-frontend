import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const AdminContext = createContext();

export const AdminProvider = () => {
  const [fetchedForDashboard, setFetchedForDashboard] = useState(false)
  const [usersCount, setUsersCount] = useState([])
  const [auditsToday, setAuditsToday] = useState([])
  // const [auditsTodayResource, setAuditsTodayResource] = useState('')
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
    status: '',
    sort_by: '',
    order_by: ''
  })
  const [departments, setDepartments] = useState([])

  return (
    <AdminContext.Provider value={{ 
      fetchedForDashboard, setFetchedForDashboard,
      usersCount, setUsersCount, 
      auditsToday, setAuditsToday,
      // auditsTodayResource, setAuditsTodayResource,
      loadingAuditsTodayDownload, setLoadingAuditsTodayDownload,
      auditsAll, setAuditsAll,
      auditsAllFilters, setAuditsAllFilters,
      loadingAuditsAllDownload, setLoadingAuditsAllDownload,
      users, setUsers,
      searchUser, setSearchUser,
      usersFilters, setUsersFilters,
      departments, setDepartments
    }}>
      <Outlet />
    </AdminContext.Provider>
  );
};

export default AdminContext;