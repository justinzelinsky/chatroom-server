const { isEmail } = require('utils');

function validateUpdateInput ({ email = '', name = '' }) {
  let error = '';

  if (!email) {
    error = 'Email field is required';
  } else if (!isEmail(email)) {
    error = 'Email is invalid';
  } else if (!name) {
    error = 'Name field is required';
  }

  const isValid = error === '';

  return {
    error,
    isValid
  };
}

module.exports = validateUpdateInput;
