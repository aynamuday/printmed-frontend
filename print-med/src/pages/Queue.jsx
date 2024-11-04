import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Queue = () => {
  const [pediaQueue, setPediaQueue] = useState(0);
  const [neuroQueue, setNeuroQueue] = useState(0);
  const [entQueue, setEntQueue] = useState(0);

  const fetchQueueData = async () => {
    const response = await fetch('/api/queue');
    const data = await response.json();
    setPediaQueue(data.pediaQueue || 0);
    setNeuroQueue(data.neuroQueue || 0);
    setEntQueue(data.entQueue || 0);
  };

  const clearQueue = async (type) => {
    const response = await fetch(`/api/queue/${type}/2/clear`, { method: 'POST' });
    if (response.ok) {
      if (type === 'pedia') setPediaQueue(0);
      if (type === 'neuro') setNeuroQueue(0);
      if (type === 'ent') setEntQueue(0);
    }
  };

  const deleteQueue = async (type) => {
    const response = await fetch(`/api/queue/${type}/2`, { method: 'DELETE' });
    if (response.ok) {
      if (type === 'pedia') setPediaQueue(0);
      if (type === 'neuro') setNeuroQueue(0);
      if (type === 'ent') setEntQueue(0);
    }
  };

  const incrementQueue = async (type) => {
    const response = await fetch(`/api/queue/${type}/increment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        {/* <h2 className="text-2xl mb-4">Queue Management</h2> */}

        <div className="grid grid-cols-3 gap-4 mt-5">
          {/* Pedia Queue */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
            <h3 className="text-xl font-bold flex justify-between text-center items-center">
              PEDIA
              <span>
                <i className="bi bi-x-circle mx-1 text-red-500 cursor-pointer" onClick={() => clearQueue('pedia')} title="Clear Queue"></i>
                <i className="bi bi-trash mx-1 text-yellow-500 cursor-pointer" onClick={() => deleteQueue('pedia')} title="Delete Queue"></i>
              </span>
            </h3>
            <p className="text-7xl my-4">{pediaQueue}</p>
          </div>

          {/* Neuro Queue */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
            <h3 className="text-xl font-bold flex justify-between items-center">
              NEURO
              <span>
                <i className="bi bi-x-circle mx-1 text-red-500 cursor-pointer" onClick={() => clearQueue('neuro')} title="Clear Queue"></i>
                <i className="bi bi-trash mx-1 text-yellow-500 cursor-pointer" onClick={() => deleteQueue('neuro')} title="Delete Queue"></i>
              </span>
            </h3>
            <p className="text-7xl my-4">{neuroQueue}</p>
          </div>

          {/* ENT Queue */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
            <h3 className="text-xl font-bold flex justify-between items-center">
              ENT
              <span>
                <i className="bi bi-x-circle mx-1 text-red-500 cursor-pointer" onClick={() => clearQueue('ent')} title="Clear Queue"></i>
                <i className="bi bi-trash mx-1 text-yellow-500 cursor-pointer" onClick={() => deleteQueue('ent')} title="Delete Queue"></i>
              </span>
            </h3>
            <p className="text-7xl my-4">{entQueue}</p>
          </div>

          <div class="col-start-2 col-span-1 gap-4">
            <button 
                className="w-full px-4 py-2 bg-[#6CB6AD] font-bold text-3xl text-black rounded-lg hover:bg-blue-600 mt-5"
                onClick={() => incrementQueue('pedia')}
              >
                PEDIA
            </button>
            <button 
                className="w-full px-4 py-2 bg-[#6CB6AD] font-bold text-3xl text-black rounded-lg hover:bg-blue-600 mt-5"
                onClick={() => incrementQueue('neuro')}
              >
                NEURO
            </button>
            <button 
                className="w-full px-4 py-2 bg-[#6CB6AD] font-bold text-3xl text-black rounded-lg hover:bg-blue-600 mt-5"
                onClick={() => incrementQueue('ent')}
              >
                ENT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Queue;
