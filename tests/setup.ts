// Jest setup file for test environment configuration

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Set test timeout
jest.setTimeout(10000);

// Mock process.exit to prevent tests from actually exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
  throw new Error(`process.exit called with code ${code}`);
});

// Mock process.stdout.write to prevent output during tests
jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
jest.spyOn(process.stderr, 'write').mockImplementation(() => true);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Export empty object to make this a module
export {};