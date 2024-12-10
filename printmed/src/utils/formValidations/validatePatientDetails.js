import { capitalizedWords } from "../wordUtils";

export const validatePatientDetails = (e, setErrors, setFormData, formData) => {
    const { name, value } = e.target

    setErrors((prevErrors) => ({...prevErrors, [name]: ''}))
    const capitalizedValue = name !== "email" && name !== "suffix" && name !== "payment_method" && name !== "hmo" ? capitalizedWords(value) : value

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

    if (name == "payment_method" && value != "HMO") {
        setFormData({...formData, hmo: "", [name]: capitalizedValue})
        return
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
            setErrors((prevErrors) => ({...prevErrors, email: "Can only contain letters, numbers, and dot."}))
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