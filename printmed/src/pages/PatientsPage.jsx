import React, { useEffect, useState, useContext, useRef } from 'react';
import { PulseLoader, ClipLoader } from 'react-spinners';
import qr from '../assets/images/qr.png'

import AppContext from '../context/AppContext';
import SecretaryContext from '../context/SecretaryContext';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PatientsTable from '../components/PatientsTable';
import QrScanning from '../components/QrScanning';
import { fetchPatientUsingQr } from '../utils/fetch/fetchPatientUsingQr';
import { useNavigate } from 'react-router-dom';
import { showError } from '../utils/fetch/showError';
import { capitalizedWords } from '../utils/wordUtils';

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
      setPatients(data);
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
    setQrCode("")

    try {
      const patient = await fetchPatientUsingQr(qrCode, token)
      navigate(`/patients/${patient.id}`, {
        state: { patient }
      });
    }
    catch (err) {
      showError(err)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      { loading && (
        <div className='flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30 z-50'>
            <ClipLoader className='' loading={loading} size={60} color='#6CB6AD' />
        </div>
      )}

      {/* for QR scanning */}
      { isQrInputFocused && (
        <div className='flex items-center justify-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 z-30'>
            <div className='px-4 py-6 bg-white shadow-lg w-[400px] rounded-md'>
                <QrScanning />
                <p className='mt-4 font-semibold text-center'>Waiting for your scan</p>
                <p className='text-center'>Please ensure the QR is properly placed on the scanner for accurate reading.</p>
                <button onClick={handleQrInputBlur} className='bg-[#b43c3a] text-xl text-white font-medium hover:bg-[#d05250] p-1.5 rounded-md w-[50%] mx-auto mt-3 block'>
                    Cancel
                </button>
            </div>
        </div>
      )}
      <form onSubmit={(e) => handleQrCodeSubmit(e)} className='absolute w-0 h-0 p-0 m-0 border-0 clip-rect opacity-0'>
        <input 
          className='absolute w-0 h-0 p-0 m-0 border-0 clip-rect opacity-0'
          ref={qrInputRef} 
          type="text"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          onFocus={handleQrInputFocus}
          onBlur={handleQrInputBlur}
          required
        />
      </form>

      <Sidebar />
      <Header />

      <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] pb-10">
      <div className={`flex justify-between items-end mb-6 mt-4`}>
          <h2 className={`font-bold text-2xl`}>Patients</h2>
          <div className={`flex justify-end gap-4 items-end`}>
            {/* search */}
            <div>
                <label htmlFor="search" className='text-xs block mb-1'>{"Patient No. or Name (FN LN or FN or LN)"}</label>
                <form onSubmit={(e) => handleSearch(e)} className='border border-[#248176] py-1 rounded ps-2'>
                    <input
                        type="text"
                        name="search"
                        className="focus:outline-none focus:border-none"
                        value={searchPatient}
                        onChange={(e) => {
                          setSearchPatient(capitalizedWords(e.target.value));
                        }}
                        placeholder='Search'
                    />
                    <button onClick={(e) => handleSearch} className="btn btn-primary d-flex align-items-center">
                        <i className="bi bi-search me-2 text-[#374151]"></i>
                    </button>
                </form>
            </div>

            {/* sort */}
            <div>
                <label className='text-xs block mb-1'>Sort by</label>
                <select className='px-4 h-8 border border-[#248176] rounded-md bg-white font-medium focus:outline-none' 
                  value={patientsFilters.sortBy + "_" + patientsFilters.orderBy} onChange={(e) => handleSortByChange(e)}
                >
                    <option value="" data-sort-by="" data-order-by="">Last updated</option>
                    <option value="name_asc" data-sort-by="name" data-order-by="asc">Last Name (A&rarr;Z)</option>
                    <option value="name_desc" data-sort-by="name" data-order-by="desc">Last Name (Z&rarr;A)</option>
                </select>
            </div>

            {/* qr scanning */}
            <button onClick={handleScanButtonClick} className=''><img src={qr} alt="" className='w-[50px] rounded-md p-0.5 border border-[#248176]' /></button>

            {/* pagination controls */}
            { patients.current_page &&
              <div className="flex justify-end items-center">
                <button className={`px-4 h-8 border border-[#248176] bg-[#248176] ${patients.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`} 
                    disabled={patients.current_page <= 1} onClick={handlePrevious}>
                  &lt;
                </button>
                <button className={`px-4 h-8 border border-[#248176] text-sm`} disabled={true}>
                  {patients.current_page} OF {patients.last_page}
                </button>
                <button className={`px-4 h-8 border border-[#248176] bg-[#248176] ${patients.current_page === patients.last_page ? 'bg-opacity-70' : ''} text-white text-sm`} 
                    disabled={patients.current_page === patients.last_page} onClick={handleNext}>
                  &gt;
                </button>
              </div>
            }

            {/* clear button */}
            <div>
                <label className='text-xs block mb-1'>Clear</label>
                <button 
                  onClick={() => {handleClear()}}
                  className={`px-4 h-8 border border-[#248176] bg-[#248176] text-white text-sm`}
                >
                  <i className='bi bi-arrow-clockwise text-xl'></i>  
                </button>
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
      </div>
    </>
  );
};

export default PatientsPage;
