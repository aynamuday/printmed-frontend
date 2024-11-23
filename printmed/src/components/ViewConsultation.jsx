import React, { useContext, useEffect, useState } from 'react'
import { getFormattedNumericDate, getFormattedStringDate } from '../utils/dateUtils'
import globalSwal from '../utils/globalSwal'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'
import Swal from 'sweetalert2'

const ViewConsultation = () => {
    const { token } = useContext(AppContext)
    const { 
        setPatientPageLoading,
        consultations, setConsultations,
        viewConsultationId 
    } = useContext(PhysicianContext)

    const [consultation, setConsultation] = useState(null)

    useEffect(() => {
        if (consultations[viewConsultationId] === null || consultations[viewConsultationId] === undefined) {
            fetchConsultation()
        } else {
            setConsultation(consultations[viewConsultationId])
        }
    }, [])

    const fetchConsultation = async () => {
        try {
            setPatientPageLoading(true)

            const res = await fetch(`/api/consultations/${viewConsultationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(!res.ok) {
                if (res.status === 404) {
                    throw new Error("Consultation not found.")
                } else if (res.status === 403) {
                    throw new Error("You are not authorized to perform this action.")
                } else if (res.status === 400) {
                    throw new Error("Something went wrong with your request. Please try again later.")
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }

            const data = await res.json()
            setConsultation(data)
            setConsultations((prevData) => ({...prevData, [data.id]: data}))
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
            setPatientPageLoading(false)
        }
    }

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
