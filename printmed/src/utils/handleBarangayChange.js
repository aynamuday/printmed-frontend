export const handleBarangayChange = (e, setFormData) => {
    const barangay = e.target.value
    const selectedOption = e.target.selectedOptions[0]
    const barangayCode = selectedOption.getAttribute('data-code')

    setFormData((formData) => ({...formData,
        barangay: barangay,
        barangay_code: barangayCode
    }))
}