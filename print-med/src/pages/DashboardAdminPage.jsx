import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import { PulseLoader } from 'react-spinners';
import { getCurrentDate } from '../utils/dateUtils';

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import DashboardCard from '../components/DashboardCard';


const DashboardAdminPage = () => {
  const { token, fetchedForDashboard, setFetchedForDashboard, usersCount, setUsersCount, audits, setAudits } = useContext(AppContext)
  const [loadingDashboard, setLoadingDashboard] = useState(false)
  const [loadingAudits, setLoadingAudits] = useState(false)
  const dateToday = getCurrentDate()
  const [auditsResource, setAuditsResource] = useState('')

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

  const getAudits = async (page = 1, resource='user') => {
    fetchedForDashboard ? setLoadingAudits(true) : setLoadingDashboard(true)

    const url = resource.trim() === "" ? `/api/audits?date_from=2024-11-04&date_until=${dateToday}&page=${page}` 
                                  : `/api/audits?date_from=2024-11-04&date_until=${dateToday}&page=${page}&resource=${resource}`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    setAudits(data)

    setLoadingDashboard(false)
    setLoadingAudits(false)
  }

  useEffect(() => {
    if (!fetchedForDashboard) {
      getUsersCount()
      getAudits()
    }

    setFetchedForDashboard(true)
  }, [])

  useEffect(() => {
    getAudits(audits.current_page, auditsResource)
  }, [auditsResource])

  const handlePreviousAudits = () => {
    getAudits(audits.current_page - 1)
  };

  const handleNextAudits = () => {
    getAudits(audits.current_page + 1)
  };

  const handleAuditsDownload = async () => {
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
  }
  
  return (
    <>
      <Sidebar />
      <Header />  
      <div className="w-full md:w-[75%] md:ml-[22%]">
        { loadingDashboard ? (
          <div className='flex justify-center items-center mt-40'>
            <PulseLoader color="#6CB6AD" loading={loadingDashboard} size={15} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <DashboardCard name={"Admins"} value={usersCount.admins} />
              <DashboardCard name={"Physicians"} value={usersCount.physicians} />
              <DashboardCard name={"Secretaries"} value={usersCount.secretaries} />
              <DashboardCard name={"Queue Managers"} value={usersCount.queue_managers} />
            </div>

            <div className='h-12'></div>

            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-bold text-lg'>Audits | Today</h2>
              <div className='flex gap-4 justify-center items-center'>
                <select className='px-4 py-1.5 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                        name="resource" id="resource" value={auditsResource} onChange={(e) => setAuditsResource(e.target.value)}>
                  <option value="">Select resource</option>
                  <option value="user">User</option>
                  <option value="patient">Patient</option>
                  <option value="consultation record">Consultation Record</option>
                  <option value="payment">Payment</option>
                </select>

                <div>
                  <button className={`px-4 py-1 border border-[#6CB6AD] bg-[#6CB6AD] ${audits.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`} 
                          disabled={audits.current_page === 1} onClick={handlePreviousAudits}>
                    &lt;
                  </button>
                  <button className='px-4 py-1 border border-[#6CB6AD] text-sm'>
                    {audits.current_page} OF {audits.last_page}
                  </button>
                  <button className={`px-4 py-1 border border-[#6CB6AD] bg-[#6CB6AD] ${audits.current_page === audits.last_page ? 'bg-opacity-70' : ''} text-white text-sm`} 
                          disabled={audits.current_page === audits.last_page} onClick={handleNextAudits}>
                    &gt;
                  </button>
                </div>

                { audits.data && audits.data.length > 0 && (
                  <button className='px-4 py-1 border border-[#6CB6AD] bg-[#6CB6AD] text-white font-medium rounded-md hover:bg-[#55b8ac]' onClick={handleAuditsDownload}>
                    Download
                  </button>
                )}
              </div>
            </div>
            { loadingAudits ? (
              <div className='flex justify-center items-center mt-20'>
                <PulseLoader color="#6CB6AD" loading={loadingAudits} size={15} />
              </div>
            ) : (
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
                { audits.data && audits.data.length > 0 ? (
                  audits.data.map((audit, index) => (
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