import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context/AppContext'
import { getFormattedNumericDate, getFormattedStringDate, hasDatePassed } from '../utils/dateUtils';
import { capitalizedWords } from '../utils/wordUtils';
import Swal from 'sweetalert2';

const PatientDetails = ({setLoading, patient, setPatient}) => {
    const { token } = useContext(AppContext)

    const [errors, setErrors] = useState([])

    const [update, setUpdate] = useState(false)
    const [updateData, setUpdateData] = useState([])

    useEffect(() => {
        resetUpdateData()
        resetErrors()
    }, [])

    const resetUpdateData = () => {
        setUpdateData({
            'first_name': patient.first_name,
            'middle_name': patient.middle_name ?? '',
            'last_name': patient.last_name,
            'suffix': patient.suffix ?? '',
            'birthdate': patient.birthdate ?? '',
            'birthplace': patient.birthplace ?? '',
            'sex': patient.sex ?? '',
            'house_number': patient.house_number ?? '',
            'street': patient.street ?? '',
            'barangay': patient.barangay ?? '',
            'city': patient.city ?? '',
            'province': patient.province ?? '',
            'postal_code': patient.postal_code ?? '',
            'civil_status': patient.civil_status ?? '',
            'religion': patient.religion ?? '',
            'phone_number': patient.phone_number ? patient.phone_number.slice(2) : '',
            'email': patient.email ?? ''
        })
    }

    const resetErrors = () => {
        setErrors({})
    }

    const handleBack = () => {
        setUpdate(false)
        resetUpdateData()
        resetErrors()
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (Object.values(errors).some(error => error !== '')) {
            return
        }

        let hasError = false

        if (Number(updateData.postal_code) < 1000 || Number(updateData.postal_code) > 9999) {
            setErrors(prevData => ({ ...prevData, postal_code: "Postal code must range from 1000-9999."}))
            hasError = true
        } else {
            setUpdateData(prevData => ({ ...prevData, postal_code: Number(updateData.postal_code)})) 
        }

        if (!hasError) {
            updatePatient();
        }
    }

    const updatePatient = async () => {

        if (updateData.sex == "Male") {
            setUpdateData(prevData => ({ ...prevData, suffix: null})) 
        }

        const updateDataToSubmit = Object.keys(updateData).reduce((acc, key) => {
            if (key === "phone_number") {
                updateData[key] = updateData[key] !== "" ? "09" + updateData[key] : null
            }
                
            updateData[key] = updateData[key] === "" ? null : updateData[key]

            if (updateData[key] !== patient[key]) {
                acc[key] = updateData[key]
            }

            return acc;
        }, {});

        if (!Object.keys(updateDataToSubmit).length > 0) {
            handleBack()
            return
        }

        try {
            setLoading(true)

            const res = await fetch(`/api/patients/${patient.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updateDataToSubmit)
            })            

            if(!res.ok) {
                if (res.status === 404) {
                    throw new Error("Patient not found.")
                } else if (res.status === 403) {
                    throw new Error("You are not authorized to perform this action.")
                } else if (res.status === 400) {
                    throw new Error("Something went wrong with your request. Please check your input and try again later.")
                } else {
                    throw new Error("Something went wrong. Please try again later.")
                }
            }

            const data = await res.json()
            setPatient(data)
            handleBack()
            
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
                },
                confirmButtonColor: "#248176",
                cancelButtonColor: "#b33c39",
            })
        }
        finally {
            setLoading(false)
        }
    }

    const handleLettersOnlyInputChange = (key, value) => {
        setErrors(prevData => ({ ...prevData, [key]: ""}))

        // allows only one trailing space
        let trimmedValue = value.trim()
        if (value.endsWith(' ')) {
            trimmedValue = trimmedValue + ' ';
        }

        // allows only letters and spaces
        const lettersOnlyRegex = /^[a-zA-ZñÑ\s]*$/
        if (lettersOnlyRegex.test(value)) {
            setUpdateData(prevData => ({ ...prevData, [key]: capitalizedWords(trimmedValue)}))  // capitalized each word
        }
    }

    const handleNoSpecialCharactersInputChange = (key, value) => {
        setErrors(prevData => ({ ...prevData, [key]: ""}))

        // allows only one trailing space
        let trimmedValue = value.trim()
        if (value.endsWith(' ')) {
            trimmedValue = trimmedValue + ' ';
        }


        // allows only letters, numbers, and spaces
        const noSpecialCharactersRegex = /^[a-zA-ZñÑ0-9\s]*$/
        if (noSpecialCharactersRegex.test(value)) {
            setUpdateData(prevData => ({ ...prevData, [key]: capitalizedWords(trimmedValue)}))  // capitalized each word
        }
    }

    const handleNumbersOnlyInputChange = (key, value) => {
        setErrors(prevData => ({ ...prevData, [key]: ""}))
        
        const numbersOnlyRegex = /^\d*$/
        if (numbersOnlyRegex.test(value)) {
            setUpdateData(prevData => ({ ...prevData, [key]: value}))
        }
    }
   
    return (
        <>
            <div className='bg-[#D9D9D9] bg-opacity-30'>
                <div className='bg-[#B43C3A] py-2 px-4 flex items-center justify-between'>
                    <div className='flex gap-2'>
                        { !update ? (
                            <p className='font-semibold text-white text-lg'>Details</p>
                        ) : (
                            <>
                                <button onClick={handleBack}> <i className={`bi bi-arrow-left text-xl me-2 text-white`}></i></button>
                                <p className='font-semibold text-white text-lg'>Edit Details</p>
                            </>
                        )}
                    </div>
                    {!update && <button onClick={() => {setUpdate(true)}}><i className={`bi bi-pencil-square me-2 text-white`}></i></button>}
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col items-center justify-center px-6 py-4 pb-6 w-full'>
                    { patient.photo_url ? (
                        <img src={ patient.photo_url } alt="" className="w-40 h-40 object-cover rounded-md mb-4" />
                    ) : (
                        <div className="w-40 h-40 object-cover rounded-md mb-4 bg-gray-300 flex items-center justify-center"></div>
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
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>First Name {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.first_name}
                                                placeholder='First Name'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={(e) => handleLettersOnlyInputChange("first_name", e.target.value)}
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
                                                placeholder='Middle Name'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={(e) => handleLettersOnlyInputChange("middle_name", e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Last Name {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.last_name}
                                                placeholder='Last Name'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={(e) => handleLettersOnlyInputChange("last_name", e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    { updateData.sex == "Male" && (
                                        <tr>
                                            <th className='text-start border border-[#828282] p-2 w-[35%]'>Suffix</th>
                                            <td className='border p-2 border-[#828282] w-[65%]'>
                                                <select
                                                    value={updateData.suffix}
                                                    className="col-span-2 border border-gray-800 block py-2 px-2 rounded bg-white w-[50%]"
                                                    onChange={(e) => setUpdateData(prevData => ({...prevData, suffix: e.target.value}))}
                                                >
                                                    <option value="">Select Suffix</option>
                                                    <option value="Jr">Jr</option>
                                                    <option value="Sr">Sr</option>
                                                    <option value="III">III</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                            { !update && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>Age</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>{patient.age}</td>
                                </tr>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Birthdate {update && <span className='text-red-600'>*</span>}</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.birthdate ? getFormattedStringDate(patient.birthdate) : ""
                                    ) : (
                                        <input
                                            type="date"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={updateData.birthdate}
                                            min={"1904-01-01"}
                                            max={getFormattedNumericDate()}
                                            onChange={(e) => setUpdateData(prevData => ({...prevData, birthdate: e.target.value}))}
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                            { (patient.birthplace && !update) || update && (
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
                                                placeholder='Birthplace'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={(e) => handleLettersOnlyInputChange("birthplace", e.target.value)}
                                            />
                                        )}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Sex {update && <span className='text-red-600'>*</span>}</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.sex
                                    ) : (
                                        <select
                                            value={updateData.sex}
                                            className="col-span-2 border border-gray-800 block w-full py-2 px-2 rounded bg-white"
                                            onChange={(e) => setUpdateData(prevData => ({...prevData, sex: e.target.value}))}
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
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>House No. {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.house_number}
                                                placeholder='House No.'
                                                minLength={2}
                                                maxLength={30}
                                                onChange={(e) => handleNoSpecialCharactersInputChange("house_number", e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Street {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.street}
                                                placeholder='Street'
                                                minLength={2}
                                                maxLength={20}
                                                onChange={(e) => handleNoSpecialCharactersInputChange("street", e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Barangay {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.barangay}
                                                placeholder='Barangay'
                                                minLength={2}
                                                maxLength={20}
                                                onChange={(e) => handleLettersOnlyInputChange("barangay", e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>City {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.city}
                                                placeholder='City'
                                                minLength={2}
                                                maxLength={20}
                                                onChange={(e) => handleLettersOnlyInputChange("city", e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Province {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.province}
                                                placeholder='Province'
                                                minLength={2}
                                                maxLength={20}
                                                onChange={(e) => handleLettersOnlyInputChange("province", e.target.value)}
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
                                                placeholder='Postal Code'
                                                maxLength={4}
                                                minLength={4}
                                                onChange={(e) => handleNumbersOnlyInputChange("postal_code", e.target.value)}
                                            />
                                            <p className='text-red-600 text-xs'>{errors.postal_code}</p>
                                        </td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Civil Status {update && <span className='text-red-600'>*</span>}</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.civil_status
                                    ) : (
                                        <select
                                            value={updateData.civil_status}
                                            className="col-span-2 border border-gray-800 block w-full py-2 px-2 rounded bg-white"
                                            onChange={(e) => setUpdateData(prevData => ({...prevData, civil_status: e.target.value}))}
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
                            { (patient.religion && !update) || update && (
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
                                                placeholder='Religion'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={(e) => handleLettersOnlyInputChange("religion", e.target.value)}
                                            />
                                        )}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Phone No. {update && <span className='text-red-600'>*</span>}</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.phone_number
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <p>+639</p>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.phone_number}
                                                placeholder='Phone No.'
                                                maxLength={9}
                                                minLength={9}
                                                onChange={(e) => handleNumbersOnlyInputChange("phone_number", e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                            { (patient.religion && !update) || update && (
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
                                                onChange={(e) => setUpdateData(prevData => ({...prevData, email: e.target.value}))}
                                                placeholder='Email'
                                            />
                                        )}
                                    </td>
                                </tr>
                            )}
                            { !update && patient.consultations && patient.consultations.length > 0 && (
                                <>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Last Visit</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{patient.last_visit ? getFormattedStringDate(patient.last_visit) : ""}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Follow-up Date</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            { patient.follow_up_date ? (
                                                hasDatePassed(patient.follow_up_date) ? patient.follow_up_date + <span className='text-red-500'>Missed</span> : patient.follow_up_date
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
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