import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Queue = () => {
  // State to hold queue counts for each department
  const [queues, setQueues] = useState({
    pediaQueue: 0,
    neuroQueue: 0,
    entQueue: 0,
  });

  // Handle increment of queue
  const incrementQueue = (type) => {
    setQueues(prevQueues => ({
      ...prevQueues,
      [type]: prevQueues[type] + 1,
    }));
  };

  // Handle clearing the queue
  const clearQueue = (type) => {
    setQueues(prevQueues => ({
      ...prevQueues,
      [type]: 0,
    }));
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%]">
        <div className="p-6 w-full max-w-5xl bg-white mx-auto mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PEDIA Section */}
            <div className="flex flex-col items-center justify-center bg-[#D9D9D9BF] p-6 rounded-xl shadow-md relative">
              <h2 className="text-2xl font-semibold text-black mb-4">PEDIA</h2>
              <p className="text-5xl font-bold text-black mb-4">{queues.pediaQueue}</p> {/* Increased text size */}
              <div className="flex space-x-4">
                <button
                  onClick={() => incrementQueue('pediaQueue')}
                  className="px-6 py-2 bg-[#6CB6AD] text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  Increment
                </button>
              </div>
              {/* Close Icon */}
              <button
                onClick={() => clearQueue('pediaQueue')}
                className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
              >
                <i className="bi bi-x"></i> {/* Bootstrap Icon X */}
              </button>
            </div>

            {/* NEURO Section */}
            <div className="flex flex-col items-center justify-center bg-[#D9D9D9BF] p-6 rounded-xl shadow-md relative">
              <h2 className="text-2xl font-semibold text-black mb-4">NEURO</h2>
              <p className="text-5xl font-bold text-black mb-4">{queues.neuroQueue}</p> {/* Increased text size */}
              <div className="flex space-x-4">
                <button
                  onClick={() => incrementQueue('neuroQueue')}
                  className="px-6 py-2 bg-[#6CB6AD] text-white rounded-md shadow-md hover:bg-green-600"
                >
                  Increment
                </button>
              </div>
              {/* Close Icon */}
              <button
                onClick={() => clearQueue('neuroQueue')}
                className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
              >
                <i className="bi bi-x"></i> {/* Bootstrap Icon X */}
              </button>
            </div>

            {/* ENT Section */}
            <div className="flex flex-col items-center justify-center bg-[#D9D9D9BF] p-6 rounded-xl shadow-md relative">
              <h2 className="text-2xl font-semibold text-black mb-4">ENT</h2>
              <p className="text-5xl font-bold text-black mb-4">{queues.entQueue}</p> {/* Increased text size */}
              <div className="flex space-x-4">
                <button
                  onClick={() => incrementQueue('entQueue')}
                  className="px-6 py-2 bg-[#6CB6AD] text-white rounded-md shadow-md hover:bg-yellow-600"
                >
                  Increment
                </button>
              </div>
              {/* Close Icon */}
              <button
                onClick={() => clearQueue('entQueue')}
                className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
              >
                <i className="bi bi-x"></i> {/* Bootstrap Icon X */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Queue;
