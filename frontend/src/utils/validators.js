// Email validation
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Password validation (at least 6 characters)
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Required field validation
export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

// Price validation (positive number)
export const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0;
};

// Form validation
export const validateForm = (values, fields) => {
  const errors = {};
  
  fields.forEach(field => {
    const { name, type, required } = field;
    
    if (required && !validateRequired(values[name])) {
      errors[name] = `${field.label || name} is required`;
      return;
    }
    
    if (values[name]) {
      if (type === 'email' && !validateEmail(values[name])) {
        errors[name] = 'Please enter a valid email address';
      } else if (type === 'password' && !validatePassword(values[name])) {
        errors[name] = 'Password must be at least 6 characters';
      } else if (type === 'price' && !validatePrice(values[name])) {
        errors[name] = 'Please enter a valid price';
      }
    }
  });
  
  return errors;
};
