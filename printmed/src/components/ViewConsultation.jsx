import React, { useContext, useEffect, useState } from 'react'
import { getFormattedStringDate } from '../utils/dateUtils'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'
import { showError } from '../utils/fetch/showError'
import { printPdf } from '../utils/printPdf'

const ViewConsultation = () => {
    const { token, user } = useContext(AppContext)
    const { 
        patient,
        setPatientPageLoading,
        setConsultationComponentStatus,
        consultations, setConsultations,
        viewConsultationId
    } = useContext(PhysicianContext)

    const [consultation, setConsultation] = useState(null)
    const [printPrescription, setPrintPrescription] = useState(false)
    const [printPrescriptionData, setPrintPrescriptionData] = useState({
        s2: "",
        ptr: "",
        sendToPatientEmail: true
    })

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
                } else {
                    throw new Error("Something went wrong with your request. Please try again later.")
                }
            }

            const data = await res.json()
            setConsultation(data)
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

    const getPrescriptionPdf = async () => {
        try {
            setPatientPageLoading(true)

            var url = `/api/consultations/${viewConsultationId}/print-prescription?sendToPatientEmail=`
            url += patient.email != null && patient.email != "" ? `${printPrescriptionData.sendToPatientEmail}` : 'false'
            if (printPrescriptionData.ptr.trim() != "") {
                url += `&ptr=${printPrescriptionData.ptr}`
            }
            if (printPrescriptionData.s2.trim() != "") {
                url += `&s2=${printPrescriptionData.s2}`
            }

            const res = await fetch(url, {
                'Content-Type': 'application/pdf',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
    
            if(!res.ok) {
                console.log(await res.text())
                throw new Error("An error occured while getting the printable prescription. Please try again later.")
            }

            const data = await res.blob()
            const pdfUrl = URL.createObjectURL(data)
            printPdf(pdfUrl)   
            setPrintPrescriptionData({...printPrescriptionData, ptr: '', s2: '', sendToPatientEmail: true})
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
                    {printPrescription && (
                        <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-40 z-40'>
                            <div className='bg-white px-8 py-6 rounded-md'>
                                <form onSubmit={(e) => {e.preventDefault(); setPrintPrescription(false); getPrescriptionPdf()}} className='flex items-center flex-col'>
                                    <div className='grid grid-cols-5 items-center'>
                                        <label className='col-span-1 font-bold'>PTR #</label>
                                        <input 
                                            type="text" 
                                            className='col-span-4 border border-black focus:outline-none px-2 py-1 rounded-md' 
                                            value={printPrescriptionData.ptr || ''}
                                            onChange={(e) => {setPrintPrescriptionData({...printPrescriptionData, ptr: e.target.value})}}
                                        />
                                    </div>
                                    <div className='grid grid-cols-5 items-center mt-3'>
                                        <label className='col-span-1 font-bold'>S2 #</label>
                                        <input 
                                            type="text" 
                                            className='col-span-4 border border-black focus:outline-none px-2 py-1 rounded-md'
                                            value={printPrescriptionData.s2 || ''}
                                            onChange={(e) => {setPrintPrescriptionData({...printPrescriptionData, s2: e.target.value})}}
                                        />
                                    </div>
                                    { patient.email != null && patient.email != "" && user.signature != null && user.signature != "" &&
                                        <div className='flex gap-2 items-center mt-5'>
                                            <input 
                                                id='send-to-patient-email'
                                                type="checkbox" 
                                                checked={printPrescriptionData.sendToPatientEmail}
                                                onChange={() => {setPrintPrescriptionData({...printPrescriptionData, sendToPatientEmail: !printPrescriptionData.sendToPatientEmail})}}
                                            />
                                            <label htmlFor='send-to-patient-email'>Send prescription to patient's email</label>
                                        </div>
                                    }
                                    <div className='flex items-center justify-center gap-4 mt-6'>
                                        <button type='submit' className='bg-[#248176] text-white rounded-lg px-6 py-2 hover:bg-blue-700'>
                                            Continue
                                        </button>
                                        <button type='button' onClick={() => {setPrintPrescription(false); setPrintPrescriptionData({...printPrescriptionData, ptr: '', s2: '', sendToPatientEmail: true})}} className='bg-[#b33c39] text-white rounded-lg px-6 py-2 hover:bg-blue-700'>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
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
                                                <button onClick={() => {setPrintPrescription(true)}} className='ms-2 px-2 py-1 hover:bg-[#f4f4f4] rounded-full'>
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
                                <td className='border p-2 border-[#828282] w-[65%]'>{consultation.physician.id == user.id ? <span className='italic'>You</span> : "Doc. " + consultation.physician.full_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default ViewConsultation;
