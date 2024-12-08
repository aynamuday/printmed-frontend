export const validateEmail = (email) => {
    // Check if email starts with invalid character or has consecutive dots
    if (email.startsWith('.') || email.startsWith('+')) {
        return 'Must start with a letter or number.'
    } 
    
    if (/\.\./.test(email)) {
        return 'Consecutive periods are not valid.';
    }

    // Check if the last character is not an ASCII letter or number
    if (!/[a-z0-9]$/.test(email)) {
        return 'Email username must end with a letter or number.';
    }

    if (email.length < 6 || email.length > 30) {
        return 'Email username must be between 6 to 30 characters.';
    }
    
    return ""
}