import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { useUser } from '../components/UserContext';

const Forms = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthday: '',
    sex: '',
    address: '',
    civilStatus: '',
    religion: '',
    phoneNumber: '',
    physician: '', // Add the physician field
  });

  const [patients, setPatients] = useState([]);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle submission status
  const { currentUser } = useUser(); // State for current user

  useEffect(() => {
    // Fetch existing patients to determine the next ID
    fetch('http://localhost:8000/patients')
      .then((response) => response.json())
      .then((data) => setPatients(data));

    // Fetch the current user (this could be from an API, local storage, or context)
    if (currentUser) {
      setFormData(prevData => ({
        ...prevData,
        physician: currentUser.username, // Set physician as the currentUser's username
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prompt the user to confirm the information
    const confirmMessage = `Is all information correct?\n\n${JSON.stringify(formData, null, 2)}`;
    
    if (window.confirm(confirmMessage)) {
      setIsSubmitting(true); // Set submitting state

      // Calculate the next ID based on existing patients
      const newID = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 0;

      // Prepare the new patient record with the calculated ID
      const newPatient = {
        id: newID, // Set the calculated ID
        ...formData,
      };

      // Save the new patient to patientsName.json using json-server
      fetch('http://localhost:8000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('New Patient Record:', data);
          setSuccessMessage('Patient added successfully!'); // Show success message
          // Reset form after submission
          setFormData({
            firstName: '',
            middleName: '',
            lastName: '',
            suffix: '',
            birthday: '',
            sex: '',
            address: '',
            civilStatus: '',
            religion: '',
            phoneNumber: '',
            physician: '', // Reset the doctor field to the current user
          });
          // Update patients list with the new patient
          setPatients((prevPatients) => [...prevPatients, data]);
          setIsSubmitting(false); // Reset submitting state
        })
        .catch((error) => {
          console.error('Error adding patient:', error);
          setIsSubmitting(false); // Reset submitting state on error
        });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white items-center justify-center w-full md:w-[100%]">
      <div className="w-full md:w-[70%] md:ml-[20%]">
        <h2 className="text-2xl font-semibold text-center mb-4">Add Patient Record</h2>
      </div>

      {successMessage && (
        <div className="mb-4 text-green-600 text-center">
          {successMessage}
        </div>
      )}

      <div className="w-full md:w-[70%] md:ml-[20%] bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="p-2.5 mt-1 flex justify-center items-center rounded-md bg-gray-100">
          <img src={logo} className="h-20" alt="Logo" />
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Middle Name:</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Suffix:</label>
            <input
              type="text"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sex:</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Select Your Sex</option> {/* Default option */}
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Civil Status:</label>
            <select
              name="civilStatus"
              value={formData.civilStatus}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Select Your Civil Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Its Complicated">It's Complicated</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Religion:</label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Physician:</label>
            <input
              type="text"
              name="physician"
              value={formData.physician}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              disabled // Make the input read-only or remove this if you want to keep it editable
              required
            />
          </div>
          <div className="col-span-3 flex justify-center mt-4">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded-md shadow ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Patient Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forms;
