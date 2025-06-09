import React, { useContext, useRef, useState, useEffect } from 'react'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'

import qr from '../assets/images/qr.png'
import facial_recognition_icon from '../assets/images/facial-recognition-icon.png'
import '../assets/styles/QrScanAnimation.css'
import { BounceLoader } from 'react-spinners'

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import PatientDetails from '../components/PatientDetails'
import ConsultationForm from '../components/ConsultationForm'
import ConsultationsTable from '../components/ConsultationsTable'
import ViewConsultation from '../components/ViewConsultation'
import { globalSwalNoIcon, globalSwalWithIcon } from '../utils/globalSwal'
import { fetchPatientUsingQr } from '../utils/fetch/fetchPatientUsingQr'
import { showError } from '../utils/fetch/showError'
import { fetchPatientUsingId } from '../utils/fetch/fetchPatientUsingId'
import Pusher from 'pusher-js'
import { echo as Echo } from '../utils/pusher/echo';
import { showWarning } from '../utils/fetch/showWarning'
import IconScanning from '../components/IconScanning'
import WebcamCapture from '../components/WebcamCapture'
import FoundPatientPopup from '../components/FoundPatientPopup'
import { fetchPatientUsingFace } from '../utils/fetch/fetchPatientUsingFace'
import { base64ToPngFile } from '../utils/fileUtils'

window.pusher = Pusher

const PatientPagePhysician = () => {
    const { user, token } = useContext(AppContext)
    const { 
        patientPageLoading, setPatientPageLoading,
        resetPatientViewer,
        patient, setPatient,
        consultationComponentStatus, setConsultationComponentStatus,
     } = useContext(PhysicianContext)

    const qrInputRef = useRef(null)
    const patientIdInputRef = useRef(null)
    const [isQrInputFocused, setIsQrInputFocused] = useState(false)
    const [qrCode, setQrCode] = useState("")
    const modalRef = useRef(null);
    const [manualLookup, setManualLookup] = useState(false)
    const [patientId, setPatientId] = useState('')
    const [patientIdError, setPatientIdError] = useState('')
    const [isAddHovered, setIsAddHovered] = useState(false)

    const [searchFace, setSearchFace] = useState(false)
    const [image, setImage] = useState(null)
    const [foundPatient, setFoundPatient] = useState(null)

    useEffect(() => {
        if (patient && user.role === "physician") {
            const echo = Echo(token)
            echo.private(`vital-signs.${patient.id}`)
                .listen('VitalSignsNew', (e) => {
                    const newVitalSigns = e.vitalSigns
                    
                    setPatient({...patient, vital_signs: newVitalSigns})
                })
                .listen('VitalSignsUpdated', (e) => {
                    const updatedVitalSigns = e.vitalSigns
                    
                    setPatient({...patient, vital_signs: updatedVitalSigns})
                })

            return () => {
                echo.leave(`vital-signs.${patient.id}`)
            }
        }
    }, [patient])

    const getPatientUsingQr = async (e) => {
        e.preventDefault()
        setPatientPageLoading(true)
        setIsQrInputFocused(false)

        try {
            setFoundPatient(fetchPatientUsingQr(qrCode, token))
        }
        catch (err) {
            if (err.message === "Invalid") {
                showWarning("The QR code is invalid.")
            } else if (err.message === "Not found") {
                showWarning("The QR code is either deactivated, expired, or does not exists.")
            } else if (err.message === "Unauthorized") {
                showWarning("You are not authorized to access this patient. Make sure you are an assigned physician.")
            } else {
                showError(err)
            }
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
            setFoundPatient(await fetchPatientUsingId(patientId, token))
            
            setManualLookup(false)
            setPatientId('')
        }
        catch (err) {
            if (err.message === "Invalid") {
                showWarning("The patient ID is invalid.")
            } else if (err.message === "Not found") {
                showWarning("Patient not found.")
            } else if (err.message === "Unauthorized") {
                showWarning("You are not authorized to access this patient. Make sure you are an assigned physician.")
            } else {
                showError(err)
            }
        }
        finally {
            setPatientPageLoading(false)
        }
    }

    const handlePatientIdChange = (e) => {
        setPatientIdError('')

        const value = e.target.value

        if(!/^[\d-]*$/.test(value)) {
            setPatientIdError('Can only contain numbers and dash (-).')
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

    const viewPatient = () => {
        if(foundPatient) {
            setPatient(foundPatient)
            setFoundPatient(null)
        }
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

    const handleAddConsultationButton = () => {
        if (!patient.vital_signs) {
            // globalSwalWithIcon.fire({
            //     title: "Vital signs not available, cannot add consultation record.",
            //     icon: 'warning',
            //     showConfirmButton: false,
            //     showCloseButton: true
            // });
            return
        }

        setConsultationComponentStatus("add")
    }

    const handleManualLookupClick = () => {
        setManualLookup(true);
    };

    // Focus the patient ID input field when modal is shown
    useEffect(() => {
        if (manualLookup && patientIdInputRef.current) {
            patientIdInputRef.current.focus();
        }
    }, [manualLookup]);

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

    return (
        <>
            <Sidebar />
            { patientPageLoading && (
                <div className='z-50 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
                    <BounceLoader className='' loading={patientPageLoading} size={60} color='#6CB6AD' />
                </div>
            )}

            {/* pop up to find patient */}
            {manualLookup && (
                <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-40 z-40'>
                    <div ref={modalRef} className="bg-white rounded-md flex justify-items-center flex-col p-6 max-h-[70vh] relative">
                        <i className="bi bi-search block text-3xl font-bold text-center text-[#6CB6AD]"></i>
                        <form onSubmit={(e) => getPatientUsingId(e)} className='flex items-center justify-center flex-col'>
                            <div className='mt-3'>
                                <div className="flex items-center border rounded-md border-black overflow-hidden">
                                    <span className="bg-gray-200 p-2 border-r border-r-black">P</span>
                                    <input
                                        ref={patientIdInputRef}
                                        type="text"
                                        placeholder="00000-0000"
                                        value={patientId}
                                        onChange={handlePatientIdChange}
                                        className="w-full p-2 focus:outline-none min-w-[250px] sm:min-w-[300px]"
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
                        <button onClick={() => setManualLookup(false)} className='absolute text-lg top-2 right-2'>
                            <i className='bi bi-x-lg'></i>
                        </button>
                    </div>
                </div>
            )}

            <div className='lg:pl-[250px] min-h-screen bg-white'>
                <Header />
                { !patient && isQrInputFocused && (
                    <div className='fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50'>
                        <div className='w-[90%] max-w-md bg-white shadow-lg rounded-md p-6 sm:p-8'>
                            <IconScanning src={qr} />
                            <p className='mt-4 font-semibold text-center'>Waiting for your scan</p>
                            <p className='text-center'>Please ensure that the QR code is properly placed on the scanner for accurate reading.</p>
                            <button onClick={handleQrInputBlur} className='bg-red-700 text-xl text-white font-medium hover:bg-[#d05250] p-1.5 rounded-md w-[50%] mx-auto mt-3 block'>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* face search */}
                {!patient && searchFace && (
                    <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-30'>
                    <WebcamCapture image={image} setImage={setImage} setShow={setSearchFace} />
                    </div>
                )}

                {!patient && image && (
                    <div className='flex items-center justify-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 z-30'>
                        <div className='px-4 py-6 bg-white shadow-lg w-[90%] sm:w-[400px] rounded-md'>
                            <IconScanning src={facial_recognition_icon} />
                            <p className='text-center italic mt-4'>Looking for patient. Please wait.</p>
                        </div>
                    </div>
                )}

                {/* pop-up for found patient */}
                {!patient && foundPatient && (
                    <FoundPatientPopup isOpen={foundPatient} onClose={() => {setFoundPatient(null)}} patient={foundPatient} viewPatient={viewPatient}/>
                )}
                
                { !patient ? (
                    <div>
                        <div className="bg-[url('assets/images/bg_nurse_transparent.png')] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center sm:px-6">
                            <div className='w-fit max-w-[600px] mx-auto bg-white rounded-lg p-4'>
                                <div className='grid grid-cols-2 gap-4 place-items-center'>
                                    <img onClick={() => {}} src={qr} alt="" className='w-full max-w-[250px] p-3 border border-black rounded-md' />
                                    <img onClick={() => {}} src={facial_recognition_icon} alt="" className='w-full max-w-[250px] p-3 border border-black rounded-md' />
                                    <p className='text-center leading-tight text-base'>Scan the patient's QR code to access their medical records.</p>
                                    <p className='text-center leading-tight text-base'>Use facial recognition to access the patient's medical records.</p>
                                    <button onClick={handleScanButtonClick} className='bg-[#248176] text-xl text-white font-medium hover:bg-[#499e94] p-1.5 w-full rounded-md'>Scan QR</button>
                                    <button onClick={() => {setSearchFace(true)}} className='bg-[#248176] text-xl text-white font-medium hover:bg-[#499e94] p-1.5 w-full rounded-md'>Use Face ID</button>
                                </div>
                                <p className='text-center my-2 font-normal text-sm'>Or you may do a manual lookup using Patient ID&nbsp;  
                                    <span onClick={handleManualLookupClick} className='underline text-[#248176] hover:text-orange-600 cursor-pointer'>here</span>.
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
                    <div className="px-4 sm:px-6 mt-4">
                        <div className='flex items-center mb-4'>
                            <button onClick={() => handleClose()} className='me-6 flex items-center h-full'><i className='bi bi-x-lg'></i></button>
                            <h2 className='me-3 font-bold text-2xl'>Patient No. {patient.patient_number}</h2>
                            { patient.is_new_in_department && 
                                <div className='me-2 h-full border border-green-500 border-1 px-2 py-1 rounded-lg'>
                                    <p className='text-xs text-green-500 font-semibold'>New</p>
                                </div> 
                            }
                            <div className={`h-full border ${patient.vital_signs == null ? "border-gray-500" : "border-orange-500"} border-1 px-2 py-1 rounded-lg`}>
                                <p className={`text-xs ${patient.vital_signs == null ? "text-gray-500" : "text-orange-500"} font-semibold`}>Vital Signs {patient.vital_signs == null && "Not"} Available</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 w-full px-2 lg:px-0'>
                            {/* Left Panel */}
                            <div className='col-span-1 lg:col-span-3 w-full'>
                                <PatientDetails patient={patient} />
                            </div>
                            {/* Right Panel */}
                            <div className='col-span-1 lg:col-span-4 bg-[#D9D9D9] bg-opacity-30 mb-4 w-full'>
                                <div className='bg-[#248176] py-3 px-4 flex items-center justify-between'>
                                    <div className='flex gap-4 w-full'>
                                        { consultationComponentStatus != null && 
                                            <button onClick={() => setConsultationComponentStatus(null)}>
                                                <i className="bi bi-arrow-left text-xl me-2 text-white"></i>
                                            </button>
                                        }
                                        { consultationComponentStatus === null && 
                                            <div className='flex justify-between items-center w-full'>
                                                <p className='font-semibold text-white text-lg'>Consultations</p>
                                                <div className='relative'>
                                                    <button 
                                                        onMouseEnter={() => setIsAddHovered(true)}
                                                        onMouseLeave={() => setIsAddHovered(false)}
                                                        onClick={() => handleAddConsultationButton()}>
                                                            <i className={`bi bi-plus-square-fill me-2 text-xl ${patient.vital_signs == null ? 'text-gray-300' : 'text-white'}`}></i>
                                                    </button>
                                                    {isAddHovered && <div className='bg-gray-700 text-sm text-white p-2 rounded-md absolute right-0 w-40'>Vital signs unavailable.</div>}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='p-4'>
                                    <div className='grid grid-cols-1 justify-center'>
                                        { consultationComponentStatus === null ? (
                                            <ConsultationsTable consultations={patient.consultations} />
                                        ) : consultationComponentStatus === "view" ? (
                                            <ViewConsultation setLoading={setPatientPageLoading} /> 
                                        ) : consultationComponentStatus === "add" && (
                                            <ConsultationForm /> 
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
