/** @type {import('jest').Config} */
module.exports = {
  displayName: 'E2E Tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/e2e'],
  testMatch: ['**/*.e2e.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: false,
      isolatedModules: true,
      tsconfig: {
        target: 'ES2020',
        module: 'commonjs',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true
      }
    }],
  },
  testTimeout: 60000,
  maxWorkers: 1, // Run E2E tests sequentially to avoid conflicts
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/types/**',
    '!src/stubs/**'
  ],
  coverageDirectory: 'coverage/e2e',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  bail: 1, // Stop on first test failure
  forceExit: true, // Ensure Jest exits cleanly
  detectOpenHandles: true, // Help debug hanging processes
};