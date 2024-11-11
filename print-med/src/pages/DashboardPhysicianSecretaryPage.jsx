import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import { PulseLoader } from 'react-spinners';

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardCard from '../components/DashboardCard';
import Payment from './Payment';

const DashboardPhysicianSecretaryPage = () => {
  const { token } = useContext(AppContext);
  const [queueNumber, setQueueNumber] = useState(null);
  const [waitingPatients, setWaitingPatients] = useState(null);
  const [completedPatients, setCompletedPatients] = useState(null);
  const [totalPayments, setTotalPayments] = useState(null);
  const [patientData, setPatientData] = useState([]);

  // Fetch queue number
  const fetchQueueNumber = async () => {
    const res = await fetch("/api/queue", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetching Queue Number:', res.ok ? 'Success' : 'Failed');
    const data = await res.json();
    if (res.ok) setQueueNumber(data.count);
  };

  // Fetch waiting patients
  const fetchWaitingPatients = async () => {
    const res = await fetch("/api/patients?status=waiting", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetching Waiting Patients:', res.ok ? 'Success' : 'Failed');
    const data = await res.json();
    if (res.ok) setWaitingPatients(data.length);
  };

  // Fetch completed patients
  const fetchCompletedPatients = async () => {
    const res = await fetch("/api/patients?status=completed", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetching Completed Patients:', res.ok ? 'Success' : 'Failed');
    const data = await res.json();
    if (res.ok) setCompletedPatients(data.length);
  };

  // Fetch total payments
  const fetchTotalPayments = async () => {
    const res = await fetch("/api/payments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetching Total Payments:', res.ok ? 'Success' : 'Failed');
    const data = await res.json();
    if (res.ok) setTotalPayments(data.total);
  };

  // Fetch patient data for the table
  const fetchPatientData = async () => {
    const res = await fetch("/api/patients", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetching Patients:', res.ok ? 'Success' : 'Failed');
    const data = await res.json();
    if (res.ok) setPatientData(data.patientData);
  };
  
  

  // Execute all fetch functions on mount
  useEffect(() => {
    fetchQueueNumber();
    fetchWaitingPatients();
    fetchCompletedPatients();
    fetchTotalPayments();
    fetchPatientData();
  }, []);

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%]">
        {/* Loading Spinner */}
        {queueNumber === null || waitingPatients === null || completedPatients === null || totalPayments === null ? (
          <div className="flex justify-center items-center mt-40">
            <PulseLoader color="#6CB6AD" loading={true} size={15} />
          </div>
        ) : (
          <>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <DashboardCard name="Queue Number" value={queueNumber} />
              <DashboardCard name="Waiting Patients" value={waitingPatients} />
              <DashboardCard name="Completed Patients" value={completedPatients} />
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
