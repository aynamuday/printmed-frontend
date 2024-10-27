const PatientInfo = ({ patient }) => (
    <div className="w-1/2">
      <h2 className="text-lg font-semibold">Details</h2>
      <div className="mt-2">
        <p>Name: <span className="font-medium">{`${patient.firstName} ${patient.middleName} ${patient.lastName}`}</span></p>
        <p>Sex: <span className="font-medium">{patient.sex}</span></p>
        <p>Address: <span className="font-medium">{patient.address}</span></p>
        <p>Birthday: <span className="font-medium">{patient.birthday}</span></p>
        <p>Civil Status: <span className="font-medium">{patient.civilStatus}</span></p>
        <p>Religion: <span className="font-medium">{patient.religion}</span></p>
        <p>Mobile Number: <span className="font-medium">{patient.phoneNumber}</span></p>
        <p>Physician: <span className="font-medium">{patient.physician}</span></p>
      </div>
    </div>
  );
  
  export default PatientInfo;
  