import React, { useContext, useEffect, useState } from 'react'
import PhysicianContext from '../context/PhysicianContext'
import { getFormattedDate } from '../utils/dateUtils'
import AppContext from '../context/AppContext'
import globalSwal from '../utils/globalSwal'

const Consultation = () => {
    const { token } = useContext(AppContext)
    const { consultationStatus, consultation, setConsultation, consultationPayment, setConsultationPayment } = useContext(PhysicianContext)
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
            console.log(data)
            setConsultation(data.consultation)
            setConsultationPayment(data.payment)
        } else {
            console.log(data)
        }

        globalSwal.close()
    }

    useEffect(() => {
        setAddData({
            'height': '',
            'weight': '',
            'blood_pressure': '',
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
            'payment_amount': '',
            'payment_method': '',
            'payment_hmo': '',
        })

        if ((consultationStatus == "view") && consultation) {
            fetchConsultation()
        }

        if (consultation) {
            setEditData({
                'height': consultation.height ?? '',
                'weight': consultation.weight ?? '',
                'blood_pressure': consultation.blood_pressure ?? '',
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
                'payment_amount': consultation.payment_amount ?? '',
                'payment_method': consultation.payment_method ?? '',
                'payment_hmo': consultation.payment_hmo ?? '',
            })
        }

        if (consultation) {
            if (consultation.pediatrics_h || consultation.pediatrics_e || consultation.pediatrics_a || consultation.pediatrics_d) {
                setPediatrics(true)
            }
        }
    }, [consultationStatus])

  return (
    <div>
        {consultationStatus == "view" && consultation && <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Date</p>
            <p className="block text-black col-span-2">{getFormattedDate(consultation.created_at)}</p>
        </div>}
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Height</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.height : addData.height}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, height: e.target.value}) : setAddData({...addData, height: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.height}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Weight</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.weight : addData.weight}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, weight: e.target.value}) : setAddData({...addData, weight: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.weight}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Temperature</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.temperature : addData.temperature}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, temperature: e.target.value}) : setAddData({...addData, temperature: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.temperature}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Blood Pressure</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.blood_pressure : addData.blood_pressure}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, blood_pressure: e.target.value}) : setAddData({...addData, blood_pressure: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.blood_pressure}</p> ) }
        </div>

        <div className='h-6'></div>

        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Chief Complaint</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.chief_complaint : addData.chief_complaint}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, chief_complaint: e.target.value}) : setAddData({...addData, chief_complaint: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.chief_complaint}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">History of Present Illness</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.present_illness_hx : addData.present_illness_hx}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, present_illness_hx: e.target.value}) : setAddData({...addData, present_illness_hx: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.present_illness_hx}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Family History</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.family_hx : addData.family_hx}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, family_hx: e.target.value}) : setAddData({...addData, family_hx: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.family_hx}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Medical History</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.medical_hx : addData.medical_hx}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, medical_hx: e.target.value}) : setAddData({...addData, medical_hx: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.medical_hx}</p> ) }
        </div>
        { consultationStatus == "add" || (consultationStatus == "edit" && consultation) && (
            <div className='grid grid-cols-1 py-1'>
                <div className='h-6'></div>
                    <div className='cols-span-3 flex items-center gap-4'>
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-black"
                            value={pediatrics}
                            onChange={(e) => {setPediatrics(!pediatrics)}}
                        />
                        <p className="font-semibold text-black">Is Pediatrics?</p>
                    </div>
            </div>
        )}
        { pediatrics && (
            <>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(H) Home"}</p>
                    { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus == "edit" ? editData.pediatrics_h : addData.pediatrics_h}
                            onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, pediatrics_h: e.target.value}) : setAddData({...addData, pediatrics_h: e.target.value}) }}
                        />
                    ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.pediatrics_h}</p> ) }
                </div>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(E) Education / Employment"}</p>
                    { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus == "edit" ? editData.pediatrics_e : addData.pediatrics_e}
                            onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, pediatrics_e: e.target.value}) : setAddData({...addData, pediatrics_e: e.target.value}) }}
                        />
                    ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.pediatrics_e}</p> ) }
                </div>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(H) Home"}</p>
                    { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus == "edit" ? editData.pediatrics_h : addData.pediatrics_h}
                            onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, pediatrics_h: e.target.value}) : setAddData({...addData, pediatrics_h: e.target.value}) }}
                        />
                    ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.pediatrics_h}</p> ) }
                </div>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(D) Drugs / Drinking"}</p>
                    { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus == "edit" ? editData.pediatrics_d : addData.pediatrics_d}
                            onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, pediatrics_d: e.target.value}) : setAddData({...addData, pediatrics_d: e.target.value}) }}
                        />
                    ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.pediatrics_d}</p> ) }
                </div>
            </>
        )}

        <div className='h-6'></div>

        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Primary Diagnosis</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <input
                    type="text"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.primary_diagnosis : addData.primary_diagnosis}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, primary_diagnosis: e.target.value}) : setAddData({...addData, primary_diagnosis: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.primary_diagnosis}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Diagnosis</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.diagnosis : addData.diagnosis}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, diagnosis: e.target.value}) : setAddData({...addData, diagnosis: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.diagnosis}</p> ) }
        </div>

        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Prescription</p>
            { consultation && (consultationStatus == "edit" || consultationStatus == "add") ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={consultationStatus == "edit" ? editData.prescription : addData.prescription}
                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, prescription: e.target.value}) : setAddData({...addData, prescription: e.target.value}) }}
                />
            ) : ( consultationStatus == "view" && <p className="block text-black col-span-2">{consultation.prescription}</p> ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            { consultationStatus == "view" && 
                <>
                    <p className="block font-semibold text-black col-span-2">Follow-Up Date</p>
                    <p className="block text-black col-span-2">{consultation.primary_diagnosis}</p>
                </>
            }
        </div>

        { (consultationPayment && (consultationStatus == "view" || (consultationStatus == "edit" && consultationPayment.is_paid == false))) || consultationStatus == "add" &&
            <>
                <div className='h-6'></div>
                
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">Amount</p>
                    { consultationStatus == "add" || consultationStatus == "edit" ? (
                        <input
                            type="text"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={consultationStatus == "edit" ? editData.amount : addData.amount}
                            onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, payment_amount: e.target.value}) : setAddData({...addData, payment_amount: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{consultationPayment.amount}</p>
                    ) }
                </div>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">Method</p>
                    { consultationStatus == "add" || consultationStatus == "edit" ? (
                        <select
                            name="payment_method"
                            value={consultationStatus == "edit" ? editData.payment_method : addData.payment_method}
                            onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, payment_method: e.target.value}) : setAddData({...addData, payment_method: e.target.value})}}
                            className="col-span-3 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                            required
                        >
                            <option value="">Select Payment Method</option>
                            <option value="cash">Cash</option>
                            <option value="hmo">HMO</option>
                        </select>
                    ) : (
                        <p className="block text-black col-span-2">{consultationPayment.method}</p>
                    ) }
                </div>
                { ((consultationStatus == "add" && addData.payment_method == "hmo") || (consultationStatus == "edit" && editData.payment_method == "hmo") || (consultationStatus == "view" && consultationPayment.payment_method == "hmo")) && 
                    <>
                        <div className='grid grid-cols-7 gap-4 py-1'>
                            <p className="block font-semibold text-black col-span-2">HMO</p>
                            { consultationStatus == "add" || consultationStatus == "edit" ? (
                                <select
                                    name="payment_method"
                                    value={consultationStatus == "edit" ? editData.payment_hmo : addData.payment_hmo}
                                    onChange={(e) => {consultationStatus == "edit" ? setEditData({...editData, payment_hmo: e.target.value}) : setAddData({...addData, payment_hmo: e.target.value})}}
                                    className="col-span-3 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                                    required
                                >
                                    <option value="">Select HMO</option>
                                    <option value="cash">Cash</option>
                                    <option value="hmo">HMO</option>
                                </select>
                            ) : (
                                <p className="block text-black col-span-2">{consultationPayment.method}</p>
                            ) }
                        </div>   
                    </>
                }
            </>
        }
        { (consultationStatus == "edit" || consultationStatus == "add") && (
            <div className="mt-8 w-full">
                {/* {!errors.errors && errors.message && <p className="text-red-600 mb-1 text-center">{errors.message}</p>} */}

                <div className="flex justify-center items-center">
                    <button onClick={() => {}} className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                        Save
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default Consultation