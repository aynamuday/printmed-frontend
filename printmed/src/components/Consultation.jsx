import React, { useContext, useEffect, useState } from 'react'
import { getFormattedDate } from '../utils/dateUtils'
import globalSwal from '../utils/globalSwal'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'

const Consultation = () => {
    const { user, token } = useContext(AppContext)
    const { consultationStatus, consultation, setConsultation } = useContext(PhysicianContext)
    const [pediatrics, setPediatrics] = useState(false)

    const [editData, setEditData] = useState({})
    const [addData, setAddData] = useState({})

    const fetchConsultation = async () => {
        globalSwal.showLoading()

        const res = await fetch(`/api/consultations/${consultation.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        if (res.ok) {
            setConsultation(data.consultation)
        } else {
            console.log(data)
        }

        globalSwal.close()
    }

    useEffect(() => {
        setAddData({
            'height': '',
            'weight': '',
            'systolic_pressure': '',
            'diastolic_pressure': '',
            'temperature': '',
            'chief_complaint': '',
            'present_illness_hx': '',
            'family_hx': '',
            'medical_hx': '',
            'pediatrics_h': '',
            'pediatrics_e': '',
            'pediatrics_a': '',
            'pediatrics_d': '',
            'primary_diagnosis': '',
            'diagnosis': '',
            'prescription': '',
        })

        if ((consultationStatus === "view") && consultation) {
            fetchConsultation()
        }

        if (consultation) {
            setEditData({
                'height': consultation.height ?? '',
                'weight': consultation.weight ?? '',
                'systolic_pressure': consultation.systolic_pressure ?? '',
                'diastolic_pressure': consultation.diastolic_pressure ?? '',
                'temperature': consultation.temperature ?? '',
                'chief_complaint': consultation.chief_complaint ?? '',
                'present_illness_hx': consultation.present_illness_hx ?? '',
                'family_hx': consultation.family_hx ?? '',
                'medical_hx': consultation.medical_hx ?? '',
                'pediatrics_h': consultation.pediatrics_h ?? '',
                'pediatrics_e': consultation.pediatrics_e ?? '',
                'pediatrics_a': consultation.pediatrics_a ?? '',
                'pediatrics_d': consultation.pediatrics_d ?? '',
                'primary_diagnosis': consultation.primary_diagnosis ?? '',
                'diagnosis': consultation.diagnosis ?? '',
                'prescription': consultation.prescription ?? '',
            })
        }

        if (consultation) {
            if (consultation.pediatrics_h || consultation.pediatrics_e || consultation.pediatrics_a || consultation.pediatrics_d) {
                setPediatrics(true)
            }
        }
    }, [consultationStatus])

    const addConsultation = async () => {
        const res = await fetch("/api/consultations", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(addData)
        })

        const data = await res.json()

        if (res.ok) {
            globalSwal.fire('Success', 'Consultation added successfully!', 'success')
        } else {
            globalSwal.fire('Error', 'There was an error adding the consultation.', 'error')
        }
    }

    return (
        <form onSubmit={addConsultation}>
            {consultationStatus === "view" && consultation && (
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">Date</p>
                    <p className="block text-black col-span-2">{getFormattedDate(consultation.created_at)}</p>
                </div>
            )}
            {/* Height */}
            {(user.role === 'physician' || user.role === 'secretary') && (
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">Height</p>
                    {((consultation && consultationStatus === "edit") || consultationStatus === "add") ? (
                        <input
                            placeholder="cm"
                            type="number"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded text-right"
                            value={consultationStatus === "edit" ? editData.height : addData.height}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && (value === '' || parseFloat(value) <= 250)) {
                                    consultationStatus === "edit"
                                        ? setEditData({ ...editData, height: value })
                                        : setAddData({ ...addData, height: value });
                                }
                            }}
                        />
                    ) : (consultationStatus === "view" && <p className="block text-black col-span-2">{consultation.height}</p>)}
                </div>
            )}
            {/* Weight */}
            {(user.role === 'physician' || user.role === 'secretary') && (
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">Weight</p>
                    {((consultation && consultationStatus === "edit") || consultationStatus === "add") ? (
                        <input
                            placeholder="kg"
                            type="number"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded text-right"
                            value={consultationStatus === "edit" ? editData.weight : addData.weight}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && (value === '' || parseFloat(value) <= 150)) {
                                    consultationStatus === "edit"
                                        ? setEditData({ ...editData, weight: value })
                                        : setAddData({ ...addData, weight: value });
                                }
                            }}
                        />
                    ) : (consultationStatus === "view" && <p className="block text-black col-span-2">{consultation.weight}</p>)}
                </div>
            )}
            {/* Temperature */}
            {(user.role === 'physician' || user.role === 'secretary') && (
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">Temperature</p>
                    {((consultation && consultationStatus === "edit") || consultationStatus === "add") ? (
                        <input
                            placeholder="celsius"
                            type="number"
                            step="0.1"  // Allow decimal
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded text-right"
                            value={consultationStatus === "edit" ? editData.temperature : addData.temperature}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*(\.\d{0,1})?$/.test(value) && (value === '' || parseFloat(value) <= 45)) {
                                    consultationStatus === "edit"
                                        ? setEditData({ ...editData, temperature: value })
                                        : setAddData({ ...addData, temperature: value });
                                }
                            }}
                        />
                    ) : (consultationStatus === "view" && <p className="block text-black col-span-2">{consultation.temperature}</p>)}
                </div>
            )}
            {/* Blood Pressure */}
            {(user.role === 'physician' || user.role === 'secretary') && (
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">Blood Pressure</p>
                    {((consultation && consultationStatus === "edit") || consultationStatus === "add") ? (
                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Systolic"
                                className="border border-gray-800 w-full py-1 px-2 rounded text-right"
                                value={consultationStatus === "edit" ? editData.systolic_pressure : addData.systolic_pressure}
                                min="30"
                                max="250"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || (value >= 30 && value <= 250)) {
                                        consultationStatus === "edit"
                                            ? setEditData({ ...editData, systolic_pressure: value })
                                            : setAddData({ ...addData, systolic_pressure: value });
                                    }
                                }}
                                required
                            />
                            <span>/</span>
                            <input
                                type="number"
                                placeholder="Diastolic"
                                className="border border-gray-800 w-full py-1 px-2 rounded text-right"
                                value={consultationStatus === "edit" ? editData.diastolic_pressure : addData.diastolic_pressure}
                                min="10"
                                max="150"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || (value >= 10 && value <= 150)) {
                                        consultationStatus === "edit"
                                            ? setEditData({ ...editData, diastolic_pressure: value })
                                            : setAddData({ ...addData, diastolic_pressure: value });
                                    }
                                }}
                                required
                            />
                        </div>
                    ) : (consultationStatus === "view" && <p className="block text-black col-span-2">{consultation.blood_pressure}</p>)}
                </div>
            )}
            {/* Fields for Chief Complaint, Present Illness, etc. (Accessible only for Physicians) */}
            {user.role === 'physician' && (
                <>
                    {/* Chief Complaint */}
                    <div className='grid grid-cols-7 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-2">Chief Complaint</p>
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus === "edit" ? editData.chief_complaint : addData.chief_complaint}
                            onChange={(e) => {
                                consultationStatus === "edit"
                                    ? setEditData({ ...editData, chief_complaint: e.target.value })
                                    : setAddData({ ...addData, chief_complaint: e.target.value });
                            }}
                        />
                    </div>

                    {/* History of Present Illness */}
                    <div className='grid grid-cols-7 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-2">Present Illness</p>
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus === "edit" ? editData.present_illness_hx : addData.present_illness_hx}
                            onChange={(e) => {
                                consultationStatus === "edit"
                                    ? setEditData({ ...editData, present_illness_hx: e.target.value })
                                    : setAddData({ ...addData, present_illness_hx: e.target.value });
                            }}
                        />
                    </div>

                    {/* Family History */}
                    <div className='grid grid-cols-7 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-2">Family History</p>
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus === "edit" ? editData.family_hx : addData.family_hx}
                            onChange={(e) => {
                                consultationStatus === "edit"
                                    ? setEditData({ ...editData, family_hx: e.target.value })
                                    : setAddData({ ...addData, family_hx: e.target.value });
                            }}
                        />
                    </div>

                    {/* Medical History */}
                    <div className='grid grid-cols-7 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-2">Medical History</p>
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus === "edit" ? editData.medical_hx : addData.medical_hx}
                            onChange={(e) => {
                                consultationStatus === "edit"
                                    ? setEditData({ ...editData, medical_hx: e.target.value })
                                    : setAddData({ ...addData, medical_hx: e.target.value });
                            }}
                        />
                    </div>

                    {/* Primary Diagnosis */}
                    <div className='grid grid-cols-7 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-2">Primary Diagnosis</p>
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus === "edit" ? editData.primary_diagnosis : addData.primary_diagnosis}
                            onChange={(e) => {
                                consultationStatus === "edit"
                                    ? setEditData({ ...editData, primary_diagnosis: e.target.value })
                                    : setAddData({ ...addData, primary_diagnosis: e.target.value });
                            }}
                        />
                    </div>

                    {/* Diagnosis */}
                    <div className='grid grid-cols-7 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-2">Diagnosis</p>
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus === "edit" ? editData.diagnosis : addData.diagnosis}
                            onChange={(e) => {
                                consultationStatus === "edit"
                                    ? setEditData({ ...editData, diagnosis: e.target.value })
                                    : setAddData({ ...addData, diagnosis: e.target.value });
                            }}
                        />
                    </div>

                    {/* Prescription */}
                    <div className='grid grid-cols-7 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-2">Prescription</p>
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus === "edit" ? editData.prescription : addData.prescription}
                            onChange={(e) => {
                                consultationStatus === "edit"
                                    ? setEditData({ ...editData, prescription: e.target.value })
                                    : setAddData({ ...addData, prescription: e.target.value });
                            }}
                        />
                    </div>
                </>
            )}
            { (consultationStatus == "edit" || consultationStatus == "add") && (
            <div className="mt-8 w-full">
                {/* {!errors.errors && errors.message && <p className="text-red-600 mb-1 text-center">{errors.message}</p>} */}

                <div className="flex justify-center items-center">
                    {/* <button onClick={() => {}} className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                        Save
                    </button> */}
                    <button type="submit" className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                        Submit Consultation
                    </button>

                </div>
            </div>
            )}
        </form>
    )
}

export default Consultation;
