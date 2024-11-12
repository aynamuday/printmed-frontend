import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const QueueManagerContext = createContext();

export const QueueManagerProvider = () => {
  const [queue, setQueue] = useState([]);

  // Update the queue total for a specific department
  const updateQueue = (departmentName, newTotal) => {
    setQueue(prevQueues => 
      prevQueues.map(queue =>
        queue.department_name === departmentName
          ? { ...queue, total: newTotal }
          : queue
      )
    );
  };

  // Increment the queue total for a department
  const incrementQueue = (queueId) => {
    setQueue(prevQueues =>
      prevQueues.map(queue =>
        queue.id === queueId
          ? { ...queue, total: queue.total + 1 }
          : queue
      )
    );
  };

  // Decrement the queue total for a department (ensure total doesn't go below 0)
  const decrementQueue = (queueId) => {
    setQueue(prevQueues =>
      prevQueues.map(queue =>
        queue.id === queueId
          ? { ...queue, total: queue.total > 0 ? queue.total - 1 : 0 }
          : queue
      )
    );
  };

  // Clear the queue for a specific department (set total to 0)
  const clearQueue = (queueId) => {
    setQueue(prevQueues =>
      prevQueues.map(queue =>
        queue.id === queueId
          ? { ...queue, total: 0 }
          : queue
      )
    );
  };

  // Add a new queue to the list
  const addQueue = (newQueue) => {
    setQueue(prevQueues => [...prevQueues, newQueue]);
  };

  // Remove a queue from the list
  const removeQueue = (queueId) => {
    setQueue(prevQueues => prevQueues.filter(queue => queue.id !== queueId));
  };

  return (
    <QueueManagerContext.Provider value={{ queue, updateQueue, addQueue, removeQueue, incrementQueue, decrementQueue, clearQueue }}>
      <Outlet />
    </QueueManagerContext.Provider>
  );
};

export default QueueManagerContext;
