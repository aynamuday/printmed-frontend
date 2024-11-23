import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import { PulseLoader } from 'react-spinners';
import PhysicianContext from '../context/PhysicianContext';
import PatientsTable from '../components/PatientsTable';
import SecretaryContext from '../context/SecretaryContext';

const PatientTablePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const {
    patientsAll,
    setPatientsAll,
    patientsAllFilters,
    setPatientsAllFilters,
  } = useContext(SecretaryContext, PhysicianContext);

  const [loadingPatients, setLoadingPatients] = useState(false);

  // Function to fetch patients
  const getPatients = async (page = 1, search = '', sortField = '', sortOrder = 'asc') => {
    let url = `/api/patients?page=${page}`;

    if (search.trim() !== '') {
      url += `&search=${search}`;
    }
    if (sortField.trim() !== '') {
      url += `&sort_by=${sortField}`;
    }
    if (sortOrder.trim() !== '') {
      url += `&sort_direction=${sortOrder}`;
    }

    setLoadingPatients(true);
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setPatientsAll(data);
    
    setLoadingPatients(false);
  };

  useEffect(() => {
    if (!patientsAll.data || patientsAll.data.length < 1) { // Add a check to see if patientsAll.data is undefined or empty
      setLoadingPatients(true);
    }
  
    const { search, sortField, sortOrder } = patientsAllFilters;
    getPatients(1, search, sortField, sortOrder);
  }, [patientsAllFilters]); // Ensure this runs when filters change
  

  const handleSortFieldChange = (e) => {
    const sortField = e.target.value;
    setLoadingPatients(true);

    setPatientsAllFilters((prev) => ({ ...prev, sortField })); // Reset to first page when sort field changes
    const { search, sortOrder } = patientsAllFilters;
    getPatients(1, sortField, search, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    const sortOrder = e.target.value;
    setLoadingPatients(true);

    setPatientsAllFilters((prev) => ({ ...prev, sortOrder })); // Reset to first page when sort field changes
    const { search, sortField } = patientsAllFilters;
    getPatients(1, sortOrder, search, sortField);
  };
  
  const handleSearchChange = (e) => {
    const search = e.target.value;
    setPatientsAllFilters((prev) => ({ ...prev, search }));
    
    const { sortField, sortOrder } = patientsAllFilters;
    getPatients(1, search, sortField, sortOrder);
  };

  const handlePreviousPage = () => {
    setLoadingPatients(true);
    const { search, sortField, sortOrder } = patientsAllFilters;
    getPatients(patientsAll.current_page - 1, search, sortField, sortOrder);
  };

  const handleNextPage = () => {
    setLoadingPatients(true);
    const { search, sortField, sortOrder } = patientsAllFilters;
    getPatients(patientsAll.current_page + 1, search, sortField, sortOrder);
  };

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%] p-6">
        <h1 className="text-2xl font-bold mb-4">Patients</h1>

        <div className="grid grid-cols-2 gap-4 items-center mb-4">
          <div className="flex gap-4">
            {/* Search input field */}
            <input
              type="text"
              placeholder="Search by name or number"
              value={patientsAllFilters.search}
              onChange={handleSearchChange}
              className="p-2 border border-gray-300 rounded-md"
            />
            
            {/* Sort field dropdown */}
            <select
              name="sortField"
              id="sortField"
              value={patientsAllFilters.sortField}
              onChange={handleSortFieldChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">Sort By</option>
              <option value="last_name">Last Name</option>
              <option value="patient_number">Patient Number</option>
              <option value="follow_up_date">Follow-up Date</option>
            </select>

            {/* Sort order dropdown */}
            <select
              name="sortOrder"
              id="sortOrder"
              value={patientsAllFilters.sortOrder}
              onChange={handleSortOrderChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">Sort Order By</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {patientsAll.data?.length > 0 && (
            <div className="flex justify-end items-center">
            <button
              className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${patientsAll.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`}
              disabled={patientsAll.current_page <= 1}
              onClick={handlePreviousPage}
            >
              &lt;
            </button>
            <button className="px-4 h-8 border border-[#6CB6AD] text-sm" disabled>
              {patientsAll.current_page} OF {patientsAll.last_page}
            </button>
            <button
              className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${patientsAll.current_page === patientsAll.last_page ? 'bg-opacity-70' : ''} text-white text-sm`}
              disabled={patientsAll.current_page === patientsAll.last_page}
              onClick={handleNextPage}
            >
              &gt;
            </button>
          </div>
          )}
        </div>
      </div>

      {loadingPatients ? (
          <div className="flex justify-center items-center mt-20">
            <PulseLoader color="#6CB6AD" loading={loadingPatients} size={15} />
          </div>
      ) : (
          <PatientsTable patients={patientsAll.data} />
      )}
    </>
  );
};

export default PatientTablePage;
