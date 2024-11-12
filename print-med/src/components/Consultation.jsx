import React, { useContext, useState } from 'react'
import PhysicianContext from '../context/PhysicianContext'
import { getFormattedDate } from '../utils/dateUtils'

const Consultation = () => {
    const { consultation } = useContext(PhysicianContext)
    const [pediatrics, setPediatrics] = useState(false)

  return (
    <div>
        {consultation && <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Date</p>
            <p className="block text-black col-span-2">{getFormattedDate(consultation.created_at)}</p>
        </div>}
        {/* <div className='h-6'></div> */}
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Height</p>
            { !consultation ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.height}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Weight</p>
            { !consultation ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.weight}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Temperature</p>
            { !consultation ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.temperature}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Blood Pressure</p>
            { !consultation ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.blood_pressure}</p>
            ) }
        </div>
        <div className='h-6'></div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Chief Complaint</p>
            { !consultation ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.chief_complaint}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">History of Present Illness</p>
            { !consultation ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.present_illness_hx}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Family History</p>
            { !consultation ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.family_hx}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Medical History</p>
            { !consultation ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.medical_hx}</p>
            ) }
        </div>
        {/* <div className='h-6'></div> */}
        <div className='grid grid-cols-1 py-1'>
            { !consultation && (
                <div className='cols-span-3 flex items-center gap-4'>
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-black"
                        value={""}
                        // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                    />
                    <p className="font-semibold text-black">Is Pediatrics?</p>
                </div>
            )}
        </div>
        { pediatrics && (
            <>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(H) Home"}</p>
                    { !consultation ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={""}
                            // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{consultation.birthdate}</p>
                    ) }
                </div>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(E) Education / Employment"}</p>
                    { !consultation ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={""}
                            // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{consultation.birthdate}</p>
                    ) }
                </div>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(A) Activities"}</p>
                    { !consultation ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={""}
                            // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{consultation.birthdate}</p>
                    ) }
                </div>
                <div className='grid grid-cols-7 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-2">{"(D) Drugs / Drinking"}</p>
                    { !consultation ? (
                        <textarea
                            rows="3"
                            className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={""}
                            // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{consultation.birthdate}</p>
                    ) }
                </div>
            </>
        )}
        <div className='h-6'></div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Primary Diagnosis</p>
            { !consultation ? (
                <input
                    type="text"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.primary_diagnosis}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Diagnosis</p>
            { !consultation ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.diagnosis}</p>
            ) }
        </div>

        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Prescription</p>
            { !consultation ? (
                <textarea
                    rows="3"
                    className="col-span-5 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.prescription}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Follow-up Date</p>
            { !consultation ? (
                <input
                    type="date"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.follow_up_date}</p>
            ) }
        </div>
        <div className='h-6'></div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Amount</p>
            { !consultation ? (
                <input
                    type="text"
                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                />
            ) : (
                <p className="block text-black col-span-2">{consultation.birthdate}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">Method</p>
            { !consultation ? (
                <select
                    name="payment_method"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, civil_status: e.target.value})}}
                    className="col-span-3 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                    required
                >
                    <option value="">Select Payment Method</option>
                    <option value="cash">Cash</option>
                    <option value="hmo">HMO</option>
                </select>
            ) : (
                <p className="block text-black col-span-2">{consultation.birthdate}</p>
            ) }
        </div>
        <div className='grid grid-cols-7 gap-4 py-1'>
            <p className="block font-semibold text-black col-span-2">HMO</p>
            { !consultation ? (
                <select
                    name="payment_method"
                    value={""}
                    // onChange={(e) => {setUpdateData({...updateData, civil_status: e.target.value})}}
                    className="col-span-3 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                    required
                >
                    <option value="">Select Payment Method</option>
                    <option value="cash">Cash</option>
                    <option value="hmo">HMO</option>
                </select>
            ) : (
                <p className="block text-black col-span-2">{consultation.birthdate}</p>
            ) }
        </div>
        { !consultation && (
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