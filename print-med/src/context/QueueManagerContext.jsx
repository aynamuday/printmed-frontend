import React, { createContext, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';

const QueueManagerContext = createContext();

export const QueueManagerProvider = () => {
  const [queues, setQueues] = useState({
    pediaQueue: 0,
    neuroQueue: 0,
    entQueue: 0,
  });

  // Update queue counts
  const updateQueue = (type, count) => {
    setQueues((prevQueues) => ({
      ...prevQueues,
      [type]: count,
    }));
  };

  return (
    <QueueManagerContext.Provider value={{ queues, updateQueue }}>
      <Outlet />
    </QueueManagerContext.Provider>
  );
};

export default QueueManagerContext;
