import { StatusIndicator } from '../status-indicator';
import chalk from 'chalk';
import * as blessed from 'blessed';

// Mock dependencies
jest.mock('chalk', () => ({
  blue: jest.fn((text) => text),
  green: jest.fn((text) => text),
  red: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
  white: jest.fn((text) => text),
  gray: jest.fn((text) => text),
  dim: jest.fn((text) => text),
  bold: jest.fn((text) => text),
  cyan: {
    bold: jest.fn((text) => text)
  }
}));

jest.mock('blessed');

describe('StatusIndicator', () => {
  let statusIndicator: StatusIndicator;
  let mockScreen: any;
  let mockBox: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    // Mock blessed components
    mockBox = {
      setContent: jest.fn(),
      screen: { render: jest.fn() },
      key: jest.fn(),
      append: jest.fn(),
      remove: jest.fn(),
      focus: jest.fn()
    };

    mockScreen = {
      append: jest.fn(),
      render: jest.fn(),
      key: jest.fn(),
      remove: jest.fn()
    };

    (blessed.screen as jest.Mock).mockReturnValue(mockScreen);
    (blessed.box as jest.Mock).mockReturnValue(mockBox);
    (blessed.log as jest.Mock).mockReturnValue({
      ...mockBox,
      log: jest.fn(),
      clear: jest.fn()
    });

    statusIndicator = new StatusIndicator();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default agents', () => {
      const indicator = new StatusIndicator();
      
      // Test that updateAgentStatus works with initialized agents
      indicator.updateAgentStatus('@frontend', 'thinking', 'Testing task', 0.8);
      
      // Should not throw error, indicating agents were initialized
      expect(() => indicator.updateAgentStatus('@frontend', 'ready')).not.toThrow();
    });
  });

  describe('spinner functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start spinner with message', () => {
      const message = 'Processing...';
      
      statusIndicator.start(message);
      
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should animate spinner frames', () => {
      const message = 'Processing...';
      
      statusIndicator.start(message);
      
      // Fast forward time to trigger animation
      jest.advanceTimersByTime(100);
      
      expect(process.stdout.write).toHaveBeenCalledTimes(2); // Initial + first animation
    });

    it('should stop spinner on success', () => {
      statusIndicator.start('Processing...');
      
      statusIndicator.succeed('Success message');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Success message')
      );
    });

    it('should stop spinner on failure', () => {
      statusIndicator.start('Processing...');
      
      statusIndicator.fail('Error message');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Error message')
      );
    });

    it('should clear spinner interval on stop', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      statusIndicator.start('Processing...');
      statusIndicator.succeed('Done');
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('agent status management', () => {
    it('should update agent status correctly', () => {
      statusIndicator.updateAgentStatus('@frontend', 'analyzing', 'Component review', 0.85);
      
      // Verify the agent status was updated by checking team status output
      statusIndicator.showTeamStatus({ json: true });
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('@frontend')
      );
    });

    it('should handle invalid agent names gracefully', () => {
      // Should not throw error for unknown agent
      expect(() => {
        statusIndicator.updateAgentStatus('@unknown', 'thinking', 'Some task', 0.5);
      }).not.toThrow();
    });

    it('should update lastUpdate timestamp', () => {
      const beforeUpdate = new Date();
      
      statusIndicator.updateAgentStatus('@frontend', 'ready', 'Task complete', 1.0);
      
      // Get the agent status through showTeamStatus
      statusIndicator.showTeamStatus({ json: true });
      
      const logCall = (console.log as jest.Mock).mock.calls[0][0];
      const statusData = JSON.parse(logCall);
      
      const frontendAgent = statusData.agents.find((a: any) => a.name === '@frontend');
      expect(new Date(frontendAgent.lastUpdate).getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });
  });

  describe('team consensus', () => {
    it('should update team consensus', () => {
      const consensus = {
        level: 0.87,
        agreementPoints: ['Security looks good', 'Performance is optimal'],
        disagreementPoints: ['State management approach'],
        priority: 'high' as const
      };

      statusIndicator.updateTeamConsensus(consensus);
      
      statusIndicator.showTeamStatus({ json: true });
      
      const logCall = (console.log as jest.Mock).mock.calls[0][0];
      const statusData = JSON.parse(logCall);
      
      expect(statusData.consensus).toEqual(expect.objectContaining({
        level: 0.87,
        priority: 'high'
      }));
    });
  });

  describe('team status display', () => {
    it('should show team status in human readable format', async () => {
      await statusIndicator.showTeamStatus();
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('🎭 CONDUCTOR CLI - AI TEAM STATUS')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('👥 Agent Orchestra:')
      );
    });

    it('should show team status in JSON format when requested', async () => {
      await statusIndicator.showTeamStatus({ json: true });
      
      const logCall = (console.log as jest.Mock).mock.calls[0][0];
      
      expect(() => JSON.parse(logCall)).not.toThrow();
      
      const parsed = JSON.parse(logCall);
      expect(parsed).toHaveProperty('agents');
      expect(parsed).toHaveProperty('consensus');
      expect(parsed).toHaveProperty('timestamp');
    });

    it('should show verbose information when requested', async () => {
      const consensus = {
        level: 0.75,
        agreementPoints: ['Good architecture'],
        disagreementPoints: ['Database choice'],
        priority: 'medium' as const
      };

      statusIndicator.updateTeamConsensus(consensus);
      
      await statusIndicator.showTeamStatus({ verbose: true });
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Database choice')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('conductor dashboard')
      );
    });
  });

  describe('persistent status bar', () => {
    it('should create blessed status bar', () => {
      const statusBar = statusIndicator.createPersistentStatusBar();
      
      expect(blessed.screen).toHaveBeenCalledWith({
        smartCSR: true,
        fullUnicode: true
      });
      
      expect(blessed.box).toHaveBeenCalledWith(
        expect.objectContaining({
          bottom: 0,
          left: 0,
          right: 0,
          height: 3
        })
      );
      
      expect(mockScreen.append).toHaveBeenCalled();
      expect(mockScreen.render).toHaveBeenCalled();
    });

    it('should setup exit key handlers', () => {
      statusIndicator.createPersistentStatusBar();
      
      expect(mockScreen.key).toHaveBeenCalledWith(['q', 'C-c'], expect.any(Function));
    });

    it('should update status bar content periodically', () => {
      jest.useFakeTimers();
      
      statusIndicator.createPersistentStatusBar();
      
      // Fast forward to trigger interval
      jest.advanceTimersByTime(2000);
      
      expect(mockBox.setContent).toHaveBeenCalled();
      
      jest.useRealTimers();
    });
  });

  describe('live agent activity', () => {
    it('should create live activity dashboard', async () => {
      await statusIndicator.showLiveAgentActivity();
      
      expect(blessed.screen).toHaveBeenCalledWith({
        smartCSR: true,
        title: '🎭 Conductor CLI - Live Agent Activity',
        fullUnicode: true
      });
      
      // Should create multiple panels
      expect(blessed.box).toHaveBeenCalledTimes(2); // Agent panel + consensus panel
      expect(blessed.log).toHaveBeenCalledTimes(1); // Activity log
    });

    it('should setup keyboard shortcuts for live activity', async () => {
      await statusIndicator.showLiveAgentActivity();
      
      expect(mockScreen.key).toHaveBeenCalledWith(['q', 'C-c'], expect.any(Function));
      expect(mockScreen.key).toHaveBeenCalledWith(['r'], expect.any(Function));
      expect(mockScreen.key).toHaveBeenCalledWith(['c'], expect.any(Function));
    });
  });

  describe('status icons and colors', () => {
    it('should return correct status icons', () => {
      const getStatusIcon = (statusIndicator as any).getStatusIcon;
      
      expect(getStatusIcon('idle')).toBe('⚫');
      expect(getStatusIcon('thinking')).toBe('🤔');
      expect(getStatusIcon('analyzing')).toBe('🔍');
      expect(getStatusIcon('ready')).toBe('✅');
      expect(getStatusIcon('error')).toBe('❌');
      expect(getStatusIcon('unknown')).toBe('❓');
    });

    it('should return correct status colors', () => {
      const getStatusColor = (statusIndicator as any).getStatusColor;
      
      expect(getStatusColor('idle')).toBe(chalk.gray);
      expect(getStatusColor('thinking')).toBe(chalk.yellow);
      expect(getStatusColor('analyzing')).toBe(chalk.blue);
      expect(getStatusColor('ready')).toBe(chalk.green);
      expect(getStatusColor('error')).toBe(chalk.red);
      expect(getStatusColor('unknown')).toBe(chalk.white);
    });

    it('should return correct priority icons', () => {
      const getPriorityIcon = (statusIndicator as any).getPriorityIcon;
      
      expect(getPriorityIcon('low')).toBe('🟢');
      expect(getPriorityIcon('medium')).toBe('🟡');
      expect(getPriorityIcon('high')).toBe('🟠');
      expect(getPriorityIcon('critical')).toBe('🔴');
    });
  });

  describe('simulation functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start agent activity simulation', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      
      statusIndicator.simulateActivity();
      
      expect(setIntervalSpy).toHaveBeenCalledTimes(2); // Agent updates + consensus updates
    });

    it('should update agent status during simulation', () => {
      const updateAgentStatusSpy = jest.spyOn(statusIndicator, 'updateAgentStatus');
      
      statusIndicator.simulateActivity();
      
      // Fast forward to trigger simulation updates
      jest.advanceTimersByTime(3000);
      
      expect(updateAgentStatusSpy).toHaveBeenCalled();
    });

    it('should update team consensus during simulation', () => {
      const updateTeamConsensusSpy = jest.spyOn(statusIndicator, 'updateTeamConsensus');
      
      statusIndicator.simulateActivity();
      
      // Fast forward to trigger consensus updates
      jest.advanceTimersByTime(5000);
      
      expect(updateTeamConsensusSpy).toHaveBeenCalled();
    });
  });

  describe('message types', () => {
    it('should display info messages', () => {
      statusIndicator.info('Information message');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Information message')
      );
    });

    it('should display warning messages', () => {
      statusIndicator.warn('Warning message');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Warning message')
      );
    });

    it('should handle multiple concurrent spinners gracefully', () => {
      statusIndicator.start('First process');
      statusIndicator.start('Second process'); // Should stop first spinner
      
      statusIndicator.succeed('Completed');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Completed')
      );
    });
  });
});