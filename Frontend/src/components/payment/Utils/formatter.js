export const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
};

export const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
};