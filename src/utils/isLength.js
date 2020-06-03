function isLength (str, options) {
  const { min, max } = options;
  return str && str.length >= min && str.length <= max;
}

module.exports = isLength;
