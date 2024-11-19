import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import PatientDetails from '../components/PatientDetails'
import ConsultationsTable from '../components/ConsultationsTable'
import Consultation from '../components/Consultation'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'
import globalSwal from '../utils/globalSwal'

const PatientPage = (patientId) => {
    const { token } = useContext(AppContext)
    const navigate = useNavigate();

    const [qrCode, setQrCode] = useState("")
    const [ patient, setPatient ] = useState(null)
    
    const [error, setError] = useState("")
    
    const { consultationStatus, setConsultationStatus } = useContext(PhysicianContext)
    const { consultation, setConsultation } = useContext(PhysicianContext)
    const { addConsultation, setAddConsultation } = useContext(PhysicianContext)
    const { editConsultation, setEditConsultation } = useContext(PhysicianContext)

    patientId = 1

    const [ consultations, setConsultations ] = useState([])
    const [loading, setLoading] = useState(false)

    const handleQrCodeSubmit = () => {
        setLoading(true)

        const fetchPatient = async () => {
            try {
                const res = await fetch('/api/patient-using-qr', {
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
                        throw new Error("You don't have permission to access this patient.")
                    } else if (res.status === 400) {
                        throw new Error("Something went wrong with your request. Please check your input and try again later.")
                    } else {
                        throw new Error("Something went wrong. Please try again later.")
                    }
                }

                const data = res.json()

                setPatient(data)
            }
            catch (err) {
                if (err.name === "TypeError") {
                    setError("Network error.")
                } else {
                    setError(err.message || "Something went wrong. Please try again later.")
                }
            }
            finally {
                setLoading(false)
            }
        }
    }







    const fetchPatient = async () => {
        globalSwal.showLoading()
        
        const res = await fetch(`/api/patients/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        console.log(data);

        if(res.ok) {
            setPatient(data)
            fetchConsultations()
        }
    }

    const fetchConsultations = async () => {
        const res = await fetch(`/api/patients/${patientId}/consultations`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        console.log(data)

        if(res.ok) {
            setConsultations(data)
        }

        setLoading(false)

        globalSwal.close()
    }

    useEffect(() => {
        setLoading(true)
        fetchPatient()
    }, [])

    return (
        // if loading
        // if error

        <div>
            <Sidebar />
            <Header />

            {/* <div className="w-full md:w-[75%] md:ml-[22%] mt-10 mb-12">
                <div className='w-full min-h-96 flex flex-col items-center justify-center'>
                    <h1 className='font-bold text-3xl mb-5'>Scan Patient QR Code</h1>
                    <form action="handleQrCodeSubmit" className='flex items-center justify-center w-full'>
                        <input 
                            type="text" 
                            className='border-2 border-[#6cb6ad] w-[50%] h-12 rounded-lg text-lg p-2 placeholder:italic placeholder:text-base'
                            placeholder='Scan Patient QR Code'
                            value={qrCode}
                            onChange={(e) => setQrCode(e.target.value)}
                            required
                        />
                    </form>
                </div>
            </div> */}

            { patient && ( <div className="w-full md:w-[75%] md:ml-[22%] mt-10 mb-12">
                <h2 className='font-bold text-2xl mb-4 flex items-center'>
                    <button onClick={() => navigate("/patients")} className="mr-4">
                        <i className="bi bi-arrow-left text-xl"></i> {/* Left arrow icon */}
                    </button>
                    Patient No. {patient.patient_number}
                </h2>
                <div className='grid grid-cols-5 gap-4'>
                    <div  className='col-span-2'>
                        <PatientDetails patient={patient} />
                        
                    </div>
                    <div  className='bg-[#D9D9D9] bg-opacity-30 col-span-3'>
                        <div className='bg-[#B43C3A] py-2 px-4 flex items-center justify-between'>
                            <div className='flex gap-4'>
                                {(consultationStatus) && 
                                    <button onClick={() => {consultationStatus == "edit" ? setConsultationStatus("view") : setConsultationStatus(null)}}>
                                        <i className={`bi bi-arrow-left text-xl me-2 text-white`}></i>
                                    </button>
                                }
                                <p className='font-semibold text-white text-lg'>Consultation Records</p>
                            </div>
                            <div className='flex gap-4'>
                                {consultationStatus == "view" && <button onClick={() => {setConsultationStatus("edit")}}><i className={`bi bi-pencil-square me-2 text-white`}></i></button>}
                                {!consultationStatus && <button onClick={() => {setConsultationStatus("add")}}><i className={`bi bi-plus-square-fill me-2 text-white`}></i></button>}
                            </div>
                        </div>
                        <div>
                            <div className='grid grid-cols-1 justify-center px-4 py-6'>
                                { consultationStatus && <Consultation /> }
                                {!consultationStatus && <ConsultationsTable consultations={consultations.data} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div> )}
        </div>
    )
}

export default PatientPage
