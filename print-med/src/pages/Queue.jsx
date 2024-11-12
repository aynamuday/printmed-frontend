import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import QueueManagerContext from '../context/QueueManagerContext';

const Queue = () => {
  const { token } = useContext(AppContext);
  const { queues, updateQueue } = useContext(QueueManagerContext);

  // Fetch initial queue data
  useEffect(() => {
    const apiUrl = '/api/queue';
    
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch queues');
        }
        return response.json();
      })
      .then(data => {
        updateQueue('pediaQueue', data.pediaQueue || 0);
        updateQueue('neuroQueue', data.neuroQueue || 0);
        updateQueue('entQueue', data.entQueue || 0);
        
        console.log("API connected successfully and data fetched.");
      })
      .catch(error => console.error("Error fetching queues:", error));
  }, [updateQueue, token]);

  // Handle increment of queue
  const incrementQueue = (type, queueId) => {
    fetch(`/api/queue/${queueId}/increment-total`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        updateQueue(type, data.currentCount);
      })
      .catch(error => console.error(`Error incrementing ${type} queue:`, error));
  };

  // Handle decrement of queue
  const decrementQueue = (type, queueId) => {
    fetch(`/api/queue/${queueId}/decrement-total`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        updateQueue(type, data.currentCount);
      })
      .catch(error => console.error(`Error decrementing ${type} queue:`, error));
  };

  // Handle clearing the queue
  const clearQueue = (type, queueId) => {
    fetch(`http://127.0.0.1:8000/api/queue/${queueId}/clear`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(() => {
        updateQueue(type, 0);
      })
      .catch(error => console.error(`Error clearing ${type} queue:`, error));
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
              <p className="text-5xl font-bold text-black mb-4">{queues.pediaQueue}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => incrementQueue('pediaQueue', 1)}
                  className="px-6 py-2 bg-[#6CB6AD] text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  <i className="bi bi-plus"></i>
                </button>
                <button
                  onClick={() => decrementQueue('pediaQueue', 1)}
                  className="px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  <i className="bi bi-dash"></i>
                </button>
              </div>

              <button
                onClick={() => clearQueue('pediaQueue', 1)}
                className="absolute top-2 right-2 text-3xl text-gray-700 hover:text-gray-900"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            {/* NEURO Section */}
            <div className="flex flex-col items-center justify-center bg-[#D9D9D9BF] p-6 rounded-xl shadow-md relative">
              <h2 className="text-2xl font-semibold text-black mb-4">NEURO</h2>
              <p className="text-5xl font-bold text-black mb-4">{queues.neuroQueue}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => incrementQueue('neuroQueue', 2)}
                  className="px-6 py-2 bg-[#6CB6AD] text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  <i className="bi bi-plus"></i>
                </button>
                <button
                  onClick={() => decrementQueue('neuroQueue', 2)}
                  className="px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  <i className="bi bi-dash"></i>
                </button>
              </div>

              <button
                onClick={() => clearQueue('neuroQueue', 2)}
                className="absolute top-2 right-2 text-3xl text-gray-700 hover:text-gray-900"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            {/* ENT Section */}
            <div className="flex flex-col items-center justify-center bg-[#D9D9D9BF] p-6 rounded-xl shadow-md relative">
              <h2 className="text-2xl font-semibold text-black mb-4">ENT</h2>
              <p className="text-5xl font-bold text-black mb-4">{queues.entQueue}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => incrementQueue('entQueue', 3)}
                  className="px-6 py-2 bg-[#6CB6AD] text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  <i className="bi bi-plus"></i>
                </button>
                <button
                  onClick={() => decrementQueue('entQueue', 3)}
                  className="px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  <i className="bi bi-dash"></i>
                </button>
              </div>

              <button
                onClick={() => clearQueue('entQueue', 3)}
                className="absolute top-2 right-2 text-3xl text-gray-700 hover:text-gray-900"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Queue;
