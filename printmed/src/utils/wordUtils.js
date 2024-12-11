export const capitalizedWords = (word) => {
    return word
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
}