import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Queue = () => {
  // Define state variables for each queue
  const [pediaQueue, setPediaQueue] = useState(0);
  const [neuroQueue, setNeuroQueue] = useState(0);
  const [entQueue, setEntQueue] = useState(0);

  // Function to fetch initial queue values from API
  const fetchQueueData = async () => {
    const response = await fetch('/api/queue');
    const data = await response.json();
    setPediaQueue(data.pediaQueue || 0); // Adjust according to your API response structure
    setNeuroQueue(data.neuroQueue || 0);
    setEntQueue(data.entQueue || 0);
  };

  // Function to clear the queue
  const clearQueue = async (type) => {
    const response = await fetch(`/api/queue/${type}/2/clear`, {
      method: 'POST',
    });

    if (response.ok) {
      if (type === 'pedia') setPediaQueue(0);
      if (type === 'neuro') setNeuroQueue(0);
      if (type === 'ent') setEntQueue(0);
    }
  };

  // Function to delete the queue
  const deleteQueue = async (type) => {
    const response = await fetch(`/api/queue/${type}/2`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Optionally handle UI changes after deletion
      if (type === 'pedia') setPediaQueue(0);
      if (type === 'neuro') setNeuroQueue(0);
      if (type === 'ent') setEntQueue(0);
    }
  };

  // Functions to increment each queue and update API
  const incrementQueue = async (type) => {
    const response = await fetch(`/api/queue/${type}/increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      if (type === 'pedia') setPediaQueue(prev => prev + 1);
      else if (type === 'neuro') setNeuroQueue(prev => prev + 1);
      else if (type === 'ent') setEntQueue(prev => prev + 1);
    }
  };

    useEffect(() => {
    fetchQueueData();
  }, []);

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%] mt-10">
        <h2 className="text-2xl mb-4">Queue Management</h2>
        
        <div className="grid grid-cols-3 gap-4 mt-5">
          {/* Pedia Queue */}
          <div className="bg-white shadow-lg rounded-lg p-5 text-center">
            <h3 className="text-xl font-bold">PEDIA</h3>
            <p className="text-4xl my-4">{pediaQueue}</p>
            <div className="space-y-2">
              <button 
                className="w-48 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => incrementQueue('pedia')}
              >
                Increment
              </button>
              <button 
                className="w-48 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => clearQueue('pedia')}
              >
                Clear
              </button>
              <button 
                className="w-48 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => deleteQueue('pedia')}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Neuro Queue */}
          <div className="bg-white shadow-lg rounded-lg p-5 text-center">
            <h3 className="text-xl font-bold">NEURO</h3>
            <p className="text-4xl my-4">{neuroQueue}</p>
            <div className="space-y-2">
              <button 
                className="w-48 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => incrementQueue('neuro')}
              >
                Increment
              </button>
              <button 
                className="w-48 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => clearQueue('neuro')}
              >
                Clear
              </button>
              <button 
                className="w-48 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => deleteQueue('neuro')}
              >
                Delete
              </button>
            </div>
          </div>

          {/* ENT Queue */}
          <div className="bg-white shadow-lg rounded-lg p-5 text-center">
            <h3 className="text-xl font-bold">ENT</h3>
            <p className="text-4xl my-4">{entQueue}</p>
            <div className="space-y-2">
              <button 
                className="w-48 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => incrementQueue('ent')}
              >
                Increment
              </button>
              <button 
                className="w-48 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => clearQueue('ent')}
              >
                Clear
              </button>
              <button 
                className="w-48 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => deleteQueue('ent')}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Queue;
