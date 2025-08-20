import { ClaudeLauncher } from '../../src/claude-launcher';
import { ErrorRecovery } from '../../src/ux/error-recovery';
import { ContextualHelp } from '../../src/ux/contextual-help';

// Mock dependencies
jest.mock('../../src/claude-launcher');
jest.mock('../../src/ux/error-recovery');
jest.mock('../../src/ux/contextual-help');

describe('Launch Command', () => {
  let mockClaudeLauncher: jest.Mocked<ClaudeLauncher>;
  let mockErrorRecovery: jest.Mocked<ErrorRecovery>;
  let mockContextualHelp: jest.Mocked<ContextualHelp>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    // Mock ClaudeLauncher
    mockClaudeLauncher = {
      launchWithContext: jest.fn().mockResolvedValue(true)
    } as any;
    (ClaudeLauncher as unknown as jest.Mock).mockImplementation(() => mockClaudeLauncher);

    // Mock ErrorRecovery
    mockErrorRecovery = {
      handleError: jest.fn().mockResolvedValue(undefined)
    } as any;
    (ErrorRecovery as unknown as jest.Mock).mockImplementation(() => mockErrorRecovery);

    // Mock ContextualHelp
    mockContextualHelp = {
      setContext: jest.fn()
    } as any;
    (ContextualHelp as unknown as jest.Mock).mockImplementation(() => mockContextualHelp);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('conductor launch', () => {
    it('should launch Claude with default options', async () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      expect(launchCommand).toBeDefined();
      
      const action = (launchCommand as any)._actionHandler;
      
      await action({});
      
      expect(ClaudeLauncher).toHaveBeenCalled();
      expect(mockClaudeLauncher.launchWithContext).toHaveBeenCalledWith({
        background: undefined,
        verbose: undefined,
        autoSpinAgents: true,
        contextFile: undefined
      });
    });

    it('should launch Claude with background option', async () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const action = (launchCommand as any)._actionHandler;
      
      await action({ background: true });
      
      expect(mockClaudeLauncher.launchWithContext).toHaveBeenCalledWith({
        background: true,
        verbose: undefined,
        autoSpinAgents: true,
        contextFile: undefined
      });
    });

    it('should launch Claude with verbose option', async () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const action = (launchCommand as any)._actionHandler;
      
      await action({ verbose: true });
      
      expect(mockClaudeLauncher.launchWithContext).toHaveBeenCalledWith({
        background: undefined,
        verbose: true,
        autoSpinAgents: true,
        contextFile: undefined
      });
    });

    it('should launch Claude without agents when no-agents option is provided', async () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const action = (launchCommand as any)._actionHandler;
      
      await action({ noAgents: true });
      
      expect(mockClaudeLauncher.launchWithContext).toHaveBeenCalledWith({
        background: undefined,
        verbose: undefined,
        autoSpinAgents: false,
        contextFile: undefined
      });
    });

    it('should launch Claude with custom context file', async () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const action = (launchCommand as any)._actionHandler;
      
      await action({ context: 'custom-context.md' });
      
      expect(mockClaudeLauncher.launchWithContext).toHaveBeenCalledWith({
        background: undefined,
        verbose: undefined,
        autoSpinAgents: true,
        contextFile: 'custom-context.md'
      });
    });

    it('should handle launch failures', async () => {
      mockClaudeLauncher.launchWithContext.mockResolvedValue(false);
      
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const action = (launchCommand as any)._actionHandler;
      
      await action({});
      
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle launch errors gracefully', async () => {
      const error = new Error('Launch failed');
      mockClaudeLauncher.launchWithContext.mockRejectedValue(error);
      
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const action = (launchCommand as any)._actionHandler;
      
      await action({});
      
      expect(mockErrorRecovery.handleError).toHaveBeenCalledWith(error, {
        command: 'launch',
        args: process.argv.slice(3),
        workingDirectory: process.cwd(),
        timestamp: expect.any(Date)
      });
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should set contextual help context for launch command', async () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const action = (launchCommand as any)._actionHandler;
      
      await action({});
      
      expect(mockContextualHelp.setContext).toHaveBeenCalledWith(['launch', 'claude']);
    });
  });

  describe('launch command options', () => {
    it('should have all expected options', () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      const options = (launchCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--background');
      expect(optionNames).toContain('--verbose');
      expect(optionNames).toContain('--no-agents');
      expect(optionNames).toContain('--context');
    });

    it('should have correct command description', () => {
      const { program } = require('../../src/enhanced-cli');
      const launchCommand = program.commands.find((cmd: any) => cmd.name() === 'launch');
      
      expect(launchCommand.description()).toBe('🚀 Launch Claude Code with full AI team integration');
    });
  });
});