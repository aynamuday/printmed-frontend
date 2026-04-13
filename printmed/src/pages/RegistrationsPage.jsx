import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import SecretaryContext from '../context/SecretaryContext';
import { PulseLoader } from 'react-spinners';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Pusher from 'pusher-js'
import { echo as Echo } from '../utils/pusher/echo';
import { showError } from '../utils/fetch/showError';

window.Pusher = Pusher   // Pusher for realtime

const RegistrationsPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const { 
    registrations, setRegistrations,
    registrationsSearch, setRegistrationsSearch
  } = useContext(SecretaryContext)

  const [deleted, setDeleted] = useState(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!registrations.data) {
      setLoading(true)
    }

    // const page = registrations.data ? registrations.current_page : 1
    getRegistrations(1, registrationsSearch);


    // laravel echo for new registration
    const echo = Echo(token)
    echo.private('registration')
        .listen('RegistrationNew', (e) => {
          const newRegistration = e.registration

          if (registrations.current_page == 1) {
            setRegistrations((prevState) => {
              const exists = prevState.data.some(item => item.id === newRegistration.id);
              if (exists) {
                return prevState;
              }
  
              const updatedData = [newRegistration, ...prevState.data]
              if (updatedData > 20) {
                updatedData.pop()
              }
              return {
                ...prevState, 
                data: updatedData, 
                total: prevState.total+1
              }
            })
          }
        })
        .listen('RegistrationDeleted', (e) => {
          const deletedRegistrationId = e.registrationId
          
          setRegistrations((prevState) => ({
            ...prevState,
            data: prevState.data.filter(item => item.id != deletedRegistrationId),
            total: prevState.total-1
          }))

          setDeleted(true)
        })

    return () => {
      echo.leave('registration')
    }
  }, [])

  useEffect(() => {
    if (registrations.length != 0) {
      const lastPage = Math.ceil(registrations.total / registrations.per_page)

      if (lastPage != registrations.last_page && lastPage > 1) {
        setRegistrations({...registrations, last_page: lastPage})
      }
    }
  }, [registrations.total])

  useEffect(() => {
    if (registrations.current_page > registrations.last_page) { //current page is greater than last page
      getRegistrations(registrations.last_page, registrationsSearch)
    } else if (registrations.current_page < 15 && registrations.current_page != registrations.last_page) {  // not last page
      getRegistrations(registrations.current_page, registrationsSearch)
    } else if (registrations.data?.length == 0 && registrations.current_page != 1 && registrations.current_page == registrations.last_page) { // not page 1, but last page, and data length == 0
      getRegistrations(registrations.current_page - 1, registrationsSearch)
    }
  }, [deleted])
  
  const getRegistrations = async (page = 1, search = '') => {
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

      setRegistrations(data)
    }
    catch (err) {
      showError(err)
    }
    finally {
        setLoading(false)
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    getRegistrations(registrations.current_page, registrationsSearch);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= registrations.last_page) {
      setLoading(true)
      getRegistrations(page, registrationsSearch);
    }
  };

  const handleViewRegistration = (registration) => {
    navigate('/add-patient', { state: { registration } });
  };

  const handleClear = () => {
    setLoading(true)

    setRegistrationsSearch("")
    getRegistrations(1, "");
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[250px] min-h-screen bg-white">
        <Header />
        <div className="px-4 sm:px-6 mt-4">
          <div className="flex justify-center items-center">
            <h2 className="font-bold text-2xl">Registrations</h2>
          </div>
          <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between mb-6 mt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap w-full sm:w-auto">
                  {/* Search */}
                  <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-xs mb-1">Name (FN LN or FN or LN) or Registration ID</label>
                      <form 
                        onSubmit={(e) => {handleSearchSubmit(e)}} 
                        className="flex border border-[#248176] rounded items-center px-4 py-1.5 h-8">
                          <input
                              type="text"
                              name="search"
                              className="flex-1 focus:outline-none text-sm"
                              value={registrationsSearch}
                              onChange={(e) => {setRegistrationsSearch(e.target.value)}}
                              placeholder='Search'
                          />
                          <button type='submit' className="text-[#374151]">
                              <i className="bi bi-search text-lg"></i>
                          </button>
                      </form>
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap w-full sm:w-auto">
                  {/* Pagination + Clear */}
                  <div className="flex flex-row sm:flex-row gap-4 sm:items-end w-full sm:w-auto">
                    {/* Pagination Controls */}
                    <div className="flex items-center text-xs sm:text-sm md:text-base">
                      <button 
                          onClick={() => handlePageChange(registrations.current_page - 1)} 
                          disabled={registrations.current_page <= 1 || !registrations.current_page} 
                          className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${registrations.current_page <= 1 || !registrations.current_page ? 'bg-opacity-70' : ''} text-white rounded`}>
                          &lt;
                      </button>
                      <button 
                        className="px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-white text-[#248176] font-medium rounded" 
                        disabled
                      >
                        {registrations.current_page} OF {registrations.last_page}
                      </button>
                      <button
                          onClick={() => handlePageChange(registrations.current_page + 1 || !registrations.current_page)} 
                          disabled={registrations.current_page >= registrations.last_page} 
                          className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${registrations.current_page >= registrations.last_page || !registrations.current_page ? 'bg-opacity-70' : ''} text-white rounded`}
                        >
                          &gt;
                      </button>
                    </div>

                    {/* clear button */}
                    <div className="flex items-center">
                        {/* <label className='text-xs mb-1'>Clear</label> */}
                        <button 
                          onClick={() => {handleClear()}}
                          className={`px-4 h-8 border border-[#248176] rounded-sm bg-[#248176] text-white text-sm`}
                        >
                          <i className='bi bi-arrow-clockwise text-xl'></i>  
                        </button>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          <div className="w-full overflow-x-auto">
            {!loading && (
              <table className="min-w-full border border-spacing-0 border-gray-300 text-sm sm:text-base">
                  <thead>
                    <tr>
                        <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Registration ID</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Last Name</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">First Name</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Middle Name</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Age</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Sex</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations && registrations.data && registrations.data.length > 0 ? (
                      registrations.data.map((registration, index) => (
                        <tr key={index}>
                          <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{registration.registration_id}</td>
                          <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{registration.last_name}</td>
                          <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{registration.first_name}</td>
                          <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{registration.middle_name}</td>
                          <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{registration.age}</td>
                          <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{registration.sex}</td>
                          <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">
                            <button
                              onClick={() => handleViewRegistration(registration)}
                              className="text-blue-600 hover:text-red-500 hover:underline px-4 py-0.5 rounded-lg "
                            >
                              View Registration
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="border p-2 border-[#828282] text-center">
                          No registrations
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
          )}

          {loading && (
            <div className="flex justify-center items-center mt-20">
                <PulseLoader color="#6CB6AD" loading={loading} size={15} />
            </div>
          )}
          </div>
        </div>
      </div>
      
    </>
  );
};

export default RegistrationsPage;
