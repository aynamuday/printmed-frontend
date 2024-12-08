export const validatePhoneNumber = (e, setErrors, setFormData, formData) => {
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