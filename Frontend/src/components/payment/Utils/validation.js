export const validateCard = (data) => {
  const errors = {};

  // Card Number validation
  const cardNumberClean = data.cardNumber.replace(/\s/g, '');
  if (!cardNumberClean) {
    errors.cardNumber = 'Card number is required';
  } else if (!/^\d{16}$/.test(cardNumberClean)) {
    errors.cardNumber = 'Invalid card number';
  }

  // Card Holder validation
  if (!data.cardHolder.trim()) {
    errors.cardHolder = 'Cardholder name is required';
  } else if (!/^[a-zA-Z\s]{2,}$/.test(data.cardHolder)) {
    errors.cardHolder = 'Invalid cardholder name';
  }

  // Expiry Date validation
  if (!data.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else {
    const [month, year] = data.expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (!/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)';
    } else if (parseInt(month) < 1 || parseInt(month) > 12) {
      errors.expiryDate = 'Invalid month';
    } else if (
      parseInt(year) < currentYear || 
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      errors.expiryDate = 'Card has expired';
    }
  }

  // CVV validation
  if (!data.cvv) {
    errors.cvv = 'CVV is required';
  } else if (!/^\d{3}$/.test(data.cvv)) {
    errors.cvv = 'Invalid CVV';
  }

  return errors;
};