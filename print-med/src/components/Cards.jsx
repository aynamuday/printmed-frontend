import React, { useState, useEffect } from 'react';

const Cards = () => {
  const [metrics, setMetrics] = useState({
    queueNumber: 0,
    waitingPatients: 0,
    completedPatients: 0,
    totalPayments: 0,
  });

  // Sample fetch function to simulate getting data from an API
  const fetchMetrics = async () => {
    // Replace with your actual API call
    const response = await fetch('YOUR_API_URL'); // Adjust this URL as needed
    const data = await response.json();
    // Assuming data structure corresponds to the metrics needed
    setMetrics({
      queueNumber: data.queueNumber,
      waitingPatients: data.waitingPatients,
      completedPatients: data.completedPatients,
      totalPayments: data.totalPayments,
    });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="w-full md:w-[75%] md:ml-[22%]">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Queue No.</h2>
          <p className="text-2xl font-bold">{metrics.queueNumber}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Waiting Patients</h2>
          <p className="text-2xl font-bold">{metrics.waitingPatients}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Completed Patients</h2>
          <p className="text-2xl font-bold">{metrics.completedPatients}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Total Payments</h2>
          <p className="text-2xl font-bold">{metrics.totalPayments}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-10 text-center">
        {/* <h2 className="text-gray-500">Video of Hospital</h2>
        Include video component or embed here
        <video controls className="w-full">
          <source src="YOUR_VIDEO_SOURCE" type="video/mp4" />
        </video> */}
      </div>
    </div>
  );
};

export default Cards;
