const { isEmail } = require('utils');

function validateLoginInput({ email = '', password = '' }) {
  let error = '';

  if (!email) {
    error = 'Email field is required';
  } else if (!isEmail(email)) {
    error = 'Email is invalid';
  } else if (!password) {
    error = 'Password field is required';
  }

  const isValid = error === '';

  return {
    error,
    isValid
  };
}

module.exports = validateLoginInput;
