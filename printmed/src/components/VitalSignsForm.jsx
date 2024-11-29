import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import Swal from 'sweetalert2'

const VitalSignsForm = ({ setPatient, setVitalSignsState, patientId, vitalSigns, setLoading }) => {
    const { token } = useContext(AppContext)

    const [vitalSignsData, setVitalSignsData] = useState({
        'height': vitalSigns ? vitalSigns.height : '',
        'height_unit': vitalSigns ? vitalSigns.height_unit : 'cm',
        'weight': vitalSigns ? vitalSigns.weight : '',
        'weight_unit': vitalSigns ? vitalSigns.weight_unit : 'kg',
        'systolic': vitalSigns ? vitalSigns.systolic : '',
        'diastolic': vitalSigns ? vitalSigns.diastolic : '',
        'temperature': vitalSigns ? vitalSigns.temperature : '',
        'temperature_unit': 'C'
    })
    const [vitalSignsErrors, setVitalSignsErrors] = useState({
        'height': '',
        'weight': '',
        'blood_pressure': '',
        'temperature': ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        let hasError = false

        if (vitalSignsData.height_unit === "cm" && (Number(vitalSignsData.height) < 76 || Number(vitalSignsData.height) > 244)) {
            setVitalSignsErrors((prevData) => ({...prevData, height: "Height only ranges between 76 cm to 244 cm."}))
            hasError = true
        }
        if (vitalSignsData.height_unit === "m" && (Number(vitalSignsData.height) < .76 || Number(vitalSignsData.height) > 2.44)) {
            setVitalSignsErrors((prevData) => ({...prevData, height: "Heere"}))
            hasError = true
        }
        if (vitalSignsData.weight_unit === "kg" && (Number(vitalSignsData.weight) < 2.3 || Number(vitalSignsData.weight) > 454)) {
            setVitalSignsErrors((prevData) => ({...prevData, weight: "Weight only ranges between 2.3 kg and 454 kg"}))
            hasError = true
        }
        if (vitalSignsData.weight_unit === "lb" && (Number(vitalSignsData.weight) < 5 || Number(vitalSignsData.weight) > 1000)) {
            setVitalSignsErrors((prevData) => ({...prevData, weight: "Weight only ranges between 5 lb and 1000 lb"}))
            hasError = true
        }
        if (Number(vitalSignsData.temperature) < 34.4 || Number(vitalSignsData.temperature) > 42.2) {
            setVitalSignsErrors((prevData) => ({...prevData, temperature: "Temperature only ranges between 34.4 C and 42.2 C."}))
            hasError = true
        }
        if (Number(vitalSignsData.systolic) < 50 || Number(vitalSignsData.systolic) > 220) {
            setVitalSignsErrors((prevData) => ({...prevData, blood_pressure: "Blood pressure only ranges between 50/30 mm Hg and 220/120 mm Hg."}))
            hasError = true
        }
        if (Number(vitalSignsData.diastolic) < 30 || Number(vitalSignsData.diastolic) > 120) {
            setVitalSignsErrors((prevData) => ({...prevData, blood_pressure: "Blood pressure only ranges between 50/30 mm Hg and 220/120 mm Hg."}))
            hasError = true
        }

        if (hasError) {
            return
        }

        const url = vitalSigns ? `/api/vital-signs/${vitalSigns.id}` : `/api/vital-signs/${patientId}`
        const method = vitalSigns ? "PUT" : "POST"

        try {  
            setLoading(true)

            const res = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(vitalSignsData)
            })

            if(!res.ok) {
                console.log(await res.json())
               if (res.status === 404) {
                   throw new Error(vitalSigns ? "Vital signs record not found" : "Patient not found.")
               } else {
                   throw new Error("Something went wrong. Please try again later.")
               }
            }
     
           const data = await res.json()
           setPatient((prevData) => ({...prevData, vital_signs: data}))
           setVitalSignsState("view")
         }
         catch (err) {
            console.log(err)
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
             setLoading(false)
         }
    }

    const handleVitalSignsInputChange = (key, value) => {
        setVitalSignsErrors(prevData => ({ ...prevData, [key]: ""}))
        key === "systolic" || key === "diastolic" ? setVitalSignsErrors(prevData => ({ ...prevData, blood_pressure: ""})) : ""
        
        const numbersDotOnlyRegex = /^\d*(\.\d*)?$/
        if (numbersDotOnlyRegex.test(value) && key != "systolic" && key != "diastolic") {
            setVitalSignsData(prevData => ({ ...prevData, [key]: value}))
        }

        const numbersOnlyRegex = /^\d*$/
        if (numbersOnlyRegex.test(value) && (key == "systolic" || key == "diastolic")) {
            setVitalSignsData(prevData => ({ ...prevData, [key]: value}))
        }
    }

  return (
    <>
        <form onSubmit={(e) => {handleSubmit(e)}}>
            <div className='grid grid-cols-2 gap-y-2 gap-x-2'>
                <div className='h-full'>
                    <div className='flex gap-4 items-center'>
                        <p className="block font-semibold text-black mb-2">Height<span className='text-red-600 ms-2'>*</span></p>
                        <div className='flex gap-2 w-full h-full'>
                            <input
                                type='text'
                                className="px-2 border h-fit border-gray-800 block w-[70px] py-1 rounded"
                                value={ vitalSignsData.height }
                                onChange={(e) => {handleVitalSignsInputChange("height", e.target.value)}}
                                maxLength={5}
                                required
                            />
                            <select
                                className="border border-gray-800 block px-2 py-1 rounded bg-white"
                                value={ vitalSignsData.height_unit }
                                onChange={(e) => {setVitalSignsData((prevData) => ({...prevData, height_unit: e.target.value}))}}
                                required
                            >
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                            </select>
                        </div>
                    </div>
                    { vitalSignsErrors.height.trim() != "" && (<p className='text-red-600 text-sm mt-1'>{vitalSignsErrors.height}</p>)}
                </div>
                <div className='h-full'>
                    <div className='flex gap-4 items-center'>
                        <p className="block font-semibold text-black mb-2">Weight<span className='text-red-600 ms-2'>*</span></p>
                        <div className='flex gap-2 w-full h-full'>
                            <input
                                type='text'
                                className="px-2 border border-gray-800 block w-[70px] py-1 rounded"
                                value={ vitalSignsData.weight }
                                onChange={(e) => {handleVitalSignsInputChange("weight", e.target.value)}}
                                maxLength={3}
                                required
                            />
                            <select
                                className="border border-gray-800 block px-2 py-1 rounded bg-white"
                                value={ vitalSignsData.weight_unit }
                                onChange={(e) => {setVitalSignsData((prevData) => ({...prevData, weight_unit: e.target.value}))}}
                                required
                            >
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                            </select>
                        </div>
                    </div>
                    { vitalSignsErrors.weight.trim() != "" && (<p className='text-red-600 text-sm mt-1'>{vitalSignsErrors.weight}</p>)}
                </div>
                <div className='h-full'>
                    <div className='flex gap-4 items-center'>
                        <p className="block font-semibold text-black mb-2">Temperature<span className='text-red-600 ms-2'>*</span></p>
                        <div className='flex gap-1'>
                            <input
                                type='text'
                                className="px-2 border border-gray-800 block w-[50px] py-1 rounded"
                                value={ vitalSignsData.temperature }
                                onChange={(e) => {handleVitalSignsInputChange("temperature", e.target.value)}}
                                maxLength={4}
                                required
                            />
                            <p>&#176;C</p>
                        </div>
                    </div>
                    { vitalSignsErrors.temperature.trim() != "" && (<p className='text-red-600 text-sm mt-1'>{vitalSignsErrors.temperature}</p>)}
                </div>
                <div className='h-full'>
                    <div className='flex gap-2 items-top'>
                        <p className="font-semibold text-black mb-2 w-24">Blood Pressure<span className='text-red-600 ms-2'>*</span></p>
                        <input
                            type='text'
                            className="px-2 border border-gray-800 w-[50px] py-1 rounded h-fit"
                            value={ vitalSignsData.systolic }
                            onChange={(e) => {handleVitalSignsInputChange("systolic", e.target.value)}}
                            maxLength={3}
                            required
                        />
                        <p>/</p>
                        <input
                            type='text'
                            className="px-2 border border-gray-800 w-[50px] py-1 rounded h-fit"
                            value={ vitalSignsData.diastolic }
                            onChange={(e) => {handleVitalSignsInputChange("diastolic", e.target.value)}}
                            maxLength={3}
                            required
                        />
                    </div>
                    { vitalSignsErrors.blood_pressure.trim() != "" && (<p className='text-red-600 text-sm mt-1'>{vitalSignsErrors.blood_pressure}</p>)}
                </div>
            </div>
            <div className='flex items-center justify-center w-full mt-2'>
                <button type='submit' className='bg-[#248176] px-4 py-1 text-white rounded-md hover:bg-blue-700'>Save</button>
            </div>
        </form>
    </>
  )
}

export default VitalSignsForm