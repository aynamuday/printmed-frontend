export const validatePostalCode = (postalCode) => {
    if (Number (postalCode) < 1000 || Number (postalCode) > 9999) {
        return 'Postal code must range between 1000-9999'
    }

    return ''
}