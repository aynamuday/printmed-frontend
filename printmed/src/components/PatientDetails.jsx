import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context/AppContext'
import { getFormattedStringDate } from '../utils/dateUtils';
import WebcamCapture from './WebcamCapture';
import { showError } from '../utils/fetch/showError';
import { globalSwalNoIcon } from '../utils/globalSwal';
import { base64ToPngFile } from '../utils/fileUtils';
import { getFollowUpDateStatus } from '../utils/patientUtils';
import { fetchPhysicians } from '../utils/fetch/fetchPhysicians';
import { ClipLoader } from 'react-spinners';
import { validatePatientDetails } from "../utils/formValidations/validatePatientDetails";
import { validatePhoneNumber } from "../utils/formValidations/validatePhoneNumber";
import { validatePostalCode } from "../utils/formValidations/validatePostalCode";
import { validatePatientBirthdate } from "../utils/formValidations/validatePatientBirthdate";
import { validateEmail } from "../utils/formValidations/validateEmail";
import { handleRegionChange } from "../utils/handleRegionChange";
import { handleProvinceChange } from "../utils/handleProvinceChange";
import { handleCityChange } from "../utils/handleCityChange";
import { handleBarangayChange } from "../utils/handleBarangayChange";
import { fetchProvinces } from "../utils/fetch/fetchProvinces";
import { fetchRegions } from "../utils/fetch/fetchRegions";
import { fetchCities } from "../utils/fetch/fetchCities";
import { fetchBarangays } from "../utils/fetch/fetchBarangays";
import { showLoggedOut } from '../utils/fetch/showLoggedOut';

