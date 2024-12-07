import React, { useState, useContext, useEffect } from "react";

import AppContext from "../context/AppContext";

import { BounceLoader, ClipLoader } from "react-spinners";
import { useLocation, useNavigate } from 'react-router-dom';
import {globalSwalNoIcon, globalSwalWithIcon} from "../utils/globalSwal";
import logo from '../assets/images/logo.png';
import { capitalizedWords } from "../utils/wordUtils";
import { base64ToPngFile } from "../utils/fileUtils";

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import WebcamCapture from "../components/WebcamCapture"
import { showError } from "../utils/fetch/showError";
import { fetchPatient } from "../utils/fetch/fetchPatient";
//import { handlePhoneNumberChange } from "../utils/handlePhoneNumberChange";
import { fetchPhysicians } from "../utils/fetch/fetchPhysicians";

const AddPatientPage = () => {
  const { token } = useContext(AppContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [physicians, setPhysicians] = useState([])
  const [duplicatePatients, setDuplicatePatients] = useState([])
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
    barangay: registration.barangay || '',
    city: registration.city || '',
    province: registration.province || '',
    region: registration.region || '',
    postal_code: registration.postal_code || '',
    religion: registration.religion || '',
    email: registration.email || '',
    email_username: registration.email_username || '',
    phone_number: registration.phone_number || '',
    physician_id: '',
    registration_id: registration.id || '',
  });
  console.log('Registration Data:', registration);

  const [image, setImage] = useState(null)
  const [takePhoto, setTakePhoto] = useState(false)

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const fetchRegions = async () => {
    const response = await fetch('https://psgc.gitlab.io/api/regions.json');
    const data = await response.json();
    console.log(data);
    return data;
  }

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    const getRegions = async () => {
      const regionData = await fetchRegions();
      setRegions(regionData);
    };
    getRegions();
  }, []);

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;

    const sanitizedValue = value.replace(/\D/g, '');

    if (value !== sanitizedValue) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone_number: 'Phone number can only contain numbers.',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phone_number: '' }));
    }

    const limitedValue = sanitizedValue.slice(0, 10);

    setNewPatientData({
      ...newPatientData,
      phone_number: limitedValue,
    });
  };

  // Fetch provinces based on selected region
  const handleRegionChange = async (event) => {
    const selectedRegion = event.target.value;

    // Find the region object by its name
    const regionObject = regions.find((region) => region.name === selectedRegion);

    if (regionObject) {
        const response = await fetch(`https://psgc.gitlab.io/api/regions/${regionObject.code}/provinces.json`);
        const data = await response.json();

        setProvinces(data);
        setNewPatientData({ ...formData, region: selectedRegion });
    } else {
        console.error("Region not found.");
    }
};

// const handleRegionChange = async (event) => {
//     const selectedRegion = event.target.value;
//     // setFormData({ ...formData, region: selectedRegion });
//     const selectedOptionElement = event.target.options[event.target.selectedIndex];
//     const additionalData = selectedOptionElement.getAttribute('data-code'); 
//     const response = await fetch(`https://psgc.gitlab.io/api/regions/${additionalData}/provinces.json`);
//     const data = await response.json();
//     console.log(selectedRegion);

//     // regions.
//     // regions // where code == ""
//     setProvinces(data);
//     // console.log(data.name);
//     // selected = event.target.selectedIndex
//     // const selectedOptionElement = event.target.options[event.target.selectedIndex];
//     // const additionalData = selectedOptionElement.getAttribute('data-name');  // Access the data-info attribute
//     console.log(additionalData)

//     setFormData({ ...formData, region: selectedRegion });
// };

// Fetch cities based on selected province
const handleProvinceChange = async (event) => {
    const selectedProvince = event.target.value;

    // Find the province object by its name
    const provinceObject = provinces.find((province) => province.name === selectedProvince);

    if (provinceObject) {
        const response = await fetch(`https://psgc.gitlab.io/api/provinces/${provinceObject.code}/cities.json`);
        const data = await response.json();

        setCities(data);
        setNewPatientData({ ...formData, province: selectedProvince });
    } else {
        console.error("Province not found.");
    }
};

// const handleProvinceChange = async (event) => {
//     const selectedProvince = event.target.value;

//     const selectedOptionElement = event.target.options[event.target.selectedIndex];
//     const additionalData = selectedOptionElement.getAttribute('data-code'); 
//     const response = await fetch(`https://psgc.gitlab.io/api/provinces/${additionalData}/cities.json`);
//     const data = await response.json();
//     console.log(selectedProvince);

