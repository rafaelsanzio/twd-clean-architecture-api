/* eslint-disable quotes */
module.exports = {
  preset: '@shelf/jest-mongodb',
  roots: ['<rootDir>/test'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/test/**', '!**/config/**'],
  testEnvironment: 'node',
  transform: {
    // eslint-disable-next-line comma-dangle
    '^.+\\.ts$': 'ts-jest'
    // eslint-disable-next-line comma-dangle
  },
  // eslint-disable-next-line semi
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  }
}
