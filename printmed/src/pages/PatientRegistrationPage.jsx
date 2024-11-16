import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const PatientRegistrationPage = () => {
    const [patients, setPatients] = useState([
        { 
            registrationNo: 1, 
            email: 'johndoe@gamil.com',
            name: 'John Doe', 
            age: 35, 
            address: 'Langkiwa',
            contact: '09123456789', 
            idType: 'National ID',
            registrationDate: '2023-11-01' 
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null); // Track selected patient

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter patients based on the search term
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle viewing patient details
    const handleViewDetails = (patient) => {
        setSelectedPatient(patient); // Set the selected patient to display details
    };

    // Function to handle closing patient details view
    const handleCloseDetails = () => {
        setSelectedPatient(null); // Clear selected patient
    };

    return (
        <>
            <Sidebar />
            <Header />

            <div className="w-full md:w-[75%] md:ml-[22%] p-6">
                <h1 className="text-2xl font-bold mb-4">Patient Registration</h1>

                {/* Search Filter */}
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Patient Registration Table */}
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Registration No.</th>
                            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[30%]">Name</th>
                            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Age</th>
                            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[20%]">Contact Number</th>
                            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[25%]">Registration Date</th>
                            <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Action</th> {/* Action Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="p-2 border text-center border-[#828282]">{patient.registrationNo}</td>
                                <td className="p-2 border text-center border-[#828282]">{patient.name}</td>
                                <td className="p-2 border text-center border-[#828282]">{patient.age}</td>
                                <td className="p-2 border text-center border-[#828282]">{patient.contact}</td>
                                <td className="p-2 border text-center border-[#828282]">{patient.registrationDate}</td>
                                <td className="p-2 border text-center border-[#828282]">
                                    <button
                                        onClick={() => handleViewDetails(patient)} // Trigger view on button click
                                        className="bg-[#6CB6AD] text-white px-4 py-2 rounded"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Display selected patient details */}
                {selectedPatient && (
                    <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
                        <p><strong>Name:</strong> {selectedPatient.name}</p>
                        <p><strong>Age:</strong> {selectedPatient.age}</p>
                        <p><strong>Contact:</strong> {selectedPatient.contact}</p>
                        <p><strong>Address:</strong> {selectedPatient.address}</p>
                        <p><strong>Email:</strong> {selectedPatient.email}</p>
                        <p><strong>Type of ID:</strong> {selectedPatient.idType}</p>
                        <p><strong>Registration Date:</strong> {selectedPatient.registrationDate}</p>
                        <button
                            onClick={handleCloseDetails}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default PatientRegistrationPage;
