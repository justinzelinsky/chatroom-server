const ERROR = 2;
const WARN = 1;

module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
    'jest/globals': true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['jest'],
  rules: {
    indent: [ERROR, 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'object-curly-spacing': [ERROR, 'always'],
    'no-trailing-spaces': ['error'],
    'no-console': 0,
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error'
  }
};
