import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import globalSwal from '../utils/globalSwal'

const PatientDetails = ({patient}) => {
    const { token } = useContext(AppContext)

    const [update, setUpdate] = useState(false)
    const [updateData, setUpdateData] = useState({
        'first_name': patient.first_name,
        'middle_name': patient.middle_name ?? '',
        'last_name': patient.last_name,
        'suffix': patient.suffix ?? '',
        'birthdate': patient.birthdate ?? '',
        'birthplace': patient.birthplace ?? '',
        'sex': patient.sex ?? '',
        'address': patient.address ?? '',
        'civil_status': patient.civil_status ?? '',
        'religion': patient.religion ?? '',
        'phone_number': patient.phone_number ?? '',
        'email': patient.email ?? ''
    })
    const [errors, setErrors] = useState([])

    const updatePatient = async () => {
        globalSwal.showLoading()

        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([key, value]) => value !== '')
        );

        const res = await fetch(`/api/patients/${patient.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(filteredUpdateData)
        })

        const data = await res.json()

        console.log(data)

        if(res.ok) {
            patient = data
        }

        setUpdate(false)

        globalSwal.close()
    }

   return (
    <div>
        <div className='bg-[#D9D9D9] bg-opacity-30'>
            <div className='bg-[#B43C3A] py-2 px-4 flex items-center justify-between'>
                <p className='font-semibold text-white text-lg'>Details</p>
                <button onClick={() => {setUpdate(!update)}}>
                    <i className={`bi ${update ? 'bi-x-circle-fill' : 'bi-pencil-square'} me-2 text-white`}></i>
                </button>
            </div>

            <div className='pt-4 pb-6 px-4'>
                { update ? (
                    <>
                        <div className='grid grid-cols-3 gap-4 py-1'>
                            <p className="block font-semibold text-black col-span-1">First Name</p>
                            <input
                                type="text"
                                className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                value={updateData.first_name}
                                onChange={(e) => {setUpdateData({...updateData, first_name: e.target.value})}}
                            />
                        </div>
                        <div className='grid grid-cols-3 gap-4 py-1'>
                            <p className="block font-semibold text-black col-span-1">Middle Name</p>
                            <input
                                type="text"
                                className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                value={updateData.middle_name}
                                onChange={(e) => {setUpdateData({...updateData, middle_name: e.target.value})}}
                            />
                        </div>
                        <div className='grid grid-cols-3 gap-4 py-1'>
                            <p className="block font-semibold text-black col-span-1">Last Name</p>
                            <input
                                type="text"
                                className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                value={updateData.last_name}
                                onChange={(e) => {setUpdateData({...updateData, last_name: e.target.value})}}
                            />
                        </div>
                        <div className='grid grid-cols-3 gap-4 py-1'>
                            <p className="block font-semibold text-black col-span-1">Suffix</p>
                            <input
                                type="text"
                                className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                value={updateData.suffix}
                                onChange={(e) => {setUpdateData({...updateData, suffix: e.target.value})}}
                            />
                        </div>
                    </>
                ) : (
                    <div className='grid grid-cols-3 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-1">Name</p>
                        <p className="block text-black col-span-2">{patient.full_name}</p>
                    </div>
                )}
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Birthdate</p>
                    { update ? (
                        <input
                            type="date"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={updateData.birthdate}
                            onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{patient.birthdate}</p>
                    ) }
                </div>
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Birthplace</p>
                    { update ? (
                        <input
                            type="text"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={updateData.birthplace}
                            onChange={(e) => {setUpdateData({...updateData, birthplace: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{patient.birthplace}</p>
                    ) }
                </div>
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Sex</p>
                    { update ? (
                        <select
                            name="sex"
                            value={updateData.sex}
                            onChange={(e) => {setUpdateData({...updateData, sex: e.target.value})}}
                            className="col-span-2 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                            required
                        >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className="block text-black col-span-2">{patient.sex}</p>
                    ) }
                </div>
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Address</p>
                    { update ? (
                        <input
                            type="text"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={updateData.address}
                            onChange={(e) => {setUpdateData({...updateData, address: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{patient.address}</p>
                    ) }
                </div>
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Civil Status</p>
                    { update ? (
                        <select
                            name="sex"
                            value={updateData.civil_status}
                            onChange={(e) => {setUpdateData({...updateData, civil_status: e.target.value})}}
                            className="col-span-2 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                            required
                        >
                            <option value="">Select Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    ) : (
                        <p className="block text-black col-span-2">{patient.civil_status}</p>
                    ) }
                </div>
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Religion</p>
                    { update ? (
                        <input
                            type="text"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={updateData.religion}
                            onChange={(e) => {setUpdateData({...updateData, religion: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{patient.religion}</p>
                    ) }
                </div>
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Phone Number</p>
                    { update ? (
                        <div className='col-span-2'>
                            <input
                                type="text"
                                className="border border-gray-800 block w-full py-1 px-4 rounded"
                                value={updateData.phone_number}
                                onChange={(e) => {setUpdateData({...updateData, phone_number: e.target.value})}}
                            />
                            {errors.errors && errors.phone_number[0] && <p className="text-red-600 mb-1 mt-1 text-sm">{errors.errors.phone_number[0]}</p>}
                        </div>
                    ) : (
                        <p className="block text-black col-span-2">{patient.phone_number}</p>
                    ) }
                </div>
                <div className='grid grid-cols-3 gap-4 py-1'>
                    <p className="block font-semibold text-black col-span-1">Email</p>
                    { update ? (
                        <input
                            type="email"
                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                            value={updateData.email}
                            onChange={(e) => {setUpdateData({...updateData, email: e.target.value})}}
                        />
                    ) : (
                        <p className="block text-black col-span-2">{patient.email}</p>
                    ) }
                </div>
                { update && (
                    <div className="mt-8 w-full">
                        {!errors.errors && errors.message && <p className="text-red-600 mb-1 text-center">{errors.message}</p>}

                        <div className="flex justify-center items-center">
                            <button onClick={() => updatePatient()} className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default PatientDetails