export const handleProvinceChange = async (e, setFormData, setBarangays) => {
    const province = e.target.value
    const selectedOption = e.target.selectedOptions[0]
    const provinceCode = selectedOption.getAttribute('data-code')

    setFormData((formData) => ({...formData, 
        province: province,
        province_code: provinceCode,
        city: '',
        city_code: '',
        barangay: '',
        barangay_code: ''
    }))
    setBarangays([])
};    