export const validateEmail = (emailUsername) => {
    // Check if email starts with invalid character or has consecutive dots
    if (emailUsername.startsWith('.') || emailUsername.startsWith('+')) {
        return 'Must start with a letter or number.'
    } 
    
    if (/\.\./.test(emailUsername)) {
        return 'Consecutive periods are not valid.';
    }

    // Check if the last character is not an ASCII letter or number
    if (!/[a-z0-9]$/.test(emailUsername)) {
        return 'Email username must end with a letter or number.';
    }

    if (emailUsername.length < 6 || emailUsername.length > 30) {
        return 'Email username must be between 6 to 30 characters.';
    }
    
    return ""
}