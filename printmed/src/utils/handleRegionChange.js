export const handleRegionChange = async (e, setFormData, setCities, setBarangays) => {
    const region = e.target.value
    const selectedOption = e.target.selectedOptions[0]
    const regionCode = selectedOption.getAttribute('data-code')

    setFormData((formData) => ({...formData, 
        region: region,
        region_code: regionCode,
        province: '',
        province_code: '',
        city: '',
        city_code: '',
        barangay: '',
        barangay_code: ''
    }))
    setCities([])
    setBarangays([])
}