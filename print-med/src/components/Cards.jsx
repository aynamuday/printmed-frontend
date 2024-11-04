import React, { useState, useEffect } from 'react';

const Cards = () => {
  const [metrics, setMetrics] = useState({
    queueNumber: 0,
    waitingPatients: 0,
    completedPatients: 0,
    totalPayments: 0,
  });

  // This function is only using dummy data now
  const fetchMetrics = () => {
    // Dummy data to simulate API response
    const dummyData = {
      queueNumber: 5,
      waitingPatients: 10,
      completedPatients: 20,
      totalPayments: 1500,
    };

    // Set the metrics with dummy data
    setMetrics(dummyData);
  };

  useEffect(() => {
    fetchMetrics(); // Call the function to set dummy data
  }, []);

  return (
    <div className="w-full md:w-[75%] md:ml-[22%]">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
          <h2 className="text-gray-500 text-lg">Queue No.</h2>
          <p className="text-7xl font-extrabold mt-4">{metrics.queueNumber}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
          <h2 className="text-gray-500 text-lg">Waiting Patients</h2>
          <p className="text-7xl font-extrabold mt-4">{metrics.waitingPatients}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
          <h2 className="text-gray-500 text-lg">Completed Patients</h2>
          <p className="text-7xl font-extrabold mt-4">{metrics.completedPatients}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
          <h2 className="text-gray-500 text-lg">Total Payments</h2>
          <p className="text-7xl font-extrabold mt-4">{metrics.totalPayments}</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;

// import React, { useState, useEffect } from 'react';

// const Cards = () => {
//   const [metrics, setMetrics] = useState({
//     queueNumber: 0,
//     waitingPatients: 0,
//     completedPatients: 0,
//     totalPayments: 0,
//   });

//   // Sample fetch function to simulate getting data from an API
//   const fetchMetrics = async () => {
//     // Uncomment this section when you have a valid API
//     /*
//     try {
//       const response = await fetch('YOUR_API_URL'); // Adjust this URL as needed
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       setMetrics({
//         queueNumber: data.queueNumber,
//         waitingPatients: data.waitingPatients,
//         completedPatients: data.completedPatients,
//         totalPayments: data.totalPayments,
//       });
//     } catch (error) {
//       console.error('Error fetching metrics:', error);
//     }
//     */

//     // Dummy data to simulate API response
//     const dummyData = {
//       queueNumber: 5,
//       waitingPatients: 10,
//       completedPatients: 20,
//       totalPayments: 1500,
//     };

//     // Set the metrics with dummy data
//     setMetrics(dummyData);
//   };

//   useEffect(() => {
//     fetchMetrics();
//   }, []);

//   return (
//     <div className="w-full md:w-[75%] md:ml-[22%]">
//       <div className="grid grid-cols-2 gap-6">
//         <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
//           <h2 className="text-gray-500 text-lg">Queue No.</h2>
//           <p className="text-7xl font-extrabold mt-4">{metrics.queueNumber}</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
//           <h2 className="text-gray-500 text-lg">Waiting Patients</h2>
//           <p className="text-7xl font-extrabold mt-4">{metrics.waitingPatients}</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
//           <h2 className="text-gray-500 text-lg">Completed Patients</h2>
//           <p className="text-7xl font-extrabold mt-4">{metrics.completedPatients}</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
//           <h2 className="text-gray-500 text-lg">Total Payments</h2>
//           <p className="text-7xl font-extrabold mt-4">{metrics.totalPayments}</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 gap-4 mt-10 text-center">
//         {/* 
//           <h2 className="text-gray-500">Video of Hospital</h2>
//           Include video component or embed here
//           <video controls className="w-full">
//             <source src="YOUR_VIDEO_SOURCE" type="video/mp4" />
//           </video> 
//         */}
//       </div>
//     </div>
//   );
// };

// export default Cards;
