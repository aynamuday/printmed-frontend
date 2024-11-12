import React, { useContext, useEffect, useState } from 'react'

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import PatientDetails from '../components/PatientDetails'
import ConsultationsTable from '../components/ConsultationsTable'
import AppContext from '../context/AppContext'

const PatientPage = (patientId) => {
    const { token } = useContext(AppContext)

    patientId = 1

    const [ patient, setPatient ] = useState(null)
    const [ consultations, setConsultations ] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchPatient = async () => {
        const res = await fetch(`/api/patients/${patientId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        if(res.ok) {
            setPatient(data)
        }
    }

    const fetchConsultations = async () => {
        const res = await fetch(`/api/patients/${patientId}/consultations`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        if(res.ok) {
            setConsultations(data)
        }

        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        fetchPatient()
        fetchConsultations()
    }, [])


    return (
        <div>
            <Sidebar />
            <Header />

            { patient && ( <div className="w-full md:w-[75%] md:ml-[22%] mt-10 mb-12">
                <h2 className='font-bold text-2xl mb-4'>Patient No. {patient.patient_number}</h2>
                <div className='grid grid-cols-5 gap-4'>
                    <div  className='col-span-2'>
                        <PatientDetails patient={patient} />
                    </div>
                    <div  className='bg-[#D9D9D9] bg-opacity-30 col-span-3'>
                        <div className='bg-[#B43C3A] py-2 px-4 flex items-center justify-between'>
                            <p className='font-semibold text-white text-lg'>Consultation Records</p>
                            <button>
                                <i className="bi bi-plus-square-fill me-2 text-white"></i>
                            </button>
                        </div>
                        <div>
                            <div className='grid grid-cols-1 justify-center px-4 py-6'>
                                <ConsultationsTable consultations={consultations.data}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div> )}
        </div>
    )
}

export default PatientPage