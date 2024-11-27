import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AppContext from '../context/AppContext'

import Swal from 'sweetalert2'
import { ClipLoader } from 'react-spinners'

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import PatientDetails from '../components/PatientDetails'
import VitalSignsTable from '../components/VitalSignsTable'
import VitalSignsForm from '../components/VitalSignsForm'
import globalSwalNoIcon from '../utils/globalSwal'

const PatientPageSecretary = () => {
    const { token } = useContext(AppContext)
    const navigate = useNavigate()

    const [patient, setPatient] = useState([])
    const [vitalSignsState, setVitalSignsState] = useState(patient.vital_signs === null ? null : "view")
    const [showPatientIdMenu, setShowPatientIdMenu] = useState(false)
    const patientIdMenuRef = useRef(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchPatient()

        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (patientIdMenuRef.current && !patientIdMenuRef.current.contains(event.target)) {
            setShowPatientIdMenu(false);
        }
    };

    const fetchPatient = async () => {
        setLoading(true)

        try {
            const res = await fetch(`/api/patients/10`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(!res.ok) {
                if (res.status === 500) {
                    throw new Error("Something went wrong. Please try again later.")
                } else if (res.status === 404) {
                    throw new Error("Patient not found.")
                } else if (res.status === 403) {
                    throw new Error("You are not authorized to perform this action.")
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }

            const data = await res.json()
            
            setPatient(data)
            console.log(data)
        }
        catch (err) {
            let error = err.message ?? "Something went wrong. Please try again later."

            if (err.name === "TypeError") {
                error = "Something went wrong. Please try again later. You may refresh or check your Internet connection."
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

            navigate('/')
        }
        finally {
            setLoading(false)
        }
    }

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
                       if (res.status === 404) {
                           throw new Error("Vital signs record not found.")
                       } else {
                           throw new Error("Something went wrong. Please try again later.")
                       }
                   }    
        
                   setPatient((prevData) => ({...prevData, vital_signs: null}))
                   setVitalSignsState(null)
                }
                 catch (err) {
                   let error = err.message ?? "Something went wrong. Please try again later."
                   if (err.name === "TypeError") {
                       error = "Something went wrong. Please try again later. You may refresh or check your Internet connection."
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
            }
        })
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
            },
            confirmButtonColor: "#248176",
            cancelButtonColor: "#b33c39",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/')
            }
        });
    }

    return (
        <>
            { loading && (
                <div className='z-20 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
                    <ClipLoader className='' loading={loading} size={60} color='#6CB6AD' />
                </div>
            )}

            <div>

                <Sidebar />
                <Header />

                <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] mb-12">
                    <div className='flex gap-6 items-center mb-4'>
                        <button onClick={() => handleClose()} className='flex items-center h-full'><i className='bi bi-x-lg'></i></button>
                        <h2 className='font-bold text-2xl'>Patient No. {patient.patient_number}</h2>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <PatientDetails patient={patient} setPatient={setPatient} setLoading={setLoading} />
                        </div>
                        <div className='bg-[#D9D9D9] bg-opacity-30 flex flex-col gap-4'>
                            <div>
                                <p className='bg-[#B43C3A] py-2 px-4 font-semibold text-white text-lg'>Consultation Today</p>
                                <div className='px-6 py-4'>
                                    { true && (
                                        <>
                                            <div className='flex gap-2 items-center mb-2'>
                                                { (vitalSignsState === "edit" || vitalSignsState === "add") && (
                                                    <button onClick={() => {setVitalSignsState(!patient.vital_signs ? null : "view")}}>
                                                        <i className={`bi bi-arrow-left me-2 text-xl text-black font-bold`}></i>
                                                    </button>
                                                )}
                                                <p className={`text-black font-semibold ${vitalSignsState && "text-lg"}`}>Vital Signs</p>
                                                { !vitalSignsState && (!patient.vital_signs) && (
                                                    <button onClick={() => {setVitalSignsState("add")}}>
                                                        <i className={`bi bi-plus-square-fill ms-4 text-lg text-[#B43C3A] hover:text-red-500`}></i>
                                                    </button>
                                                )}
                                                { vitalSignsState === "view" && patient.vital_signs && (
                                                    <button onClick={() => {setVitalSignsState("edit")}}>
                                                        <i className={`bi bi-pencil-square ms-4 text-lg text-[#B43C3A] hover:text-red-500`}></i>
                                                    </button>
                                                )}
                                                { vitalSignsState === "view" && patient.vital_signs && (
                                                    <button onClick={() => {deleteVitalSigns()}}>
                                                        <i className={`bi bi-trash ms-4 text-lg text-[#B43C3A] hover:text-red-500`}></i>
                                                    </button>
                                                )}
                                            </div>

                                            {console.log(vitalSignsState)}

                                            {/* view vital signs */}
                                            { vitalSignsState === "view" && patient.vital_signs && (
                                                <VitalSignsTable vitalSigns={patient.vital_signs} />
                                            )}

                                            {/* edit vital signs */}
                                            { vitalSignsState === "edit" && patient.vital_signs && (
                                                <VitalSignsForm setPatient={setPatient} setVitalSignsState={setVitalSignsState} setLoading={setLoading} vitalSigns={patient.vital_signs} />
                                            )}

                                            {/* add vital signs */}
                                            { vitalSignsState === "add" && !patient.vital_signs && (
                                                <VitalSignsForm setPatient={setPatient} setVitalSignsState={setVitalSignsState} setLoading={setLoading} patientId={patient.id} />
                                            )}
                                        </>
                                    )}

                                    { true && (
                                        <button onClick={() => {}} className={`block py-1 align-middle text-black font-semibold hover:text-[#B43C3A] ${vitalSignsState && "mt-6"}`}>
                                            Print Prescription<i className={`bi bi-printer-fill ms-4 text-xl text-[#B43C3A] hover:text-red-500`}></i>
                                        </button>       
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className='bg-[#B43C3A] py-2 px-4 font-semibold text-white text-lg flex justify-between items-center'>
                                    <p>Patient Identification Card</p>
                                    <div ref={patientIdMenuRef}>
                                        <button onClick={() => {setShowPatientIdMenu(!showPatientIdMenu)}}><i className='bi bi-three-dots-vertical text-xl text-white hover:text-gray-300 relative'></i></button>
                                        { showPatientIdMenu && (
                                            <div className='absolute bg-white border border-[#6cb6ad] rounded-md text-black text-base right-16 shadow'>
                                                <button className='hover:bg-gray-200 p-2 pe-12 rounded-md font-normal'>Deactivate</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='px-6 py-4'>
                                    <p className='text-black font-semibold'>Status: <span className='font-normal ms-2'>Active</span></p>
                                    <p className='text-black font-semibold'>Date Issued: <span className='font-normal ms-2'>January 22, 2023</span></p>
                                    <p className='text-black font-semibold'>Number of Issuances: <span className='font-normal ms-2'>2</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PatientPageSecretary