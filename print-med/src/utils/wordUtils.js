export const getCapitalizedEachWord = (word) => {
    return word.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
};