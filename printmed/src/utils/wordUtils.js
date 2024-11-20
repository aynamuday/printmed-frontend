export const capitalizedWords = (word) => {
    return word
        .split(' ')
        .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}

export const GH = (word) => {
    return word
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};