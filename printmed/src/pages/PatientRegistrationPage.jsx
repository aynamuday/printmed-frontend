import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AppContext from '../context/AppContext';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader

const PatientRegistrationPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);  // Use the context to get the token
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); // Track selected patient
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // To manage pagination
  
  // Fetch registrations from the API
  const getRegistrations = async (page = 1, searchTerm = '') => {
    setLoading(true);
    let url = `/api/registrations?page=${page}`;
    
    if (searchTerm.trim() !== "") {
      url += `&search=${searchTerm}`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`  // Using token from context
        }
      });

      const data = await res.json();
      setPatients(data.data);  // Assuming the response has a 'data' property containing the patients
      setTotalPages(data.last_page); // Assuming the response has pagination info like last_page
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when searchTerm or page changes
  useEffect(() => {
    getRegistrations(page, searchTerm);
  }, [page, searchTerm]);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Filter patients based on the search term
  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle viewing patient details
  const handleViewDetails = (patient) => {
    navigate('/add-patient', { state: { patient } }); // Redirect with patient data
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

        <div className="grid grid-cols-2 gap-4 items-center mb-4">
            <div className="flex gap-4">
                {/* Search Filter */}
                <input
                    type="text"
                    placeholder="Search by Registration ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end items-center">
            <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page <= 1} 
                className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] text-white text-sm ${page <= 1 ? 'bg-opacity-70' : ''}`}>
                &lt;
            </button>

            <button className="px-4 h-8 border border-[#6CB6AD] text-sm" disabled>
                {page} OF {totalPages}
            </button>

            <button
                onClick={() => handlePageChange(page + 1)} 
                disabled={page >= totalPages} 
                className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] text-white text-sm ${page >= totalPages ? 'bg-opacity-70' : ''}`}>
                &gt;
            </button>
            </div>
        </div>
        {/* Patient Registration Table */}
        {!loading && (
            <table className="w-full border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[5%]">ID</th>
                    <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Registration ID</th>
                    <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[20%]">First Name</th>
                    <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[20%]">Last Name</th>
                    <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[20%]">Birthdate</th>
                    <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Sex</th>
                    <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Action</th>
                </tr>
                </thead>
                <tbody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient, index) => (
                      <tr key={index}>
                        <td className="p-2 border text-center border-[#828282]">{patient.id}</td>
                        <td className="p-2 border text-center border-[#828282]">{patient.registration_id}</td>
                        <td className="p-2 border text-center border-[#828282]">{patient.first_name}</td>
                        <td className="p-2 border text-center border-[#828282]">{patient.last_name}</td>
                        <td className="p-2 border text-center border-[#828282]">{patient.birthdate}</td>
                        <td className="p-2 border text-center border-[#828282]">{patient.sex}</td>
                        <td className="p-2 border text-center border-[#828282]">
                          <button
                            onClick={() => handleViewDetails(patient)}
                            className="bg-[#6CB6AD] text-white px-4 py-2 rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="border p-2 border-[#828282] text-center">
                        No patients
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
            )}

            {/* Loading spinner (PulseLoader) */}
            {loading && (
            <div className="flex justify-center items-center py-6">
                <PulseLoader color="#6CB6AD" loading={loading} size={15} />
            </div>
            )}
      </div>
    </>
  );
};

export default PatientRegistrationPage;
