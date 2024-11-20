import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context/AppContext'
import globalSwal from '../utils/globalSwal'
import { getFormattedNumericDate, getFormattedStringDate } from '../utils/dateUtils'; 
import { useNavigate } from 'react-router-dom';

const PatientDetails = ({ patient }) => {
    const { user, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [errors, setErrors] = useState([])

    const [update, setUpdate] = useState(false)
    const [updateData, setUpdateData] = useState([])

    useEffect(() => {
        resetUpdateData()
    }, [])

    const resetUpdateData = () => {
        setUpdateData({
            'photo': patient.photo ?? '',
            'first_name': patient.first_name,
            'middle_name': patient.middle_name ?? '',
            'last_name': patient.last_name,
            'suffix': patient.suffix ?? '',
            'birthdate': patient.birthdate ?? { getFormattedDate: getFormattedNumericDate },
            'birthplace': patient.birthplace ?? '',
            'sex': patient.sex ?? '',
            'address': patient.address ?? '',
            'civil_status': patient.civil_status ?? '',
            'religion': patient.religion ?? '',
            'phone_number': patient.phone_number ?? '',
            'email': patient.email ?? '',
            'follow_up_date': patient.follow_up_date ?? '',
        })
    }

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
        } else {
            setErrors(data)
        }

        setUpdate(false)

        globalSwal.close()
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePatient();
    }

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdateData({ ...updateData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setUpdateData({ ...updateData, photo: '' });
    };

    const handleBackButtonClick = () => {
        setUpdate(false)
        resetUpdateData()
    }
    
   return (
        <>
            <div className='bg-[#D9D9D9] bg-opacity-30'>
                <div className='bg-[#B43C3A] py-2 px-4 flex items-center justify-between'>
                    <div className='flex gap-4'>
                        { !update ? (
                            <p className='font-semibold text-white text-lg'>Details</p>
                        ) : (
                            <>
                                <button onClick={handleBackButtonClick}> <i className={`bi bi-arrow-left text-xl me-2 text-white`}></i></button>
                                <p className='font-semibold text-white text-lg'>Edit Details</p>
                            </>
                        )}
                    </div>
                    {!update && <button onClick={() => {setUpdate(true)}}><i className={`bi bi-pencil-square me-2 text-white`}></i></button>}
                </div>

                <form className='flex flex-col items-center justify-center px-6 py-4 pb-6 w-full'>
                    { patient.photo_url ? (
                        <img src={ patient.photo_url } alt="" className="w-40 h-40 object-cover rounded-md mb-4" />
                    ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                            <span>Null</span>
                        </div>
                    )}
                    <table className='text-start border-collapse border border-black bg-white w-full break-words'>
                        <tbody>
                            { !update ? (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>Name</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{patient.full_name}</td>
                                </tr>
                            ) : (
                                <>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>First Name</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.first_name}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Middle Name</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.middle_name}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Last Name</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.last_name}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Suffix</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-[50%] py-1 px-2 rounded"
                                                value={updateData.suffix}
                                                required
                                            />
                                        </td>
                                    </tr>
                                </>
                            )}
                            { !update && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>Age</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{patient.age}</td>
                                </tr>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Birthdate</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        getFormattedStringDate(patient.birthdate)
                                    ) : (
                                        <input
                                            type="date"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={updateData.birthdate}
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Birthplace</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.birthplace
                                    ) : (
                                        <input
                                            type="text"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={updateData.birthplace}
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Sex</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.sex
                                    ) : (
                                        <select
                                            value={updateData.sex}
                                            className="col-span-2 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                                            required
                                        >
                                            <option value="">Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                            { !update ? (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>Address</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{patient.address}</td>
                                </tr>
                            ) : (
                                <>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>House Number</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.house_number}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Street</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.street}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Barangay</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.barangay}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>City</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.city}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Province</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.province}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Postal Code</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-[50%] py-1 px-2 rounded"
                                                value={updateData.postal_code}
                                                required
                                            />
                                        </td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Civil Status</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.civil_status
                                    ) : (
                                        <select
                                            value={updateData.civil_status}
                                            className="col-span-2 border border-gray-800 block w-full py-2 px-4 rounded bg-white"
                                            required
                                        >
                                            <option value="">Select Civil Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Religion</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.religion
                                    ) : (
                                        <input
                                            type="text"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={updateData.religion}
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Phone Number</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.phone_number
                                    ) : (
                                        <input
                                            type="number"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={updateData.phone_number}
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Email</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.email
                                    ) : (
                                        <input
                                            type="email"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={updateData.email}
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                            { !update && (
                                <>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Last Visit</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{patient.last_visit ? getFormattedStringDate(patient.last_visit) : ""}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Follow-up Date</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{patient.follow_up_date ? getFormattedStringDate(patient.follow_up_date) : ""}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                    { update && (
                        <div className="mt-4 w-full">
                            {!errors.errors && errors.message && <p className="text-red-600 mb-1 text-center">{errors.message}</p>}

                            <div className="flex justify-center items-center">
                                <button type="submit" className="mt-1 block w-[60%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    )
}

export default PatientDetails