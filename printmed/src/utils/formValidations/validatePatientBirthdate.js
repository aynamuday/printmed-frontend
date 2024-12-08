export const validatePatientBirthdate = (birthdate) => {
    if (new Date(birthdate) < new Date("1908-01-01")) {
        return 'Birthdate cannot be earlier than January 1, 1908.'
    } else if (new Date(birthdate) > new Date()) {
        return 'Birthdate cannot be in the future.'
    }

    return ""
}