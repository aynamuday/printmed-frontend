import React, { useContext, useEffect, useState } from 'react'
import { getFormattedNumericDate } from '../utils/dateUtils'
import globalSwal from '../utils/globalSwal'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'

const AddConsultation = () => {
    const { token } = useContext(AppContext)
    const { 
        setConsultationComponentStatus,
        addConsultationData, setAddConsultationData,
        isPediatrics, setIsPediatrics
    } = useContext(PhysicianContext)

    const [isNext, setIsNext] = useState(false)

    const handleSubmit = () => {
        createConsultation()
    }

    const createConsultation = async () => {
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

    const addPrescription = () => {
        setAddConsultationData((prevData) => ({
            ...prevData,
            prescriptions: [
                ...prevData.prescriptions,
                { name: '', dosage: '', instruction: '' }
            ]
        }));
    };

    const handlePrescriptionChange = (index, field, value) => {
        const updatedPrescriptions = [...addConsultationData.prescriptions];
        updatedPrescriptions[index][field] = value;

        setAddConsultationData((prevData) => ({
            ...prevData,
            prescriptions: updatedPrescriptions
        }));
    };

    const removePrescription = (index) => {
        setAddConsultationData((prevData) => ({
            ...prevData,
            prescriptions: prevData.prescriptions.filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={ handleSubmit } className='py-4 px-8'>
            { !isNext ? (
                <>
                    <div className='pb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Chief Complaint<span className='text-red-600 ms-2'>*</span></p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.chief_complaint }
                            rows="2"
                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, chief_complaint: e.target.value}))}}
                            required
                        />
                    </div>
                    <div className='pb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">History of Present Illness</p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.present_illness_hx }
                            rows="2"
                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, present_illness_hx: e.target.value}))}}
                        />
                    </div>
                    <div>
                        <p className="block font-semibold text-black col-span-2 mb-2">Family History</p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.family_hx }
                            rows="2"
                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, family_hx: e.target.value}))}}
                        />
                    </div>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Medical History</p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.medical_hx }
                            rows="2"
                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, medical_hx: e.target.value}))}}
                        />
                    </div>
                    <div className='mt-8'>
                        <div>
                            <input type="checkbox" value={isPediatrics} onChange={() => setIsPediatrics(!isPediatrics)} checked={isPediatrics} />
                            <label className='font-bold ms-2'>Pediatrics?</label>
                        </div>
                        { isPediatrics && (
                            <>
                                <div className='mt-4'>
                                    <div className='mb-4'>
                                        <p className="block font-semibold text-black col-span-2 mb-2">{"(H) Heads"}</p>
                                        <textarea
                                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={ addConsultationData.pediatrics_h }
                                            rows="2"
                                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, pediatrics_h: e.target.value}))}}
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <div className='mb-4'>
                                        <p className="block font-semibold text-black col-span-2 mb-2">{"(E) Education"}</p>
                                        <textarea
                                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={ addConsultationData.pediatrics_e }
                                            rows="2"
                                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, pediatrics_e: e.target.value}))}}
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <div className='mb-4'>
                                        <p className="block font-semibold text-black col-span-2 mb-2">{"(A) Activities"}</p>
                                        <textarea
                                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={ addConsultationData.pediatrics_a }
                                            rows="2"
                                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, pediatrics_a: e.target.value}))}}
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <div className='mb-4'>
                                        <p className="block font-semibold text-black col-span-2 mb-2">{"(D) Drugs"}</p>
                                        <textarea
                                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={ addConsultationData.pediatrics_d }
                                            rows="2"
                                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, pediatrics_d: e.target.value}))}}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-6 w-full">
                        <div className="flex justify-center items-center">
                            <button onClick={() => setIsNext(true)} className="mt-1 block w-[30%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full">
                        <div className="flex justify-end items-center">
                            <button onClick={() => setIsNext(false)} className="mt-1 block w-[30%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                                Previous
                            </button>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Diagnosis<span className='text-red-600 ms-2'>*</span></p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.diagnosis }
                            rows="2"
                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, diagnosis: e.target.value}))}}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Primary Diagnosis<span className='text-red-600 ms-2'>*</span></p>
                        <input
                            type='text'
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.primary_diagnosis }
                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, primary_diagnosis: e.target.value}))}}
                            required
                        />
                    </div>
                    <div className='mt-8 mb-8'>
                        <div className='flex gap-4'>
                            <p className="block font-semibold text-black col-span-2 mb-2">Prescriptions</p>
                            <button className='text-[#b43c3a] rounded-md -mt-2' onClick={() => {addPrescription()}}>
                                <i className='bi bi-plus-circle-fill text-lg' />
                            </button>
                        </div>
                        <div className='px-4'>
                            { addConsultationData.prescriptions.map((item, index) => (
                                <div key={index} className='mb-4 flex gap-4'>
                                    <div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='flex gap-2 items-center'>
                                                <label className='text-sm font-semibold'>Name</label>
                                                <input
                                                    type='text'
                                                    className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                                    value={ item.name }
                                                    onChange={(e) => {handlePrescriptionChange(index, "name", e.target.value)}}
                                                    required
                                                />
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <label className='text-sm font-semibold'>Dosage</label>
                                                <input
                                                    type='text'
                                                    className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                                    value={ item.dosage }
                                                    onChange={(e) => {handlePrescriptionChange(index, "dosage", e.target.value)}}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='flex gap-2 items-center mt-2'>
                                            <label className='text-sm font-semibold'>Instruction</label>
                                            <input
                                                type='text'
                                                className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={ item.instruction }
                                                onChange={(e) => {handlePrescriptionChange(index, "instruction", e.target.value)}}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => {removePrescription(index)}}>
                                        <i className={`bi bi-x text-2xl text-red-500 font-extrabold`}></i>
                                    </button>
                                </div>
                            )) }
                        </div>
                    </div>
                    <div className='mb-4 flex items-center gap-4'>
                        <p className="font-semibold text-black col-span-2 mb-2">Follow-up Date</p>
                        <input
                            type='date'
                            min={getFormattedNumericDate()}
                            max={getFormattedNumericDate(undefined, 1)}
                            className="col-span-5 border border-gray-800 block py-1 px-2 rounded"
                            value={ addConsultationData.follow_up_date }
                            onChange={(e) => {setAddConsultationData(prevData => ({...prevData, follow_up_date: e.target.value}))}}
                        />
                    </div>
                </>
            )}
        </form>
    )
}

export default AddConsultation;
