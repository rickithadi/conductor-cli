import { StatusIndicator } from '../../src/ux/status-indicator';
import { SmartDashboard } from '../../src/ux/smart-dashboard';

// Mock dependencies
jest.mock('../../src/ux/status-indicator');
jest.mock('../../src/ux/smart-dashboard');

describe('Plan Launch Command', () => {
  let mockStatusIndicator: jest.Mocked<StatusIndicator>;
  let mockSmartDashboard: jest.Mocked<SmartDashboard>;

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
      warn: jest.fn(),
      startProgress: jest.fn(),
      nextStep: jest.fn()
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

  describe('conductor plan-launch', () => {
    it('should plan launch strategy with basic strategy', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      expect(planLaunchCommand).toBeDefined();
      
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('product-launch', {});
      
      expect(StatusIndicator).toHaveBeenCalled();
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🚀 Planning launch strategy with AI team...');
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('✅ Complete launch strategy ready!');
    });

    it('should handle launch type option', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('feature-launch', { type: 'feature' });
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🚀 Planning launch strategy with AI team...');
    });

    it('should handle audience option', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('campaign-launch', { type: 'campaign', audience: 'developers' });
      
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🚀 Planning launch strategy with AI team...');
    });

    it('should launch dashboard when dashboard option is provided', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('product-launch', { dashboard: true });
      
      expect(SmartDashboard).toHaveBeenCalled();
      expect(mockSmartDashboard.launch).toHaveBeenCalled();
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🚀 Planning launch strategy with AI team...');
    });

    it('should handle all options together', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('comprehensive-launch', { 
        type: 'product',
        audience: 'enterprise-customers',
        dashboard: true 
      });
      
      expect(mockSmartDashboard.launch).toHaveBeenCalled();
      expect(mockStatusIndicator.start).toHaveBeenCalledWith('🚀 Planning launch strategy with AI team...');
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('✅ Complete launch strategy ready!');
    });
  });

  describe('plan-launch command configuration', () => {
    it('should have correct command description', () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      
      expect(planLaunchCommand.description()).toBe('📋 Plan launch strategy with complete AI team (PM → Ship → Market)');
    });

    it('should have all expected options', () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const options = (planLaunchCommand as any).options;
      
      const optionNames = options.map((opt: any) => opt.long);
      expect(optionNames).toContain('--type');
      expect(optionNames).toContain('--audience');
      expect(optionNames).toContain('--dashboard');
    });

    it('should require strategy parameter', () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      
      // Check that the command has the required argument
      expect(planLaunchCommand._args).toHaveLength(1);
      expect(planLaunchCommand._args[0].required).toBe(true);
      expect(planLaunchCommand._args[0].name()).toBe('strategy');
    });

    it('should have default value for type option', () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const options = (planLaunchCommand as any).options;
      
      const typeOption = options.find((opt: any) => opt.long === '--type');
      expect(typeOption).toBeDefined();
      expect(typeOption.defaultValue).toBe('product');
    });
  });

  describe('planLaunchStrategy implementation', () => {
    it('should execute multi-step launch planning process', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('comprehensive-strategy', {});
      
      // Verify that the progress tracking was initiated
      expect(mockStatusIndicator.startProgress).toHaveBeenCalledWith([
        'Assembling AI team for launch strategy',
        'Market research & user persona analysis',
        'Content strategy & digital footprint planning',
        'Landing page & conversion optimization',
        'Implementation planning & resource allocation',
        'Analytics, tracking & performance setup',
        'Security compliance & data protection review',
        'Launch checklist & risk mitigation'
      ]);
      
      // Verify that next steps were called for each phase
      expect(mockStatusIndicator.nextStep).toHaveBeenCalledTimes(7);
      
      // Verify final success message
      expect(mockStatusIndicator.succeed).toHaveBeenCalledWith('Complete launch strategy ready!', true);
    });

    it('should show agent-specific contributions during planning', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('detailed-strategy', {});
      
      // Should log contributions from each agent
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('@pm')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('@seo')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('@design')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('@frontend')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('@devops')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('@security')
      );
    });

    it('should provide next steps recommendations', async () => {
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;
      
      await action('strategy-with-recommendations', {});
      
      // Should show next steps section
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Next Steps:')
      );
      
      // Should recommend follow-up conductor commands
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('conductor ask @pm')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('conductor ask @design')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('conductor ship')
      );
    });
  });

  describe('launch strategy types', () => {
    it('should handle different launch types', async () => {
      const launchTypes = ['product', 'feature', 'campaign'];
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;

      for (const type of launchTypes) {
        await action(`${type}-strategy`, { type });
        expect(mockStatusIndicator.start).toHaveBeenCalledWith('🚀 Planning launch strategy with AI team...');
      }
    });

    it('should handle various audience targets', async () => {
      const audiences = [
        'developers',
        'enterprise-customers', 
        'small-businesses',
        'consumers',
        'b2b-saas'
      ];
      
      const { program } = require('../../src/enhanced-cli');
      const planLaunchCommand = program.commands.find((cmd: any) => cmd.name() === 'plan-launch');
      const action = (planLaunchCommand as any)._actionHandler;

      for (const audience of audiences) {
        await action('targeted-strategy', { audience });
        expect(mockStatusIndicator.start).toHaveBeenCalledWith('🚀 Planning launch strategy with AI team...');
      }
    });
  });
});