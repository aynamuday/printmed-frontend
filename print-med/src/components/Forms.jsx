import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/images/logo.png';
import AppContext from '../context/AppContext'; // Adjust the path as necessary

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
    physician: '',
  });

  const [patients, setPatients] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useContext(AppContext); // Access token and user from AppContext

  useEffect(() => {
    // Fetch existing patients from the API
    fetch('/api/patients/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));

    // Set physician from the user data
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        physician: user.username, // Assuming the user object has a username field
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirmMessage = `Is all information correct?\n\n${JSON.stringify(formData, null, 2)}`;

    if (window.confirm(confirmMessage)) {
      setIsSubmitting(true);

      const newID = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 0;

      const newPatient = {
        id: newID,
        ...formData,
      };

      // Save the new patient to the API
      fetch('/api/patients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the request
        },
        body: JSON.stringify(newPatient),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('New Patient Record:', data);
          setSuccessMessage('Patient added successfully!');
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
            physician: user.username, // Reset physician to current user's username
          });
          setPatients((prevPatients) => [...prevPatients, data]);
          setIsSubmitting(false);
        })
        .catch((error) => {
          console.error('Error adding patient:', error);
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white items-center justify-center w-full md:w-[100%]">
      <div className="w-full md:w-[70%] md:ml-[20%]">
        <h2 className="text-2xl font-semibold text-center mb-4 -mt-10">Add Patient Record</h2>
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
        <form onSubmit={handleSubmit} className="px-8">
          <div className="grid grid-cols-7 gap-4">
            <div className="col-span-2">
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
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="col-span-2">
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
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Suffix:</label>
              <input
                type="text"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="col-span-2">
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
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Sex:</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="" disabled>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-span-4">
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
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Civil Status:</label>
              <select
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="" disabled>Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="It's Complicated">It's Complicated</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Religion:</label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="" disabled>Select Your Religion</option>
                <option value="Roman Catholic">Roman Catholic</option>
                <option value="Muslim">Muslim</option>
                <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                <option value="Jehovas Witnesses">Jehovas Witnesses</option>
                <option value="Born Again">Born Again</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Hindu">Hindu</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="col-span-2">
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
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Physician:</label>
              <input
                type="text"
                name="physician"
                value={formData.physician}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                readOnly
              />
            </div>
            <div className="mt-6 col-end-8 col-span-2">
              <button
                type="submit"
                className={`w-full p-2 text-white bg-blue-600 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Add Patient'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forms;
