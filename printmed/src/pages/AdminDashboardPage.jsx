import React, { useEffect, useContext } from 'react';
import {showError} from "../utils/fetch/showError";
import {showLoggedOut} from "../utils/fetch/showLoggedOut"

import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import DashboardCard from '../components/DashboardCard';
import Audits from '../components/Audits';
import { useNavigate } from 'react-router-dom';


const DashboardAdminPage = () => {
  const { user, token } = useContext(AppContext)
  const { usersCount, setUsersCount } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    getUsersCount()
  }, [])

  const getUsersCount = async () => {
    try {
      const res = await fetch("/api/users-count", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json() 

      if(!res.ok) {
        if (res.status == 401 && data.message == "Unauthenticated.") {
          showLoggedOut()
          navigate('/')
          return
        } else {
          throw new Error("An error occured while fetching the count of users. You may refresh to try again.")
        }
      }

      setUsersCount(data)
    }
    catch (err) {
      showError(err)
    }
  }
  
  return (
    <>
      <Sidebar />
      <div className="lg:pl-[250px] min-h-screen bg-white">
        <Header />  
        <div className="px-4 sm:px-6 mt-4">
          <div className={`grid gap-4 mt-8 ${user.role == "admin" ? "grid-cols-2" : "grid-cols-3" } sm:grid-cols-2 md:grid-cols-3`}>
            {user.role == "super admin" && <DashboardCard name={"Admins"} value={usersCount?.admins || 0} />}
            <DashboardCard name={"Physicians"} value={usersCount?.physicians || 0} />
            <DashboardCard name={"Secretaries"} value={usersCount?.secretaries || 0} />
          </div>
          <div className="mt-8">
            <Audits forDashboard={true} />
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardAdminPage