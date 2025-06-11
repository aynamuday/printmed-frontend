import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import facial_recognition_icon from '../assets/images/facial-recognition-icon.png';

import AppContext from '../context/AppContext'

import { BounceLoader } from 'react-spinners'
import { globalSwalWithIcon, globalSwalNoIcon } from '../utils/globalSwal'
import { getFormattedNumericDate, getFormattedStringDate } from '../utils/dateUtils'
import { printPdf } from '../utils/printPdf'

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import PatientDetails from '../components/PatientDetails'
import VitalSignsTable from '../components/VitalSignsTable'
import VitalSignsForm from '../components/VitalSignsForm'
import { showError } from '../utils/fetch/showError'
import WebcamCapture from '../components/WebcamCapture';
import IconScanning from '../components/IconScanning';
import { showWarning } from '../utils/fetch/showWarning';
import { base64ToPngFile } from '../utils/fileUtils';
import FaceVerificationPopup from '../components/FaceVerificationPopup';
import { isPatientFaceVerified } from '../utils/fetch/isPatientFaceVerified';

const PatientPageSecretary = () => {
    const { token } = useContext(AppContext)
    const navigate = useNavigate()

    const [patient, setPatient] = useState([])
    const [vitalSignsState, setVitalSignsState] = useState(null)
    const [showPatientIdMenu, setShowPatientIdMenu] = useState(false)
    const patientIdMenuRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [verifyFace, setVerifyFace] = useState(false)
    const [verifyFaceImage, setVerifyFaceImage] = useState(null)
    const [isVerified, setIsVerified] = useState(false)
    const [showVerificationPopup, setShowIsVerifiedPopup] = useState(false)

    useEffect(() => {
        const sessionStoragePatient = sessionStorage.getItem('patient')
        if (sessionStoragePatient === null) {
            navigate('/')
            return
        }
        const patient = JSON.parse(sessionStoragePatient)
        setPatient(patient)
        setVitalSignsState(patient.vital_signs == null ? null : "view")

        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    const handleClickOutside = (event) => {
        if (patientIdMenuRef.current && !patientIdMenuRef.current.contains(event.target)) {
            setShowPatientIdMenu(false);
        }
    };

    const deleteVitalSigns = async () => {
        if (!patient.vital_signs || (!patient.vital_signs)) {
            return
        }

        globalSwalNoIcon.fire({
            title: "Are you sure you want to delete this record of vital signs?",
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true)
        
                    const res = await fetch(`/api/vital-signs/${patient.vital_signs.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
             
                   if(!res.ok) {
                        if (res.status != 404) {
                            throw new Error("Something went wrong. Please try again later.")
                        }
                   }    
        
                   const updatedPatient = {...patient, vital_signs: null}
                   setPatient(updatedPatient)
                   setVitalSignsState(null)
                   sessionStorage.setItem('patient', JSON.stringify(updatedPatient))
                }
                 catch (err) {
                   showError(err)
                }
                finally {
                    setLoading(false)
                }
            }
        })
    }

    const generateIdCard = async () => {
        setShowPatientIdMenu(false)

        if (patient.photo_url == null) {
            globalSwalWithIcon.fire({
                icon: 'warning',
                title: `Patient's photo is required to generate an identification card.`
            })

            return
        }

        globalSwalNoIcon.fire({
            title: `Generate identification card for patient?`,
            html: `${patient.email != null ? `
                <input type="checkbox" id="send-email"> <span style="color: black; font-size: 16px; margin-left: 8px;">Send digital copy to patient thru email</span>
                <p style="color: black; font-size: 16px; margin-left: 8px; font-style: italic;">Please confirm to patient that their email is active.</p>` : ""}`,
            showCancelButton: true,
            confirmButtonText: "Continue"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const sendEmail = patient.email != null ? document.getElementById('send-email').checked : false;
                
                try {
                    setLoading(true)

                    let fetchUrl = `/api/generate-patient-id-card/${patient.id}?`
                    if (patient.email != null && sendEmail) {
                        fetchUrl += "send_email=1"
                    }
        
                    const res = await fetch(fetchUrl, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
             
                    if(!res.ok) {
                       if (res.status === 404) {
                           throw new Error("Patient not found.")
                       } else {
                           throw new Error("Something went wrong. Please try again later.")
                       }
                    }
        
                    const data = await res.blob()
                    const url = URL.createObjectURL(data)
                    printPdf(url)

                    const updatedPatient = {...patient, qr_status: {...patient.qr_status, status: "Active", date_issued: getFormattedNumericDate(), issuances_count: patient.qr_status.issuances_count ? + patient.qr_status.issuances_count + 1 : 1}}
                    setPatient(updatedPatient)
                    sessionStorage.setItem('patient', JSON.stringify(updatedPatient))
                }
                catch (err) {
                    showError(err)
                }
                finally {
                    setLoading(false)
                }
            }
        })
    }

    const deactivateIdCard = async () => {
        setShowPatientIdMenu(false)

        globalSwalWithIcon.fire({
            icon: 'warning',
            title: `Are you sure you want to <span style="color: red;">deactivate patient's identification card</span>?`,
            html: `<p style="color: black; font-size: 17px; margin: 0;">This action cannot be undone!</p>`,
            showCancelButton: true,
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true)
        
                    const res = await fetch(`/api/deactivate-patient-id-card/${patient.id}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
             
                    if(!res.ok) {
                       if (res.status === 404) {
                           throw new Error("Patient not found.")
                       } else {
                           throw new Error("Something went wrong. Please try again later.")
                       }
                    }
        
                    globalSwalWithIcon.fire({
                        title: "Patient's identification card successfully deactivated!",
                        icon: 'success',
                        showConfirmButton: false,
                        showCloseButton: true
                    })

                    const updatedPatient = {...patient, qr_status: {...patient.qr_status, status: "Deactivated", date_deactivated: getFormattedNumericDate()}}
                    setPatient(updatedPatient)
                    sessionStorage.setItem('patient', JSON.stringify(updatedPatient))
                }
                catch (err) {
                    showError(err)
                }
                finally {
                    setLoading(false)
                }
            }
        })
    }

    const handleClose = () => {
        globalSwalNoIcon.fire({
            title: 'Are you sure you want to close this patient?',
            confirmButtonText: "Yes",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/')
                setPatient(null)
                setLoading(false)
                sessionStorage.removeItem('patient')
            }
        });
    }


    // verify face 
    useEffect(() => { 
        if(verifyFaceImage == null) {
            return 
        }

        verifyPatientFace()
    }, [verifyFaceImage])

    const verifyPatientFace = async () => {
        const photo = base64ToPngFile(verifyFaceImage)
        setIsVerified(await isPatientFaceVerified(photo, patient.id, token))
        setShowIsVerifiedPopup(true)
        setVerifyFace(false)
        setVerifyFaceImage(null)
    }

    return (
        <>
            { loading && (
                <div className='z-50 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
                    <BounceLoader className='' loading={loading} size={60} color='#6CB6AD' />
                </div>
            )}

            {/* verify face */}
            {verifyFace && (
                <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-30'>
                    <WebcamCapture image={verifyFaceImage} setImage={setVerifyFaceImage} setShow={setVerifyFace} />
                </div>
            )}
            {verifyFaceImage && (
                <div className='flex items-center justify-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 z-30'>
                    <div className='px-4 py-6 bg-white shadow-lg w-[90%] sm:w-[400px] rounded-md'>
                        <IconScanning src={facial_recognition_icon} />
                        <p className='text-center italic mt-4'>Verifying patient. Please wait.</p>
                    </div>
                </div>
            )}
            <FaceVerificationPopup isOpen={showVerificationPopup} onClose={() => {setShowIsVerifiedPopup(false)}} isSuccessful={isVerified}/>

            <Sidebar />
            <div className="lg:pl-[250px] min-h-screen bg-white">
                <Header />
                {patient && (
                <div className="px-4 sm:px-6 mt-4 mb-4">
                    <div>
                        <div>
                            <div className='flex flex-wrap items-center mb-4 gap-3'>
                                <button onClick={() => handleClose()} className='flex items-center tex-xl'>
                                    <i className='bi bi-x-lg'></i>
                                </button>
                                <h2 className='font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl'>
                                    Patient No. {patient.patient_number}
                                </h2>
                                {patient.is_new_in_department && 
                                    <div className='border border-green-500 px-2 py-1 rounded-lg'>
                                        <p className='text-xs text-green-500 font-semibold'>New</p>
                                    </div> 
                                }
                                {/* Verify Face Button */}
                                <div className="flex items-center">
                                    <button onClick={() => {setVerifyFace(true)}} title='Verify patient using facial recognition.'>
                                        <img src={facial_recognition_icon} alt="" className='w-[40px] h-full rounded-md p-0.5 border border-[#248176]' />
                                    </button>
                                </div>

                            </div>
                            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
                                {/* Patient Details */}
                                <div>
                                    <PatientDetails 
                                        patient={patient} 
                                        setPatient={setPatient} 
                                        setLoading={setLoading} 
                                    />
                                </div>
                                {/* Right Panel */}
                                <div>
                                    {/* Vital Signs */}
                                    <div className='bg-[#D9D9D9] bg-opacity-30 flex flex-col gap-4 mb-4'>
                                        <div className='flex bg-[#248176] py-2 px-4 font-semibold text-white text-lg'>
                                            { (vitalSignsState === "edit" || vitalSignsState === "add") && (
                                                <button onClick={() => {setVitalSignsState(!patient.vital_signs ? null : "view")}}>
                                                    <i className={`bi bi-arrow-left me-4 text-xl`}></i>
                                                </button>
                                            )}
                                            <p>Vital Signs Today</p>
                                        </div>
                                        <div className='px-4 py-3'>
                                            <div className='flex gap-2 items-center mb-2'>
                                                {!vitalSignsState && (!patient.vital_signs) && (
                                                    <button onClick={() => {setVitalSignsState("add")}}>
                                                        <i className="bi bi-plus-square-fill ms-4 text-lg text-[#248176] hover:text-[#6cb6ad]"></i>
                                                    </button>
                                                )}
                                                { vitalSignsState === "view" && patient.vital_signs && (
                                                    <>
                                                        <button onClick={() => {setVitalSignsState("edit")}}>
                                                            <i className="bi bi-pencil-square text-lg text-[#248176] hover:text-[#6cb6ad]"></i>
                                                        </button>
                                                        <button onClick={() => {deleteVitalSigns()}}>
                                                            <i className="bi bi-trash text-lg text-[#248176] hover:text-[#6cb6ad]"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* view vital signs */}
                                            { vitalSignsState === "view" && patient.vital_signs && (
                                                <VitalSignsTable vitalSigns={patient.vital_signs} />
                                            )}

                                            {/* edit vital signs */}
                                            {(vitalSignsState === "edit" || vitalSignsState === "add") && (
                                                <VitalSignsForm 
                                                    setPatient={setPatient} 
                                                    patient={patient} 
                                                    setVitalSignsState={setVitalSignsState} 
                                                    setLoading={setLoading} 
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Patient ID Card */}
                                    <div className='bg-[#D9D9D9] bg-opacity-30 flex flex-col gap-4 mb-4'>
                                        <div className='bg-[#248176] py-2 px-4 font-semibold text-white text-lg flex justify-between items-center'>
                                            <p>Patient Identification Card</p>
                                            <div ref={patientIdMenuRef} className='relative'>
                                                <button onClick={() => {setShowPatientIdMenu(!showPatientIdMenu)}}>
                                                    <i className='bi bi-three-dots-vertical text-xl text-white hover:text-gray-300'></i>
                                                </button>
                                                {showPatientIdMenu && (
                                                    <div className='absolute bg-white border border-[#6cb6ad] rounded-md text-black text-base right-0 mt-2 shadow z-10'>
                                                        {patient.qr_status?.status == "Active" ? (
                                                            <button onClick={deactivateIdCard} className='hover:bg-gray-200 p-2 pe-12 w-full text-left'> 
                                                                <i className='bi bi-dash-circle me-1 text-xl'></i> Deactivate
                                                            </button>
                                                        ) : (
                                                            <button onClick={generateIdCard} className='hover:bg-gray-200 p-2 pe-12 w-full text-left'> 
                                                                <i className='bi bi-arrow-repeat me-1 text-xl'></i> Generate
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='px-4 py-3'>
                                            <p className='text-black font-semibold'>Status: 
                                                <span className='font-normal ms-2'>
                                                    {patient.qr_status?.status ?? "No issues yet"}
                                                </span>
                                            </p>
                                            {patient.qr_status?.status && (
                                                <>
                                                    {patient.qr_status.status == "Active" && (
                                                        <p className='text-black font-semibold'>Date of Issue: 
                                                            <span className='font-normal ms-2'>{getFormattedStringDate(patient.qr_status.date_issued)}</span>
                                                        </p>  
                                                    )}
                                                    <p className='text-black font-semibold'>Number of Issuances: 
                                                        <span className='font-normal ms-2'>{patient.qr_status.issuances_count}</span>
                                                    </p>  
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            )}
            </div>
        </>
    )
}

export default PatientPageSecretary