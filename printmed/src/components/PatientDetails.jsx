import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context/AppContext'
import { getFormattedNumericDate, getFormattedStringDate } from '../utils/dateUtils';
import { capitalizedWords } from '../utils/wordUtils';
import { handlePhoneNumberChange } from '../utils/handlePhoneNumberChange';
import WebcamCapture from './WebcamCapture';
import { showError } from '../utils/fetch/showError';
import { globalSwalNoIcon } from '../utils/globalSwal';
import { base64ToPngFile } from '../utils/fileUtils';
import { getFollowUpDateStatus } from '../utils/patientUtils';
import { fetchPhysicians } from '../utils/fetch/fetchPhysicians';
import { ClipLoader } from 'react-spinners';

const PatientDetails = ({setLoading, patient, setPatient}) => {
    const { token, user } = useContext(AppContext)

    const [physicians, setPhysicians] = useState(null)
    const followUpDateStatus = getFollowUpDateStatus(patient.follow_up_date)
    const [update, setUpdate] = useState(false)
    const [updateData, setUpdateData] = useState([])
    const [image, setImage] = useState(null)
    const [takePhoto, setTakePhoto] = useState(false)
    const [errors, setErrors] = useState([])

    useEffect(() => {
        resetUpdateData()
        resetErrors()

        const getPhysicians = async () => {
            try {
                setPhysicians(await fetchPhysicians(token))
            } catch (err) {
                showError(err)
            }
        };
        
        if (user.role === "secretary" && update && (!physicians || physicians.length == 0)) {
            getPhysicians()
        }
    }, [update])

    const resetUpdateData = () => {
        setImage(patient.photo_url ?? null)
        setUpdateData({
            'first_name': patient.first_name ?? '',
            'middle_name': patient.middle_name ?? '',
            'last_name': patient.last_name ?? '',
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
            'phone_number': patient.phone_number ?? '',
            'email': patient.email ?? '',
            'physician_id': patient.physician ? patient.physician.id : '',
        })
    }

    const resetErrors = () => {
        setErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (Object.values(errors).some(error => error !== '')) {
            return
        }

        let hasError = false

        if (updateData.postal_code && updateData.postal_code.trim() != "") {
            if (Number(updateData.postal_code) < 1000 || Number(updateData.postal_code) > 9999) {
                setErrors(prevData => ({ ...prevData, postal_code: "Postal code must range from 1000-9999."}))
                hasError = true
            } else {
                setUpdateData(prevData => ({ ...prevData, postal_code: Number(updateData.postal_code)})) 
            }
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
            if (key == "physician_id" && patient.physician && updateData[key] == patient.physician.id) {
                return acc
            }

            if (String(updateData[key].trim()) == "" && (patient[key] == null || String(patient[key].trim()) == "")) {
                return acc
            }

            if ((updateData[key] !== patient[key])) {
                acc[key] = updateData[key]
            }

            return acc;
        }, {});

        if (!Object.keys(updateDataToSubmit).length > 0 && image == patient.photo_url) {
            setUpdate(false)
            return
        }

        try {
            setLoading(true)

            const formData = new FormData();
            if (image != patient.photo_url) {
                console.log(image)
                console.log(patient.photo_url)
                const photo = base64ToPngFile(image)  // util function for converting base64 to png
                formData.append('photo', photo)
            }
        
            for (const [key, value] of Object.entries(updateDataToSubmit)) {
                formData.append(key, value);
            }

            const res = await fetch(`http://127.0.0.1:8000/api/patients/${patient.id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                },
                body: formData
            })

            const data = await res.json()
            console.log(data)
        
            if(!res.ok) {
                throw new Error("Something went wrong. Please try again later.")
            }
              
            globalSwalNoIcon.fire({
                icon: 'success',
                title: 'Patient updated successfully!',
                showConfirmButton: false,
                showCloseButton: true,
            });
        
            setPatient(data)
            setUpdate(false)
        }
        catch (err) {
            showError(err)
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
        
        const lettersOneCommaRegex = /^[a-zA-ZñÑ]*(, ?[a-zA-ZñÑ]*)?$/
        if (key == "birthplace" && lettersOneCommaRegex.test(value)) {
            setUpdateData(prevData => ({ ...prevData, [key]: capitalizedWords(trimmedValue)})) 
            return
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
            {/* web cam */}
            {takePhoto && (
                <>
                    <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-30'>
                        <WebcamCapture image={image} setImage={setImage} setShow={setTakePhoto} />
                    </div>
                </>
            )}

            <div className='bg-[#D9D9D9] bg-opacity-30'>
                <div className='bg-[#248176] py-2 px-4 flex items-center justify-between'>
                    <div className='flex gap-2'>
                        { !update ? (
                            <p className='font-semibold text-white text-lg'>Details</p>
                        ) : (
                            <>
                                <button onClick={() => setUpdate(false)}> <i className={`bi bi-arrow-left text-xl me-2 text-white`}></i></button>
                                <p className='font-semibold text-white text-lg'>Edit Details</p>
                            </>
                        )}
                    </div>
                    {!update && user.role != "physician" && <button onClick={() => {setUpdate(true)}}><i className={`bi bi-pencil-square me-2 text-white`}></i></button>}
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col items-center justify-center px-6 py-4 pb-6 w-full'>
                    <div className={`relative ${update && "mb-2"}`}>
                        <img src={ !update ? patient.photo_url || '' : image } alt="" className="w-40 h-40 object-cover rounded-md mb-4 bg-gray-300" />
                        { update && (
                            <button onClick={(e) => {e.preventDefault(); setTakePhoto(true)}} className='bg-[#248176] px-2 py-1 rounded-full text-white shadow absolute bottom-1 -right-2 hover:bg-red-500'>
                                <i className='bi bi-pen'></i>
                            </button>
                        )}
                    </div>
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
                            { ((patient.birthplace && !update) || update) && (
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
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Street</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.street}
                                                placeholder='Street'
                                                minLength={2}
                                                maxLength={20}
                                                onChange={(e) => handleNoSpecialCharactersInputChange("street", e.target.value)}
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
                            { ((patient.religion && !update) || update) && (
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
                                        <input
                                            type="text"
                                            className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                            value={updateData.phone_number || '09'}
                                            onChange={(e) => handlePhoneNumberChange(e, setUpdateData, setErrors)}
                                            maxLength="11"
                                            minLength="11"
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                            { ((patient.email && !update) || update) && (
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
                            { !update && (
                                <>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Last Visit</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>{patient.last_visit ? getFormattedStringDate(patient.last_visit) : "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Follow-up Date</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            { patient.follow_up_date ? (
                                                <>
                                                    {patient.follow_up_date} 
                                                    <span className={`ms-3 italic ${followUpDateStatus == "Missed" ? "text-red-600" : followUpDateStatus == "Today" ? "text-green-500" : ""}`}>
                                                        {followUpDateStatus}
                                                    </span>
                                                </>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                    </tr>
                                </>
                            )}
                            { user.role === "secretary" && 
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>Physician {update && <span className='text-red-600'>*</span>}</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>
                                        { !update ? (
                                            patient.physician ? "Doc. " + patient.physician.full_name : "N/A"
                                        ) : (
                                            !physicians ? (
                                                <div className='flex items-center italic'>
                                                    <ClipLoader className='me-4' loading={true} size={20} color='#6CB6AD' />
                                                    Loading Physicians
                                                </div>
                                            ) : (
                                                <select
                                                    value={updateData.physician_id}
                                                    className="col-span-2 border border-gray-800 block w-full py-2 px-2 rounded bg-white"
                                                    onChange={(e) => setUpdateData(prevData => ({...prevData, physician_id: e.target.value}))}
                                                    required
                                                >
                                                    <option value=''>Select Physician</option>
                                                    {physicians && physicians.map((physician, index) => (
                                                        <option key={index} value={physician.id}>Doc. {physician.full_name}</option>
                                                    ))}
                                                </select>
                                            )
                                        )}
                                    </td>
                                </tr>
                            }
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