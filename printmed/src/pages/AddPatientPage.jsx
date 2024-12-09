import React, { useState, useContext, useEffect } from "react";

import AppContext from "../context/AppContext";

import { BounceLoader, ClipLoader } from "react-spinners";
import { useLocation, useNavigate } from 'react-router-dom';
import {globalSwalNoIcon, globalSwalWithIcon} from "../utils/globalSwal";
import logo from '../assets/images/logo.png';
import { base64ToPngFile } from "../utils/fileUtils";

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import WebcamCapture from "../components/WebcamCapture"
import { showError } from "../utils/fetch/showError";
import { fetchPatient } from "../utils/fetch/fetchPatient";
import { fetchPhysicians } from "../utils/fetch/fetchPhysicians";
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

const AddPatientPage = () => {
  const { token } = useContext(AppContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [physicians, setPhysicians] = useState([])
  const registration = state?.registration || {};
  const [newPatientData, setNewPatientData] = useState({
    first_name: registration.first_name || '',
    middle_name: registration.middle_name || '',
    last_name: registration.last_name || '',
    suffix: registration.suffix || '',
    sex: registration.sex || '',
    birthdate: registration.birthdate || '',
    birthplace: registration.birthplace || '',
    civil_status: registration.civil_status || '',
    house_number: registration.house_number || '',
    street: registration.street || '',
    region: registration.region || '',
    region_code: registration.region_code || '',
    province: registration.province || '',
    province_code: registration.province_code || '',
    city: registration.city || '',
    city_code: registration.city_code || '',
    barangay: registration.barangay || '',
    barangay_code: registration.barangay_code || '',
    postal_code: registration.postal_code || '',
    religion: registration.religion || '',
    email: registration.email || '',
    email_username: registration.email?.slice(0, registration.email.indexOf("@gmail.com")) || '',
    phone_number: registration.phone_number || '',
    physician_id: '',
    registration_id: registration.id || '',
  });
  const [image, setImage] = useState(null)
  const [takePhoto, setTakePhoto] = useState(false)
  const [duplicatePatients, setDuplicatePatients] = useState([])

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    getRegions()

    const getPhysicians = async () => {
      try {
        setPhysicians(await fetchPhysicians(token))
      } catch (err) {
        showError(err)
      }
    };

    getPhysicians()
  }, [])

  const getRegions = async () => {
    const data = await fetchRegions()
    setRegions(data.geonames)
  };

  // executes when region code changes
  useEffect(() => {
    const getProvinces = async () => {
      const data = await fetchProvinces(newPatientData.region_code)
      setProvinces(data.geonames)
    }
    getProvinces()
  }, [newPatientData.region_code])

  // executes when province code changes
  useEffect(() => {
    const getCities = async () => {
      const data = await fetchCities(newPatientData.province_code)
      setCities(data.geonames)
    }
    getCities()
  }, [newPatientData.province_code])

  // executes when city code changes
  useEffect(() => {
    const getBarangays = async () => {
      const data = await fetchBarangays(newPatientData.city_code)
      setBarangays(data.geonames)
    }
    getBarangays()
  }, [newPatientData.city_code])

  // handle changes in form fields
  const handleChange = (e) => {
    validatePatientDetails(e, setErrors, setNewPatientData, newPatientData)
  };

  // handle change in phone number input
  const handlePhoneNumberChange = (e) => {
    validatePhoneNumber(e, setErrors, setNewPatientData, newPatientData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPatientData.sex == "Female") {
      setNewPatientData(prevData => ({ ...prevData, suffix: ""})) 
    }

    let newErrors = {};
    let formIsValid = true;

    setErrors({});

    if (newPatientData.email_username.trim() != "") {
      const error = validateEmail(newPatientData.email_username)
      if (error.trim() != "") {
        newErrors.email = error
        formIsValid = false
      }
    }

    if (newPatientData.postal_code.trim() != "") {
      const error = validatePostalCode(newPatientData.postal_code)
      if (error.trim() != "") {
        newErrors.postal_code = error
        formIsValid = false
      }
    }

    if (newPatientData.birthdate.trim() !== "") {
      const error = validatePatientBirthdate(newPatientData.birthdate)
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
      setErrors(newErrors);
      return
    }

    globalSwalNoIcon.fire({
      title: 'Are you sure you want to add this patient?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if(result.isConfirmed) {
        try {
          setLoading(true)
    
          const queryParams = new URLSearchParams({
            first_name: newPatientData.first_name,
            last_name: newPatientData.last_name,
            birthdate: newPatientData.birthdate,
            sex: newPatientData.sex,
          }).toString();
    
          const res = await fetch(`/api/duplicate-patients?${queryParams}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
    
          if(!res.ok) {
            throw new Error("Something went wrong. Please try again later.")
          }
    
          const data = await res.json()
    
          if (data.length > 0) {
            setDuplicatePatients(data);
            setLoading(false);
            return;
          }
    
          addPatient(e)
        }
        catch (err) {
          setLoading(false)
          showError(err)
        }
      } 
    })
  }
  
  const addPatient = async (e) => {
    e.preventDefault()
    
    setDuplicatePatients([])

    try {
      setLoading(true)

      const filteredNewPatientData = Object.fromEntries(
        Object.entries(newPatientData).filter(([key, value]) => value !== '')
      );
      const photo = base64ToPngFile(image)  // util function for converting base64 to png

      const formData = new FormData();
      formData.append('photo', photo);

      for (const [key, value] of Object.entries(filteredNewPatientData)) {
        formData.append(key, value);
      }

      const res = await fetch('http://127.0.0.1:8000/api/patients', {
          method: 'POST',
          headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: formData,
      });

      if(!res.ok) {
        throw new Error("Something went wrong. Please try again later.")
      }

      const patient = await res.json()

      navigate(`/patients/${patient.id}`, {
        state: { patient }
      });

      setNewPatientData({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        birthdate: '',
        birthplace: '',
        phone_number: '',
        sex: '',
        civil_status: '',
        religion: '',
        email: '',
        email_username: '',
        house_number: '',
        street: '',
        region: '',
        region_code: '',
        province: '',
        province_code: '',
        city: '',
        city_code: '',
        barangay: '',
        barangay_code: '',
        postal_code: '',
      });

      globalSwalWithIcon.fire({
        icon: 'success',
        title: 'Patient added successfully!',
        showConfirmButton: false,
        showCloseButton: true,
      });

      setLoading(false)
    }
    catch (err) {
      setLoading(false)
      showError(err)
    }
  }

  // from duplicates
  const viewPatient = async (patientId) => {
    setLoading(true)

    try {
        const patient = await fetchPatient(patientId, token)

        navigate(`/patients/${patientId}`, {
          state: { patient }
        });
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
        <Sidebar />
        <Header />
        <>
          {/* loader */}
          {loading && (
            <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white bg-opacity-40 z-50'>
              <BounceLoader color="#6CB6AD" loading={true} size={60} />
            </div>
          )}

          {/* web cam */}
          {takePhoto && (
            <>
              <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-30'>
                <WebcamCapture image={image} setImage={setImage} setShow={setTakePhoto} />
              </div>
            </>
          )}

          {/* pop up if there are duplicate patients */}
          {duplicatePatients && duplicatePatients.length > 0 && (
            <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
              <div className="bg-white rounded-md flex justify-items-center flex-col pt-4 pb-8 px-8 max-h-[70vh] overflow-y-auto">
                <i className="bi bi-exclamation-circle block text-[60px] text-center text-orange-500"></i>
                <p className="text-center font-bold text-xl text-black">Duplicate Patient/s Found</p>
                <table className="w-[100%] border-collapse mt-4 break-words">
                  <thead>
                    <tr>
                      <th className="border-b-[2px] border-[#696969] text-center p-2">Patient No.</th>
                      <th className="border-b-[2px] border-[#696969] text-center p-2">Name</th>
                      <th className="border-b-[2px] border-[#696969] text-center p-2">Photo</th>
                      <th className="border-b-[2px] border-[#696969] text-center p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(duplicatePatients.map((patient, index) => (
                      <tr key={index}>
                        <td className="border-b-[1px] border-[#696969] max-w-[150px] text-center p-2 align-top px-6">{patient.patient_number}</td>
                        <td className="border-b-[1px] border-[#696969] max-w-[150px] text-center p-2 align-top px-6">{patient.full_name}</td>
                        <td className="border-b-[1px] border-[#696969] text-center p-2 align-top px-6">
                          <div className="w-full flex justify-center items-center">
                            <img src={patient.photo_url ?? ""} className="max-w-[80%] max-h-[120px]"/>
                          </div>
                        </td>
                        <td className="border-b-[1px] border-[#696969] text-center p-2 align-top px-6">
                          <button onClick={() => viewPatient(patient.id)} className="py-2 px-4 bg-[#007bff] hover:bg-blue-700 text-white rounded-md">View</button>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button onClick={(e) => addPatient(e)} className="py-2 px-4 bg-[#248176] hover:bg-[#1b6a61] text-white rounded-md">Add anyway</button>
                  <button onClick={() => setDuplicatePatients([])} className="py-2 px-4 bg-[#b33c39] hover:bg-[#e34441] text-white rounded-md">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] mb-10 flex justify-center items-center">
            <div className="w-full md:w-[70%] bg-gray-100 pt-8 pb-10 rounded-lg shadow-md mb-6">
              <div className="flex justify-center items-center rounded-md">
                <img src={logo} className="h-20" alt="Logo" />
              </div>
              <h2 className="text-2xl text-center font-bold m-6">Add New Patient</h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center justify-center">
                <div className="grid grid-cols-2 gap-4 gap-x-6 w-[80%]">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium">
                      First Name <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="first_name" 
                      value={newPatientData.first_name} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                    {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>}
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-medium">Middle Name</label>
                    <input 
                      type="text" 
                      name="middle_name" 
                      value={newPatientData.middle_name} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                    />
                    {errors.middle_name && <p className="text-red-600 text-sm mt-1">{errors.middle_name}</p>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium">
                      Last Name <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="last_name" 
                      value={newPatientData.last_name} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                    {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>}
                  </div>

                  {/* Suffix */}
                  <div>
                      <label className="block text-sm font-medium">Suffix</label>
                      <select
                        name="suffix"
                        value={newPatientData.suffix}
                        onChange={handleChange}
                        className="mt-1 block w-full border p-2 rounded-md border-black bg-white"
                      >
                        <option value="">Select Suffix</option>
                        <option value="Jr.">Jr.</option>
                        <option value="Sr.">Sr.</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </select>
                  </div>

                  {/* Sex */}
                  <div>
                    <label className="block text-sm font-medium">
                      Sex <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <select 
                      name="sex" 
                      value={newPatientData.sex} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black bg-white" 
                      required
                    >
                      <option value="">Select Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Birthdate */}
                  <div>
                    <label className="block text-sm font-medium">
                      Birthdate <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthdate"
                      value={newPatientData.birthdate}
                      onChange={handleChange}
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                      required
                    />
                    {errors.birthdate && <p className="text-red-600 text-sm mt-1">{errors.birthdate}</p>}
                  </div>

                  {/* Birthplace */}
                  <div>
                    <label className="block text-sm font-medium">
                      Birthplace <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="birthplace" 
                      value={newPatientData.birthplace} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                      required
                    />
                    {errors.birthplace && <p className="text-red-600 text-sm mt-1">{errors.birthplace}</p>}
                  </div>
                  
                  {/* Civil Status */}
                  <div>
                    <label className="block text-sm font-medium">
                      Civil Status <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <select 
                      name="civil_status" 
                      value={newPatientData.civil_status} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black bg-white" 
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  {/* Region */}
                  <div>
                      <label className="block text-sm font-medium">
                          Region <span className="text-red-600">*</span>
                      </label>
                      <select
                          name="region"
                          value={newPatientData.region}
                          onChange={(e) => handleRegionChange(e, setNewPatientData, setCities, setBarangays)}
                          className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                          required
                      >
                          <option value="">Select Region</option>
                          {regions?.map((region) => (
                              <option key={region.geonameId} data-code={region.geonameId} value={region.name}>
                                  {region.name} 
                              </option>
                          ))}
                      </select>
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium">
                        Province <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="province"
                        value={newPatientData.province}
                        onChange={(e) => handleProvinceChange(e, setNewPatientData, setBarangays)}
                        className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                        required
                    >
                    <option value="">Select Province</option>
                    {provinces?.map((province) => (
                        <option key={province.geonameId} data-code={province.geonameId} value={province.name}>
                            {province.name} 
                        </option>
                    ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                      <label className="block text-sm font-medium">
                          City/Municipality <span className="text-red-600">*</span>
                      </label>
                      <select
                          id="city"
                          name="city"
                          value={newPatientData.city}
                          onChange={(e) => handleCityChange(e, setNewPatientData)}
                          className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                          
                      >
                      <option value="">Select City/Municipality</option>
                      {cities?.map((city) => (
                          <option key={city.geonameId} data-code={city.geonameId} value={city.name}>
                              {city.name} 
                          </option>
                      ))}
                      </select>
                  </div>

                  {/* Barangay */}
                  <div>
                      <label className="block text-sm font-medium">
                          Barangay <span className="text-red-600">*</span>
                      </label>
                      <select
                          name="barangay"
                          value={newPatientData.barangay}
                          onChange={(e) => handleBarangayChange(e, setNewPatientData)}
                          className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                          required
                      >
                      <option value="">Select Barangay</option>
                      {barangays?.map((barangay) => (
                          <option key={barangay.geonameId} data-code={barangay.geonameId} value={barangay.name}>
                              {barangay.name} 
                          </option>
                      ))}
                      </select>
                  </div>
                
                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium">
                      Street <span className='text-gray-700'>(or Purok)</span> 
                    </label>
                    <input 
                      type="text" 
                      name="street" 
                      value={newPatientData.street} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                    />
                    {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
                  
                  </div>

                  {/* House No */}
                  <div>
                    <label className="block text-sm font-medium">
                      House No. <span className="text-red-600">*</span> <span className='text-gray-700'>(or Blk, Lot, Phase)</span> 
                    </label>
                    <input 
                      type="text" 
                      name="house_number" 
                      value={newPatientData.house_number} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                    {errors.house_number && <p className="text-red-600 text-sm mt-1">{errors.house_number}</p>}
                  
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium">
                      Postal Code
                    </label>
                    <input 
                      type="text" 
                      name="postal_code" 
                      maxLength="4"
                      minLength="4"
                      value={newPatientData.postal_code} 
                      onChange={handleChange}
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                    />
                    {errors.postal_code && <p className="text-red-600 text-sm mt-1">{errors.postal_code}</p>}
                  </div>

                  {/* Religion */}
                  <div>
                    <label className="block text-sm font-medium">Religion</label>
                    <select
                      name="religion"
                      className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                      value={newPatientData.religion}
                      onChange={handleChange} 
                    >
                      <option value="">Select Religion</option>
                      <option value="Roman Catholicism">Roman Catholicism</option>
                      <option value="Protestant Christianity">Protestant Christianity</option>
                      <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                      <option value="Jehovah's Witnesses">Jehovah's Witnesses</option>
                      <option value="Islam">Islam</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="flex items-center border rounded-md border-black overflow-hidden">
                        <span className="bg-gray-100 p-2">+63</span>
                          <input
                            type="text"
                            name="phone_number"
                            value={newPatientData.phone_number}
                            onChange={(e) => handlePhoneNumberChange(e)}
                            className="flex-1 p-2 border-l border-black focus:outline-none"
                            maxLength="10"
                            required
                          />
                      </div>
                    </div>
                    {errors.phone_number && (<p className="text-red-600 text-sm">{errors.phone_number}</p>)}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <div className="flex items-center border rounded-md border-black overflow-hidden">
                      <input
                        type="text"
                        name="email_username"
                        className="w-full p-2 focus:outline-none border-r border-r-black"
                        value={newPatientData.email_username}
                        onChange={handleChange}
                      />
                      <span className="bg-gray-100 p-2">@gmail.com</span> {/* Fixed domain */}
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  {/* Physician */}
                  <div>
                    <label className="block text-sm font-medium">
                      Physician <span className="text-red-600 cursor-help">*</span>
                    </label>
                    {!physicians ? (
                          <div className='flex items-center mt-3 italic'>
                              <ClipLoader className='me-4' loading={true} size={20} color='#6CB6AD' />
                              Loading Physicians
                          </div>
                      ) : (
                        <select
                          name="physician_id"
                          value={newPatientData.physician_id}
                          onChange={handleChange}
                          className="mt-1 block w-full border p-2 rounded-md border-black bg-white"
                          required
                        >
                          <option value="">Assign Physician</option>
                          { physicians?.length != 0 && physicians.map((physician) => (
                              <option key={physician.id} value={physician.id}>Doc. {physician.full_name}</option>
                          ))}
                        </select>
                      )}
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="block text-sm font-medium">
                      Photo <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <div>
                      { image && ( <img src={image} className="max-w-full h-[170px] mt-2 mb-2 rounded-lg" /> )}
                      <button type="button" onClick={(e) => {e.preventDefault(); setTakePhoto(true)}} className={`w-full py-2 px-4 rounded-lg text-white ${image ? "bg-red-700 hover:bg-red-500" : "bg-orange-500 hover:bg-orange-600"}`}>
                        <i className="bi bi-camera mr-1 text-xl font-bold"></i> {image ? "Retake" : "Take"} Photo
                      </button>
                    </div>
                    {errors.photo && <p className="text-red-600 text-sm mt-1">{errors.photo}</p>}
                  </div>
                </div>

                <button type="submit" className="mt-8 w-[50%] bg-[#248176] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 h-10">Add Patient</button>
              </form>
            </div>
          </div>
        </>
    </>
  )
}

export default AddPatientPage