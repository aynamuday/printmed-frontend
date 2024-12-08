export const handleCityChange = async (e, setFormData) => {
    const city = e.target.value
    const selectedOption = e.target.selectedOptions[0]
    const cityCode = selectedOption.getAttribute('data-code')

    setFormData((formData) => ({...formData, 
        city: city,
        city_code: cityCode,
        barangay: '',
        barangay_code: ''
    }))
}