import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AppContext from '../context/AppContext';
import { PulseLoader } from 'react-spinners';
import SecretaryContext from '../context/SecretaryContext';

const RegistrationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AppContext);
  const {  } = useContext(SecretaryContext)

  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  
  const getRegistrations = async (page = 1, search = '') => {
    setLoading(true);
    
    let url = `/api/registrations?page=${page}`;
    
    if (search.trim() !== "") {
      url += `&search=${search}`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(!res.ok) {
          throw new Error("Something went wrong. Please try again later.")
      }

      const data = await res.json()

      setRegistrations(data.data);
      setTotalPages(data.last_page);
    }
    catch (err) {
      let error = err.message ?? "Something went wrong. Please try again later."
      if (err.name === "TypeError") {
          setError("Something went wrong. Please try again later. You may refresh or check your Internet connection.")
      } 
      
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
    finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    getRegistrations(page, search);
  
    // Check if we have removedId and log to see what's happening
    if (location.state?.removedId) {
      console.log('Removed patient ID:', location.state.removedId);
      setRegistrations((prevPatients) => {
        const updatedPatients = prevPatients.filter(
          (patient) => patient.registration_id !== location.state.removedId
        );
        console.log('Updated Patients List:', updatedPatients);
        return updatedPatients;
      });
    }
  }, [page, location.state]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()

    getRegistrations(page, search);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleViewDetails = (patient) => {
    navigate('/add-patient', { state: { patient } });
  };

  return (
    <>
      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%] p-6">
        <div className={`flex justify-between items-end mb-6 mt-4`}>
          <h2 className={`font-bold text-2xl`}>Registrations</h2>
          <div className={`flex justify-end gap-4 items-end`}>
            <div>
                <label className='text-xs block mb-1'>{"Name (FN LN or FN or LN) or Registration No."}</label>
                <form onSubmit={(e) => {handleSearchSubmit(e)}} className='border border-[#6CB6AD] py-1 rounded ps-4'>
                    <input
                        type="text"
                        name="search"
                        className="focus:outline-none focus:border-none"
                        value={search}
                        onChange={(e) => {setSearch(e.target.value)}}
                        placeholder='Search'
                    />
                    <button type='submit' className="btn btn-primary d-flex align-items-center">
                        <i className="bi bi-search me-2 text-[#374151]"></i>
                    </button>
                </form>
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
        </div>

        {!loading && (
            <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                      <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Registration No.</th>
                      <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Last Name</th>
                      <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">First Name</th>
                      <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[10%]">Age</th>
                      <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Sex</th>
                      <th className="p-2 border text-center bg-[#D9D9D9] border-[#828282] w-[15%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations && registrations.length > 0 ? (
                    registrations.map((registration, index) => (
                      <tr key={index}>
                        <td className="p-2 border text-center border-[#828282]">{registration.registration_id}</td>
                        <td className="p-2 border text-center border-[#828282]">{registration.last_name}</td>
                        <td className="p-2 border text-center border-[#828282]">{registration.first_name}</td>
                        <td className="p-2 border text-center border-[#828282]">{registration.age}</td>
                        <td className="p-2 border text-center border-[#828282]">{registration.sex}</td>
                        <td className="p-2 border text-center border-[#828282]">
                          <button
                            onClick={() => handleViewDetails(registration)}
                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg "
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="border p-2 border-[#828282] text-center">
                        No registrations
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
        )}

        {loading && (
          <div className="flex justify-center items-center py-6">
              <PulseLoader color="#6CB6AD" loading={loading} size={15} />
          </div>
        )}
      </div>
    </>
  );
};

export default RegistrationsPage;
