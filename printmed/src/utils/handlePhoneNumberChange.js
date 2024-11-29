export const handlePhoneNumberChange = (e, setData, setErrors) => {
    console.log("hello")
    let value = e.target.value;

    setErrors((prevErrors) => ({ ...prevErrors, phone_number: '' }));
  
    if (!/^\d*$/.test(value)) {
      return;
    }
  
    if (value.length === 1 && value !== '0') {
      value = '09' + value;
    }
  
    if (value.length < 3) {
      value = '09';
    }
  
    if (value.length > 11) {
      return;
    }
  
    setData((prevData) => ({
      ...prevData,
      phone_number: value,
    }));
};