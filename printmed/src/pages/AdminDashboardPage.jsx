import React, { useEffect, useContext, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import {showError} from "../utils/fetch/showError";

import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import DashboardCard from '../components/DashboardCard';
import Audits from '../components/Audits';


const DashboardAdminPage = () => {
  const { token } = useContext(AppContext)
  const { usersCount, setUsersCount } = useContext(AdminContext)

  const [loadingUsersCount, setLoadingUsersCount] = useState(false)

  useEffect(() => {
    if (usersCount.length == 0) {
      setLoadingUsersCount(true)
    }

    getUsersCount()
  }, [])

  const getUsersCount = async () => {
    try {
      const res = await fetch("/api/users-count", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(!res.ok) {
          throw new Error("An error occured while fetching the count of users. You may refresh to try again.")
      }

      const data = await res.json()  
      setUsersCount(data)
    }
    catch (err) {
      showError(err)
    }
    finally {
      setLoadingUsersCount(false)
    }
  }
  
  return (
    <>
      <Sidebar />
      <div className="lg:ml-64">
        <Header />  

        <div className="ml-20 mr-10 mt-20 mb-8 px-4 sm:px-6 pt-16 lg:pt-10">
          { loadingUsersCount ? (
            <div className='flex justify-center items-center mt-20'>
              <PulseLoader color="#6CB6AD" loading={loadingUsersCount} size={15} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <DashboardCard name={"Admins"} value={usersCount ? usersCount.admins : 0} />
              <DashboardCard name={"Physicians"} value={usersCount ? usersCount.physicians : 0} />
              <DashboardCard name={"Secretaries"} value={usersCount ? usersCount.secretaries : 0} />
            </div>
          )}

          <div className='h-12'></div>

          {/* audits */}
          <Audits forDashboard={true} />
        </div>
      </div>
    </>
  )
}

export default DashboardAdminPage