import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import bg_nurse from '../assets/images/bg-nurse.png';
import logo from '../assets/images/logo.png';
import { BounceLoader } from 'react-spinners';
import { capitalizedWords } from '../utils/wordUtils';
import Swal from 'sweetalert2';
import { showError } from '../utils/fetch/showError';

function RegistrationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        sex: '',
        birthdate: '',
        birthplace: '',
        civil_status: '',
        region: '',
        region_code: '',
        province: '',
        province_code: '',
        city: '',
        city_code: '',
        barangay: '',
        barangay_code: '',
        street: '',
        house_number: '',
        postal_code: '',
        religion: '',
        phone_number: '',
        email: '',
        email_username: '',
    });
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [showTerms, setShowTerms] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [registrationId, setRegistrationId] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetchRegions()
        resetForm()
    }, []);

    const resetForm = () => {
        setFormData({
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            sex: '',
            birthdate: '',
            birthplace: '',
            civil_status: '',
            house_number: '',
            street: '',
            barangay: '',
            city: '',
            province: '',
            region: '',
            postal_code: '',
            religion: '',
            phone_number: '',
            email: '',
            email_username: '',
        });

        setErrors({});

        setTermsAccepted(false)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setErrors((prevErrors) => ({...prevErrors, [name]: ''}))
        const capitalizedValue = name !== "email" && name !== "suffix" ? capitalizedWords(value) : value

        // should not accept numbers and special characters    
        if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'Cannot contain numbers or special characters.',
            }));
            return;
        }

        if (name === "birthplace") {
            if (!/^([a-zA-Z][a-zA-Z, ]*|)$/.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'Can only contain letters and comma, and must start with a letter.',
                }));
                return
            }
        }
          
        // no symbols allowed
        if (name === 'house_number') {
            if (/[^a-zA-Z0-9\s]/.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'Cannot contain special characters.',
                }));
                return;
            }
        }
          
        if (name === 'postal_code') {
            if (/[^0-9]/.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'Can only contain numbers.',
                }));
                return;
            }
        }

        if (name === "email_username") {
            setErrors((prevErrors) => ({...prevErrors, email: ''}))
            const emailUsername = value.toLowerCase();

            // only allows letters, numbers, dot
            if (!/^[a-zA-Z0-9.]*$/.test(emailUsername)) {
                setErrors({...errors, email: "Can only contain letters, numbers, and dot."})
                return
            }

            setFormData({
                ...formData,
                email_username: emailUsername,
                email: emailUsername + "@gmail.com", 
            });
            return
        }

        setFormData({ 
            ...formData, 
            [name]: capitalizedValue, 
        });
    };

    const handlePhoneNumberChange = (e) => {
        setErrors((prevErrors) => ({ ...prevErrors, phone_number: '' }))

        let value = e.target.value;
        const sanitizedValue = value.replace(/\D/g, '');
    
        if (value !== sanitizedValue) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phone_number: 'Can only contain numbers.',
            }));
            return
        }

        setFormData({
            ...formData,
            phone_number: sanitizedValue,
        });
    };

    const fetchRegions = async () => {
        try {
            const res = await fetch('http://api.geonames.org/childrenJSON?geonameId=1694008&username=nico_183');
            const data = await res.json();
            if (data?.geonames) {
                // const regionsData = data.geonames.map(region => ({
                //     code: region.geonameId,
                //     name: region.name,
                // }));
                setRegions(data.geonames);
            }
        } catch (err) {
            console.error("Error fetching regions:", err);
        }
    };

    const handleRegionChange = async (e) => {
        const region = e.target.value
        const selectedOption = e.target.selectedOptions[0]
        const regionCode = selectedOption.getAttribute('data-code')

        console.log(region, regionCode)

        try {
            const res = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${regionCode}&username=nico_183`);
            if (!res.ok) {
                throw new Error('An error occured while getting the list of provinces. You may check your Internet connection and refresh.')
            }
            const data = await res.json();
    
            setProvinces(data.geonames);
        } catch (err) {
            showError(err)
        }

        setFormData({...formData, 
            region: region,
            region_code: regionCode,
            province: '',
            province_code: '',
            city: '',
            city_code: '',
            barangay: '',
            barangay_code: ''
        })
        setCities([])
        setBarangays([])

        // const selectedRegion = event.target.value;
        // const regionObject = regions.find((region) => region.name === selectedRegion);
        // console.log(regionObject);
    
        // if (regionObject) {
            // const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${regionObject.code}&username=nico_183`);
            // const data = await response.json();
            // console.log("Selected Region Object: ", regionObject);
    
            // setProvinces(data.geonames);
            // setFormData({ ...formData, region: selectedRegion });
        // } else {
        //     console.error("Region not found.");
        // }
    };

    const handleProvinceChange = async (event) => {
        const province = event.target.value
        const selectedOption = event.target.selectedOptions[0]
        const provinceCode = selectedOption.getAttribute('data-code')

        console.log(province, provinceCode)

        try {
            const res = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${provinceCode}&username=nico_183`);
            if (!res.ok) {
                throw new Error('An error occured while getting the list of cities/municipalities. You may check your Internet connection and refresh.')
            }
            const data = await res.json();
    
            setCities(data.geonames);
        } catch (err) {
            showError(err)
        }

        setFormData({...formData, 
            province: province,
            province_code: provinceCode,
            city: '',
            city_code: '',
            barangay: '',
            barangay_code: ''
        })
        setBarangays([])

        // const selectedProvince = event.target.value;
        // const provinceObject = provinces.find((province) => province.name === selectedProvince);
        // console.log('Selected Province:', selectedProvince);
        // console.log('Province Object:', provinceObject);
    
        // try {
        //     const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${provinceObject.geonameId}&username=nico_183`);
        //     const data = await response.json();
        //     console.log("Cities API Response:", data); // Log the full response

        //     if (data.geonames && data.geonames.length > 0) {
        //         setCities(data.geonames);
        //         setFormData({ ...formData, province: selectedProvince });
        //     } else {
        //         console.error("No cities found for this province.");
        //     }
        // } catch (error) {
        //     console.error("Error fetching cities:", error);
        // }
    };    
    
    const handleCityChange = async (event) => {
        const city = event.target.value
        const selectedOption = event.target.selectedOptions[0]
        const cityCode = selectedOption.getAttribute('data-code')

        console.log(city, cityCode)

        try {
            const res = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${cityCode}&username=nico_183`);
            if (!res.ok) {
                throw new Error('An error occured while getting the list of barangays. You may check your Internet connection and refresh.')
            }
            const data = await res.json();
    
            setBarangays(data.geonames);
        } catch (err) {
            showError(err)
        }

        setFormData({...formData, 
            city: city,
            city_code: cityCode,
            barangay: '',
            barangay_code: ''
        })

        // const selectedCity = event.target.value;
        // const cityObject = cities.find((city) => city.name === selectedCity);
    
        // if (cityObject) {
        //     const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${cityObject.geonameId}&username=nico_183`);
        //     const data = await response.json();
        //     console.log(data);
    
        //     setBarangays(data.geonames);
        //     setFormData({ ...formData, city: selectedCity });
        // } else {
        //     console.error("City not found.");
        // }
    }

    const handleBarangayChange = async (event) => {
        const barangay = event.target.value
        const selectedOption = event.target.selectedOptions[0]
        const barangayCode = selectedOption.getAttribute('data-code')

        setFormData({...formData,
            barangay: barangay,
            barangay_code: barangayCode
        })
    }

    const handleConfirm = (e) => {
        e.preventDefault();
    
        let newErrors = {};
        let formIsValid = true;
    
        setErrors({});

        if (formData.first_name.trim() === "") {
            newErrors.first_name = 'This field is required.';
            formIsValid = false;
        }

        if (formData.last_name.trim() === "") {
            newErrors.last_name = 'This field is required.';
            formIsValid = false;
        }

        if (formData.sex.trim() === "") {
            newErrors.sex = 'This field is required.';
            formIsValid = false;
        }

        if (formData.birthdate.trim() === "") {
            newErrors.birthdate = 'This field is required.';
            formIsValid = false;
        } else {
            if (new Date(formData.birthdate) < new Date("1908-01-01")) {
                newErrors.birthdate = 'Birthdate cannot be earlier than January 1, 1908.';
                formIsValid = false;
            } else if (new Date(formData.birthdate) > new Date()) {
                newErrors.birthdate = 'Birthdate cannot be in the future.';
                formIsValid = false;
            }
        }

        if (formData.civil_status.trim() === "") {
            newErrors.civil_status = 'This field is required.';
            formIsValid = false;
        }

        if (formData.house_number.trim() === "") {
            newErrors.house_number = 'This field is required.';
            formIsValid = false;
        }

        if (formData.barangay.trim() === "") {
            newErrors.barangay = 'This field is required.';
            formIsValid = false;
        }

        if (formData.city.trim() === "") {
            newErrors.city = 'This field is required.';
            formIsValid = false;
        }

        if (formData.province.trim() === "") {
            newErrors.barangay = 'This field is required.';
            formIsValid = false;
        }
    
        if (formData.email_username.trim() != "") {
            const emailUsername = formData.email_username;
        
            // Check if email starts with invalid character or has consecutive dots
            if (emailUsername.startsWith('.') || emailUsername.startsWith('+')) {
              newErrors.email = 'Must start with a letter or number.';
              formIsValid = false;
            } else if (/\.\./.test(emailUsername)) {
              newErrors.email = 'Consecutive periods are not valid.';
              formIsValid = false;
            }
        
            // Check if the last character is not an ASCII letter or number
            if (!/[a-z0-9]$/.test(emailUsername)) {
              newErrors.email = 'Email username must end with a letter or number.';
              formIsValid = false;
            }

            if (emailUsername.length < 6 || emailUsername.length > 30) {
                newErrors.email = 'Email username must be between 6 to 30 characters.';
                formIsValid = false;
            }
        }

        if (formData.postal_code.trim() !== "" && (Number (formData.postal_code) < 1000 || Number (formData.postal_code) > 9999)) {
            newErrors.postal_code = 'Postal code must only range between 1000-9999';
        }
    
        if (formData.phone_number.length !== 10) {
            newErrors.phone_number = 'Please enter a valid phone number.';
            formIsValid = false;
        }
    
        if (!termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms and conditions.';
            formIsValid = false;
        }

        if (!formIsValid) {
            setErrors(newErrors);
            console.log(newErrors)
            return
        }

        setShowConfirmation(true)
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        setShowConfirmation(false)

        setLoading(true);

        try {
            const filteredFormData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => value !== '')
            );

            const res = await fetch('/api/registrations', {
                method: 'POST',
                body: JSON.stringify(filteredFormData),
            });

            if(!res.ok) {
                throw new Error("Something went wrong. Please try again later.")
            }

            const data = await res.json()

            setRegistrationId(data.registration_id);
            resetForm()
            setShowSuccess(true)
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowTerms(false);
            }
        };

        if (showTerms) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showTerms, setShowTerms]);

    const handleClose = () => {
        setShowSuccess(false);
        navigate("/");
    };

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    return (
        <>
            { loading && (
                <div className='z-20 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
                    <BounceLoader className='' loading={loading} size={60} color='#6CB6AD' />
                </div>
            )}

            <div className="min-h-screen grid place-items-center lg:p-16 p-8 bg-cover bg-center bg-[url('assets/images/bg_nurse_transparent.png')]">
                <div className="grid grid-cols-1 md:grid-cols-5 bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
                    <div className="hidden md:block bg-cover bg-center col-span-2" style={{ backgroundImage: `url(${bg_nurse})` }}></div>

                    <div className="p-8 lg-p-10 pb-10 bg-gray-100 col-span-3">
                        <div className="flex justify-center items-center mb-4">
                            <img src={logo} alt="Carmona Hospital Logo" className="h-20" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Patient Registration Form</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        First Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border border-black p-2 rounded-md"
                                        required
                                    />
                                    {errors.first_name && (<p className="text-red-500 text-sm">{errors.first_name}</p>)}
                                </div>

                                {/* Middle Name */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="middle_name"
                                        value={formData.middle_name}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border border-black p-2 rounded-md"
                                    />
                                    {errors.middle_name && (<p className="text-red-500 text-sm">{errors.middle_name}</p>)}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Last Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border border-black p-2 rounded-md"
                                        required
                                    />
                                    {errors.last_name && (<p className="text-red-500 text-sm">{errors.last_name}</p>)}
                                </div>

                                {/* Suffix */}
                                <div>
                                    <label className="block text-sm font-medium">Suffix</label>
                                    <select
                                        name="suffix"
                                        value={formData.suffix}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
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
                                        Sex <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                        required
                                    >
                                        <option value="">Select Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.sex && (<p className="text-red-500 text-sm">{errors.sex}</p>)}
                                </div>

                                {/* Birthdate */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Birthdate <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border p-2 rounded-md border-black"
                                        required
                                    />
                                    {errors.birthdate && (<p className="text-red-500 text-sm">{errors.birthdate}</p>)}
                                </div>

                                {/* Birthplace */}
                                <div> 
                                    <label className="block text-sm font-medium">
                                        Birthplace <span className="text-red-600">*</span> <span className='text-gray-700'>(City, Province)</span> 
                                    </label>
                                    <input 
                                        type="text" 
                                        name="birthplace" 
                                        className="mt-1 block w-full border p-2 rounded-md border-black" 
                                        value={formData.birthplace} 
                                        onChange={(e) => {handleChange(e)}}
                                        required
                                    />
                                    {errors.birthplace && (<p className="text-red-500 text-sm">{errors.birthplace}</p>)}
                                </div>

                                {/* Civil Status */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Civil Status <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="civil_status"
                                        value={formData.civil_status}
                                        onChange={(e) => {handleChange(e)}}
                                        className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    {errors.civil_status && (<p className="text-red-500 text-sm">{errors.civil_status}</p>)}
                                </div>

                                {/* Region */}
                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium">
                                        Region <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        id="region"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleRegionChange}
                                        className="mt-1 block w-full border p-2.5 rounded-md bg-white border-black"
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
                                    <label htmlFor="province" className="block text-sm font-medium">
                                        Province <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        id="province"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleProvinceChange}
                                        className="mt-1 block w-full border p-2.5 rounded-md bg-white border-black"
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
                                    <label htmlFor="city" className="block text-sm font-medium">
                                        City/Municipality <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        className="mt-1 block w-full border p-2.5 rounded-md bg-white border-black"
                                        
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
                                    <label htmlFor="barangay" className="block text-sm font-medium">
                                        Barangay <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        id="barangay"
                                        name="barangay"
                                        value={formData.barangay}
                                        onChange={(e) => handleBarangayChange(e)}
                                        className="mt-1 block w-full border p-2.5 rounded-md bg-white border-black"
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
                                        className="mt-1 block w-full border p-2 rounded-md border-black" 
                                        value={formData.street} 
                                        onChange={(e) => {handleChange(e)}}
                                    />
                                    {errors.street && (<p className="text-red-500 text-sm">{errors.street}</p>)}
                                </div>

                                {/* House Number */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        House Number <span className="text-red-600">*</span> <span className='text-gray-700'>(or Blk, Phase)</span> 
                                    </label>
                                    <input
                                        type="text"
                                        name="house_number"
                                        placeholder="House Number"
                                        className="mt-1 block w-full border p-2 rounded-md border-black"
                                        value={formData.house_number}
                                        onChange={(e) => {handleChange(e)}}
                                        required
                                    />
                                    {errors.house_number && (<p className="text-red-500 text-sm">{errors.house_number}</p>)}
                                </div>

                                {/* Postal Code */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Postal Code 
                                    </label>
                                    <input 
                                        type="text" 
                                        name="postal_code" 
                                        className="mt-1 block w-full border p-2 rounded-md border-black" 
                                        value={formData.postal_code} 
                                        maxLength="4"
                                        minLength="4"
                                        onChange={(e) => {handleChange(e)}}
                                    />
                                    {errors.postal_code && (<p className="text-red-500 text-sm">{errors.postal_code}</p>)}
                                </div>

                                {/* Religion */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Religion
                                    </label>
                                    <select
                                        name="religion"
                                        className="mt-1 block w-full border p-2 rounded-md bg-white border-black"
                                        value={formData.religion}
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
                                    {errors.religion && (<p className="text-red-500 text-sm">{errors.religion}</p>)}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Phone Number <span className="text-red-600">*</span>
                                    </label>
                                    <div className="relative">
                                        {/* Phone number container */}
                                        <div className="flex items-center border rounded-md border-black overflow-hidden">
                                            <span className="bg-gray-100 p-2">+63</span>
                                            {/* Input field */}
                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={formData.phone_number}
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
                                        {/* Username Input */}
                                        <input
                                            type="email"
                                            name="email_username"
                                            placeholder="Email"
                                            className="w-full p-2 focus:outline-none border-r border-r-black"
                                            value={formData.email_username}
                                            onChange={(e) => {handleChange(e)}}
                                        />
                                        <span className="bg-gray-100 p-2">@gmail.com</span> {/* Fixed domain */}
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>

                            </div>

                            {/* Terms */}
                            <div>
                                <div className="flex flex-row items-center gap-4 justify-center">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={() => setTermsAccepted(!termsAccepted)}
                                    />

                                    {/* Text */}
                                    <p className="text-sm">
                                        I agree to the <span className="underline text-blue-700 cursor-pointer" onClick={() => {setShowTerms(true)}}>
                                            Terms and Conditions and Privacy Policy
                                        </span>. I understand that my information will be used for registration and verification purposes only, in accordance with data protection
                                        regulations.
                                    </p>
                                </div>
                                {/* Error Message */}
                                {errors.termsAccepted && (
                                    <p className="text-red-500 text-sm mt-2 text-center">{errors.termsAccepted}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={(e) => handleConfirm(e)}
                                className={`col-span-6 w-full bg-[#B43C3A] hover:bg-blue-700 text-white font-bold py-2 rounded-md ${loading && "cursor-not-allowed"}`}
                                disabled={loading}
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>

                {/* Terms and Conditions Message */}
                {showTerms && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                         onClick={() => setShowTerms(false)}    
                    >
                        <div className="bg-white p-8 max-w-[80%] lg:max-w-[40%] max-h-[90vh] w-full rounded-lg shadow-lg overflow-y-auto"
                             onClick={stopPropagation}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Terms and Conditions</h3>
                                <button onClick={() => setShowTerms(false)} className="text-2xl">&times;</button>
                            
                            
                            </div>
                            <div className="space-y-4">
                                <div className='flex gap-4'>
                                    <p className='font-semibold'>1.</p>
                                    <p><span className='font-semibold'>Acceptance of Terms. </span>By using this registration portal, you agree to these Terms and Conditions. These terms govern the collection, processing, and usage of your personal information, which is necessary to facilitate your registration at our hospital.</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='font-semibold'>2.</p>
                                    <p><span className='font-semibold'>Information Collection and Use. </span>You agree to provide accurate and complete information during the registration process. Your information will be used for in-person verification and patient identification purposes. This information will be securely stored and managed in compliance with applicable data protection laws.</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='font-semibold'>3.</p>
                                    <p><span className='font-semibold'>In-Person Verification Requirements. </span>Upon completing your online registration, you will receive a registration ID number. You are required to bring a valid government-issued ID and present the registration ID number to the hospital for in-person verification. Failure to provide these documents may result in delays or inability to complete the registration process.</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='font-semibold'>4.</p>
                                    <p><span className='font-semibold'>Data Privacy and Security.  </span>We are committed to protecting your personal information. All data provided will be stored securely and accessed only by authorized personnel. We will not share your information with any third parties without your consent, except where required by law.</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='font-semibold'>5.</p>
                                    <p><span className='font-semibold'>Limitation and Liability.  </span>The hospital is not responsible for any delays or inconveniences caused by incomplete or inaccurate information provided by you. Additionally, the hospital is not liable for any issues arising from technical failures during the registration process.</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='font-semibold'>6.</p>
                                    <p><span className='font-semibold'>Updates to Terms.  </span>We reserve the right to modify these Terms and Conditions at any time. Updates will be posted on the registration portal, and your continued use of the portal constitutes acceptance of any changes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 max-w-[80%] lg:max-w-[40%] max-h-[90vh] rounded-lg shadow-lg overflow-y-auto">
                            <h3 className="text-xl font-bold text-center mb-4">Confirm Your Details</h3>
                            <div>
                                <div className='grid grid-cols-8 gap-y-2 gap-x-4'>
                                    <p className='col-span-3 font-semibold'>First Name </p>
                                    <p className='col-span-5 break-words'>{formData.first_name}</p>
                                    { formData.middle_name && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Middle Name </p>
                                            <p className='col-span-5 break-words'>{formData.middle_name}</p>
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>Last Name </p>
                                    <p className='col-span-5 break-words'>{formData.last_name}</p>
                                    { formData.suffix && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Suffix </p>
                                            <p className='col-span-5'>{formData.suffix}</p>      
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>Sex </p>
                                    <p className='col-span-5'>{formData.sex}</p>
                                    <p className='col-span-3 font-semibold'>Birthdate </p>
                                    <p className='col-span-5'>{formData.birthdate}</p>
                                    { formData.birthplace && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Birthplace </p>
                                            <p className='col-span-5 break-words'>{formData.birthplace}</p>      
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>Civil Status </p>
                                    <p className='col-span-5'>{formData.civil_status}</p>
                                    <p className='col-span-3 font-semibold'>Region</p>
                                    <p className='col-span-5 break-words'>{formData.region}</p>
                                    <p className='col-span-3 font-semibold'>Province</p>
                                    <p className='col-span-5 break-words'>{formData.province}</p>
                                    <p className='col-span-3 font-semibold'>City</p>
                                    <p className='col-span-5 break-words'>{formData.city}</p>
                                    <p className='col-span-3 font-semibold'>Barangay</p>
                                    <p className='col-span-5 break-words'>{formData.barangay}</p>
                                    { formData.street && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Street</p>
                                            <p className='col-span-5 break-words'>{formData.street}</p>    
                                        </>
                                    )}
                                    <p className='col-span-3 font-semibold'>House No. </p>
                                    <p className='col-span-5 break-words'>{formData.house_number}</p>
                                    <p className='col-span-3 font-semibold'>Phone No. </p>
                                    <p className='col-span-5 break-words'>{formData.phone_number}</p>
                                    { formData.email && (
                                        <>
                                            <p className='col-span-3 font-semibold'>Email </p>
                                            <p className='col-span-5 break-words'>{formData.email}</p>
                                        </>
                                    )}
                                </div>
                                <div className='flex justify-center items-center gap-4 mt-6'>
                                    <button onClick={(e) => handleSubmit(e)} className='text-white bg-[#408e85]  hover:bg-blue-700 px-4 py-2 rounded-md'>Continue</button>
                                    <button onClick={() => setShowConfirmation(false)} className='text-white bg-[#B43C3A] px-4 py-2 rounded-md'>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showSuccess && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 max-w-[80%] w-full lg:max-w-[30%] max-h-[90vh] rounded-lg shadow-lg overflow-y-auto relative">
                            <button onClick={handleClose} className="text-2xl absolute right-6 top-6">&times;</button>
                            <i className='bi bi-check-circle text-[#44b85a] text-6xl text-center block mb-4'></i>
                            <h3 className="text-xl font-bold text-center mb-2">Registration Successful!</h3>
                            <div className='text-center'>
                                <p>Your registration is now complete.</p>
                                <p className='mb-4'>Thank you for registering.</p>
                                <p>Here is your registration ID:</p>
                                <p className='text-2xl font-bold tracking-widest mb-4'>{registrationId}</p>
                                <p className='w-[90%] mx-auto'>Make sure to screenshot this or write the registration ID on your note.</p>
                                <p className='font-bold mt-4'>Next Step:</p>
                                <p>Visit Carmona Hospital and Medical Center's Outpatient Department (3rd Floor) for in-person verification. Bring a valid government-issued ID and present the registration ID above.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default RegistrationPage;