const PatientDetails = ({setLoading, patient, setPatient}) => {
    const { token, user } = useContext(AppContext)

    const [physicians, setPhysicians] = useState('')
    const followUpDateStatus = getFollowUpDateStatus(patient.follow_up_date)
    const [update, setUpdate] = useState(false)
    const [updateData, setUpdateData] = useState({
        'first_name': patient.first_name ?? '',
        'middle_name': patient.middle_name ?? '',
        'last_name': patient.last_name ?? '',
        'suffix': patient.suffix ?? '',
        'birthdate': patient.birthdate ?? '',
        'birthplace': patient.birthplace ?? '',
        'sex': patient.sex ?? '',
        'house_number': patient.house_number ?? '',
        'street': patient.street ?? '',
        'region': patient.region ?? '',
        'region_code': patient.region_code ?? '',
        'province': patient.province ?? '',
        'province_code': patient.province_code ?? '',
        'city': patient.city ?? '',
        'city_code': patient.city_code ?? '',
        'barangay': patient.barangay ?? '',
        'barangay_code': patient.barangay_code ?? '',
        'postal_code': patient.postal_code ?? '',
        'civil_status': patient.civil_status ?? '',
        'religion': patient.religion ?? '',
        'phone_number': patient.phone_number ?? '',
        'email': patient.email ?? '',
        'email_username': patient.email?.slice(0, patient.email.indexOf("@gmail.com")) || '',
        'payment_method': patient.payment_method ?? '',
        'hmo': patient.hmo ?? '',
        'physician_id': patient.physician ? patient.physician.id : '',
    })
    const [image, setImage] = useState(patient.photo_url ?? null)
    const [takePhoto, setTakePhoto] = useState(false)
    const [errors, setErrors] = useState([])

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    useEffect(() => {
        const getPhysicians = async () => {
            try {
                const data = await fetchPhysicians(token)
                setPhysicians(data)
            } catch (err) {
                if (err.message == "Unauthenticated") {
                    showLoggedOut()
                    navigate('/')
                } else {
                    showError(err)
                }                
            }
        };
        
        if (user.role === "secretary" && !physicians) {
            getPhysicians()
        }

        if (user.role == "secretary") {
            getRegions()
        }
    }, [])

    useEffect(() => {
        resetUpdate()
    }, [patient])

    useEffect(() => {
        if (!update) {
            resetUpdate()
        }
    }, [update])

    const resetUpdate = () => {
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
            'region': patient.region ?? '',
            'region_code': patient.region_code ?? '',
            'province': patient.province ?? '',
            'province_code': patient.province_code ?? '',
            'city': patient.city ?? '',
            'city_code': patient.city_code ?? '',
            'barangay': patient.barangay ?? '',
            'barangay_code': patient.barangay_code ?? '',
            'postal_code': patient.postal_code ?? '',
            'civil_status': patient.civil_status ?? '',
            'religion': patient.religion ?? '',
            'phone_number': patient.phone_number ?? '',
            'email': patient.email ?? '',
            'email_username': patient.email?.slice(0, patient.email.indexOf("@gmail.com")) || '',
            'payment_method': patient.payment_method ?? '',
            'hmo': patient.hmo ?? '',
            'physician_id': patient.physician ? patient.physician.id : '',
        })
        setImage(patient.photo_url ?? null)

        setErrors([])
    }

    const handleChange = (e) => {
        validatePatientDetails(e, setErrors, setUpdateData, updateData)
    }

    const handlePhoneNumberChange = (e) => {
        validatePhoneNumber(e, setErrors, setUpdateData, updateData)
    }

    const getRegions = async () => {
        const data = await fetchRegions()
        setRegions(data)
        console.log(data);
    }

    // executes when region code changes
    useEffect(() => {
        if (patient.length != 0 && user.role == "secretary") {
            if (updateData.region === "National Capital Region (NCR)") {
                const getCities = async () => {
                    const data = await fetchCities(updateData.region_code, true)
                    setCities(data)
                }
                getCities()
                setProvinces([])
            } else {
                if (updateData.region_code) {
                    const getProvinces = async () => {
                        const data = await fetchProvinces(updateData.region_code)
                        setProvinces(data)
                    }
                    getProvinces()
                }
            }
        }
    }, [updateData.region_code])

    // executes when province code changes
    useEffect(() => {
        if (patient.length != 0 && user.role == "secretary") {
            if (updateData.province_code) {
                const getCities = async () => {
                    const data = await fetchCities(updateData.province_code)
                    setCities(data)
                }
                
                getCities()
            }
            // encountered a problem here, since I call this every time updateData.province_code is updated, it executed multiple times even province_code is empty
            // and since it is asynchronous, I received responses multiple times too and not in order
            // so I get response last for the empty, then setCities to empty
            // therefore I added condition to if statement, the patient.length != 0, so that this only executes when patient is set
        }
    }, [updateData.province_code])

    // executes when city code changes
    // useEffect(() => {
    //     if (patient.length != 0 && user.role == "secretary") {
    //         if (updateData.city_code) {
    //             const getBarangays = async () => {
    //                 const data = await fetchBarangays(updateData.city_code)
    //                 setBarangays(data)
    //             }
    //             getBarangays()
    //         }
    //     }
    // }, [updateData.city_code])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (updateData.sex == "Female") {
            setUpdateData(prevData => ({ ...prevData, suffix: ""})) 
        }

        let newErrors = {};
        let formIsValid = true;

        setErrors({})

        if (updateData.email_username.trim() != "") {
            const error = validateEmail(updateData.email_username)
            if (error.trim() != "") {
                newErrors.email = error
                formIsValid = false
            }
        }

        if (updateData.postal_code.trim() != "") {
            const error = validatePostalCode(updateData.postal_code)
            if (error.trim() != "") {
                newErrors.postal_code = error
                formIsValid = false
            }
        }

        if (updateData.birthdate.trim() !== "") {
            const error = validatePatientBirthdate(updateData.birthdate)
            if (error.trim() != "") {
                newErrors.birthdate = error
                formIsValid = false
            }
        }

        if (!image) {
            newErrors.photo = 'Photo is required.';
            formIsValid = false;
        }

        if (!formIsValid) {
            newErrors.general = "Please check your inputs for errors."
            setErrors(newErrors)
            return
        }

        updatePatient();
    }

    const updatePatient = async () => {
        const updateDataToSubmit = Object.keys(updateData).reduce((acc, key) => {
            if (key == "physician_id" && patient.physician && updateData[key] == patient.physician.id) {
                return acc
            }

            if (key == "email_username") {
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
            setImage(data.photo_url)
            setUpdate(false)
            sessionStorage.setItem('patient', JSON.stringify(data))
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
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
                                <button onClick={() => {setUpdate(false);}}> <i className={`bi bi-arrow-left text-xl me-2 text-white`}></i></button>
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
                            <button type='button' onClick={(e) => {e.preventDefault(); setTakePhoto(true)}} className='bg-[#248176] px-2 py-1 rounded-full text-white shadow absolute bottom-1 -right-2 hover:bg-[#6cb6ad]'>
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
                                                name="first_name"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.first_name}
                                                placeholder='First Name'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Middle Name</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                name="middle_name"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.middle_name}
                                                placeholder='Middle Name'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={handleChange}
                                            />
                                            {errors.middle_name && <p className="text-red-600 text-sm mt-1">{errors.middle_name}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Last Name {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                name="last_name"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.last_name}
                                                placeholder='Last Name'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Suffix</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <select
                                                value={updateData.suffix}
                                                name="suffix"
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
                                        <>
                                            <input
                                                type="date"
                                                name="birthdate"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.birthdate}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.birthdate && <p className="text-red-600 text-sm mt-1">{errors.birthdate}</p>}
                                        </>
                                    )}
                                </td>
                            </tr>
                            { ((patient.birthplace && !update) || update) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>Birthplace {update && <span className='text-red-600'>*</span> && <span className='text-gray-700 font-normal'>(City, Province)</span>} </th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>
                                        { !update ? (
                                            patient.birthplace
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    name="birthplace"
                                                    className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                    value={updateData.birthplace}
                                                    placeholder='Birthplace'
                                                    minLength={2}
                                                    maxLength={50}
                                                    onChange={handleChange}
                                                />
                                                {errors.birthplace && <p className="text-red-600 text-sm mt-1">{errors.birthplace}</p>}
                                            </>
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
                                            name="sex"
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
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Region {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <select
                                                name="region"
                                                value={updateData.region}
                                                onChange={(e) => handleRegionChange(e, setUpdateData, setCities, setBarangays)}
                                                className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                                required
                                            >
                                                <option value="">Select Region</option>
                                                {regions?.map((region) => (
                                                    <option 
                                                        key={region.id}
                                                        data-code={region.code}
                                                        value={region.name}
                                                    >
                                                        {region.name} 
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Province</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <select
                                                name="province"
                                                value={updateData.province}
                                                onChange={(e) => handleProvinceChange(e, setUpdateData, setBarangays)}
                                                className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                                // required
                                            >
                                                <option value="">Select Province</option>
                                                {provinces?.map((province) => (
                                                    <option 
                                                        key={province.id}
                                                        data-code={province.code}
                                                        value={province.name}
                                                    >
                                                        {province.name} 
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>City/Municipality {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <select
                                                name="city"
                                                value={updateData.city}
                                                onChange={(e) => handleCityChange(e, setUpdateData)}
                                                className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                                required
                                            >
                                                <option value="">Select City/Municipality</option>
                                                {cities?.map((city) => (
                                                    <option 
                                                        key={city.id}
                                                        data-code={city.code}
                                                        value={city.name}
                                                    >
                                                        {city.name} 
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Barangay {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <select
                                                name="region"
                                                value={updateData.barangay}
                                                onChange={(e) => handleBarangayChange(e, setUpdateData)}
                                                className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                                required
                                            >
                                                <option value="">Select Barangay</option>
                                                {barangays?.map((barangay) => (
                                                    <option 
                                                        key={barangay.id}
                                                        data-code={barangay.code}
                                                        value={barangay.name}
                                                    >
                                                        {barangay.name} 
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr> */}
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Barangay {update && <span className='text-red-600'>*</span>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                name="barangay"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.barangay}
                                                placeholder='Barangay'
                                                minLength={2}
                                                maxLength={50}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.barangay && <p className="text-red-600 text-sm mt-1">{errors.barangay}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Street {update && <p className='text-gray-700 font-normal'>(or Purok)</p>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                name="street"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.street}
                                                placeholder='Street'
                                                minLength={2}
                                                maxLength={20}
                                                onChange={handleChange}
                                            />
                                            {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>House No. {update && <span className='text-red-600'>*</span> && <p className='text-gray-700 font-normal'>(or Blk, Lot, Phase)</p>}</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                name="house_number"
                                                className="col-span-2 border border-gray-800 block w-full py-1 px-2 rounded"
                                                value={updateData.house_number}
                                                placeholder='House No.'
                                                minLength={2}
                                                maxLength={30}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.house_number && <p className="text-red-600 text-sm mt-1">{errors.house_number}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-start border border-[#828282] p-2 w-[35%]'>Postal Code</th>
                                        <td className='border p-2 border-[#828282] w-[65%]'>
                                            <input
                                                type="text"
                                                name="postal_code"
                                                className="col-span-2 border border-gray-800 block w-[50%] py-1 px-2 rounded"
                                                value={updateData.postal_code}
                                                placeholder='Postal Code'
                                                maxLength={4}
                                                minLength={4}
                                                onChange={handleChange}
                                            />
                                            {errors.postal_code && <p className="text-red-600 text-sm mt-1">{errors.postal_code}</p>}
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
                                            name="civil_status"
                                            className="col-span-2 border border-gray-800 block w-full py-2 px-2 rounded bg-white"
                                            onChange={handleChange}
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
                                            <select
                                                name="religion"
                                                className="col-span-2 border border-gray-800 block w-full py-2 px-2 rounded bg-white"
                                                value={updateData.religion}
                                                onChange={handleChange} 
                                            >
                                                <option value="">Select Religion</option>
                                                <option value="Roman Catholicism">Roman Catholicism</option>
                                                <option value="Protestant Christianity">Protestant Christianity</option>
                                                <option value="Iglesia Ni Cristo">Iglesia Ni Cristo</option>
                                                <option value="Jehovah's Witnesses">Jehovah's Witnesses</option>
                                                <option value="Islam">Islam</option>
                                                <option value="Buddhism">Buddhism</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Phone No. {update && <span className='text-red-600'>*</span>}</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        "+63" + patient.phone_number
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <div className="flex items-center border rounded-md border-black overflow-hidden">
                                                <span className="bg-gray-100 p-2">+63</span>
                                                    <input
                                                    type="text"
                                                    name="phone_number"
                                                    value={updateData.phone_number}
                                                    onChange={handlePhoneNumberChange}
                                                    className="flex-1 p-2 border-l border-black focus:outline-none"
                                                    maxLength="10"
                                                    minLength="10"
                                                    required
                                                    />
                                                </div>
                                            </div>
                                            {errors.phone_number && (<p className="text-red-600 text-sm">{errors.phone_number}</p>)}
                                        </>
                                    )}
                                </td>
                            </tr>
                            { ((!update && patient.email && patient.email != "") || update) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>Email</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>
                                        { !update ? (
                                            patient.email
                                        ) : (
                                            <>
                                                <div className="flex items-center border rounded-md border-black overflow-hidden">
                                                    <input
                                                        type="text"
                                                        name="email_username"
                                                        className="w-full p-2 focus:outline-none border-r border-r-black"
                                                        value={updateData.email_username}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="bg-gray-100 p-2">@gmail.com</span> {/* Fixed domain */}
                                                </div>
                                                {errors.email && (<p className="text-red-600 text-sm">{errors.email}</p>)}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th className='text-start border border-[#828282] p-2 w-[35%]'>Payment Method {update && <span className='text-red-600'>*</span>}</th>
                                <td className='border p-2 border-[#828282] w-[65%]'>
                                    { !update ? (
                                        patient.payment_method
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <select
                                                    name="payment_method"
                                                    className="col-span-2 border border-gray-800 block w-full py-2 px-2 rounded bg-white"
                                                    value={updateData.payment_method}
                                                    onChange={handleChange} 
                                                    required
                                                >
                                                    <option value="">Select Payment Method</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="HMO">HMO</option>
                                                </select>
                                            </div>
                                            {errors.payment_method && (<p className="text-red-600 text-sm">{errors.payment_method}</p>)}
                                        </>
                                    )}
                                </td>
                            </tr>
                            { ((update && updateData.payment_method == "HMO") || (!update && patient.payment_method == "HMO")) && (
                                <tr>
                                    <th className='text-start border border-[#828282] p-2 w-[35%]'>HMO {update && <span className='text-red-600'>*</span>}</th>
                                    <td className='border p-2 border-[#828282] w-[65%]'>
                                        { !update ? (
                                            patient.hmo
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <select
                                                        name="hmo"
                                                        className="col-span-2 border border-gray-800 block w-full py-2 px-2 rounded bg-white"
                                                        value={updateData.hmo}
                                                        onChange={handleChange} 
                                                        required
                                                    >
                                                        <option value="">Select HMO</option>
                                                        <option value="Advanced Medical Access Philippines">Advanced Medical Access Philippines</option>
                                                        <option value="AsianCare">AsianCare</option>
                                                        <option value="Avega">Avega</option>
                                                        <option value="Carewell Health Systems">Carewell Health Systems</option>
                                                        <option value="CocoLife HealthCare">CocoLife HealthCare</option>
                                                        <option value="Dynamic Care Corporation">Dynamic Care Corporation</option>
                                                        <option value="EastWest Healthcare">EastWest Healthcare</option>
                                                        <option value="eTiQa">eTiQa</option>
                                                        <option value="Generali">Generali</option>
                                                        <option value="Getwell Health Systems">Getwell Health Systems</option>
                                                        <option value="Health Bridge Medical Services">Health Bridge Medical Services</option>
                                                        <option value="Health Maintenance">Health Maintenance</option>
                                                        <option value="Health Plans Philippines">Health Plans Philippines</option>
                                                        <option value="iCare">iCare</option>
                                                        <option value="IMS Wellth Care">IMS Wellth Care</option>
                                                        <option value="Intellicare">Intellicare</option>
                                                        <option value="Lacson & Lacson Insurance Brokers">Lacson & Lacson Insurance Brokers</option>
                                                        <option value="MediCard">MediCard</option>
                                                        <option value="Medicare Plus">Medicare Plus</option>
                                                        <option value="Maxicare">Maxicare</option>
                                                        <option value="MedAsia">MedAsia</option>
                                                        <option value="MedoCare">MedoCare</option>
                                                        <option value="Pacific Cross Philippines">Pacific Cross Philippines</option>
                                                        <option value="PhilCare">PhilCare</option>
                                                        <option value="Sun Life Grepa">Sun Life Grepa</option>
                                                        <option value="ValuCare">ValuCare</option>
                                                    </select>
                                                </div>
                                                {errors.hmo && (<p className="text-red-600 text-sm">{errors.hmo}</p>)}
                                            </>
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
                                                    {getFormattedStringDate(patient.follow_up_date)} 
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
                            {errors.general && <p className="text-red-600 mb-1 text-center">{errors.general}</p>}

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