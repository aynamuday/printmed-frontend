import React, { useContext, useRef, useState } from 'react'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'

import qr from '../assets/images/qr.png'
import '../assets/styles/QrScanAnimation.css'
import Swal from 'sweetalert2'
import { ClipLoader } from 'react-spinners'

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import PatientDetails from '../components/PatientDetails'
import ConsultationForm from '../components/ConsultationForm'
import QrScanning from '../components/QrScanning'
import ConsultationsTable from '../components/ConsultationsTable'
import ViewConsultation from '../components/ViewConsultation'
import { globalSwalNoIcon } from '../utils/globalSwal'
import { fetchPatientUsingQr } from '../utils/fetch/fetchPatientUsingQr'
import { showError } from '../utils/fetch/showError'
import { fetchPatientUsingId } from '../utils/fetch/fetchPatientUsingId'

const PatientPagePhysician = () => {
    const { token } = useContext(AppContext)
    const { 
        patientPageLoading, setPatientPageLoading,
        resetPatientViewer,
        patient, setPatient,
        consultationComponentStatus, setConsultationComponentStatus,
     } = useContext(PhysicianContext)

    const qrInputRef = useRef(null)
    const [isQrInputFocused, setIsQrInputFocused] = useState(false)
    const [qrCode, setQrCode] = useState("")
    const [manualLookup, setManualLookup] = useState(false)
    const [patientId, setPatientId] = useState('')
    const [patientIdError, setPatientIdError] = useState('')

    const getPatientUsingQr = async (e) => {
        e.preventDefault()
        setPatientPageLoading(true)
        setIsQrInputFocused(false)

        try {
            const data = await fetchPatientUsingQr(qrCode, token)
            setPatient(data)

            console.log(data)
        }
        catch (err) {
            showError(err)
        }
        finally {
            setPatientPageLoading(false)
            setQrCode("")
        }
    }

    const getPatientUsingId = async (e) => {
        e.preventDefault()
        setPatientPageLoading(true)

        try {
            const data = await fetchPatientUsingId(patientId, token)
            setPatient(data)

            console.log(data)
            
            setManualLookup(false)
            setPatientId('')
        }
        catch (err) {
            showError(err)
        }
        finally {
            setPatientPageLoading(false)
        }
    }

    const handlePatientIdChange = (e) => {
        setPatientIdError('')

        const value = e.target.value
        console.log(value)

        if(!/^[\d-]*$/.test(value)) {
            setPatientIdError('Can only contain numbers and dash.')
            return
        }

        setPatientId(value)
    }

    const handleClose = () => {
        globalSwalNoIcon.fire({
            title: 'Are you sure you want to close this patient?',
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                resetPatientViewer()
            }
        });
    }

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

    return (
        <>
            { patientPageLoading && (
                <div className='z-50 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
                    <ClipLoader className='' loading={patientPageLoading} size={60} color='#6CB6AD' />
                </div>
            )}

            {/* pop up to find patient */}
            {manualLookup && (
                <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-40 z-40'>
                    <div className="bg-white rounded-md flex justify-items-center flex-col p-6 max-h-[70vh] relative">
                        <i className="bi bi-search block text-3xl font-bold text-center text-[#6CB6AD]"></i>
                        <form onSubmit={(e) => getPatientUsingId(e)} className='flex items-center justify-center flex-col'>
                            <div className='mt-3'>
                                {/* <label className='block text-sm'>Enter Patient ID</label> */}
                                <div className="flex items-center border rounded-md border-black overflow-hidden">
                                    <span className="bg-gray-200 p-2 border-r border-r-black">P</span>
                                    <input
                                        type="text"
                                        placeholder="00000-0000"
                                        value={patientId}
                                        onChange={handlePatientIdChange}
                                        className="w-full p-2 focus:outline-none min-w-[300px]"
                                        minLength={10}
                                        maxLength={10}
                                        required
                                    />
                                </div>
                                {patientIdError && <p className='text-red-600 text-sm'>{patientIdError}</p>}
                            </div>
                            <button type='submit' className='bg-[#248176] mt-4 text-md text-white font-medium hover:bg-[#499e94] p-1.5 px-5 rounded-md'>
                                Find Patient
                            </button>
                        </form>
                        <button onClick={() => {setManualLookup(false); setPatientId('');}} className='absolute text-lg top-2 right-2'>
                            <i className='bi bi-x-lg'></i>
                        </button>
                    </div>
                </div>
            )}

            <div>
                { !patient && isQrInputFocused && (
                    <div className='flex items-center justify-center absolute w-full h-full bg-black bg-opacity-50 top-0 bottom-0 left-0 right-0 z-40'>
                        <div className='px-4 py-6 bg-white shadow-lg w-[400px] rounded-md'>
                            <QrScanning />
                            <p className='mt-4 font-semibold text-center'>Waiting for your scan</p>
                            <p className='text-center'>Please ensure that the QR code is properly placed on the scanner for accurate reading.</p>
                            <button onClick={handleQrInputBlur} className='bg-red-700 text-xl text-white font-medium hover:bg-[#d05250] p-1.5 rounded-md w-[50%] mx-auto mt-3 block'>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                
                <Sidebar />
                <Header />

                { !patient ? (
                    <div className={`md:ml-[300px] min-h-[calc(100vh-120px)] mt-[7%]`}>
                        <div className="bg-[url('assets/images/bg_nurse_transparent.png')] bg-cover min-h-[calc(100vh-105px)] pt-28">
                            <div className='w-[300px] mx-auto flex flex-col items-center bg-white p-4'>
                                <img src={qr} alt="" className='w-full p-3 border border-black' />
                                <p className='text-center my-2 text-lg font-semibold'>Scan the patient's QR code to access their medical records.</p>
                                <button onClick={handleScanButtonClick} className='bg-[#248176] text-xl text-white font-medium hover:bg-[#499e94] p-1.5 w-full rounded-md'>Scan</button>
                                <p className='text-center my-2 font-normal text-sm'>Or you may do a manual lookup using Patient ID&nbsp;  
                                    <span onClick={() => setManualLookup(true)} className='underline hover:text-[#248176] cursor-pointer'>here</span>.
                                </p>
                            </div>
                            <form onSubmit={(e) => getPatientUsingQr(e)} className='absolute w-0 h-0 p-0 m-0 border-0 clip-rect opacity-0'>
                                <input 
                                    className='absolute w-0 h-0 p-0 m-0 border-0 clip-rect opacity-0'
                                    ref={qrInputRef} 
                                    type="text"
                                    value={qrCode}
                                    onChange={(e) => setQrCode(e.target.value)}
                                    onFocus={handleQrInputFocus}
                                    onBlur={handleQrInputBlur}
                                    disabled={patientPageLoading}
                                    required
                                />
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="md:w-[calc(100%-370px)] w-[calc(100%-320px)]  md:ml-[335px] ml-[285px] mt-[10%] mb-12">
                        <div className='flex items-center mb-4'>
                            <button onClick={() => handleClose()} className='me-6 flex items-center h-full'><i className='bi bi-x-lg'></i></button>
                            <h2 className='me-3 font-bold text-2xl'>Patient No. {patient.patient_number}</h2>
                            { patient.is_new_in_department && 
                                <div className='me-2 h-full border border-green-500 border-1 px-2 py-1 rounded-lg'>
                                    <p className='text-xs text-green-500 font-semibold'>New</p>
                                </div> 
                            }
                            <div className={`h-full border ${patient.vital_signs == null ? "border-gray-500" : "border-orange-500"} border-1 px-2 py-1 rounded-lg`}>
                                <p className={`text-xs ${patient.vital_signs == null ? "text-gray-500" : "text-orange-500"} font-semibold`}>{patient.vital_signs == null && "No"} Vital Signs Available</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-5 gap-4'>
                            <div className='col-span-2'>
                                <PatientDetails patient={patient} />
                            </div>
                            <div className='bg-[#D9D9D9] bg-opacity-30 col-span-3'>
                                <div className='bg-[#248176] py-2 px-4 flex items-center justify-between'>
                                    <div className='flex gap-4 w-full'>
                                        { consultationComponentStatus != null && 
                                            <button onClick={() => setConsultationComponentStatus(null)}>
                                                <i className={`bi bi-arrow-left text-xl me-2 text-white`}></i>
                                            </button>
                                        }
                                        { consultationComponentStatus === null && 
                                            <div className='flex justify-between items-center w-full'>
                                                <p className='font-semibold text-white text-lg'>Consultations</p>
                                                <button onClick={() => {setConsultationComponentStatus("add")}}><i className={`bi bi-plus-square-fill me-2 text-xl text-white`}></i></button>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className='grid grid-cols-1 justify-center p-6'>
                                        { consultationComponentStatus === null ? (
                                            <ConsultationsTable consultations={patient.consultations} />
                                        ) : consultationComponentStatus === "view" ? (
                                            <ViewConsultation setLoading={setPatientPageLoading} /> 
                                        ) : consultationComponentStatus === "add" && (
                                            <ConsultationForm birthdate={patient.birthdate} vitalSigns={patient.vital_signs} /> 
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) }
            </div>
        </>
    )
}

export default PatientPagePhysician
