import React, { useEffect, useContext } from 'react';
import { PulseLoader } from 'react-spinners';

import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import DashboardCard from '../components/DashboardCard';
import Audits from '../components/Audits';


const DashboardAdminPage = () => {
  const { token } = useContext(AppContext)
  const { usersCount, setUsersCount } = useContext(AdminContext)

  // execute the fetches
  useEffect(() => {
    getUsersCount()
  }, [])

  // fetch the users count
  const getUsersCount = async () => {
    const res = await fetch("/api/users-count", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (res.ok) {
      setUsersCount(data)
    }
  }
  
  return (
    <>
      <Sidebar />
      <div className="lg:ml-64">
        <Header />  

        <div className="ml-20 mr-20 mt-20 mb-8 px-4 sm:px-6 md:px-8 pt-16 lg:pt-20">
          { usersCount.length < 1 ? (
            <div className='flex justify-center items-center mt-40'>
              <PulseLoader color="#6CB6AD" loading={usersCount.length < 1} size={15} />
            </div>
          ) : (
            <>
              {/* dashboard cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                  <DashboardCard name={"Admins"} value={usersCount.admins} />
                  <DashboardCard name={"Physicians"} value={usersCount.physicians} />
                  <DashboardCard name={"Secretaries"} value={usersCount.secretaries} />
              </div>

              <div className='h-12'></div>

              {/* audits */}
              <Audits forDashboard={true} />       
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default DashboardAdminPage