/* eslint-disable quotes */
module.exports = {
  roots: ['<rootDir>/test'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/test/**', '!**/config/**'],
  testEnvironment: 'node',
  transform: {
    // eslint-disable-next-line comma-dangle
    '^.+\\.ts$': 'ts-jest'
    // eslint-disable-next-line comma-dangle
  }
  // eslint-disable-next-line semi
}
