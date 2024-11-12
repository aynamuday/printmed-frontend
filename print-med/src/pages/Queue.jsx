import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import QueueManagerContext from '../context/QueueManagerContext';
import CardsQueueing from '../components/CardsQueueing'; // Import CardsQueueing

const Queue = () => {
  const { token } = useContext(AppContext);
  const { updateQueue } = useContext(QueueManagerContext);

  const [departmentQueues, setDepartmentQueues] = useState([]);

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
        setDepartmentQueues(data);
        console.log("API connected successfully and data fetched.");
      })
      .catch(error => console.error("Error fetching department queues:", error));
  }, [token]);

  // Handle increment of queue
  const incrementQueue = (queueId) => {
    fetch(`/api/queue/${queueId}/increment-total`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        updateQueue(data.department_name, data.total);
      })
      .catch(error => console.error("Error incrementing queue:", error));
  };

  // Handle decrement of queue
  const decrementQueue = (queueId) => {
    fetch(`/api/queue/${queueId}/decrement-total`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        updateQueue(data.department_name, data.total);
      })
      .catch(error => console.error("Error decrementing queue:", error));
  };

  // Handle clearing the queue
  const clearQueue = (queueId) => {
    fetch(`/api/queue/${queueId}/clear`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(() => {
        updateQueue('department_name', 0);
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
            {/* Dynamically render CardsQueueing for each department */}
            {departmentQueues && departmentQueues.map((queue, index) => (
              <CardsQueueing
                key={queue.id}
                queue={queue}
                incrementQueue={() => incrementQueue(queue.id)}
                decrementQueue={() => decrementQueue(queue.id)}
                clearQueue={() => clearQueue(queue.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Queue;
