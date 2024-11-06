import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import Swal from 'sweetalert2';

const PatientRecord = () => {
  const { user } = useContext(AppContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [patientFindings, setPatientFindings] = useState([]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);
      setNewFinding((prevFinding) => ({
        ...prevFinding,
        dateConsulted: now.toLocaleString(),
      }));
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  const patientList = [
    {
      id: 1,
      firstName: 'Salma',
      middleName: 'Fae',
      lastName: 'Lumaogang',
      suffix: 'A.',
      birthday: '2003-08-09',
      address: 'Blk 17 Lot 23 Silcas Southwoods Laguna City',
      birthplace: 'Parańaque City',
      civilStatus: 'Married',
      gender: 'Female',
      religion: 'Catholic',
      phoneNumber: '09217376109',
      findings: [
        {
          presumption: 'Migraine',
          dateConsulted: '2020-08-09',
          details: {
            bloodPressure: '80/120',
            temperature: '38°C',
            weight: '50 kg',
            height: "5'5\"",
            diagnosis: 'Vomiting and sudden pass out',
            medication: 'Medicol 500 mg every 6 hours',
            advice: 'Avoid exposure to light, drink more water',
            otherComplaints: 'N/A',
            physician: 'Dr. Wilhelmina Lopez',
            paymentAmount: '₱ 1000.00',
          },
        },
        {
          presumption: 'Flu',
          dateConsulted: '2020-10-15',
          details: {
            bloodPressure: '120/80',
            temperature: '37.5°C',
            weight: '55 kg',
            height: "5'6\"",
            diagnosis: 'Sore throat and fever',
            medication: 'Paracetamol 500 mg every 6 hours',
            advice: 'Rest and drink plenty of fluids',
            otherComplaints: 'N/A',
            physician: 'Dr. John Doe',
            paymentAmount: '₱ 500.00',
          },
        },
      ],
    },
  ];

  const [newFinding, setNewFinding] = useState({
    presumption: '',
    dateConsulted: new Date().toLocaleString(),
    details: {
      bloodPressure: '',
      temperature: '',
      weight: '',
      height: '',
      diagnosis: '',
      medication: '',
      advice: '',
      physician: '',
      paymentAmount: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the field is inside the details object
    if (name in newFinding.details) {
      setNewFinding((prevState) => ({
        ...prevState,
        details: {
          ...prevState.details,
          [name]: value, // Update the specific field inside the details object
        },
      }));
    } else {
      setNewFinding((prevState) => ({
        ...prevState,
        [name]: value, // For fields outside details
      }));
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    let newErrors = {};
    let formIsValid = true;
  
    console.log("Form Data on Submit:", newFinding);
  
    // Validation checks (same as before)
    if (!newFinding.presumption) {
      newErrors.presumption = 'Presumption is required';
      formIsValid = false;
    }
    if (!newFinding.dateConsulted) {
      newErrors.dateConsulted = 'Date is required';
      formIsValid = false;
    }
    if (!newFinding.details.bloodPressure) {
      newErrors.bloodPressure = 'Blood pressure is required';
      formIsValid = false;
    }
    if (!newFinding.details.temperature) {
      newErrors.temperature = 'Temperature is required';
      formIsValid = false;
    }
    if (!newFinding.details.weight) {
      newErrors.weight = 'Weight is required';
      formIsValid = false;
    }
    if (!newFinding.details.height) {
      newErrors.height = 'Height is required';
      formIsValid = false;
    }
    if (!newFinding.details.diagnosis) {
      newErrors.diagnosis = 'Diagnosis is required';
      formIsValid = false;
    }
    if (!newFinding.details.medication) {
      newErrors.medication = 'Medication is required';
      formIsValid = false;
    }
    if (!newFinding.details.advice) {
      newErrors.advice = 'Advice is required';
      formIsValid = false;
    }
    if (!newFinding.details.paymentAmount) {
      newErrors.paymentAmount = 'Payment amount is required';
      formIsValid = false;
    }
    if (!newFinding.details.physician) {
      newErrors.physician = 'Physician is required';
      formIsValid = false;
    }
  
    setErrors(newErrors);
  
    if (!formIsValid) {
      Swal.fire({
        icon: 'error',
        title: 'Complete The Forms',
        text: 'Please fill in all the input fields.',
      });
      return;
    }
  
    // Show confirmation dialog before saving
    Swal.fire({
      title: 'Are you sure you want to save this new OPD finding?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save finding!',
      cancelButtonText: 'Cancel',
      position: 'center',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          console.log('New opd finding added successfully:', newFinding);
  
          // Update the list of findings with the new finding
          setPatientFindings((prevFindings) => [...prevFindings, newFinding]);
  
          // Reset the form
          setNewFinding({
            presumption: '',
            details: {
              bloodPressure: '',
              temperature: '',
              weight: '',
              height: '',
              diagnosis: '',
              medication: '',
              advice: '',
              otherComplaints: '',
              physician: '',
              paymentAmount: '',
            },
          });
          
          setShowForm(false); // Hide the form
          setSelectedFinding(null); // Deselect the selected finding
  
          Swal.fire({
            title: 'Success!',
            text: 'New OPD finding has been saved.',
            icon: 'success',
            confirmButtonText: 'OK',
            position: 'center',
          });
  
        } catch (error) {
          console.error('Error adding new opd finding:', error);
          setErrorMessage('There was error adding new opd finding. Please check the details.');
        }
      }
    });
  };
  

  const handleView = (patient) => {
    setSelectedPatient(patient);
  };

  const handleFindingClick = (finding) => {
    setSelectedFinding(finding);
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setSelectedFinding(null);
  };

  const handleAddFinding = () => {
    setShowForm(true); // Show the form and hide existing findings
  };

  const handleCancel = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure you want to cancel?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Hide the form without saving
        setShowForm(false); // Hide the form
        setNewFinding({
          presumption: '',
            details: {
              bloodPressure: '',
              temperature: '',
              weight: '',
              height: '',
              diagnosis: '',
              medication: '',
              advice: '',
              otherComplaints: '',
              physician: '',
              paymentAmount: '',
            },
        }); // Clear all fields
      }
    });
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-section').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="w-full mr-10 md:w-[75%] md:ml-[25%]">
      <div className="grid grid-cols-2 gap-4 mt-10">
        {!selectedPatient ? (
          <>
            <h2 className="text-2xl mb-4 mt-4">Patient Records</h2>
            <div className="flex items-center rounded-md px-4 duration-300 cursor-pointer bg-[#D9D9D9] w-[90%] h-[80%]">
              <i className="bi bi-search text-sm"></i>
              <input
                className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
                placeholder="Search"
              />
            </div>
          </>
        ) : (
          <h2 className="text-2xl mb-4 mt-4">Patient No. {selectedPatient.id}</h2>
        )}
      </div>

      <div className="w-full flex flex-col items-center mt-10">
        {!selectedPatient ? (
          <table className="min-w-[90%] bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Patient No.</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Birthday</th>
                <th className="py-2 px-4 border">Sex</th>
                <th className="py-2 px-4 border">Physician</th>
                <th className="py-2 px-4 border">Last Visit</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {patientList.map((patient) => (
                <tr key={patient.id} className="border-b">
                  <td className="py-2 px-4">{patient.id}</td>
                  <td className="py-2 px-4">{`${patient.firstName} ${patient.middleName} ${patient.lastName} ${patient.suffix}`}</td>
                  <td className="py-2 px-4">{patient.birthday}</td>
                  <td className="py-2 px-4">{patient.gender}</td>
                  <td className="py-2 px-4">{patient.findings[0]?.details.physician || 'N/A'}</td>
                  <td className="py-2 px-4">N/A</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleView(patient)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Patient Details and OPD Findings Display
          <div className="flex w-3/4 bg-white shadow rounded-lg">
            {/* Patient Details Section */}
            <div className="w-1/2 p-4 border-r bg-[#D9D9D9]">
              <h3 className="text-xl font-semibold mb-2 text-black">Details</h3>
              <p><strong>Name:</strong> {`${selectedPatient.firstName} ${selectedPatient.middleName} ${selectedPatient.lastName} ${selectedPatient.suffix}`}</p>
              <p><strong>Age:</strong> {new Date().getFullYear() - new Date(selectedPatient.birthday).getFullYear()}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Birthday:</strong> {selectedPatient.birthday}</p>
              <p><strong>Birthplace:</strong> {selectedPatient.birthplace}</p>
              <p><strong>Civil Status:</strong> {selectedPatient.civilStatus}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Religion:</strong> {selectedPatient.religion}</p>
              <p><strong>Phone Number:</strong> {selectedPatient.phoneNumber}</p>
            </div>

            {/* OPD Findings Section */}
            <div className="w-1/2 p-4">
              <div className="flex justify-between items-center mb-2 text-black">
                <h3 className="text-xl font-semibold">OPD Findings</h3>
                <button className="text-white" aria-label="Plus">
                  {!selectedFinding && !showForm ? (
                    <i
                      className="bi bi-plus text-xl text-black"
                      onClick={handleAddFinding}
                    ></i>
                  ) : selectedFinding ? (
                    <i
                      className="bi bi-printer text-xl text-black"
                      onClick={handlePrint}
                    ></i>
                  ) : null}
                </button>
              </div>

              {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
              
              {showForm ? (
              <form className="mt-4 p-4 border rounded bg-gray-100" onSubmit={handleFormSubmit}>
                <h3 className="text-lg font-semibold">Add New Finding</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block mb-1">Physician:</label>
                    <input
                      type="text"
                      name="physician" // Corresponds to the name of the field inside details
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newFinding.details.physician || ''}  // Ensure it defaults to an empty string
                      onChange={handleChange}
                    />
                    {errors.physician && <p className="text-red-500 text-sm">{errors.physician}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Presumption:</label>
                    <input
                      type="text"
                      name="presumption"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newFinding.presumption || ''}
                      onChange={handleChange}
                    />
                    {errors.presumption && <p className="text-red-500 text-sm">{errors.presumption}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Date Today:</label>
                    <input
                      type="text"
                      name="dateConsulted"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                      value={newFinding.dateConsulted || ''}
                      readOnly
                    />
                    {errors?.dateConsulted && <p className="text-red-500 text-sm">{errors.dateConsulted}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Blood Pressure:</label>
                    <input
                      type="text"
                      name="bloodPressure"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newFinding.details.bloodPressure || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.bloodPressure && <p className="text-red-500 text-sm">{errors.bloodPressure}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Temperature:</label>
                    <input
                      type="text"
                      name="temperature"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newFinding.details.temperature || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.temperature && <p className="text-red-500 text-sm">{errors.temperature}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Weight:</label>
                    <input
                      type="text"
                      name="weight"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newFinding.details.weight || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Height:</label>
                    <input
                      type="text"
                      name="height"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newFinding.details.height || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Diagnosis:</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded resize-y"
                      rows="3"
                      name="diagnosis"
                      value={newFinding.details.diagnosis || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.diagnosis && <p className="text-red-500 text-sm">{errors.diagnosis}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Medication:</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded resize-y"
                      rows="3"
                      name="medication"
                      value={newFinding.details.medication || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.medication && <p className="text-red-500 text-sm">{errors.medication}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Advice:</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded resize-y"
                      rows="3"
                      name="advice"
                      value={newFinding.details.advice || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.advice && <p className="text-red-500 text-sm">{errors.advice}</p>}
                  </div>
              
                  <div>
                    <label className="block mb-1">Payment Amount:</label>
                    <input
                      type="text"
                      name="paymentAmount"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newFinding.details.paymentAmount || ''}  // Nested field in details
                      onChange={handleChange}
                    />
                    {errors.paymentAmount && <p className="text-red-500 text-sm">{errors.paymentAmount}</p>}
                  </div>
              
                  <button
                    type="submit"
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              
              ) : (
                <>
                  {selectedFinding ? (
                    <div id="print-section">
                      <p><strong>History of Illness:</strong> {selectedFinding.presumption}</p>
                      <p><strong>Blood Pressure:</strong> {selectedFinding.details.bloodPressure}</p>
                      <p><strong>Temperature:</strong> {selectedFinding.details.temperature}</p>
                      <p><strong>Weight:</strong> {selectedFinding.details.weight}</p>
                      <p><strong>Height:</strong> {selectedFinding.details.height}</p>
                      <p><strong>Diagnosis:</strong> {selectedFinding.details.diagnosis}</p>
                      <p><strong>Medication:</strong> {selectedFinding.details.medication}</p>
                      <p><strong>Advice:</strong> {selectedFinding.details.advice}</p>
                      <p><strong>Other Complaints:</strong> {selectedFinding.details.otherComplaints}</p>
                      <p><strong>Physician:</strong> {selectedFinding.details.physician}</p>
                      <p><strong>Date Consulted:</strong> {selectedFinding.dateConsulted}</p>
                      <p><strong>Payment Amount:</strong> {selectedFinding.details.paymentAmount}</p>
                      <button
                        className="bg-gray-300 px-4 py-2 rounded mt-4"
                        onClick={() => setSelectedFinding(null)}
                      >
                        Back to Findings
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center rounded-md px-4 duration-300 cursor-pointer bg-[#D9D9D9] mb-4 h-10">
                        <i className="bi bi-search text-sm"></i>
                        <input
                          className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
                          placeholder="Search OPD Findings"
                        />
                      </div>
                      <table className="min-w-full bg-white shadow rounded-lg">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">History of Illness</th>
                            <th className="py-2 px-4 border">Date Consulted</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientFindings.map((finding, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-4">
                                <button
                                  className="text-blue-500 underline"
                                  onClick={() => handleFindingClick(finding)}
                                >
                                  {finding.presumption}
                                </button>
                              </td>
                              <td className="py-2 px-4">{finding.dateConsulted}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </>
              )}
              <button
                className="bg-gray-300 px-4 py-2 rounded mt-4"
                onClick={handleClose}
              >
                Close Patient Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecord;
