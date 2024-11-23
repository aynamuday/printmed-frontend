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
import AddConsultation from '../components/AddConsultation'
import QrScanning from '../components/QrScanning'
import ConsultationsTable from '../components/ConsultationsTable'
import ViewConsultation from '../components/ViewConsultation'

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

    const [error, setError] = useState("")

    const fetchPatient = async () => {
        setPatientPageLoading(true)
        setIsQrInputFocused(false)
        setQrCode("")

        try {
            const res = await fetch(`/api/patient-using-qr/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    'qr_code': qrCode
                })
            })

            if(!res.ok) {
                if (res.status === 500) {
                    throw new Error("Something went wrong. Please try again later.")
                } else if (res.status === 404) {
                    throw new Error("The QR code is either deactivated or expired.")
                } else if (res.status === 403) {
                    throw new Error("You are not authorized to access this patient. Make sure you are an assigned physician.")
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }

            const data = await res.json()

            setPatient(data)
            console.log(data)
        }
        catch (err) {
            if (err.name === "TypeError") {
                setError("Something went wrong. Please try again later. You may refresh or check your Internet connection.")
            } else {
                setError(err.message || "Something went wrong. Please try again later.")
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
            setPatientPageLoading(false)
        }
    }

    const handleClose = () => {
        Swal.fire({
            title: 'Are you sure you want to close this patient?',
            confirmButtonText: "Yes",
            showCancelButton: true,
            customClass: {
                title: 'text-xl font-bold text-black text-center',
                confirmButton: 'bg-[#248176] text-white rounded-lg px-9 py-2 hover:bg-blue-700',
                cancelButton: 'bg-gray-700 border-2 rounded-lg px-6 py-2',
                popup: 'border-2 rounded-xl p-4'
            }
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

    const handleQrCodeSubmit = (e) => {
        e.preventDefault()
        fetchPatient()
    }

    return (
        <>
            { patientPageLoading && (
                <div className='z-20 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
                    <ClipLoader className='' loading={patientPageLoading} size={60} color='#6CB6AD' />
                </div>
            )}

            <div>
                { !patient && isQrInputFocused && (
                    <div className='flex items-center justify-center absolute w-full h-full bg-black bg-opacity-50 z-10'>
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
                
                <Sidebar />
                <Header />

                { !patient ? (
                    <div className={`md:ml-[300px] min-h-[calc(100vh-120px)]`}>
                        <div className="bg-[url('assets/images/bg_nurse_transparent.png')] bg-cover min-h-[calc(100vh-120px)] pt-28">
                            <div className='w-[250px] mx-auto flex flex-col items-center bg-white p-4'>
                                <img src={qr} alt="" className='w-[220px] p-3 border border-black' />
                                <p className='text-center my-2 font-semibold'>Scan the patient's QR code to access their medical records.</p>
                                <button onClick={handleScanButtonClick} className='bg-[#499e94] text-xl text-white font-medium hover:bg-[#4fb5a9] p-1.5 w-full rounded-md'>Scan</button>
                            </div>
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
                        </div>
                    </div>
                ) : (
                    <div className="w-full md:w-[75%] md:ml-[22%] mt-10 mb-12">
                        <div className='flex gap-6 items-center mb-4'>
                            <button onClick={() => handleClose()} className='flex items-center h-full'><i className='bi bi-x-lg'></i></button>
                            <h2 className='font-bold text-2xl'>Patient No. {patient.patient_number}</h2>
                        </div>
                        <div className='grid grid-cols-5 gap-4'>
                            <div className='col-span-2'>
                                <PatientDetails />
                            </div>
                            <div className='bg-[#D9D9D9] bg-opacity-30 col-span-3'>
                                <div className='bg-[#B43C3A] py-2 px-4 flex items-center justify-between'>
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
                                            <ViewConsultation /> 
                                        ) : consultationComponentStatus === "add" && (
                                            <AddConsultation /> 
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
