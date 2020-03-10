const { isEmail } = require('utils');

function validateUpdateInput({ email = '', name = '' }) {
  let error = '';

  if (!email) {
    error = 'Email field is required';
  } else if (!isEmail(email)) {
    error = 'Email is invalid';
  } else if (!name) {
    error = 'Name field is required';
  }

  return {
    error,
    isValid: error === ''
  };
}

module.exports = validateUpdateInput;