//     setCities(data);

//     // const selectedOptionElement = event.target.options[event.target.selectedIndex];
//     // const additionalData = selectedOptionElement.getAttribute('data-name');  // Access the data-info attribute
//     setFormData({ ...formData, province: selectedProvince });
//     console.log(additionalData)
// };

// Fetch barangays based on selected city
const handleCityChange = async (event) => {
    const selectedCity = event.target.value;

    // Find the city object by its name
    const cityObject = cities.find((city) => city.name === selectedCity);

    if (cityObject) {
        const response = await fetch(`https://psgc.gitlab.io/api/cities/${cityObject.code}/barangays.json`);
        const data = await response.json();

        setBarangays(data);
        setNewPatientData({ ...formData, city: selectedCity });
    } else {
        console.error("City not found.");
    }
};

// const handleCityChange = async (event) => {
//     const selectedCity = event.target.value;

//     const selectedOptionElement = event.target.options[event.target.selectedIndex];
//     const additionalData = selectedOptionElement.getAttribute('data-code');  // Access the data-info attribute
//     const response = await fetch(`https://psgc.gitlab.io/api/cities/${additionalData}/barangays.json`);
//     const data = await response.json();
//     console.log(selectedCity)

//     setBarangays(data);
    
//     setFormData({ ...formData, city: selectedCity });
//     console.log(additionalData)
// };


  // const handleRegionChange = async (event) => {
  //   const selectedRegion = event.target.value;
  //   // setFormData({ ...formData, region: selectedRegion });
  //   const selectedOptionElement = event.target.options[event.target.selectedIndex];
  //   const additionalData = selectedOptionElement.getAttribute('data-code'); 
  //   const response = await fetch(`https://psgc.gitlab.io/api/regions/${additionalData}/provinces.json`);
  //   const data = await response.json();
  //   console.log(selectedRegion);

  //   // regions.
  //   // regions // where code == ""
  //   setProvinces(data);
  //   // console.log(data.name);
  //   // selected = event.target.selectedIndex
  //   // const selectedOptionElement = event.target.options[event.target.selectedIndex];
  //   // const additionalData = selectedOptionElement.getAttribute('data-name');  // Access the data-info attribute
  //   console.log(additionalData)

  //   setNewPatientData({ ...newPatientData, region: selectedRegion });
  // };

  // const handleProvinceChange = async (event) => {
  //   const selectedProvince = event.target.value;

  //   const selectedOptionElement = event.target.options[event.target.selectedIndex];
  //   const additionalData = selectedOptionElement.getAttribute('data-code'); 
  //   const response = await fetch(`https://psgc.gitlab.io/api/provinces/${additionalData}/cities.json`);
  //   const data = await response.json();
  //   console.log(selectedProvince);

  //   setCities(data);

  //   // const selectedOptionElement = event.target.options[event.target.selectedIndex];
  //   // const additionalData = selectedOptionElement.getAttribute('data-name');  // Access the data-info attribute
  //   setNewPatientData({ ...newPatientData, province: selectedProvince });
  //   console.log(additionalData)
  // };

  // const handleCityChange = async (event) => {
  //   const selectedCity = event.target.value;

  //   const selectedOptionElement = event.target.options[event.target.selectedIndex];
  //   const additionalData = selectedOptionElement.getAttribute('data-code');  // Access the data-info attribute
  //   const response = await fetch(`https://psgc.gitlab.io/api/cities/${additionalData}/barangays.json`);
  //   const data = await response.json();
  //   console.log(selectedCity)

  //   setBarangays(data);
    
  //   setNewPatientData({ ...newPatientData, city: selectedCity });
  //   console.log(additionalData)
  // };

  useEffect(() => {
    const getPhysicians = async () => {
      try {
        setPhysicians(await fetchPhysicians(token))
      } catch (err) {
        showError(err)
      }
    };
    
    getPhysicians()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = name !== "email" && name !== "suffix" ? capitalizedWords(value) : value

    setErrors({ ...errors, [name]: '' });
      
    // no numbers and symbols numbers
    if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Cannot contain numbers or special characters.',
      }));  
      return;
    }

    // no symbols allowed
    if (name === 'house_number' || name === 'street') {
        if (/[^a-zA-Z0-9\s]/.test(value)) {
          return;
        }
    }
    
    if (name === 'postal_code') {
        if (/[^0-9]/.test(value)) {
          return;
        }
        if (value.length > 4) {
          return;
        }
    }

    setNewPatientData({ 
        ...newPatientData, 
        [name]: capitalizedValue, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let formIsValid = true;

    setErrors({});

    if (!newPatientData.email_username.trim()) {
      newErrors.email = 'Email username is required.';
      formIsValid = false;
  } else if (!/^[a-zA-Z0-9._%+-]+$/.test(newPatientData.email_username)) {
      newErrors.email = 'Email username contains invalid characters.';
      formIsValid = false;
  }

  // Construct full email and assign to formData
  const fullEmail = `${newPatientData.email_username}@gmail.com`;
  newPatientData.email = fullEmail;

  // Reassign errors if email is invalid
  if (!/\S+@\S+\.\S+/.test(fullEmail)) {
      newErrors.email = 'Please enter a valid email address.';
      formIsValid = false;
  }

    if (newPatientData.postal_code.trim() !== "" && (Number (newPatientData.postal_code) < 1000 || Number (newPatientData.postal_code) > 9999)) {
      newErrors.postal_code = 'Postal code must only range between 1000-9999';
    }

    if (newPatientData.phone_number.length !== 11) {
      newErrors.phone_number = 'Please enter a valid phone number.';
      formIsValid = false;
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
        barangay: '',
        street: '',
        city: '',
        province: '',
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
                    {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>}
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
                      max={new Date().toISOString().split("T")[0]}
                      min="1920-01-01"
                      required
                    />
                  </div>

                  {/* Birthplace */}
                  <div>
                      <label className="block text-sm font-medium">
                        Birthplace
                      </label>
                      <input 
                        type="text" 
                        name="birthplace" 
                        value={newPatientData.birthplace} 
                        onChange={handleChange} 
                        className="mt-1 block w-full border p-2 rounded-md border-black"
                      />
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
                    <label htmlFor="region" className="block text-sm font-medium">
                      Region <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={newPatientData.region}
                      onChange={handleRegionChange}
                      className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                      required
                    >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.code} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                    </select>
                  </div>

                  {/* Province */}
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium">
                      Province <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <select
                      id="province"
                      name="province"
                      value={newPatientData.province}
                      onChange={handleProvinceChange}
                      className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                      required
                    >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium">
                      City/Municipality <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={newPatientData.city}
                      onChange={handleCityChange}
                      className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                      required
                    >
                      <option value="">Select City/Municipality</option>
                        {cities.map((city) => (
                        <option key={city.code} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Barangay */}
                  <div>
                    <label htmlFor="barangay" className="block text-sm font-medium">
                      Barangay <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="barangay"
                      name="barangay"
                      value={newPatientData.barangay}
                      onChange={(e) => setNewPatientData({ ...formData, barangay: e.target.value })}
                      className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                      required
                    >
                      <option value="">Select Barangay</option>
                        {barangays.map((barangay) => (
                          <option key={barangay.code} value={barangay.name}>
                          {barangay.name}
                      </option>
                    ))}
                    </select>
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium">
                      Street
                    </label>
                    <input 
                      type="text" 
                      name="street" 
                      value={newPatientData.street} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black"
                    />
                  </div>

                  {/* House No */}
                  <div>
                    <label className="block text-sm font-medium">
                      House No. <span className="text-red-600 cursor-help">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="house_number" 
                      value={newPatientData.house_number} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border p-2 rounded-md border-black" 
                      required 
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium">
                      Postal Code
                    </label>
                    <input 
                      type="number" 
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
                      <option value="Islam">Islam</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Jehovah's Witnesses">Jehovah's Witnesses</option>
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
                          <span className="bg-gray-100 p-2 text-gray-700">+63</span>
                            <input
                              type="text"
                              name="phone_number"
                              value={newPatientData.phone_number || ''}
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
                        type="email"
                        name="email_username"
                        className="w-full p-2 focus:outline-none"
                        value={newPatientData.email || ""}
                        onChange={(e) => {
                          const emailUsername = e.target.value;
                          setNewPatientData({
                              ...newPatientData,
                              email_username: emailUsername,
                              email: emailUsername + "@gmail.com", // Append domain
                          });
                        }}
                    />
                    <span className="bg-gray-100 text-gray-600 px-2">@gmail.com</span> {/* Fixed domain */}
                    </div>
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
                      { image && ( <img src={image} className="max-w-full h-[150px] mt-2 mb-2 rounded-lg" /> )}
                      <button onClick={(e) => {e.preventDefault(); setTakePhoto(true)}} className={`w-full py-2 px-4 rounded-lg text-white ${image ? "bg-red-700 hover:bg-red-500" : "bg-orange-500 hover:bg-orange-600"}`}>
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