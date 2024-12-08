import React, { useContext, useEffect, useState } from 'react'
import { getFormattedStringDate } from '../utils/dateUtils'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'
import { showError } from '../utils/fetch/showError'
import { printPdf } from '../utils/printPdf'

const ViewConsultation = () => {
    const { token } = useContext(AppContext)
    const { 
        setPatientPageLoading,
        setConsultationComponentStatus,
        consultations, setConsultations,
        viewConsultationId
    } = useContext(PhysicianContext)

    const [consultation, setConsultation] = useState(null)

    useEffect(() => {
        if (consultations[viewConsultationId] === null || consultations[viewConsultationId] === undefined) {
            fetchConsultation()
        } else {
            setConsultation(consultations[viewConsultationId])
            console.log(consultations[viewConsultationId])
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
                } else {
                    throw new Error("Something went wrong with your request. Please try again later.")
                }
            }

            const data = await res.json()
            setConsultation(data)
            console.log(data)
            setConsultations((prevData) => ({...prevData, [data.id]: data}))
        }
        catch (err) {
            showError(err)
            setConsultationComponentStatus(null)
        }
        finally {
            setPatientPageLoading(false)
        }
    }

    const printPrescription = async () => {
        try {
            setPatientPageLoading(true)

            const res = await fetch(`/api/consultations/${viewConsultationId}/print-prescription`, {
                'Content-Type': 'application/pdf',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
    
            if(!res.ok) {
                throw new Error("An error occured while getting the printable prescription. Please try again later.")
            }

            const data = await res.blob()
            const url = URL.createObjectURL(data)
            printPdf(url)   
        }
        catch (err) {
            showError(err)
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
                                <td className='border p-2 border-[#828282] w-[35%]'>{ consultation.systolic + "/" + consultation.diastolic }</td>
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
                            { (consultation.birth_maternal_hx) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Birth and Maternal History</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.birth_maternal_hx}</td>
                                </tr>
                            )}
                            { (consultation.immunization) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Immunization</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.immunization}</td>
                                </tr>
                            )}
                            { (consultation.heads) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>HEADS</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.heads}</td>
                                </tr>
                            )}
                            { (consultation.pertinent_physical_examination) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Pertinent Physical Examination</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.pertinent_physical_examination}</td>
                                </tr>
                            )}
                            { (consultation.laboratory_diagnostics_tests) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Laboratory or Diagnostics Tests</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{ consultation.laboratory_diagnostics_tests}</td>
                                </tr>
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
                                    <th className='align-top p-2 w-[25%]'>
                                        <div className='flex items-center'>
                                            Prescriptions
                                            {consultation.prescriptions.length != 0 && 
                                                <button onClick={() => {printPrescription()}} className='ms-2 px-2 py-1 hover:bg-[#f4f4f4] rounded-full'>
                                                    <i className='text-[#b43c3a] text-xl bi bi-printer-fill'></i>
                                                </button>
                                            }
                                        </div>
                                    </th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>
                                        {consultation.prescriptions.length != 0 ? (
                                            <>
                                                { consultation.prescriptions.map((item, index) => (
                                                    <div key={index} className='mb-2'>
                                                        <p className='underline'>{`${item.name} ${item.dosage}`}</p>
                                                        <p>{`${item.instruction}`}</p>
                                                    </div>
                                                ))}
                                            </>
                                        ) : "N/A"}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[25%]'>Physician</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>Doc. { consultation.physician.full_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default ViewConsultation;
