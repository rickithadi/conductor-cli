import { SmartDashboard } from '../smart-dashboard';
import * as blessed from 'blessed';

// Mock blessed
jest.mock('blessed');

describe('SmartDashboard', () => {
  let smartDashboard: SmartDashboard;
  let mockScreen: any;
  let mockBox: any;
  let mockLog: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock blessed components
    mockBox = {
      setContent: jest.fn(),
      key: jest.fn(),
      focus: jest.fn()
    };

    mockLog = {
      ...mockBox,
      log: jest.fn(),
      clear: jest.fn()
    };

    mockScreen = {
      append: jest.fn(),
      render: jest.fn(),
      key: jest.fn(),
      remove: jest.fn()
    };

    (blessed.screen as jest.Mock).mockReturnValue(mockScreen);
    (blessed.box as jest.Mock).mockReturnValue(mockBox);
    (blessed.log as jest.Mock).mockReturnValue(mockLog);

    smartDashboard = new SmartDashboard();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with sample data', () => {
      const dashboard = new SmartDashboard();
      
      expect(dashboard).toBeDefined();
      expect((dashboard as any).recommendations).toHaveLength(5);
      expect((dashboard as any).activityLog).toEqual([]);
    });
  });

  describe('launch', () => {
    it('should create full dashboard by default', async () => {
      await smartDashboard.launch();
      
      expect(blessed.screen).toHaveBeenCalledWith({
        smartCSR: true,
        title: '🎭 Conductor CLI - AI Team Dashboard',
        fullUnicode: true,
        cursor: expect.objectContaining({
          artificial: true,
          shape: 'line',
          blink: true,
          color: 'cyan'
        })
      });
      
      expect(mockScreen.append).toHaveBeenCalledTimes(5); // header, agent panel, consensus panel, activity panel, status bar
    });

    it('should create minimal dashboard when requested', async () => {
      await smartDashboard.launch({ minimal: true });
      
      expect(mockScreen.append).toHaveBeenCalledTimes(3); // header, status panel, status bar
    });

    it('should setup keyboard shortcuts', async () => {
      await smartDashboard.launch();
      
      expect(mockScreen.key).toHaveBeenCalledWith(['q', 'C-c'], expect.any(Function));
      expect(mockScreen.key).toHaveBeenCalledWith(['r'], expect.any(Function));
      expect(mockScreen.key).toHaveBeenCalledWith(['h', '?'], expect.any(Function));
    });

    it('should start real-time updates', async () => {
      jest.useFakeTimers();
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      
      await smartDashboard.launch();
      
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
      
      jest.useRealTimers();
    });

    it('should render the screen', async () => {
      await smartDashboard.launch();
      
      expect(mockScreen.render).toHaveBeenCalled();
    });
  });

  describe('full layout creation', () => {
    it('should create all required panels', async () => {
      await (smartDashboard as any).createFullLayout({});
      
      expect(blessed.box).toHaveBeenCalledTimes(4); // header, agent panel, consensus panel, status bar
      expect(blessed.log).toHaveBeenCalledTimes(1); // activity panel
    });

    it('should create panels with correct configurations', async () => {
      await (smartDashboard as any).createFullLayout({});
      
      // Check header configuration
      expect(blessed.box).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 0,
          left: 0,
          width: '100%',
          height: 3
        })
      );
      
      // Check agent panel configuration
      expect(blessed.box).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 3,
          left: 0,
          width: '40%',
          height: '60%',
          label: ' 👥 Agent Orchestra '
        })
      );
    });

    it('should setup panel event handlers', async () => {
      await (smartDashboard as any).createFullLayout({});
      
      expect(mockBox.key).toHaveBeenCalledWith(['enter'], expect.any(Function));
    });

    it('should add initial activity log entries', async () => {
      await (smartDashboard as any).createFullLayout({});
      
      expect((smartDashboard as any).activityLog.length).toBeGreaterThan(0);
    });
  });

  describe('minimal layout creation', () => {
    it('should create minimal panel set', async () => {
      await (smartDashboard as any).createMinimalLayout();
      
      expect(blessed.box).toHaveBeenCalledTimes(3); // header, status panel, status bar
      expect(blessed.log).not.toHaveBeenCalled(); // No activity log in minimal mode
    });
  });

  describe('keyboard shortcuts', () => {
    beforeEach(async () => {
      (smartDashboard as any).screen = mockScreen;
      (smartDashboard as any).setupKeyboardShortcuts();
    });

    it('should setup quit shortcuts', () => {
      expect(mockScreen.key).toHaveBeenCalledWith(['q', 'C-c'], expect.any(Function));
    });

    it('should setup refresh shortcut', () => {
      expect(mockScreen.key).toHaveBeenCalledWith(['r'], expect.any(Function));
    });

    it('should setup help shortcuts', () => {
      expect(mockScreen.key).toHaveBeenCalledWith(['h', '?'], expect.any(Function));
    });

    it('should setup focus shortcuts', () => {
      expect(mockScreen.key).toHaveBeenCalledWith(['1'], expect.any(Function));
      expect(mockScreen.key).toHaveBeenCalledWith(['2'], expect.any(Function));
      expect(mockScreen.key).toHaveBeenCalledWith(['3'], expect.any(Function));
    });

    it('should setup utility shortcuts', () => {
      expect(mockScreen.key).toHaveBeenCalledWith(['c'], expect.any(Function));
      expect(mockScreen.key).toHaveBeenCalledWith(['s'], expect.any(Function));
    });
  });

  describe('content generation', () => {
    it('should generate header content with current time', () => {
      const content = (smartDashboard as any).getHeaderContent();
      
      expect(content).toContain('🎭 CONDUCTOR CLI - AI TEAM DASHBOARD');
      expect(content).toMatch(/\d{1,2}:\d{2}:\d{2}/); // Time format
      expect(content).toContain('Active:');
    });

    it('should generate agent panel content with status indicators', () => {
      const content = (smartDashboard as any).getAgentPanelContent();
      
      expect(content).toContain('@pm');
      expect(content).toContain('@frontend');
      expect(content).toContain('@security');
      expect(content).toContain('█'); // Progress bars
    });

    it('should generate consensus panel content with recommendations', () => {
      const content = (smartDashboard as any).getConsensusPanelContent();
      
      expect(content).toContain('📊 TEAM CONSENSUS');
      expect(content).toContain('Level:');
      expect(content).toContain('Priority:');
      expect(content).toContain('✅ Team Agreements:');
      expect(content).toContain('🎯 ACTIVE RECOMMENDATIONS');
    });

    it('should generate status bar content with controls', () => {
      const content = (smartDashboard as any).getStatusBarContent();
      
      expect(content).toContain('🎭 Conductor');
      expect(content).toContain('Press');
      expect(content).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date format
    });

    it('should generate minimal status content', () => {
      const content = (smartDashboard as any).getMinimalStatusContent();
      
      expect(content).toContain('🎭 AI TEAM STATUS');
      expect(content).toContain('👥 Agents:');
      expect(content).toContain('📊 Consensus:');
      expect(content).toContain('Recent Activity:');
    });
  });

  describe('real-time updates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update display periodically', () => {
      const updateDisplaySpy = jest.spyOn(smartDashboard as any, 'updateDisplay');
      
      (smartDashboard as any).startRealTimeUpdates();
      
      jest.advanceTimersByTime(2000);
      
      expect(updateDisplaySpy).toHaveBeenCalled();
    });

    it('should simulate activity periodically', () => {
      const simulateActivitySpy = jest.spyOn(smartDashboard as any, 'simulateRandomActivity');
      
      (smartDashboard as any).startRealTimeUpdates();
      
      jest.advanceTimersByTime(5000);
      
      expect(simulateActivitySpy).toHaveBeenCalled();
    });
  });

  describe('display updates', () => {
    beforeEach(() => {
      (smartDashboard as any).screen = {
        ...mockScreen,
        agentPanel: mockBox,
        consensusPanel: mockBox,
        statusBar: mockBox,
        header: mockBox,
        statusPanel: mockBox
      };
    });

    it('should update all panels in full mode', () => {
      (smartDashboard as any).updateDisplay();
      
      expect(mockBox.setContent).toHaveBeenCalledTimes(4); // agent, consensus, status bar, header
    });

    it('should update status panel in minimal mode', () => {
      // Remove full mode panels
      delete (smartDashboard as any).screen.agentPanel;
      delete (smartDashboard as any).screen.consensusPanel;
      
      (smartDashboard as any).updateDisplay();
      
      expect(mockBox.setContent).toHaveBeenCalled();
    });

    it('should render screen after updates', () => {
      (smartDashboard as any).updateDisplay();
      
      expect(mockScreen.render).toHaveBeenCalled();
    });
  });

  describe('help modal', () => {
    beforeEach(() => {
      (smartDashboard as any).screen = mockScreen;
    });

    it('should create help modal', () => {
      (smartDashboard as any).showHelpModal();
      
      expect(blessed.box).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 'center',
          left: 'center',
          width: '60%',
          height: '70%',
          label: ' 📚 Conductor CLI Dashboard Help '
        })
      );
    });

    it('should setup help modal key handlers', () => {
      (smartDashboard as any).showHelpModal();
      
      expect(mockBox.key).toHaveBeenCalledWith(['escape', 'q', 'enter'], expect.any(Function));
    });

    it('should append help modal to screen', () => {
      (smartDashboard as any).showHelpModal();
      
      expect(mockScreen.append).toHaveBeenCalled();
      expect(mockScreen.render).toHaveBeenCalled();
    });
  });

  describe('activity logging', () => {
    it('should add activity log entries', () => {
      const initialLength = (smartDashboard as any).activityLog.length;
      
      (smartDashboard as any).addActivityLog('system', 'Test action', 'Test details', 'info');
      
      expect((smartDashboard as any).activityLog.length).toBe(initialLength + 1);
    });

    it('should limit activity log size', () => {
      // Add 105 entries to test the 100 limit
      for (let i = 0; i < 105; i++) {
        (smartDashboard as any).addActivityLog('system', `Action ${i}`, undefined, 'info');
      }
      
      expect((smartDashboard as any).activityLog.length).toBe(100);
    });

    it('should log to blessed log panel if available', () => {
      (smartDashboard as any).screen = {
        activityPanel: mockLog
      };
      
      (smartDashboard as any).addActivityLog('frontend', 'Component updated', undefined, 'success');
      
      expect(mockLog.log).toHaveBeenCalledWith(
        expect.stringContaining('frontend: Component updated')
      );
    });

    it('should clear activity log', () => {
      (smartDashboard as any).addActivityLog('system', 'Test', undefined, 'info');
      (smartDashboard as any).screen = { activityPanel: mockLog };
      
      (smartDashboard as any).clearActivityLog();
      
      expect((smartDashboard as any).activityLog.length).toBe(1); // Only the "cleared" message
      expect(mockLog.clear).toHaveBeenCalled();
    });
  });

  describe('random activity simulation', () => {
    it('should generate random activity entries', () => {
      const initialLength = (smartDashboard as any).activityLog.length;
      
      (smartDashboard as any).simulateRandomActivity();
      
      expect((smartDashboard as any).activityLog.length).toBe(initialLength + 1);
    });

    it('should use realistic agent names and actions', () => {
      (smartDashboard as any).simulateRandomActivity();
      
      const lastEntry = (smartDashboard as any).activityLog.slice(-1)[0];
      
      expect(lastEntry.agent).toMatch(/^@(pm|design|frontend|backend|qa|devops|reviewer|security)$/);
      expect(lastEntry.action).toContain('ing'); // Most actions end with 'ing'
    });
  });

  describe('icon and color helpers', () => {
    it('should return correct status icons', () => {
      const getStatusIcon = (smartDashboard as any).getStatusIcon;
      
      expect(getStatusIcon('idle')).toBe('⚫');
      expect(getStatusIcon('thinking')).toBe('🤔');
      expect(getStatusIcon('analyzing')).toBe('🔍');
      expect(getStatusIcon('ready')).toBe('✅');
      expect(getStatusIcon('error')).toBe('❌');
      expect(getStatusIcon('unknown')).toBe('❓');
    });

    it('should return correct priority icons', () => {
      const getPriorityIcon = (smartDashboard as any).getPriorityIcon;
      
      expect(getPriorityIcon('low')).toBe('🟢');
      expect(getPriorityIcon('medium')).toBe('🟡');
      expect(getPriorityIcon('high')).toBe('🟠');
      expect(getPriorityIcon('critical')).toBe('🔴');
      expect(getPriorityIcon('unknown')).toBe('⚪');
    });

    it('should return correct log icons', () => {
      const getLogIcon = (smartDashboard as any).getLogIcon;
      
      expect(getLogIcon('info')).toBe('ℹ️');
      expect(getLogIcon('success')).toBe('✅');
      expect(getLogIcon('warning')).toBe('⚠️');
      expect(getLogIcon('error')).toBe('❌');
    });

    it('should return correct status color tags', () => {
      const getStatusColorTag = (smartDashboard as any).getStatusColorTag;
      
      expect(getStatusColorTag('idle')).toBe('gray-fg');
      expect(getStatusColorTag('thinking')).toBe('yellow-fg');
      expect(getStatusColorTag('analyzing')).toBe('blue-fg');
      expect(getStatusColorTag('ready')).toBe('green-fg');
      expect(getStatusColorTag('error')).toBe('red-fg');
      expect(getStatusColorTag('unknown')).toBe('white-fg');
    });
  });

  describe('sample data initialization', () => {
    it('should initialize with sample recommendations', () => {
      const recommendations = (smartDashboard as any).recommendations;
      
      expect(recommendations).toHaveLength(5);
      expect(recommendations[0]).toHaveProperty('id');
      expect(recommendations[0]).toHaveProperty('title');
      expect(recommendations[0]).toHaveProperty('priority');
      expect(recommendations[0]).toHaveProperty('agent');
      expect(recommendations[0]).toHaveProperty('status');
    });

    it('should have recommendations with different priorities', () => {
      const recommendations = (smartDashboard as any).recommendations;
      const priorities = recommendations.map((r: any) => r.priority);
      
      expect(priorities).toContain('high');
      expect(priorities).toContain('medium');
    });

    it('should have recommendations from different agents', () => {
      const recommendations = (smartDashboard as any).recommendations;
      const agents = recommendations.map((r: any) => r.agent);
      
      expect(agents).toContain('@security');
      expect(agents).toContain('@backend');
      expect(agents).toContain('@design');
    });
  });

  describe('focus management', () => {
    it('should change focus when requested', async () => {
      await smartDashboard.launch({ focus: '@frontend' });
      
      expect((smartDashboard as any).currentFocus).toBe('@frontend');
    });

    it('should default to overview focus', () => {
      expect((smartDashboard as any).currentFocus).toBe('overview');
    });

    it('should update focus on keyboard shortcuts', () => {
      (smartDashboard as any).screen = mockScreen;
      (smartDashboard as any).setupKeyboardShortcuts();
      
      // Simulate key press for focus change
      const keyHandler = mockScreen.key.mock.calls.find(call => 
        call[0].includes('1')
      )[1];
      
      keyHandler();
      
      expect((smartDashboard as any).currentFocus).toBe('agents');
    });
  });

  describe('theme handling', () => {
    it('should accept theme options', async () => {
      await smartDashboard.launch({ theme: 'dark' });
      
      // Should create dashboard without errors
      expect(mockScreen.append).toHaveBeenCalled();
    });

    it('should handle auto theme', async () => {
      await smartDashboard.launch({ theme: 'auto' });
      
      expect(mockScreen.append).toHaveBeenCalled();
    });

    it('should handle light theme', async () => {
      await smartDashboard.launch({ theme: 'light' });
      
      expect(mockScreen.append).toHaveBeenCalled();
    });
  });
});