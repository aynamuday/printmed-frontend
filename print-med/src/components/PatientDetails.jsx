const PatientDetails = ({ patient, onClose }) => {
    return (
      <div className="mt-4 p-4 bg-white shadow-lg rounded">
        <h1 className="text-xl font-bold">Patient No. {patient.id}</h1>
        <div className="flex justify-between mt-4">
          <div className="w-1/2">
            <h2 className="text-lg font-semibold">Details</h2>
            <div className="mt-2">
              <p>Name: <span className="font-medium">{patient.name}</span></p>
              <p>Age: <span className="font-medium">{patient.age}</span></p>
              <p>Sex: <span className="font-medium">Female</span></p>
              <p>Address: <span className="font-medium">Blk 17 Lot 23 Silcas Southwoods, Biñan City, Laguna</span></p>
              <p>Birthday: <span className="font-medium">September 9, 2003</span></p>
              <p>Birthplace: <span className="font-medium">Parañaque City</span></p>
              <p>Civil Status: <span className="font-medium">Married</span></p>
              <p>Religion: <span className="font-medium">Catholic</span></p>
              <p>Mobile Number: <span className="font-medium">09217376109</span></p>
            </div>
          </div>
  
          <div className="w-1/2">
            <h2 className="text-lg font-semibold">Findings</h2>
            <div className="mt-2">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border">Presumption</th>
                    <th className="py-2 px-4 border">Date Consulted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4">
                      <a href="findings.html" className="text-blue-600">Migraine</a>
                    </td>
                    <td className="py-2 px-4">08-09-2021</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    );
  };

  export default PatientDetails;