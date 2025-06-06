module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'], // Look for tests in the src directory
  testMatch: [ // Pattern for test files
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  },
  // Setup file to run before each test suite (optional, e.g., for DB setup/teardown mocks)
  setupFilesAfterEnv: ['<rootDir>/src/testSetup.ts'],
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json paths)
    // Example: '^@/(.*)$': '<rootDir>/src/'
  },
  collectCoverage: true, // Enable coverage collection
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Coverage report formats
  coverageDirectory: 'coverage', // Directory where coverage reports will be saved
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
