module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage/',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js'],
  setupFiles: ['<rootDir>/setupJest.js'],
  testMatch: ['/**/*.test.js'],
  verbose: true
};
