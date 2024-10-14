import React, { useState } from 'react';
import logo from '../assets/images/logo.png';

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the new patient record
    const newPatient = {
      id: String(Date.now()), // Generate a unique ID based on timestamp
      ...formData,
    };

    // Save the new patient to patientRecords.json (placeholder logic)
    // You would need an API call or another method to actually save this to a file
    console.log('New Patient Record:', newPatient);

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
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white items-center justify-center w-full md:w-[100%]">
      <div className="w-full md:w-[70%] md:ml-[20%]">
        <h2 className="text-2xl font-semibold text-center mb-4">Add Patient Record</h2>
      </div>
      
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
            <input
              type="text"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
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
            <input
              type="text"
              name="civilStatus"
              value={formData.civilStatus}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Biometrics:</label>
            <button className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-green-600 text-white py-2">
              Scan Fingerprint
            </button>
          </div>
          <div className="mt-4 text-center col-span-3">
            <button type="submit" className="text-white px-4 py-2 rounded bg-[#6CB6AD]">
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forms;
