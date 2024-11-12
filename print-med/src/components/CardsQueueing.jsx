import React, { useContext } from 'react';
import QueueManagerContext from '../context/QueueManagerContext';

const CardsQueueing = ({ queue }) => {
  const { updateQueue } = useContext(QueueManagerContext);

  const incrementQueue = () => {
    const newTotal = queue.total + 1;
    updateQueue(queue.department_name, newTotal);
  };

  const decrementQueue = () => {
    const newTotal = queue.total > 0 ? queue.total - 1 : 0;
    updateQueue(queue.department_name, newTotal);
  };

  const clearQueue = () => {
    updateQueue(queue.department_name, 0);
  };

  return (
    <div className="bg-[#D9D9D9] bg-opacity-75 shadow rounded-lg p-4 text-center relative">
      <h2 className="font-bold text-lg">{queue.department_name}</h2>
      <p className="text-8xl font-medium">{queue.total}</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={incrementQueue}
          className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition"
        >
          <i className="bi bi-plus"></i>
        </button>
        <button
          onClick={decrementQueue}
          className="bg-red-500 text-white p-2 rounded-md shadow-md hover:bg-red-600 transition"
        >
          <i className="bi bi-dash"></i>
        </button>
      </div>
      <button
        onClick={clearQueue}
        className="absolute top-2 right-2 text-3xl text-gray-700 hover:text-gray-900"
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
};

export default CardsQueueing;
