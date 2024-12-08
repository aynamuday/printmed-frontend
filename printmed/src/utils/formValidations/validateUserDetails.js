import { capitalizedWords } from "../wordUtils";

export const validateUserDetails = (e, setErrors, setFormData, formData) => {
    const { name, value } = e.target

    const capitalizedValue = (name != "suffix" && name != "role" && name != "email_username") ? capitalizedWords(value) : value

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  
    // letters only
    if ((name === 'first_name' || name === 'middle_name' || name === 'last_name') && /[^a-zA-Z\s]/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Cannot contain numbers or special characters.',
      }));
      return;
    }

    if (name === 'personnel_number_input') {
      setErrors((prevData) => ({
        ...prevData,
        personnel_number: '',
      }));
  
      // numbers only
      if (!/^\d*$/.test(value)) {
        setErrors((prevData) => ({
          ...prevData,
          personnel_number: 'Can only contain numbers.',
        }));
        return
      }
  
      setFormData({
          ...formData,
          personnel_number_input: value,
          personnel_number: "PN-" +  value,
      })
      return
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
}