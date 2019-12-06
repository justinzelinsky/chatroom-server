const { isEmail } = require('utils');

const validateLoginInput = ({ email = '', password = '' }) => {
  let error = '';

  if (!email) {
    error = 'Email field is required';
  } else if (!isEmail(email)) {
    error = 'Email is invalid';
  } else if (!password) {
    error = 'Password field is required';
  }

  return { error, isValid: error === '' };
};

module.exports = validateLoginInput;
