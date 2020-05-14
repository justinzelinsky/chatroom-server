// Credit: https://tylermcginnis.com/validate-email-address-javascript/

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmail(email) {
  return EMAIL_REGEX.test(email);
}

module.exports = isEmail;
