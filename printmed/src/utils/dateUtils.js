export const getFormattedNumericDate = (dateStamp) => {
    const date = dateStamp ? new Date(dateStamp) : new Date();

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