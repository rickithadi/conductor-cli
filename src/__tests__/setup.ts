// Jest setup file for UX components tests
import 'jest';

// Global test setup
beforeAll(() => {
  // Mock process.exit to prevent tests from actually exiting
  jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit was called');
  });

  // Mock setTimeout and setInterval for consistent test behavior
  jest.spyOn(global, 'setTimeout');
  jest.spyOn(global, 'setInterval');
  jest.spyOn(global, 'clearTimeout');
  jest.spyOn(global, 'clearInterval');
});

// Global test teardown
afterAll(() => {
  jest.restoreAllMocks();
});

// Mock console methods globally to reduce noise in tests
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'clear').mockImplementation(() => {});
  jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllTimers();
});

// Custom matchers for better testing
expect.extend({
  toContainEmoji(received: string) {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const pass = emojiRegex.test(received);
    
    return {
      message: () => `expected ${received} to ${pass ? 'not ' : ''}contain emoji`,
      pass
    };
  },

  toBeValidTimestamp(received: any) {
    const date = new Date(received);
    const pass = !isNaN(date.getTime()) && date.getTime() > 0;
    
    return {
      message: () => `expected ${received} to ${pass ? 'not ' : ''}be a valid timestamp`,
      pass
    };
  },

  toHaveStatusIcon(received: string, expectedStatus: string) {
    const statusIcons = {
      idle: '⚫',
      thinking: '🤔',
      analyzing: '🔍',
      ready: '✅',
      error: '❌'
    };
    
    const expectedIcon = statusIcons[expectedStatus as keyof typeof statusIcons];
    const pass = received.includes(expectedIcon);
    
    return {
      message: () => `expected ${received} to ${pass ? 'not ' : ''}contain status icon ${expectedIcon} for status ${expectedStatus}`,
      pass
    };
  }
});

// Add type declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainEmoji(): R;
      toBeValidTimestamp(): R;
      toHaveStatusIcon(expectedStatus: string): R;
    }
  }
}

// Mock fs-extra globally for file system operations
jest.mock('fs-extra', () => ({
  ensureDir: jest.fn().mockResolvedValue(undefined),
  writeJson: jest.fn().mockResolvedValue(undefined),
  readJson: jest.fn().mockResolvedValue({}),
  writeFile: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue(''),
  pathExists: jest.fn().mockResolvedValue(true),
  remove: jest.fn().mockResolvedValue(undefined),
  chmod: jest.fn().mockResolvedValue(undefined)
}));

// Mock inquirer for interactive prompts
jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({
    projectType: 'nextjs',
    primaryGoal: 'feature',
    enabledAgents: ['frontend', 'backend'],
    enableVSCodeIntegration: true,
    enableDashboard: true,
    experienceLevel: 'intermediate'
  })
}));

// Mock chalk for colored output
jest.mock('chalk', () => ({
  red: jest.fn((text) => text),
  green: jest.fn((text) => text),
  blue: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
  cyan: jest.fn((text) => text),
  gray: jest.fn((text) => text),
  white: jest.fn((text) => text),
  dim: jest.fn((text) => text),
  bold: jest.fn((text) => text),
  underline: jest.fn((text) => text)
}));

// Helper functions for tests
export const createMockProject = (overrides: any = {}) => ({
  framework: 'nextjs',
  language: 'typescript',
  packageManager: 'npm',
  hasDatabase: false,
  hasAuthentication: false,
  hasAPI: true,
  hasTesting: true,
  hasLinting: true,
  hasTypeScript: true,
  hasAuth: false,
  hasTests: true,
  dependencies: ['react', 'next', 'typescript'],
  devDependencies: ['@types/node', 'jest'],
  scripts: { dev: 'next dev', build: 'next build' },
  rootPath: '/test/project',
  ...overrides
});

export const createMockAgent = (overrides: any = {}) => ({
  name: '@frontend',
  role: 'Frontend Developer',
  expertise: ['React', 'Next.js', 'TypeScript'],
  technicalStack: ['typescript', 'nextjs'],
  specialInstructions: [],
  ...overrides
});

export const waitForAsync = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTimers = () => {
  jest.useFakeTimers();
  return () => jest.useRealTimers();
};

export const captureConsoleOutput = () => {
  const logs: string[] = [];
  const errors: string[] = [];
  
  const logSpy = jest.spyOn(console, 'log').mockImplementation((...args) => {
    logs.push(args.join(' '));
  });
  
  const errorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
    errors.push(args.join(' '));
  });
  
  return {
    logs,
    errors,
    restore: () => {
      logSpy.mockRestore();
      errorSpy.mockRestore();
    }
  };
};

export const mockBlessedComponents = () => {
  const mockScreen = {
    append: jest.fn(),
    render: jest.fn(),
    key: jest.fn(),
    remove: jest.fn()
  };
  
  const mockBox = {
    setContent: jest.fn(),
    key: jest.fn(),
    focus: jest.fn()
  };
  
  const mockLog = {
    ...mockBox,
    log: jest.fn(),
    clear: jest.fn()
  };
  
  jest.doMock('blessed', () => ({
    screen: jest.fn(() => mockScreen),
    box: jest.fn(() => mockBox),
    log: jest.fn(() => mockLog)
  }));
  
  return { mockScreen, mockBox, mockLog };
};