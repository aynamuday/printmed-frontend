import React, { useEffect, useState, useContext } from 'react';
import { PulseLoader } from 'react-spinners';

import AppContext from '../context/AppContext';
import SecretaryContext from '../context/SecretaryContext';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PatientsTable from '../components/PatientsTable';
import Swal from 'sweetalert2';

const PatientsPage = () => {
  const { token } = useContext(AppContext);
  const {
    patients, setPatients,
    patientsFilters, setPatientsFilters,
  } = useContext(SecretaryContext);

  const [loading, setLoading] = useState(false);

  const getPatients = async (page = 1, search = '', sortBy = '', orderBy = '') => {
    let url = `/api/patients?page=${page}`;

    if (search.trim() !== '') {
      url += `&search=${search}`;
    }
    if (sortBy.trim() !== '') {
      url += `&sort_by=${sortBy}`;
    }
    if (orderBy.trim() !== '') {
      url += `&order_by=${orderBy}`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(!res.ok) {
        throw new Error("An error occured while fetching the patients. Please try again later.")
      }

      const data = await res.json()  
      setPatients(data); 
    }
    catch (err) {
      let error = err.message ?? "An error occured while fetching the patients. Please try again later."
      if (err.name === "TypeError") {
          setError("An error occured while fetching the patients. Please try again later. You may refresh or check your Internet connection.")
      } 

      if (!patients.data || patients.data.length < 1) {
        Swal.fire({
          icon: 'error',
          title: `${error}`,
          showConfirmButton: false,
          showCloseButton: true,
          customClass: {
              title: 'text-xl font-bold text-black text-center',
              popup: 'border-2 rounded-xl px-4 py-8',
              icon: 'p-0 mx-auto my-0'
          }
        })
      }
    }
    finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    if (!patients.data || patients.data.length < 1) {
      setLoading(true);
    }
  
    const page = patients.data ? patients.current_page : 1
    const { search, sortBy, orderBy } = patientsFilters;
    getPatients(page, search, sortBy, orderBy);
  }, []);
  

  const handleSortByChange = (sortBy) => {
    setLoading(true);

    setPatientsFilters((prevPatients) => ({ ...prevPatients, sortBy}));
    const { search, orderBy } = patientsFilters;
    getPatients(1, search, sortBy, orderBy);
  };

  const handleOrderByChange = (orderBy) => {
    setLoading(true);

    setPatientsFilters((prevPatients) => ({ ...prevPatients, orderBy }));
    const { search, sortBy } = patientsFilters;
    getPatients(1, search, sortBy, orderBy);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    const { search, sortBy, orderBy } = patientsFilters;
    getPatients(1, search, sortBy, orderBy);
  };

  const handlePageChange = (page) => {
    setLoading(true)

    const { search, sortBy, orderBy } = patientsFilters;
    if (page > 0 && page <= patients.last_page) {
      getPatients(page, search, sortBy, orderBy);
    }
  };

  const handleClear = () => {
    setLoading(true)

    setPatientsFilters({
      search: '',
      sortBy: '',
      orderBy: '',
    })
    getPatients(1, "", "", "");
  };

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%] p-6 pb-10">
      <div className={`flex justify-between items-end mb-6 mt-4`}>
          <h2 className={`font-bold text-2xl`}>Patients</h2>
          <div className={`flex justify-end gap-4 items-end`}>
            <div>
                <label className='text-xs block mb-1'>{"Name (FN LN or FN or LN) or Patient No."}</label>
                <form onSubmit={(e) => {handleSearchSubmit(e)}} className='border border-[#6CB6AD] py-1 rounded ps-4'>
                    <input
                        type="text"
                        name="search"
                        className="focus:outline-none focus:border-none"
                        value={patientsFilters.search}
                        onChange={(e) => {setPatientsFilters((prevFilters) => ({...prevFilters, search: e.target.value}))}}
                        placeholder='Search'
                    />
                    <button type='submit' className="btn btn-primary d-flex align-items-center">
                        <i className="bi bi-search me-2 text-[#374151]"></i>
                    </button>
                </form>
            </div>

            {/* sort by */}
            <div>
                <label className='text-xs block mb-1'>Sort by</label>
                <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                  name="resource" id="resource" value={patientsFilters.sortBy} onChange={(e) => handleSortByChange(e.target.value)}
                >
                    <option value="">Last updated</option>
                    <option value="patient_number">Patient No.</option>
                    <option value="last_name">Last Name</option>
                </select>
            </div>

            {/* sort direction */}
            <div>
                <label className='text-xs block mb-1'>Order by</label>
                <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                  name="resource" id="resource" value={patientsFilters.orderBy} onChange={(e) => handleOrderByChange(e.target.value)}
                >
                    <option value="">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>

            {/* pagination controls */}
            <div className="flex justify-end items-center">
              <button 
                  onClick={() => {handlePageChange(patients.current_page - 1)}} 
                  disabled={patients.current_page <= 1 || !patients.current_page} 
                  className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] text-white text-sm ${patients.current_page <= 1 || !patients.current_page ? 'bg-opacity-70' : ''}`}>
                  &lt;
              </button>

              <button className="px-4 h-8 border border-[#6CB6AD] text-sm" disabled>
                  {patients.current_page} OF {patients.last_page}
              </button>

              <button
                  onClick={() => {handlePageChange(patients.current_page + 1)}} 
                  disabled={patients.current_page >= patients.last_page} 
                  className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] text-white text-sm ${patients.current_page >= patients.last_page || !patients.current_page ? 'bg-opacity-70' : ''}`}>
                  &gt;
              </button>
            </div>

            {/* clear button */}
            <div>
                <label className='text-xs block mb-1'>Clear</label>
                <button 
                  onClick={() => {handleClear()}}
                  className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] text-white text-sm`}
                >
                  <i className='bi bi-arrow-clockwise text-xl'></i>  
                </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <PulseLoader color="#6CB6AD" loading={loading} size={15} />
          </div>
        ) : (
            <PatientsTable patients={patients.data} />
        )}
      </div>
    </>
  );
};

export default PatientsPage;
