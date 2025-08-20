// Jest setup file for global test configuration
import 'jest';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console methods for cleaner test output
const originalConsole = console;

beforeAll(() => {
  // Suppress console output during tests unless explicitly needed
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  // Restore console after tests
  global.console = originalConsole;
});

// Global test utilities - extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidColor(): R;
      toBeValidUrl(): R;
      toHaveGoodSEOScore(): R;
    }
  }
  namespace NodeJS {
    interface Global {
      console: any;
    }
  }
}

// Custom matchers for design and SEO testing
expect.extend({
  toBeValidColor(received: string) {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbColorRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const hslColorRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
    
    const isValid = hexColorRegex.test(received) || 
                   rgbColorRegex.test(received) || 
                   hslColorRegex.test(received);
    
    return {
      message: () => `Expected ${received} to be a valid color format`,
      pass: isValid,
    };
  },
  
  toBeValidUrl(received: string) {
    try {
      new URL(received);
      return {
        message: () => `Expected ${received} to be a valid URL`,
        pass: true,
      };
    } catch {
      return {
        message: () => `Expected ${received} to be a valid URL`,
        pass: false,
      };
    }
  },
  
  toHaveGoodSEOScore(received: any) {
    const hasTitle = received.title && received.title.length >= 10 && received.title.length <= 60;
    const hasDescription = received.description && received.description.length >= 120 && received.description.length <= 160;
    const hasKeywords = received.keywords && received.keywords.length > 0;
    const hasStructuredData = received.structuredData !== undefined;
    
    const score = [hasTitle, hasDescription, hasKeywords, hasStructuredData].filter(Boolean).length;
    const isGood = score >= 3;
    
    return {
      message: () => `Expected SEO score to be good (3+/4), got ${score}/4`,
      pass: isGood,
    };
  }
});