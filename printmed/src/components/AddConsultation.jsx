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
        isPediatrics, setIsPediatrics,
        isNext, setIsNext
    } = useContext(PhysicianContext)

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

    const handlePediatricsChange = () => {
        setIsPediatrics(!isPediatrics)

        if (isPediatrics === false) {
            setAddConsultationData((prevData) => ({
                ...prevData,
                pediatrics_h: "",
                pediatrics_e: "",
                pediatrics_a: "",
                pediatrics_d: "",
            }))
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

    const handleDecimalInputChange = (key, value) => {
        // setErrors(prevData => ({ ...prevData, [key]: ""}))
        
        const numbersOnlyRegex = /^(?!\.)[0-9]*\.?[0-9]*$/
        if (numbersOnlyRegex.test(value)) {
            setAddConsultationData(prevData => ({ ...prevData, [key]: value}))
        }
    }

    return (
        <form onSubmit={ handleSubmit } className='py-4 px-8'>
            { !isNext ? (
                <>
                    {/* <div className='grid grid-cols-5 gap-x-6'>
                        <div className='col-span-2 mb-4 flex gap-4 items-center'>
                            <p className="block font-semibold text-black mb-2">Height<span className='text-red-600 ms-2'>*</span></p>
                            <div className='col-span-2 flex gap-2 w-full h-full'>
                                <input
                                    type='text'
                                    className="px-2 border border-gray-800 block w-[70px] py-1 rounded"
                                    value={ addConsultationData.height }
                                    onChange={(e) => {handleDecimalInputChange("height", e.target.value)}}
                                    maxLength={5}
                                    required
                                />
                                <select
                                    className="border border-gray-800 block px-2 h-full py-1 rounded bg-white"
                                    value={ addConsultationData.height_unit }
                                    onChange={(e) => {setAddConsultationData(prevData => ({...prevData, height_unit: e.target.value}))}}
                                    required
                                >
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-span-3 mb-4 flex gap-4 items-center'>
                            <p className="block font-semibold text-black mb-2">Weight<span className='text-red-600 ms-2'>*</span></p>
                            <div className='col-span-2 flex gap-2 w-full h-full'>
                                <input
                                    type='text'
                                    className="px-2 border border-gray-800 block w-[70px] py-1 rounded"
                                    value={ addConsultationData.weight }
                                    onChange={(e) => {handleDecimalInputChange("weight", e.target.value)}}
                                    maxLength={3}
                                    required
                                />
                                <select
                                    className="border border-gray-800 block px-2 h-full py-1 rounded bg-white"
                                    value={ addConsultationData.weight_unit }
                                    onChange={(e) => {setAddConsultationData(prevData => ({...prevData, weight_unit: e.target.value}))}}
                                    required
                                >
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-span-2 mb-4 flex gap-4 items-center'>
                            <p className="block font-semibold text-black mb-2">Temperature<span className='text-red-600 ms-2'>*</span></p>
                            <div className='flex gap-1'>
                                <input
                                    type='text'
                                    className="px-2 border border-gray-800 block w-[50px] py-1 rounded"
                                    value={ addConsultationData.temperature }
                                    onChange={(e) => {setAddConsultationData(prevData => ({...prevData, temperature: e.target.value}))}}
                                    maxLength={3}
                                    required
                                />
                                <p>&#176;C</p>
                            </div>
                        </div>
                        <div className='col-span-3 mb-4 flex gap-2 items-center'>
                            <p className="block font-semibold text-black mb-2">Blood Pressure<span className='text-red-600 ms-2 me-2'>*</span></p>
                            <input
                                type='text'
                                className="px-2 border border-gray-800 w-[50px] py-1 rounded"
                                value={ addConsultationData.primary_diagnosis }
                                onChange={(e) => {setAddConsultationData(prevData => ({...prevData, primary_diagnosis: e.target.value}))}}
                                required
                            />
                            <p>/</p>
                            <input
                                type='text'
                                className="px-2 border border-gray-800 w-[50px] py-1 rounded"
                                value={ addConsultationData.primary_diagnosis }
                                onChange={(e) => {setAddConsultationData(prevData => ({...prevData, primary_diagnosis: e.target.value}))}}
                                required
                            />
                        </div>
                    </div> */}
                    <table className='text-start mb-8 border-collapse border border-black bg-white w-full break-words'>
                        <tbody>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[15%]'>Height</th>
                                <td className='border p-2 border-[#828282] w-[20%]'>{ addConsultationData.height + " " + addConsultationData.height_unit}</td>
                                <th className='text-start border border-[#828282] p-2 w-[15%]'>Weight</th>
                                <td className='border p-2 border-[#828282] w-[35%]'>{ addConsultationData.weight + " " + addConsultationData.weight_unit}</td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[15%]'>Temperature</th>
                                <td className='border p-2 border-[#828282] w-[20%]'>{ addConsultationData.temperature}</td>
                                <th className='text-start border border-[#828282] p-2 w-[25%]'>Blood Pressure</th>
                                <td className='border p-2 border-[#828282] w-[35%]'>{ addConsultationData.blood_pressure}</td>
                            </tr>
                        </tbody>
                    </table>
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
                            <label className='font-bold ms-2'>Pediatrics</label>
                        </div>
                        { isPediatrics && (
                            <>
                                <div className='mt-4'>
                                    <div className='mb-4'>
                                        <p className="block font-semibold text-black col-span-2 mb-2">{"(H) Home"}</p>
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
                            <button onClick={() => setIsNext(true)} className="mt-1 block px-10 h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full">
                        <div className="flex justify-end items-center">
                            <button onClick={() => setIsNext(false)} className="block px-6 h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
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
                        <div className='px-2'>
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
                    <div className="mt-12 w-full">
                        <div className="flex justify-center items-center">
                            <button onClick={() => handleSubmit()} className="block px-14 h-10 bg-blue-700 text-white font-semibold rounded-md hover:bg-[#b43c3a] transition duration-200">
                                Submit
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    )
}

export default AddConsultation;
