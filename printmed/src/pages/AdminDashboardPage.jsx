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
      <Header />  

      <div className="w-full md:w-[75%] md:ml-[22%] mb-8">
        { usersCount.length < 1 ? (
          <div className='flex justify-center items-center mt-40'>
            <PulseLoader color="#6CB6AD" loading={usersCount.length < 1} size={15} />
          </div>
        ) : (
          <>
            {/* dashboard cards */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              <div className="col-span-2">
                <DashboardCard name={"Admins"} value={usersCount.admins} />
              </div>
              <div className="col-span-2">
                <DashboardCard name={"Physicians"} value={usersCount.physicians} /> 
              </div>
              <div className="col-start-2 col-end-4">
                <DashboardCard name={"Secretaries"} value={usersCount.secretaries} />
              </div>
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