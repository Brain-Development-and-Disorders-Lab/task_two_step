module.exports = {
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { module: 'CommonJS' } }],
  },
  testEnvironment: 'jsdom',
  testRegex: '/tests/unit/.*\\.(test|spec)?\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/node_modules/', '/tests/automated/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
