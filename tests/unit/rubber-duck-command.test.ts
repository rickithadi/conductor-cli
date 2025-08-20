import { StatusIndicator } from '../../src/ux/status-indicator';

// Mock dependencies
jest.mock('../../src/ux/status-indicator');

describe('Rubber Duck Command', () => {
  let mockStatusIndicator: jest.Mocked<StatusIndicator>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock StatusIndicator
    mockStatusIndicator = {
      start: jest.fn(),
      succeed: jest.fn(),
      fail: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    } as any;
    (StatusIndicator as jest.Mock).mockImplementation(() => mockStatusIndicator);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('conductor rubber-duck', () => {
    it('should start rubber duck session with basic problem', async () => {
      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      expect(rubberDuckCommand).toBeDefined();
      
      const action = (rubberDuckCommand as any)._actionHandler;
      
      await action('My code is not working', {});
      
      expect(StatusIndicator).toHaveBeenCalled();
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🦆 Starting rubber duck session...');
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('🎯 Problem solving session complete!');
    });

    it('should handle voice option', async () => {
      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      const action = (rubberDuckCommand as any)._actionHandler;
      
      await action('My React component renders slowly', { voice: true });
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🦆 Starting rubber duck session...');
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('🎯 Problem solving session complete!');
    });

    it('should handle structured option', async () => {
      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      const action = (rubberDuckCommand as any)._actionHandler;
      
      await action('TypeScript errors everywhere', { structured: true });
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🦆 Starting rubber duck session...');
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('🎯 Problem solving session complete!');
    });

    it('should handle both voice and structured options', async () => {
      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      const action = (rubberDuckCommand as any)._actionHandler;
      
      await action('API authentication failing', { voice: true, structured: true });
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🦆 Starting rubber duck session...');
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('🎯 Problem solving session complete!');
    });
  });

  describe('rubber-duck command configuration', () => {
    it('should have correct command description', () => {
      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      
      expect(rubberDuckCommand.description()).toBe('🦆 Traditional rubber ducking with AI feedback');
    });

    it('should have all expected options', () => {
      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      const options = (rubberDuckCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--voice');
      expect(optionNames).toContain('--structured');
    });

    it('should require problem parameter', () => {
      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      
      // Check that the command has the required argument
      expect(rubberDuckCommand._args).toHaveLength(1);
      expect(rubberDuckCommand._args[0].required).toBe(true);
      expect(rubberDuckCommand._args[0].name()).toBe('problem');
    });
  });

  describe('startRubberDuckSession function', () => {
    it('should handle different types of problems', async () => {
      const problems = [
        'My React component is not re-rendering',
        'Database connection keeps timing out',
        'CSS layout is broken on mobile',
        'Unit tests are failing randomly',
        'API returns 500 error intermittently'
      ];

      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      const action = (rubberDuckCommand as any)._actionHandler;

      for (const problem of problems) {
        await action(problem, {});
        expect(mockStatusIndicator.start).toHaveBeenCalledWith('🦆 Starting rubber duck session...');
        expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('🎯 Problem solving session complete!');
      }

      expect(mockStatusIndicator.start).toHaveBeenCalledTimes(problems.length);
      expect(mockStatusIndicator.succeed).toHaveBeenCalledTimes(problems.length);
    });

    it('should work with complex problem descriptions', async () => {
      const complexProblem = `I have a Next.js application with the following issues:
      1. Pages are loading slowly
      2. Hydration mismatches occur randomly  
      3. Some API routes return stale data
      4. TypeScript compilation takes forever
      Please help me debug these issues step by step.`;

      const { program } = require('../../src/enhanced-cli');
      const rubberDuckCommand = program.commands.find((cmd: any) => cmd.name() === 'rubber-duck');
      const action = (rubberDuckCommand as any)._actionHandler;

      await action(complexProblem, { structured: true });

      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🦆 Starting rubber duck session...');
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('🎯 Problem solving session complete!');
    });
  });
});