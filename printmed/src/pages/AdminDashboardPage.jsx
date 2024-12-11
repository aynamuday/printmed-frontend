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
      <div className="lg:ml-64">
        <Header />  

        <div className="ml-20 mr-10 mt-20 mb-8 px-4 sm:px-6 pt-16 lg:pt-10">
          <div className={`grid gap-4 mt-8 ${user.role == "admin" ? "grid-cols-2" : "grid-cols-3" }`}>
            {user.role == "super admin" && <DashboardCard name={"Admins"} value={usersCount ? usersCount.admins : 0} />}
            <DashboardCard name={"Physicians"} value={usersCount ? usersCount.physicians : 0} />
            <DashboardCard name={"Secretaries"} value={usersCount ? usersCount.secretaries : 0} />
          </div>

          <div className='h-6'></div>

          {/* audits */}
          <Audits forDashboard={true} />
        </div>
      </div>
    </>
  )
}

export default DashboardAdminPage