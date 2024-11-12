import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import QueueManagerContext from '../context/QueueManagerContext';

const QueuePage = () => {
  const { token } = useContext(AppContext);
  const { updateQueue, setUpdateQueue } = useContext(QueueManagerContext);

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
          throw new Error('Failed to fetch department queues');
        }
        return response.json();
      })
      .then(data => {
        setUpdateQueue(data);
        console.log("API connected successfully and data fetched.");
      })
      .catch(error => console.error("Error fetching department queues:", error));
  }, [token, setUpdateQueue]);

  // Handle increment of queue
  const incrementQueue = (queueId) => {
    const updatedQueues = updateQueue.map(queue => {
      if (queue.id === queueId) {
        return { ...queue, total: queue.total + 1 };
      }
      return queue;
    });

    // Update state optimistically
    setUpdateQueue(updatedQueues);

    // Only update API if the increment was successful
    fetch(`/api/queue/${queueId}/increment-total`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Increment successful");
        } else {
          throw new Error('Failed to increment queue');
        }
      })
      .catch(error => console.error("Error incrementing queue:", error));
  };

  // Handle decrement of queue
  const decrementQueue = (queueId) => {
    // Prevent decrement if total is already 0
    const queue = updateQueue.find(q => q.id === queueId);
    if (queue.total === 0) return; // No decrement if total is 0

    const updatedQueues = updateQueue.map(queue => {
      if (queue.id === queueId) {
        return { ...queue, total: queue.total - 1 };
      }
      return queue;
    });

    // Update state optimistically
    setUpdateQueue(updatedQueues);

    // Only update API if the decrement was successful
    fetch(`/api/queue/${queueId}/decrement-total`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Decrement successful");
        } else {
          throw new Error('Failed to decrement queue');
        }
      })
      .catch(error => console.error("Error decrementing queue:", error));
  };

  // Handle clearing the queue
  const clearQueue = (queueId) => {
    const updatedQueues = updateQueue.map(queue => {
      if (queue.id === queueId) {
        return { ...queue, total: 0 };
      }
      return queue;
    });

    // Update state optimistically
    setUpdateQueue(updatedQueues);

    // Only update API if the clear was successful
    fetch(`/api/queue/${queueId}/clear`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Clear successful");
        } else {
          throw new Error('Failed to clear queue');
        }
      })
      .catch(error => console.error("Error clearing queue:", error));
  };

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%]">
        <div className="p-6 w-full max-w-5xl bg-white mx-auto mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dynamically render queue cards for each department */}
            {updateQueue && updateQueue.map((queue) => (
              <div key={queue.id} className="bg-[#D9D9D9] bg-opacity-75 shadow rounded-lg p-4 text-center relative">
                <h2 className="font-bold text-lg">{queue.department_name}</h2>
                <p className="text-8xl font-medium">{queue.total}</p>
                <div className="flex justify-between mt-4">
                  {/* Increment button centered */}
                  <button
                    onClick={() => incrementQueue(queue.id)}
                    className="bg-[#6CB6AD] text-white p-4 rounded-md shadow-md hover:bg-red-600 transition w-16"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                {/* Decrement and Clear buttons */}
                <div className="flex justify-between mt-4">
                  {queue.total > 0 && (
                    <button
                      onClick={() => decrementQueue(queue.id)}
                      className="bg-[#6CB6AD] text-white p-2 rounded-md shadow-md hover:bg-red-600 transition"
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                  )}
                  <button
                    onClick={() => clearQueue(queue.id)}
                    className="bg-[#6CB6AD] text-white p-2 rounded-md shadow-md hover:bg-red-600 transition"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default QueuePage;
