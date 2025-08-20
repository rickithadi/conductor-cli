import { ErrorRecovery } from '../../src/ux/error-recovery';
import chalk from 'chalk';

// Mock dependencies
jest.mock('../../src/ux/error-recovery');
jest.mock('chalk');

describe('Health Command', () => {
  let mockErrorRecovery: jest.Mocked<ErrorRecovery>;
  let mockChalk: jest.Mocked<typeof chalk>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock ErrorRecovery
    mockErrorRecovery = {
      performHealthCheck: jest.fn().mockResolvedValue({
        healthy: true,
        issues: []
      })
    } as any;
    (ErrorRecovery as jest.Mock).mockImplementation(() => mockErrorRecovery);

    // Mock chalk
    mockChalk = {
      yellow: jest.fn().mockReturnValue('mocked-yellow'),
      green: jest.fn().mockReturnValue('mocked-green'),
      red: jest.fn().mockReturnValue('mocked-red'),
      blue: jest.fn().mockReturnValue('mocked-blue')
    } as any;
    (chalk as any).yellow = mockChalk.yellow;
    (chalk as any).green = mockChalk.green;
    (chalk as any).red = mockChalk.red;
    (chalk as any).blue = mockChalk.blue;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('conductor health', () => {
    it('should perform basic health check', async () => {
      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      expect(healthCommand).toBeDefined();
      
      const action = (healthCommand as any)._actionHandler;
      
      await action({});
      
      expect(ErrorRecovery).toHaveBeenCalled();
      expect(mockErrorRecovery.performHealthCheck).toHaveBeenCalled();
    });

    it('should perform health check and attempt fixes when --fix flag is provided', async () => {
      mockErrorRecovery.performHealthCheck.mockResolvedValue({
        healthy: false,
        issues: ['Node modules out of date', 'Missing environment variables'],
        // recommendations removed to match interface
      });

      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const action = (healthCommand as any)._actionHandler;
      
      await action({ fix: true });
      
      expect(mockErrorRecovery.performHealthCheck).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('mocked-yellow');
    });

    it('should not attempt fixes when system is healthy', async () => {
      mockErrorRecovery.performHealthCheck.mockResolvedValue({
        healthy: true,
        issues: [],
        // recommendations removed to match interface
      });

      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const action = (healthCommand as any)._actionHandler;
      
      await action({ fix: true });
      
      expect(mockErrorRecovery.performHealthCheck).toHaveBeenCalled();
      // Should not show fix message when healthy
      expect(mockChalk.yellow).not.toHaveBeenCalled();
    });

    it('should not attempt fixes when --fix flag is not provided', async () => {
      mockErrorRecovery.performHealthCheck.mockResolvedValue({
        healthy: false,
        issues: ['Node modules out of date'],
        // recommendations removed to match interface
      });

      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const action = (healthCommand as any)._actionHandler;
      
      await action({});
      
      expect(mockErrorRecovery.performHealthCheck).toHaveBeenCalled();
      // Should not show fix message when --fix not provided
      expect(mockChalk.yellow).not.toHaveBeenCalled();
    });
  });

  describe('health command configuration', () => {
    it('should have correct command description', () => {
      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      
      expect(healthCommand.description()).toBe('🏥 Run system health check');
    });

    it('should have --fix option', () => {
      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const options = (healthCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--fix');
    });

    it('should have fix option with correct description', () => {
      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const options = (healthCommand as any).options;
      
      const fixOption = options.find((opt: any) => opt.long === '--fix');
      expect(fixOption).toBeDefined();
      expect(fixOption.description).toBe('Attempt automatic fixes');
    });
  });

  describe('health check results', () => {
    it('should handle various health check scenarios', async () => {
      const scenarios = [
        {
          name: 'all systems healthy',
          result: { healthy: true, issues: [], recommendations: [] }
        },
        {
          name: 'minor issues',
          result: { 
            healthy: false, 
            issues: ['Outdated packages'], 
            recommendations: ['Update dependencies'] 
          }
        },
        {
          name: 'major issues',
          result: { 
            healthy: false, 
            issues: ['Missing Node.js', 'Corrupted project files'], 
            recommendations: ['Install Node.js', 'Reinstall project'] 
          }
        }
      ];

      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const action = (healthCommand as any)._actionHandler;

      for (const scenario of scenarios) {
        mockErrorRecovery.performHealthCheck.mockResolvedValue(scenario.result);
        
        await action({});
        
        expect(mockErrorRecovery.performHealthCheck).toHaveBeenCalled();
      }
    });

    it('should handle health check errors gracefully', async () => {
      const error = new Error('Health check failed');
      mockErrorRecovery.performHealthCheck.mockRejectedValue(error);

      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const action = (healthCommand as any)._actionHandler;

      await expect(action({})).rejects.toThrow('Health check failed');
    });
  });

  describe('documented health command usage', () => {
    it('should support documented --fix usage patterns', async () => {
      // Test the patterns documented in README:
      // conductor health --fix
      // conductor health --full-check --auto-fix (this would need to be added)
      
      const { program } = require('../../src/enhanced-cli');
      const healthCommand = program.commands.find((cmd: any) => cmd.name() === 'health');
      const action = (healthCommand as any)._actionHandler;

      mockErrorRecovery.performHealthCheck.mockResolvedValue({
        healthy: false,
        issues: ['System needs repair'],
        // recommendations removed to match interface
      });

      await action({ fix: true });

      expect(mockErrorRecovery.performHealthCheck).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });
});