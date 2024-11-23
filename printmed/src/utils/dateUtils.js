export const getFormattedNumericDate = (dateStamp, addYears = 0) => {
    const date = dateStamp ? new Date(dateStamp) : new Date();

    if (addYears > 0) {
        date.setFullYear(date.getFullYear() + addYears);
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const getFormattedStringDate = (dateStamp) => {
    const date = dateStamp ? new Date(dateStamp).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) 
                            : new Date().toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})

    return date
};

export const hasDatePassed = (dateStamp) => {
    return dateStamp < getFormattedNumericDate()
}