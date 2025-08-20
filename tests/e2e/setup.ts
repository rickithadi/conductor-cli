import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

// Global test setup for E2E tests
beforeAll(async () => {
  console.log('🧪 Setting up E2E test environment...');
  
  // Ensure test directories exist
  const testDirs = [
    'tests/e2e/results',
    'tests/e2e/screenshots',
    'tests/e2e/temp'
  ];
  
  for (const dir of testDirs) {
    await fs.ensureDir(path.join(__dirname, '../../', dir));
  }
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.CONDUCTOR_TEST_MODE = 'true';
  process.env.CONDUCTOR_LOG_LEVEL = 'error'; // Reduce noise in tests
  
  console.log('✅ E2E test environment ready');
}, 30000);

afterAll(async () => {
  console.log('🧹 Cleaning up E2E test environment...');
  
  // Clean up test artifacts older than 1 day
  const tempDir = path.join(__dirname, 'temp');
  if (await fs.pathExists(tempDir)) {
    const items = await fs.readdir(tempDir);
    const now = Date.now();
    
    for (const item of items) {
      const itemPath = path.join(tempDir, item);
      const stats = await fs.stat(itemPath);
      const ageInMs = now - stats.mtime.getTime();
      const ageInHours = ageInMs / (1000 * 60 * 60);
      
      if (ageInHours > 24) {
        await fs.remove(itemPath);
        console.log(`🗑️ Removed old test artifact: ${item}`);
      }
    }
  }
  
  console.log('✅ E2E test cleanup complete');
});

// Custom matchers for better CLI testing
expect.extend({
  toContainSuccessMessage(received: string) {
    const successPatterns = [
      /✅.*complete/i,
      /🎉.*success/i,
      /✨.*ready/i,
      /success/i
    ];
    
    const pass = successPatterns.some(pattern => pattern.test(received));
    
    if (pass) {
      return {
        message: () => `Expected output not to contain success message, but it did`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected output to contain a success message, but it didn't`,
        pass: false,
      };
    }
  },

  toContainErrorMessage(received: string) {
    const errorPatterns = [
      /❌.*error/i,
      /error/i,
      /failed/i,
      /failure/i
    ];
    
    const pass = errorPatterns.some(pattern => pattern.test(received));
    
    if (pass) {
      return {
        message: () => `Expected output not to contain error message, but it did`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected output to contain an error message, but it didn't`,
        pass: false,
      };
    }
  },

  toHaveValidConfiguration(received: any) {
    const requiredFields = ['version', 'projectType', 'agents'];
    const missingFields = requiredFields.filter(field => !received.hasOwnProperty(field));
    
    if (missingFields.length === 0 && Array.isArray(received.agents)) {
      return {
        message: () => `Expected configuration to be invalid, but it was valid`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected valid configuration but missing fields: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
  },

  toCompleteWithinTime(received: number, expectedMaxMs: number) {
    const pass = received <= expectedMaxMs;
    
    if (pass) {
      return {
        message: () => `Expected operation to take more than ${expectedMaxMs}ms, but it completed in ${received}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected operation to complete within ${expectedMaxMs}ms, but it took ${received}ms`,
        pass: false,
      };
    }
  }
});

// Type declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainSuccessMessage(): R;
      toContainErrorMessage(): R;
      toHaveValidConfiguration(): R;
      toCompleteWithinTime(expectedMaxMs: number): R;
    }
  }
}