import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import globalSwal from '../utils/globalSwal'
import { getFormattedDate } from '../utils/dateUtils'; 
import { useNavigate } from 'react-router-dom';

const PatientDetails = ({patient}) => {
    const { user, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [update, setUpdate] = useState(false)
    const [updateData, setUpdateData] = useState({
        'photo': patient.photo ?? '',
        'first_name': patient.first_name,
        'middle_name': patient.middle_name ?? '',
        'last_name': patient.last_name,
        'suffix': patient.suffix ?? '',
        'birthdate': patient.birthdate ?? { getFormattedDate },
        'birthplace': patient.birthplace ?? '',
        'sex': patient.sex ?? '',
        'address': patient.address ?? '',
        'civil_status': patient.civil_status ?? '',
        'religion': patient.religion ?? '',
        'phone_number': patient.phone_number ?? '',
        'email': patient.email ?? '',
        'follow_up_date': patient.follow_up_date ?? '',
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
    
   return (
    <>
        <div className='bg-[#D9D9D9] bg-opacity-30'>
            <div className='bg-[#B43C3A] py-2 px-4 flex items-center justify-between'>
                <div className='flex gap-4'>
                    { update && <button onClick={() => {setUpdate(false)}}> <i className={`bi bi-arrow-left text-xl me-2 text-white`}></i></button>}
                    <p className='font-semibold text-white text-lg'>Details</p>
                </div>
                {!update && <button onClick={() => {setUpdate(true)}}><i className={`bi bi-pencil-square me-2 text-white`}></i></button>}
            </div>

            <form className='pt-4 pb-6 px-4' onSubmit={handleSubmit}>
                { update ? (
                    <>
                            <div className="grid grid-cols-3 gap-4 py-1">
                                <div className="col-span-1">
                                    {updateData.photo ? (
                                        <div className="relative">
                                            <img src={updateData.photo} alt="Patient" className="w-20 h-20 object-cover rounded-full" />
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="absolute top-0 right-0 p-1 text-black hover:bg-red-500 hover:text-white"
                                            >
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span>Null</span>
                                        </div>
                                    )}
                                </div>
                                {update && (
                                    <div className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded">
                                        <label htmlFor="photo" className="font-semibold text-black">Choose Photo</label>
                                        <input
                                            type="file"
                                            id="photo"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='grid grid-cols-3 gap-4 py-1'>
                                <p className="block font-semibold text-black col-span-1">First Name</p>
                                <input
                                    type="text"
                                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                    value={updateData.first_name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[a-zA-Z]*$/.test(value)) { // Ensure only letters are allowed
                                            setUpdateData({ ...updateData, first_name: value });
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        // Prevent number input by checking if the key is a number
                                        if (/\d/.test(e.key)) {
                                            e.preventDefault(); // Prevent the default action (i.e., typing a number)
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-3 gap-4 py-1'>
                                <p className="block font-semibold text-black col-span-1">Middle Name</p>
                                <input
                                    type="text"
                                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                    value={updateData.middle_name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[a-zA-Z]*$/.test(value)) { // Ensure only letters are allowed
                                            setUpdateData({ ...updateData, middle_name: value });
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        // Prevent number input by checking if the key is a number
                                        if (/\d/.test(e.key)) {
                                            e.preventDefault(); // Prevent the default action (i.e., typing a number)
                                        }
                                    }}
                                />
                            </div>
                            <div className='grid grid-cols-3 gap-4 py-1'>
                                <p className="block font-semibold text-black col-span-1">Last Name</p>
                                <input
                                    type="text"
                                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                    value={updateData.last_name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[a-zA-Z]*$/.test(value)) { // Ensure only letters are allowed
                                            setUpdateData({ ...updateData, last_name: value });
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        // Prevent number input by checking if the key is a number
                                        if (/\d/.test(e.key)) {
                                            e.preventDefault(); // Prevent the default action (i.e., typing a number)
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-3 gap-4 py-1'>
                                <p className="block font-semibold text-black col-span-1">Suffix</p>
                                <input
                                    type="text"
                                    className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                    value={updateData.suffix}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[a-zA-Z]*$/.test(value) && value.length <= 3) {
                                            setUpdateData({...updateData, suffix: value});
                                        }
                                    }}
                                />
                            </div>
                    </>
                ) : (
                    <div className="grid grid-cols-3 gap-4 py-1">
                        {/* Image on the right side of the name */}
                        <div className="col-span-2">
                            {updateData.photo ? (
                                <img src={updateData.photo} alt="Patient" className="w-20 h-20 object-cover rounded-full" />
                            ) : (
                                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span>Null</span>
                                </div>
                            )}
                        </div>
                        {/* Name Section */}
                        <div className="col-span-2">
                            <p className="block font-semibold text-black">Name</p>
                            <p className="block text-black">{patient.full_name}</p>
                        </div>
                    </div>
                )}
                    <div className='grid grid-cols-3 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-1">Birthdate</p>
                        { update ? (
                            <input
                                type="date"
                                name="birthdate"
                                className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                value={updateData.birthdate}
                                onChange={(e) => {setUpdateData({...updateData, birthdate: e.target.value})}}
                                max={new Date().toISOString().split("T")[0]} // Max date is today
                                min="1920-01-01" // Min date is 1920-01-01
                                required
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
                                required
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
                                required
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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only numeric characters and enforce a maximum length of 11
                                    if (/^\d*$/.test(value) && value.length <= 11) {
                                        setUpdateData({ ...updateData, phone_number: value });
                                    }
                                }}
                                onBlur={(e) => {
                                    // Check if phone number is exactly 11 digits on blur
                                    if (e.target.value.length !== 11) {
                                        console.log("Phone number must be exactly 11 digits.");
                                    }
                                }}
                            />
                            {errors.errors && errors.phone_number[0] && (
                                <p className="text-red-600 mb-1 mt-1 text-sm">
                                    {errors.errors.phone_number[0]}
                                </p>
                            )}
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
                    <div className='grid grid-cols-3 gap-4 py-1'>
                        <p className="block font-semibold text-black col-span-1">Follow-up Date</p>
                        {update ? (
                            <input
                                type="date"
                                name="follow_up_date"
                                className="col-span-2 border border-gray-800 block w-full py-1 px-4 rounded"
                                value={updateData.follow_up_date}
                                onChange={(e) => {
                                    setUpdateData({ ...updateData, follow_up_date: e.target.value });
                                }}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                        ) : (
                            <p className="block text-black col-span-2">{patient.follow_up_date}</p>
                        )}
                    </div>
                { update && (
                    <div className="mt-8 w-full">
                        {!errors.errors && errors.message && <p className="text-red-600 mb-1 text-center">{errors.message}</p>}

                        <div className="flex justify-center items-center">
                            <button type="submit" className="mt-1 block w-[50%] h-10 bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                                Save
                            </button>
                        </div>
                    </div>
                    )
                }
                {/* Generate ID Button */}
                {update && user.role === 'secretary' && (
                    <div className="mt-4 flex justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                navigate(`/patient-id-card/${patient.id}`);
                            }}
                            className="w-[50%] h-10 bg-[#4CAF50] text-white font-semibold rounded-md hover:bg-green-600 transition duration-200">
                            Generate ID
                        </button>
                    </div>
                )}
            </form>
        </div>
    </>
  )
}

export default PatientDetails