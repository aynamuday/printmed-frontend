export const validateUserBirthdate = (birthdate) => {
    if (new Date(birthdate) < new Date("1908-01-01")) {
        return 'Birthdate cannot be earlier than January 1, 1908.'
    } else if (new Date(birthdate) > new Date(new Date().setFullYear(new Date().getFullYear() - 18))) {
        return 'User must be at least 18 years old.'
    }

    return ""
}