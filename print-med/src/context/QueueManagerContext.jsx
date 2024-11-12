import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const QueueManagerContext = createContext();

export const QueueManagerProvider = () => {
  const [updateQueue, setUpdateQueue] = useState([]);

  return (
    <QueueManagerContext.Provider value={{ updateQueue, setUpdateQueue }}>
      <Outlet />
    </QueueManagerContext.Provider>
  );
};

export default QueueManagerContext;
