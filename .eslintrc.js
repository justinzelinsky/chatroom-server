module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:node/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 11
  },
  'plugins': [
    'jest'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'space-before-function-paren': ['error', 'always'],
    'keyword-spacing': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'node/no-missing-require': [
      'error',
      {
        resolvePaths: [
          './src'
        ]
      }
    ]
  }
};
