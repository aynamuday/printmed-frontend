import React, { useContext, useEffect, useState } from 'react'
import { getFormattedNumericDate } from '../utils/dateUtils'

import AppContext from '../context/AppContext'
import PhysicianContext from '../context/PhysicianContext'
import Swal from 'sweetalert2'

const ConsultationForm = () => {
    const { token } = useContext(AppContext)
    const { 
        setPatientPageLoading,
        patient, setPatient,
        addConsultationData, setAddConsultationData,
        isPediatrics, setIsPediatrics,
        isNext, setIsNext,
        addConsultationErrors, setAddConsultationErrors,
        setConsultations,
        setConsultationComponentStatus, 
        resetAddConsultation
    } = useContext(PhysicianContext)

    useEffect(() => {
        setAddConsultationData((prevData) => ({...prevData, patient_id: patient.id}))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        let hasError = false

        if (addConsultationData.chief_complaint.trim() === "") {
            hasError = true
            setAddConsultationErrors((prevData) => ({...prevData, chief_complaint: "Chief complaint is required."}))
        }
        if (addConsultationData.diagnosis.trim() === "") {
            hasError = true
            setAddConsultationErrors((prevData) => ({...prevData, diagnosis: "Diagnosis is required."}))
        }
        if (addConsultationData.primary_diagnosis.trim() === "") {
            hasError = true
            setAddConsultationErrors((prevData) => ({...prevData, primary_diagnosis: "Primary diagnosis is required."}))
        }
        if (addConsultationData.prescriptions.length > 0) {
            addConsultationData.prescriptions.map((item, index) => {
                if (item.name.trim() === "" || item.dosage.trim() === "" || item.instruction.trim() === "") {
                    setAddConsultationErrors((prevData) => ({...prevData, prescriptions: "All fields (name, dosage, instruction) are required for a prescription."}))
                    hasError = true
                    return
                }
            })
        }

        if (hasError) {
            setAddConsultationErrors((prevData) => ({...prevData, general: "Please kindly check your inputs. Make sure required fields are not empty."}))
            return
        } else {
            createConsultation()
        }
    }

    const createConsultation = async () => {
        try {
            setPatientPageLoading(true)

            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(addConsultationData, )
            })

            if(!res.ok) {
                if (res.status === 500) {
                    throw new Error("Something went wrong. Please try again later.")
                } else if (res.status === 404) {
                    throw new Error("The QR code is either deactivated or expired.")
                } else if (res.status === 403) {
                    throw new Error("You are not authorized to access this patient. Make sure you are an assigned physician.")
                } else if (res.status === 400) {
                    throw new Error("Something went wrong with your request. Please check your input and try again later.")
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }

            const data = await res.json()
            setConsultations((prevData) => ({...prevData, [data.id]: data}))
            setPatient(prevPatient => ({
                ...prevPatient,
                consultations: [
                    {id: data.id, chief_complaint: data.chief_complaint, primary_diagnosis: data.primary_diagnosis, created_at: data.created_at},
                    ...prevPatient.consultations, 
                ]
            }));

            setConsultationComponentStatus(null)
            resetAddConsultation()
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

    const handleInputChange = (key, value) => {
        setAddConsultationErrors((prevData) => ({...prevData, [key]: ""}))
        setAddConsultationErrors((prevData) => ({...prevData, general: ""}))
        setAddConsultationData(prevData => ({ ...prevData, [key]: value}))
    }

    const addPrescription = (e) => {
        e.preventDefault()

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

        setAddConsultationErrors((prevData) => ({...prevData, prescriptions: ""}))

        setAddConsultationData((prevData) => ({
            ...prevData,
            prescriptions: updatedPrescriptions
        }));
    };

    const removePrescription = (index) => {
        setAddConsultationErrors((prevData) => ({...prevData, prescriptions: ""}))
        
        setAddConsultationData((prevData) => ({
            ...prevData,
            prescriptions: prevData.prescriptions.filter((_, i) => i !== index)
        }));
    };

    return (
        <form className='py-4 px-8'>
            { !isNext ? (
                <>
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
                                <td className='border p-2 border-[#828282] w-[20%]'>{ addConsultationData.temperature} &#176;C</td>
                                <th className='text-start border border-[#828282] p-2 w-[25%]'>Blood Pressure</th>
                                <td className='border p-2 border-[#828282] w-[35%]'>{ addConsultationData.blood_pressure}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Chief Complaint<span className='text-red-600 ms-2'>*</span></p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.chief_complaint }
                            rows="2"
                            onChange={(e) => {handleInputChange("chief_complaint", e.target.value)}}
                        />
                        { addConsultationErrors.chief_complaint.trim() != "" && (<p className='text-red-600 text-sm mt-1'>{addConsultationErrors.chief_complaint}</p>)}
                    </div>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">History of Present Illness</p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.present_illness_hx }
                            rows="2"
                            onChange={(e) => {handleInputChange("present_illness_hx", e.target.value)}}
                        />
                    </div>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Family History</p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.family_hx }
                            rows="2"
                            onChange={(e) => {handleInputChange("family_hx", e.target.value)}}
                        />
                    </div>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Medical History</p>
                        <textarea
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.medical_hx }
                            rows="2"
                            onChange={(e) => {handleInputChange("medical_hx", e.target.value)}}
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
                                            onChange={(e) => {handleInputChange("pediatrics_h", e.target.value)}}
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
                                            onChange={(e) => {handleInputChange("pediatrics_e", e.target.value)}}
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
                                            onChange={(e) => {handleInputChange("pediatrics_a", e.target.value)}}
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
                                            onChange={(e) => {handleInputChange("pediatrics_d", e.target.value)}}
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
                            onChange={(e) => {handleInputChange("diagnosis", e.target.value)}}
                        />
                        { addConsultationErrors.diagnosis.trim() != "" && (<p className='text-red-600 text-sm mt-1'>{addConsultationErrors.diagnosis}</p>)}
                    </div>
                    <div className='mb-4'>
                        <p className="block font-semibold text-black col-span-2 mb-2">Primary Diagnosis<span className='text-red-600 ms-2'>*</span></p>
                        <input
                            type='text'
                            className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                            value={ addConsultationData.primary_diagnosis }
                            onChange={(e) => {handleInputChange("primary_diagnosis", e.target.value)}}
                        />
                        { addConsultationErrors.primary_diagnosis.trim() != "" && (<p className='text-red-600 text-sm mt-1'>{addConsultationErrors.primary_diagnosis}</p>)}
                    </div>
                    <div className='mt-8 mb-8'>
                        <div className='flex gap-4'>
                            <p className="block font-semibold text-black col-span-2">Prescriptions</p>
                            <button className='text-[#b43c3a] rounded-md -mt-2' onClick={(e) => {addPrescription(e)}}>
                                <i className='bi bi-plus-circle-fill text-lg' />
                            </button>
                        </div>
                        { addConsultationErrors.prescriptions.trim() != "" && (<p className='text-red-600 text-sm'>{addConsultationErrors.prescriptions}</p>)}
                        <div className='px-2 mt-4'>
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
                                                />
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <label className='text-sm font-semibold'>Dosage</label>
                                                <input
                                                    type='text'
                                                    className="col-span-5 border border-gray-800 block w-full py-1 px-2 rounded"
                                                    value={ item.dosage }
                                                    onChange={(e) => {handlePrescriptionChange(index, "dosage", e.target.value)}}
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
                            onChange={(e) => {handleInputChange("follow_up_date", e.target.value)}}
                        />
                    </div>
                    <div className="mt-12 w-full">
                        <div className="flex justify-center items-center flex-col">
                            { addConsultationErrors.general.trim() != "" && (<p className='text-red-600 text-sm mb-4'>{addConsultationErrors.general}</p>)}
                            <button onClick={(e) => handleSubmit(e)} className="block px-14 h-10 bg-[#b43c3a] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                                Submit
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    )
}

export default ConsultationForm;
