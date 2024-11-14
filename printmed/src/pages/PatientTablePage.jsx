import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const PatientTablePage = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 30, gender: 'Male' },
    { id: 2, name: 'Jane Smith', age: 25, gender: 'Female' },
    { id: 3, name: 'Alice Johnson', age: 40, gender: 'Female' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortGender, setSortGender] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortGender(e.target.value);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Filter and sort patients based on search term, gender, field, and order
  const filteredPatients = patients
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(patient => 
      sortGender === 'All' || patient.gender === sortGender
    )
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleViewClick = (id) => {
    navigate(`/patients/${id}`);
  };

  return (
    <>
      <Sidebar />
      <Header />
      
      <div className="w-full md:w-[75%] md:ml-[22%] p-6">
        <h1 className="text-2xl font-bold mb-4">Patients</h1>
        
        <div className="flex gap-4 mb-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded-md"
          />

          {/* Gender sorting dropdown */}
          <select
            value={sortGender}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Sort field dropdown */}
          <select
            value={sortField}
            onChange={handleSortFieldChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="name">Alphabetical</option>
            <option value="age">Age</option>
            <option value="id">ID</option>
          </select>

          {/* Sort order dropdown */}
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">ID</th>
              <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[40%]">Name</th>
              <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Age</th>
              <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[20%]">Gender</th>
              <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="p-2 border text-center border-[#828282]">{patient.id}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.name}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.age}</td>
                <td className="p-2 border text-center border-[#828282]">{patient.gender}</td>
                <td className="p-2 border text-center border-[#828282]">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-[#6CB6AD] text-white px-4 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleViewClick(patient.id)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PatientTablePage;
