module.exports = {
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { module: 'CommonJS' } }],
  },
  testEnvironment: 'node',
  testRegex: '/tests/unit/.*\\.(test|spec)?\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/node_modules/', '/tests/automated/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
