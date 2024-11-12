import React, { useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import { PulseLoader } from 'react-spinners';

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import DashboardCard from '../components/DashboardCard';
import Audits from '../components/Audits';


const DashboardAdminPage = () => {
  const { token } = useContext(AppContext)
  const { usersCount, setUsersCount } = useContext(AdminContext)

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

  // execute the fetches
  useEffect(() => {
    getUsersCount()
  }, [])
  
  return (
    <>
      <Sidebar />
      <Header />  

      <div className="w-full md:w-[75%] md:ml-[22%] mb-8">
        { usersCount.length < 1 ? (
          <div className='flex justify-center items-center mt-40'>
            <PulseLoader color="#6CB6AD" loading={usersCount.length < 1} size={15} />
          </div>
        ) : (
          <>
            {/* dashboard cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <DashboardCard name={"Admins"} value={usersCount.admins} />
              <DashboardCard name={"Physicians"} value={usersCount.physicians} />
              <DashboardCard name={"Secretaries"} value={usersCount.secretaries} />
              <DashboardCard name={"Queue Managers"} value={usersCount.queue_managers} />
            </div>

            <div className='h-12'></div>

            {/* audits */}
            <Audits forDashboard={true} />       
          </>
        )}
      </div>
    </>
  )
}

export default DashboardAdminPage