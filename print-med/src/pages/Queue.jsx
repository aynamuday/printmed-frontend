import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppContext from '../context/AppContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Queue = () => {
  const [queues, setQueues] = useState({
    pediaQueue: 0,
    neuroQueue: 0,
    entQueue: 0,
  });
  const { token } = useContext(AppContext);

  // Fetch queue data
  const fetchQueueData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/queue', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch queue data');
      const data = await response.json();
      setQueues({
        pediaQueue: data.pediaQueue || 0,
        neuroQueue: data.neuroQueue || 0,
        entQueue: data.entQueue || 0,
      });
      console.log('Queue data fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching queue data:', error);
    }
  };

  // Handle queue actions (clear, delete, increment)
  const handleQueueAction = async (type, action) => {
    try {
      let url = `http://127.0.0.1:8000/api/queue/${type}`;
      let method = 'GET';

      switch(action) {
        case 'clear':
          url += '/clear';
          method = 'PUT';
          break;
        case 'delete':
          url += '';
          method = 'DELETE';
          break;
        case 'increment':
          url += '/increment-current';
          method = 'PUT';
          break;
        default:
          throw new Error('Unknown action');
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to ${action} ${type} queue`);

      // Update state based on action
      setQueues((prevState) => {
        switch(action) {
          case 'clear':
            return { ...prevState, [`${type}Queue`]: 0 };
          case 'delete':
            return { ...prevState, [`${type}Queue`]: 0 };
          case 'increment':
            return { ...prevState, [`${type}Queue`]: prevState[`${type}Queue`] + 1 };
          default:
            return prevState;
        }
      });

      console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} ${type} queue successfully`);
    } catch (error) {
      console.error(`Error ${action} ${type} queue:`, error);
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
        <div className="grid grid-cols-3 gap-4 mt-5">
          {/* Pedia Queue */}
          <QueueCard
            type="pedia"
            queue={queues.pediaQueue}
            onAction={handleQueueAction}
          />

          {/* Neuro Queue */}
          <QueueCard
            type="neuro"
            queue={queues.neuroQueue}
            onAction={handleQueueAction}
          />

          {/* ENT Queue */}
          <QueueCard
            type="ent"
            queue={queues.entQueue}
            onAction={handleQueueAction}
          />

          <div className="col-start-2 col-span-1 gap-4">
            <button
              className="w-full px-4 py-2 bg-[#6CB6AD] font-bold text-3xl text-black rounded-lg hover:bg-blue-600 mt-5"
              onClick={() => handleQueueAction('pedia', 'increment')}
            >
              PEDIA
            </button>
            <button
              className="w-full px-4 py-2 bg-[#6CB6AD] font-bold text-3xl text-black rounded-lg hover:bg-blue-600 mt-5"
              onClick={() => handleQueueAction('neuro', 'increment')}
            >
              NEURO
            </button>
            <button
              className="w-full px-4 py-2 bg-[#6CB6AD] font-bold text-3xl text-black rounded-lg hover:bg-blue-600 mt-5"
              onClick={() => handleQueueAction('ent', 'increment')}
            >
              ENT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable Queue Card Component
const QueueCard = ({ type, queue, onAction }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
    <h3 className="text-xl font-bold flex justify-between text-center items-center">
      {type.toUpperCase()}
      <span>
        <i
          className="bi bi-x-circle mx-1 text-red-500 cursor-pointer"
          onClick={() => onAction(type, 'clear')}
          title="Clear Queue"
        />
        <i
          className="bi bi-trash mx-1 text-yellow-500 cursor-pointer"
          onClick={() => onAction(type, 'delete')}
          title="Delete Queue"
        />
      </span>
    </h3>
    <p className="text-7xl my-4">{queue}</p>
  </div>
);

export default Queue;
