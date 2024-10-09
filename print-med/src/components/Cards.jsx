import data from '../data/dashboardData.json';

const Cards = () => {
    const dashboardInfo = data.dashboardData[0];

  return (
    <div className="w-full md:w-[80%] md:ml-[20%]">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-gray-500">Queue No.</h2>
            <p className="text-2xl font-bold">{dashboardInfo.queueNumber}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-gray-500">Waiting Patients</h2>
            <p className="text-2xl font-bold">{dashboardInfo.waitingPatients}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-gray-500">Completed Patients</h2>
            <p className="text-2xl font-bold">{dashboardInfo.completedPatients}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-gray-500">Total Payments</h2>
            <p className="text-2xl font-bold">{dashboardInfo.totalPayments}</p>
          </div>
        </div>
    </div>
  );
};

export default Cards;
