import { program } from '../enhanced-cli';
import { EnhancedLaunch } from '../ux/enhanced-launch';
import { StatusIndicator } from '../ux/status-indicator';
import { SmartDashboard } from '../ux/smart-dashboard';

// Mock dependencies
jest.mock('../ux/enhanced-launch');
jest.mock('../ux/status-indicator');
jest.mock('../ux/smart-dashboard');
jest.mock('../context-scanner');
jest.mock('../subagent-generator');
jest.mock('../approval-system');

describe('Enhanced CLI', () => {
  let mockEnhancedLaunch: jest.Mocked<EnhancedLaunch>;
  let mockStatusIndicator: jest.Mocked<StatusIndicator>;
  let mockSmartDashboard: jest.Mocked<SmartDashboard>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    // Mock EnhancedLaunch
    mockEnhancedLaunch = {
      initialize: jest.fn().mockResolvedValue(undefined)
    } as any;
    (EnhancedLaunch as jest.Mock).mockImplementation(() => mockEnhancedLaunch);

    // Mock StatusIndicator
    mockStatusIndicator = {
      start: jest.fn(),
      succeed: jest.fn(),
      fail: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      showTeamStatus: jest.fn().mockResolvedValue(undefined),
      simulateActivity: jest.fn()
    } as any;
    (StatusIndicator as jest.Mock).mockImplementation(() => mockStatusIndicator);

    // Mock SmartDashboard
    mockSmartDashboard = {
      launch: jest.fn().mockResolvedValue(undefined)
    } as any;
    (SmartDashboard as jest.Mock).mockImplementation(() => mockSmartDashboard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('program configuration', () => {
    it('should have correct name and description', () => {
      expect(program.name()).toBe('conductor');
      expect(program.description()).toContain('🦆 Rubber Ducking with AI Experts');
    });

    it('should have correct version', () => {
      expect(program.version()).toBe('1.0.0');
    });
  });

  describe('init command', () => {
    it('should initialize with EnhancedLaunch', async () => {
      const mockParse = jest.spyOn(program, 'parseAsync').mockResolvedValue(program);
      
      // Mock process.argv to simulate command
      process.argv = ['node', 'enhanced-cli.js', 'init'];
      
      await program.parseAsync();
      
      expect(EnhancedLaunch).toHaveBeenCalled();
      expect(mockEnhancedLaunch.initialize).toHaveBeenCalled();
    });

    it('should pass options to EnhancedLaunch', async () => {
      // Mock the command execution directly
      const initCommand = program.commands.find(cmd => cmd.name() === 'init');
      expect(initCommand).toBeDefined();
      
      const action = (initCommand as any)._actionHandler;
      
      const options = {
        framework: 'nextjs',
        template: 'basic',
        skipWelcome: true,
        quick: false
      };
      
      await action(options);
      
      expect(mockEnhancedLaunch.initialize).toHaveBeenCalledWith(options);
    });

    it('should handle initialization errors', async () => {
      const error = new Error('Initialization failed');
      mockEnhancedLaunch.initialize.mockRejectedValue(error);
      
      const initCommand = program.commands.find(cmd => cmd.name() === 'init');
      const action = (initCommand as any)._actionHandler;
      
      await expect(action({})).rejects.toThrow('Initialization failed');
    });
  });

  describe('ask command', () => {
    it('should start status indicator for ask command', async () => {
      const askCommand = program.commands.find(cmd => cmd.name() === 'ask');
      expect(askCommand).toBeDefined();
      
      const action = (askCommand as any)._actionHandler;
      
      await action('Test question', {});
      
      expect(StatusIndicator).toHaveBeenCalled();
      expect(mockStatusIndicator.start).toHaveBeenCalledWith(
        '🦆 Rubber ducking with AI experts...'
      );
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith(
        '🎯 Expert consultation complete!'
      );
    });

    it('should launch dashboard when requested', async () => {
      const askCommand = program.commands.find(cmd => cmd.name() === 'ask');
      const action = (askCommand as any)._actionHandler;
      
      await action('Test question', { dashboard: true });
      
      expect(SmartDashboard).toHaveBeenCalled();
      expect(mockSmartDashboard.launch).toHaveBeenCalled();
    });

    it('should have duck alias', () => {
      const duckCommand = program.commands.find(cmd => cmd.alias() === 'duck');
      expect(duckCommand).toBeDefined();
      expect(duckCommand?.name()).toBe('ask');
    });
  });

  describe('explain command', () => {
    it('should start status indicator for explain command', async () => {
      const explainCommand = program.commands.find(cmd => cmd.name() === 'explain');
      expect(explainCommand).toBeDefined();
      
      const action = (explainCommand as any)._actionHandler;
      
      await action('React hooks', {});
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith(
        expect.stringContaining('React hooks')
      );
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith(
        '📚 Expert explanation ready!'
      );
    });

    it('should support various options', () => {
      const explainCommand = program.commands.find(cmd => cmd.name() === 'explain');
      const options = (explainCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--simple');
      expect(optionNames).toContain('--examples');
      expect(optionNames).toContain('--links');
    });
  });

  describe('review command', () => {
    it('should start status indicator for review command', async () => {
      const reviewCommand = program.commands.find(cmd => cmd.name() === 'review');
      expect(reviewCommand).toBeDefined();
      
      const action = (reviewCommand as any)._actionHandler;
      
      await action({});
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith(
        '🔍 Multi-agent code review in progress...'
      );
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith(
        '✅ Code review complete - recommendations ready!'
      );
    });

    it('should have audit alias', () => {
      const auditCommand = program.commands.find(cmd => cmd.alias() === 'audit');
      expect(auditCommand).toBeDefined();
      expect(auditCommand?.name()).toBe('review');
    });

    it('should support file filtering options', () => {
      const reviewCommand = program.commands.find(cmd => cmd.name() === 'review');
      const options = (reviewCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--files');
      expect(optionNames).toContain('--staged');
      expect(optionNames).toContain('--branch');
      expect(optionNames).toContain('--type');
      expect(optionNames).toContain('--watch');
    });
  });

  describe('ship command', () => {
    it('should start status indicator for ship command', async () => {
      const shipCommand = program.commands.find(cmd => cmd.name() === 'ship');
      expect(shipCommand).toBeDefined();
      
      const action = (shipCommand as any)._actionHandler;
      
      await action('my-feature', {});
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith(
        '🚀 Preparing my-feature for shipment...'
      );
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith(
        '🎯 Ready to ship with confidence!'
      );
    });

    it('should support deployment options', () => {
      const shipCommand = program.commands.find(cmd => cmd.name() === 'ship');
      const options = (shipCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--environment');
      expect(optionNames).toContain('--security-scan');
      expect(optionNames).toContain('--performance');
      expect(optionNames).toContain('--accessibility');
      expect(optionNames).toContain('--deploy');
    });
  });

  describe('dashboard command', () => {
    it('should launch SmartDashboard', async () => {
      const dashboardCommand = program.commands.find(cmd => cmd.name() === 'dashboard');
      expect(dashboardCommand).toBeDefined();
      
      const action = (dashboardCommand as any)._actionHandler;
      
      const options = { focus: '@frontend', theme: 'dark' };
      await action(options);
      
      expect(SmartDashboard).toHaveBeenCalled();
      expect(mockSmartDashboard.launch).toHaveBeenCalledWith(options);
    });

    it('should have watch alias', () => {
      const watchCommand = program.commands.find(cmd => cmd.alias() === 'watch');
      expect(watchCommand).toBeDefined();
      expect(watchCommand?.name()).toBe('dashboard');
    });

    it('should support dashboard options', () => {
      const dashboardCommand = program.commands.find(cmd => cmd.name() === 'dashboard');
      const options = (dashboardCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--focus');
      expect(optionNames).toContain('--theme');
      expect(optionNames).toContain('--minimal');
    });
  });

  describe('status command', () => {
    it('should show team status', async () => {
      const statusCommand = program.commands.find(cmd => cmd.name() === 'status');
      expect(statusCommand).toBeDefined();
      
      const action = (statusCommand as any)._actionHandler;
      
      const options = { verbose: true, json: false };
      await action(options);
      
      expect(StatusIndicator).toHaveBeenCalled();
      expect(mockStatusIndicator.showTeamStatus).toHaveBeenCalledWith(options);
    });

    it('should have health alias', () => {
      const healthCommand = program.commands.find(cmd => cmd.alias() === 'health');
      expect(healthCommand).toBeDefined();
      expect(healthCommand?.name()).toBe('status');
    });
  });

  describe('quick-fix command', () => {
    it('should provide quick fixes', async () => {
      const quickFixCommand = program.commands.find(cmd => cmd.name() === 'quick-fix');
      expect(quickFixCommand).toBeDefined();
      
      const action = (quickFixCommand as any)._actionHandler;
      
      await action();
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith(
        '⚡ Analyzing current issues...'
      );
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith(
        '🔧 Quick fixes ready!'
      );
    });
  });

  describe('rubber-duck command', () => {
    it('should start rubber duck session', async () => {
      const rubberDuckCommand = program.commands.find(cmd => cmd.name() === 'rubber-duck');
      expect(rubberDuckCommand).toBeDefined();
      
      const action = (rubberDuckCommand as any)._actionHandler;
      
      await action('My problem', {});
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith(
        '🦆 Starting rubber duck session...'
      );
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith(
        '🎯 Problem solving session complete!'
      );
    });

    it('should support voice and structured options', () => {
      const rubberDuckCommand = program.commands.find(cmd => cmd.name() === 'rubber-duck');
      const options = (rubberDuckCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--voice');
      expect(optionNames).toContain('--structured');
    });
  });

  describe('config command', () => {
    it('should handle configuration management', async () => {
      const configCommand = program.commands.find(cmd => cmd.name() === 'config');
      expect(configCommand).toBeDefined();
      
      const action = (configCommand as any)._actionHandler;
      
      await action({ edit: true });
      
      // Should not throw error
      expect(true).toBe(true);
    });

    it('should support configuration options', () => {
      const configCommand = program.commands.find(cmd => cmd.name() === 'config');
      const options = (configCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--edit');
      expect(optionNames).toContain('--reset');
      expect(optionNames).toContain('--show');
    });
  });

  describe('command validation', () => {
    it('should have all expected commands', () => {
      const commandNames = program.commands.map(cmd => cmd.name());
      
      expect(commandNames).toContain('init');
      expect(commandNames).toContain('ask');
      expect(commandNames).toContain('explain');
      expect(commandNames).toContain('review');
      expect(commandNames).toContain('ship');
      expect(commandNames).toContain('dashboard');
      expect(commandNames).toContain('status');
      expect(commandNames).toContain('config');
      expect(commandNames).toContain('quick-fix');
      expect(commandNames).toContain('rubber-duck');
    });

    it('should have all expected aliases', () => {
      const aliases = program.commands
        .map(cmd => cmd.alias())
        .filter(alias => alias);
      
      expect(aliases).toContain('duck');
      expect(aliases).toContain('audit');
      expect(aliases).toContain('watch');
      expect(aliases).toContain('health');
    });

    it('should have proper command descriptions', () => {
      program.commands.forEach(command => {
        expect(command.description()).toBeTruthy();
        expect(command.description()).toMatch(/^[🎭🦆🔍🚀📊🏥⚙️⚡💡]/); // Should start with emoji
      });
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle uncaught exceptions', () => {
      const error = new Error('Test uncaught exception');
      const errorHandler = process.listeners('uncaughtException').slice(-1)[0] as any;
      
      errorHandler(error);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ Unexpected error occurred:')
      );
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Test uncaught exception')
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle unhandled promise rejections', () => {
      const reason = 'Test rejection';
      const promise = Promise.resolve();
      const rejectionHandler = process.listeners('unhandledRejection').slice(-1)[0] as any;
      
      rejectionHandler(reason, promise);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ Unhandled promise rejection:')
      );
      expect(console.error).toHaveBeenCalledWith('Test rejection');
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should provide helpful error suggestions', () => {
      const error = new Error('Test error');
      const errorHandler = process.listeners('uncaughtException').slice(-1)[0] as any;
      
      errorHandler(error);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('💡 Try running: conductor ask "help with this error"')
      );
    });
  });

  describe('help configuration', () => {
    it('should have proper help configuration', () => {
      const helpConfig = (program as any)._helpConfiguration;
      
      expect(helpConfig.helpWidth).toBe(120);
      expect(helpConfig.sortSubcommands).toBe(true);
    });

    it('should show help after error', () => {
      expect((program as any)._showHelpAfterError).toBe(true);
    });

    it('should have exit override configured', () => {
      expect((program as any)._exitCallback).toBeDefined();
    });
  });

  describe('integration tests', () => {
    it('should initialize and launch dashboard in sequence', async () => {
      // Test init command
      const initCommand = program.commands.find(cmd => cmd.name() === 'init');
      const initAction = (initCommand as any)._actionHandler;
      await initAction({ quick: true });
      
      expect(mockEnhancedLaunch.initialize).toHaveBeenCalledWith({ quick: true });
      
      // Test dashboard command
      const dashboardCommand = program.commands.find(cmd => cmd.name() === 'dashboard');
      const dashboardAction = (dashboardCommand as any)._actionHandler;
      await dashboardAction({});
      
      expect(mockSmartDashboard.launch).toHaveBeenCalledWith({});
    });

    it('should handle ask command with dashboard option', async () => {
      const askCommand = program.commands.find(cmd => cmd.name() === 'ask');
      const action = (askCommand as any)._actionHandler;
      
      await action('Test question', { dashboard: true, agent: '@frontend' });
      
      expect(mockStatusIndicator.start).toHaveBeenCalled();
      expect(mockSmartDashboard.launch).toHaveBeenCalled();
      expect(mockStatusIndicator.succeed).toHaveBeenCalled();
    });

    it('should support chaining of commands conceptually', async () => {
      // This tests that all command handlers work independently
      const commands = [
        { name: 'ask', args: ['Question'], options: {} },
        { name: 'review', args: [], options: {} },
        { name: 'status', args: [], options: {} }
      ];
      
      for (const cmd of commands) {
        const command = program.commands.find(c => c.name() === cmd.name);
        expect(command).toBeDefined();
        
        const action = (command as any)._actionHandler;
        await action(...cmd.args, cmd.options);
      }
      
      // All commands should have executed without error
      expect(mockStatusIndicator.start).toHaveBeenCalledTimes(2); // ask and review
      expect(mockStatusIndicator.showTeamStatus).toHaveBeenCalledTimes(1); // status
    });
  });
});