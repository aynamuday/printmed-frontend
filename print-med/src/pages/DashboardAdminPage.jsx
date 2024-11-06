import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import { PulseLoader, ClipLoader } from 'react-spinners';
import { getCurrentDate } from '../utils/dateUtils';

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import DashboardCard from '../components/DashboardCard';


const DashboardAdminPage = () => {
  const { token } = useContext(AppContext)
  const { fetchedForDashboard, setFetchedForDashboard, usersCount, setUsersCount, auditsToday, setAuditsToday, auditsTodayResource, getAuditsTodayResource, loadingAuditsDownload, setLoadingAuditsDownload } = useContext(AdminContext)
  const [loadingDashboard, setLoadingDashboard] = useState(false)
  const [loadingAudits, setLoadingAudits] = useState(false)
  const dateToday = getCurrentDate()

  // fetch the users count
  const getUsersCount = async () => {
    setLoadingDashboard(true)

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

  // fetch the audits for today
  const getAudits = async (page = 1, resource='') => {
    fetchedForDashboard ? setLoadingAudits(true) : setLoadingDashboard(true)

    let url = `/api/audits?date_from=${dateToday}&date_until=${dateToday}&page=${page}`

    if (!(resource.trim() === "")) {
      url += `&resource=${resource}`
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    setAuditsToday(data)

    setLoadingDashboard(false)
    setLoadingAudits(false)
  }

  // execute the fetches
  useEffect(() => {
    if (!fetchedForDashboard) {
      getUsersCount()
      getAudits()
    }

    setFetchedForDashboard(true)
  }, [])

  // executes when user selects audit resource
  const handleAuditsResourceChange = (e) => {
    getAuditsTodayResource(e.target.value)
    getAudits(1, e.target.value)
  };

  // executes when user click previous button for audits
  const handlePreviousAudits = () => {
    getAudits(audits.current_page - 1, auditsTodayResource)
  };

  // executes when user click next button for audits
  const handleNextAudits = () => {
    getAudits(audits.current_page + 1, auditsTodayResource)
  };

  // executes when button for audits download is clicked
  const handleAuditsDownload = async () => {
    setLoadingAuditsDownload(true)

    const res = await fetch(`/api/audits/download?date_from=2024-11-04&date_until=${dateToday}`, {
      headers: {
        'Content-Type': 'application/pdf',
        Authorization: `Bearer ${token}`
      }
    })

    const blob = await res.blob()
    console.log(blob)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `printmed-audits-${dateToday}`
    link.click()

    window.URL.revokeObjectURL(url)

    setLoadingAuditsDownload(false)
  }
  
  return (
    <>
      <Sidebar />
      <Header />  

      <div className="w-full md:w-[75%] md:ml-[22%]">
        {/* react spinner for initial load */}
        { loadingDashboard ? (
          <div className='flex justify-center items-center mt-40'>
            <PulseLoader color="#6CB6AD" loading={loadingDashboard} size={15} />
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
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-bold text-lg'>Audits | Today</h2>
              <div className='flex gap-4 justify-center items-center'>
                {/* select audit resource dropdown */}
                <select className='px-4 py-1.5 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                        name="resource" id="resource" value={auditsTodayResource} onChange={handleAuditsResourceChange}>
                  <option value="">Select resource</option>
                  <option value="user">User</option>
                  <option value="patient">Patient</option>
                  <option value="consultation record">Consultation Record</option>
                  <option value="payment">Payment</option>
                </select>

                {/* pagination buttons */}
                <div>
                  <button className={`px-4 py-1 border border-[#6CB6AD] bg-[#6CB6AD] ${auditsToday.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`} 
                          disabled={auditsToday.current_page === 1} onClick={handlePreviousAudits}>
                    &lt;
                  </button>
                  <div className='inline-block px-4 py-1 border border-[#6CB6AD] text-sm'>
                    {auditsToday.current_page} OF {auditsToday.last_page}
                  </div>
                  <button className={`px-4 py-1 border border-[#6CB6AD] bg-[#6CB6AD] ${auditsToday.current_page === auditsToday.last_page ? 'bg-opacity-70' : ''} text-white text-sm`} 
                          disabled={auditsToday.current_page === auditsToday.last_page} onClick={handleNextAudits}>
                    &gt;
                  </button>
                </div>

                {/* download audits button */}
                { auditsToday.data && auditsToday.data.length > 0 && ( 
                  <button className='px-4 py-1 border border-[#6CB6AD] bg-[#6CB6AD] text-white font-medium rounded-md hover:bg-[#55b8ac]' onClick={handleAuditsDownload} disabled={loadingAuditsDownload}>
                    { loadingAuditsDownload ? (<ClipLoader color="#FFFFFF" loading={loadingAuditsDownload} size={14} />) : ( "Download" )}
                  </button>
                )}
              </div>
            </div>
            {/* react spinner for fetching students */}
            { loadingAudits ? (
              <div className='flex justify-center items-center mt-20'>
                <PulseLoader color="#6CB6AD" loading={loadingAudits} size={15} />
              </div>
            ) : (
              // table for audits
              <table className="min-w-full border border-spacing-0 border-gray-300">
                <thead>
                  <tr>
                    <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[20%]">Time</th>
                    <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[20%]">User Role</th>
                    <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[20%]">User No.</th>
                    <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[30%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  { auditsToday.data && auditsToday.data.length > 0 ? (
                    auditsToday.data.map((audit, index) => (
                      <tr key={index}>
                        <td className="border p-2 border-[#828282] text-center">{audit.time}</td>
                        <td className="border p-2 border-[#828282] text-center">{audit.user_role}</td>
                        <td className="border p-2 border-[#828282] text-center">{audit.user_personnel_number}</td>
                        <td className="border p-2 border-[#828282] text-center">{audit.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="border p-2 border-[#828282] text-center">No audits</td>
                    </tr>
                  )}
                </tbody>
              </table> 
            )}
            <div className='h-16'></div>
        </>
        )}
      </div>
    </>
  )
}

export default DashboardAdminPage