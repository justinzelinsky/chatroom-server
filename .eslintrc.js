const ERROR = 2;
const WARN = 1;
const OFF = 0;

module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: ['jest'],
  rules: {
    indent: [ERROR, 2],
    'linebreak-style': [ERROR, 'unix'],
    quotes: [ERROR, 'single'],
    semi: [ERROR, 'always'],
    'object-curly-spacing': [ERROR, 'always'],
    'no-trailing-spaces': ['error'],
    'no-console': OFF,
    'jest/no-disabled-tests': WARN,
    'jest/no-focused-tests': ERROR,
    'jest/no-identical-title': ERROR,
    'jest/prefer-to-have-length': WARN,
    'jest/valid-expect': ERROR
  }
};
