const ERROR = 2;
const OFF = 0;

module.exports = {
  env: {
    node: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: [
    'jest'
  ],
  rules: {
    'space-before-function-paren': ['error', 'always'],
    'keyword-spacing': ERROR,
    'no-trailing-spaces': ERROR,
    indent: [ERROR, 2, { SwitchCase: 1 }],
    'linebreak-style': [ERROR, 'unix'],
    quotes: [ERROR, 'single'],
    semi: [ERROR, 'always'],
    'object-curly-spacing': [ERROR, 'always'],
    'no-console': OFF,
    'node/no-missing-require': [ERROR, {
      resolvePaths: ['./src/']
    }]
  }
};
