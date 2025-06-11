const FoundPatientPopup = ({ isOpen, onClose, patient, viewPatient }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
        <div className="bg-white rounded-md flex justify-items-center flex-col pt-4 pb-8 px-8 max-h-[70vh] overflow-y-auto">
            <i className="bi bi-person-check block text-[60px] text-center text-[#52a1fd]"></i>
            <p className="text-center font-bold text-xl text-black">Found Patient</p>
            <table className="min-w-[600px] w-full border-collapse mt-4">
                <thead>
                    <tr>
                    <th className="border-b-[2px] border-[#696969] text-center p-2">Patient No.</th>
                    <th className="border-b-[2px] border-[#696969] text-center p-2">Name</th>
                    <th className="border-b-[2px] border-[#696969] text-center p-2">Photo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-b-[1px] border-[#696969] max-w-[150px] text-center p-2 align-top px-6">{patient.patient_number}</td>
                        <td className="border-b-[1px] border-[#696969] max-w-[150px] text-center p-2 align-top px-6">{patient.first_name} {patient.last_name}</td>
                        <td className="border-b-[1px] border-[#696969] text-center p-2 align-top px-6">
                        <div className="w-full flex justify-center items-center">
                            <img src={patient.photo_url ?? ""} className="max-w-[80%] max-h-[120px]"/>
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={viewPatient} className="py-2 px-4 bg-[#248176] hover:bg-blue-600 text-white rounded-md">View Patient</button>
                <button onClick={onClose} className="py-2 px-4 bg-[#b33c39] hover:bg-[#e34441] text-white rounded-md">Cancel</button>
            </div>
        </div>
    </div>
  );
};

export default FoundPatientPopup;
