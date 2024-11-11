import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import { PulseLoader } from 'react-spinners';

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardCard from '../components/DashboardCard';
import Payment from './Payment';

const DashboardPhysicianSecretaryPage = () => {
  const { token } = useContext(AppContext);
  const [queue, setQueue] = useState(null);
  const [totalPayments, setTotalPayments] = useState(null);
  const [patientData, setPatientData] = useState([]);

  // Fetch queue number
  const fetchQueue = async () => {
    const res = await fetch("/api/queue", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetching Queue:', res.ok ? 'Success' : 'Failed');
    const data = await res.json();
    if (res.ok) setQueue(data);
  };

  // Fetch payments
  const fetchPayments = async () => {
    const res = await fetch("/api/payments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetching Total Payments:', res.ok ? 'Success' : 'Failed');
    const data = await res.json();
    if (res.ok) setTotalPayments(data.total);
  }; 

  // Execute all fetch functions on mount
  useEffect(() => {
    fetchQueue();
    fetchPayments();
  }, []);

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%]">
        {/* Loading Spinner */}
        {queue === null ? (
          <div className="flex justify-center items-center mt-40">
            <PulseLoader color="#6CB6AD" loading={true} size={15} />
          </div>
        ) : (
          <>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <DashboardCard name="Queue Number" value={queue.current} />
              <DashboardCard name="Waiting Patients" value={queue.waiting} />
              <DashboardCard name="Completed Patients" value={queue.completed} />
              <DashboardCard name="Total Payments" value={totalPayments} />
            </div>

            <div className="h-12"></div>

            {/* payments */}
            <Payment forDashboard={true} />
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPhysicianSecretaryPage;
