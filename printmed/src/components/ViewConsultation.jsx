import React, { useContext, useEffect, useState } from 'react'
import { getFormattedNumericDate, getFormattedStringDate } from '../utils/dateUtils'
import globalSwal from '../utils/globalSwal'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'

const ViewConsultation = () => {
    const { token } = useContext(AppContext)
    const { 
        consultations, setConsultations,
        viewConsultationId 
    } = useContext(PhysicianContext)

    const [consultation, setConsultation] = useState(null)

    const fetchConsultation = async () => {
        globalSwal.showLoading()

        const res = await fetch(`/api/consultations/${viewConsultationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        if (res.ok) {
            setConsultation(data)
            setConsultations((prevData) => ({...prevData, [data.id]: data}))
        } else {
            console.log(data)
        }

        globalSwal.close()
    }

    useEffect(() => {
        if (consultations[viewConsultationId] === null || consultations[viewConsultationId] === undefined) {
            fetchConsultation()
        } else {
            setConsultation(consultations[viewConsultationId])
        }
    }, [])

    return (
        <>
            { consultation && (
                <div className='p-4 bg-white'>
                    <p className='font-semibold mb-4'>Consultation Date: <span className='font-normal ms-2'>{getFormattedStringDate(consultation.created_at)}</span></p>
                    <table className='text-start mb-4 border-collapse border border-black bg-white w-full break-words'>
                        <tbody>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[15%]'>Height</th>
                                <td className='border p-2 border-[#828282] w-[20%]'>{ consultation.height + " " + consultation.height_unit}</td>
                                <th className='text-start border border-[#828282] p-2 w-[15%]'>Weight</th>
                                <td className='border p-2 border-[#828282] w-[35%]'>{ consultation.weight + " " + consultation.weight_unit}</td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[15%]'>Temperature</th>
                                <td className='border p-2 border-[#828282] w-[20%]'>{ consultation.temperature} &#176;C</td>
                                <th className='text-start border border-[#828282] p-2 w-[25%]'>Blood Pressure</th>
                                <td className='border p-2 border-[#828282] w-[35%]'>{ consultation.blood_pressure}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='text-start border-collapse border border-black bg-white w-full break-words'>
                        <tbody>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[25%]'>Chief Complaint</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.chief_complaint}</td>
                            </tr>
                            { consultation.present_illness_hx && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>History of Present Illness</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.present_illness_hx}</td>
                                </tr>
                            )}  
                            { consultation.family_hx && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Family History</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.family_hx}</td>
                                </tr>
                            )}  
                            { consultation.medical_hx && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Medical History</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.medical_hx}</td>
                                </tr>
                            )}
                            { (consultation.pediatrics_h || consultation.pediatrics_e || consultation.pediatrics_a || consultation.pediatrics_d) && (
                                <>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[25%]'>{"(H)"} Home</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.pediatrics_h ?? ''}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[25%]'>{"(E)"} Education</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.pediatrics_e ?? ''}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[25%]'>{"(A)"} Activities</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.pediatrics_a ?? ''}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[25%]'>{"(D)"} Drugs</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.pediatrics_d ?? ''}</td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[25%]'>Primary Diagnosis</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.primary_diagnosis}</td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[25%]'>Diagnosis</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.diagnosis}</td>
                            </tr>
                            { consultation.prescriptions && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Prescriptions</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>
                                        { consultation.prescriptions.map((item, index) => (
                                            <div key={index} className='mb-2'>
                                                <p className='underline'>{`${item.name} ${item.dosage}`}</p>
                                                <p>{`${item.instruction}`}</p>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default ViewConsultation;
