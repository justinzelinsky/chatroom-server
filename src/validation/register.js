const { isEmail, isLength } = require('utils');

const validateRegisterInput = ({
  name = '',
  email = '',
  password = '',
  passwordConfirmation = ''
}) => {
  let error = '';

  if (!name) {
    error = 'Name field is required';
  } else if (!email) {
    error = 'Email field is required';
  } else if (!isEmail(email)) {
    error = 'Email is invalid';
  } else if (!password) {
    error = 'Password field is required';
  } else if (!isLength(password, { min: 6, max: 30 })) {
    error = 'Password must be between 6 and 30 characters';
  } else if (!passwordConfirmation) {
    error = 'Confirm password field is required';
  } else if (password !== passwordConfirmation) {
    error = 'Passwords must match';
  }

  return {
    error,
    isValid: error === ''
  };
};

module.exports = validateRegisterInput;
