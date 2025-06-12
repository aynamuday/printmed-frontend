import React, { useEffect, useState, useContext, useRef } from 'react';
import { PulseLoader, BounceLoader } from 'react-spinners';
import qr from '../assets/images/qr.png';
import facial_recognition_icon from '../assets/images/facial-recognition-icon.png';

import AppContext from '../context/AppContext';
import SecretaryContext from '../context/SecretaryContext';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PatientsTable from '../components/PatientsTable';
import IconScanning from '../components/IconScanning';
import { fetchPatientUsingQr } from '../utils/fetch/fetchPatientUsingQr';
import { useNavigate } from 'react-router-dom';
import { showError } from '../utils/fetch/showError';
import { capitalizedWords } from '../utils/wordUtils';
import { showWarning } from '../utils/fetch/showWarning';
import WebcamCapture from '../components/WebcamCapture';
import { base64ToPngFile } from '../utils/fileUtils';
import { fetchPatientUsingFace } from '../utils/fetch/fetchPatientUsingFace';
import FoundPatientPopup from '../components/FoundPatientPopup';

const PatientsPage = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate()
  const {
    patients, setPatients,
    searchPatient, setSearchPatient,
    patientsFilters, setPatientsFilters,
  } = useContext(SecretaryContext);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchFace, setSearchFace] = useState(false)
  const [image, setImage] = useState(null)
  const [foundPatient, setFoundPatient] = useState(null)

  useEffect(() => {
    if (patients.length < 1) {
      setTableLoading(true);
    }

    const sortBy = patientsFilters.sortBy
    const orderBy = patientsFilters.orderBy

    getPatients(1, searchPatient, sortBy, orderBy);
  }, []);

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
      setPatients(data)
    }
    catch (err) {
      showError(err)
    }
    finally {
        setTableLoading(false)
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()

    setTableLoading(true)

    setPatientsFilters({
      sortBy: '',
      orderBy: ''
    })

    getPatients(1, searchPatient, undefined, undefined)
  };

  const handleSortByChange = (e) => {
    setTableLoading(true);

    const selectedOption = e.target.selectedOptions[0]
    const sortBy = selectedOption.getAttribute('data-sort-by')
    const orderBy = selectedOption.getAttribute('data-order-by')

    setPatientsFilters((prevPatients) => ({ ...prevPatients, sortBy: sortBy, orderBy: orderBy}))
    getPatients(1, searchPatient, sortBy, orderBy);
  };

  const handlePrevious = () => {
    setTableLoading(true)

    getPatients(patients.current_page - 1, undefined, patientsFilters.sortBy, patientsFilters.orderBy)
  };

  const handleNext = () => {
    setTableLoading(true)

    getPatients(patients.current_page + 1, undefined, patientsFilters.sortBy, patientsFilters.orderBy)
  };

  const handleClear = () => {
    setTableLoading(true)

    setSearchPatient('');
    setPatientsFilters({
      sortBy: '',
      orderBy: '',
    })

    getPatients(1, "", "", "");
  };


  // for QR scanning
  const qrInputRef = useRef(null)
  const [isQrInputFocused, setIsQrInputFocused] = useState(false)
  const [qrCode, setQrCode] = useState("")

  const handleQrInputFocus = () => {
    setIsQrInputFocused(true);   
  };

  const handleQrInputBlur = () => {
    setIsQrInputFocused(false);
  };

  const handleScanButtonClick = () => {
    if (qrInputRef.current) {
        qrInputRef.current.focus();
    }
  }

  const handleQrCodeSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setIsQrInputFocused(false)

    try {
      setFoundPatient(await fetchPatientUsingQr(qrCode, token))
    }
    catch (err) {
      if (err.message === "Invalid") {
        showWarning("The QR code is invalid.")
      } else if (err.message === "Not found") {
          showWarning("The QR code is either deactivated, expired, or does not exists.")
      } else if (err.message === "Unauthorized") {
          showWarning("You are not authorized to access this patient. ")
      } else {
        showError(err)
      }
    }
    finally {
      setLoading(false)
      setQrCode("")
    }
  }

  // face search
  useEffect(() => { 
    if(image == null) {
      return 
    }

    getPatientUsingFace()
  }, [image])

  const getPatientUsingFace = async () => {
    const photo = base64ToPngFile(image)

    try {
      setFoundPatient(await fetchPatientUsingFace(photo, token))
    } catch (err) {
      if (err.message === "Not found") {
          showWarning("Patient not found.")
      } else if (err.message === "Unauthorized") {
          showWarning("You are not authorized to access this patient. ")
      } else {
        showError(err)
      }
    } finally {
      setImage(null)
      setSearchFace(false)
    }
  }

  const viewPatient = () => {
    if(foundPatient) {
      sessionStorage.setItem('patient', JSON.stringify(foundPatient))
      navigate(`/patient`)
    }
  }

  return (
    <>
      <Sidebar />
      <form onSubmit={(e) => handleQrCodeSubmit(e)} className='absolute w-0 h-0 p-0 m-0 border-0 clip-rect opacity-0'>
        <input 
          className='absolute w-0 h-0 p-0 m-0 border-0 clip-rect opacity-0'
          ref={qrInputRef} 
          type="text"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          onFocus={handleQrInputFocus}
          onBlur={handleQrInputBlur}
          disabled={loading}
          required
        />
      </form>
      <div className="lg:pl-[250px] min-h-screen bg-white">
        <Header />
        <div className="px-4 sm:px-6 mt-4">
          <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-6 mt-4">
                <h2 className="font-bold text-2xl">Patients</h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap w-full sm:w-auto">
                  {/* Search */}
                  <div className="flex flex-col w-full sm:w-auto">
                      <label htmlFor="search" className='text-xs block mb-1'>Name (FN LN or FN or LN) or Personnel No.</label>
                      <form 
                        onSubmit={(e) => handleSearch(e)} 
                        className="flex border border-[#248176] rounded items-center px-4 py-1.5 h-8"
                      >
                        <input
                            type="text"
                            name="search"
                            className="flex-1 focus:outline-none text-sm"
                            value={searchPatient}
                            onChange={(e) => {
                              setSearchPatient(capitalizedWords(e.target.value));
                            }}
                            placeholder='Search'
                        />
                        <button 
                          // onClick={(e) => handleSearch} 
                          className="text-[#374151]">
                          <i className="bi bi-search text-lg"></i>
                        </button>
                      </form>
                  </div>

                  {/* Sort */}
                  <div className="flex flex-col w-full sm:w-auto">
                        <label className='text-xs block mb-1'>Sort by</label>
                        <select 
                          className="w-full sm:w-auto px-4 h-8 border border-[#248176] rounded-md bg-white font-medium focus:outline-none" 
                          value={patientsFilters.sortBy + "_" + patientsFilters.orderBy} 
                          onChange={(e) => handleSortByChange(e)}
                        >
                            <option value="" data-sort-by="" data-order-by="">Last updated</option>
                            <option value="name_asc" data-sort-by="name" data-order-by="asc">Last Name (A&rarr;Z)</option>
                            <option value="name_desc" data-sort-by="name" data-order-by="desc">Last Name (Z&rarr;A)</option>
                        </select>
                  </div>

                  {/* Pagination + Search Buttons + Clear */}
                  { patients.current_page &&
                    <div className="flex flex-row sm:flex-row gap-4 sm:items-end w-full sm:w-auto">
                      {/* QR Scanning */}
                      {/* <div className="flex items-center">
                        <button onClick={handleScanButtonClick}>
                          <img src={qr} alt="" className='w-[50px] h-full rounded-md p-0.5 border border-[#248176]' />
                        </button>
                      </div> */}

                      {/* Face Search */}
                      <div className="flex items-center">
                        <button onClick={() => {setSearchFace(true)}}>
                          <img src={facial_recognition_icon} alt="" className='w-[50px] h-full rounded-md p-0.5 border border-[#248176]' />
                        </button>
                      </div>
                      
                      {/* Pagination */}
                      <div className="flex items-center text-xs sm:text-sm md:text-base">
                        <button 
                          className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${patients.current_page === 1 ? 'bg-opacity-70' : ''} text-white rounded`} 
                          disabled={patients.current_page <= 1} 
                          onClick={handlePrevious}
                        >
                          &lt;
                        </button>
                        <button 
                          className="x-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-white text-[#248176] font-medium rounded"
                          disabled={true}
                        >
                          {patients.current_page} OF {patients.last_page}
                        </button>
                        <button 
                          className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${patients.current_page === patients.last_page ? 'bg-opacity-70' : ''} text-white rounded`} 
                          disabled={patients.current_page === patients.last_page} 
                          onClick={handleNext}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  }
                  {/* Clear Button */}
                  <div className="flex items-center">
                  {/* <label className='text-xs mb-1'>Clear</label> */}
                    <button 
                      onClick={() => {handleClear()}}
                      className="px-4 h-8 border border-[#248176] rounded bg-[#248176] text-white text-sm"
                    >
                      <i className='bi bi-arrow-clockwise text-xl'></i>  
                    </button>
                  </div>
                </div>
              </div>
          </div>

          {tableLoading ? (
            <div className="flex justify-center items-center mt-20">
              <PulseLoader color="#6CB6AD" loading={tableLoading} size={15} />
            </div>
          ) : (
              <PatientsTable patients={patients.data} setLoading={setLoading}/>
          )}
          { loading && (
          <div className='flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30 z-50'>
              <BounceLoader className='' loading={loading} size={60} color='#6CB6AD' />
          </div>
          )}

          {/* for QR scanning */}
          { isQrInputFocused && (
            <div className='flex items-center justify-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 z-30'>
                <div className='px-4 py-6 bg-white shadow-lg w-[90%] sm:w-[400px] rounded-md'>
                    <IconScanning src={qr} />
                    <p className='mt-4 font-semibold text-center'>Waiting for your scan</p>
                    <p className='text-center'>Please ensure the QR is properly placed on the scanner for accurate reading.</p>
                    <button onClick={handleQrInputBlur} className='bg-[#b43c3a] text-xl text-white font-medium hover:bg-[#d05250] p-1.5 rounded-md w-[50%] mx-auto mt-3 block'>
                        Cancel
                    </button>
                </div>
            </div>
          )}

          {/* face search */}
          {searchFace && (
            <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-30'>
              <WebcamCapture image={image} setImage={setImage} setShow={setSearchFace} />
            </div>
          )}
          {image && (
            <div className='flex items-center justify-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 z-30'>
                <div className='px-4 py-6 bg-white shadow-lg w-[90%] sm:w-[400px] rounded-md'>
                    <IconScanning src={facial_recognition_icon} />
                    <p className='text-center italic mt-4'>Looking for patient. Please wait.</p>
                </div>
            </div>
          )}

          {/* pop-up for found patient */}
          <FoundPatientPopup isOpen={foundPatient} onClose={() => {setFoundPatient(null)}} patient={foundPatient} viewPatient={viewPatient}/>
        </div>
      </div>
    </>
  );
};

export default PatientsPage;
