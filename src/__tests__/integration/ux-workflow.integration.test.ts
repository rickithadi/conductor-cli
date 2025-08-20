import { EnhancedLaunch } from '../../ux/enhanced-launch';
import { StatusIndicator } from '../../ux/status-indicator';
import { SmartDashboard } from '../../ux/smart-dashboard';
import { ContextScanner } from '../../context-scanner';
import { SubagentGenerator } from '../../subagent-generator';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as inquirer from 'inquirer';

// Integration tests for the complete UX workflow
describe('UX Workflow Integration', () => {
  const testProjectPath = path.join(__dirname, '../../..', 'test-project');
  
  beforeAll(async () => {
    // Create test project directory
    await fs.ensureDir(testProjectPath);
    
    // Create a minimal package.json to simulate a real project
    await fs.writeJson(path.join(testProjectPath, 'package.json'), {
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        'react': '^18.0.0',
        'next': '^14.0.0',
        'typescript': '^5.0.0'
      },
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'test': 'jest'
      }
    });
  });

  afterAll(async () => {
    // Clean up test project
    await fs.remove(testProjectPath);
  });

  describe('Complete initialization workflow', () => {
    it('should initialize project with full workflow', async () => {
      const enhancedLaunch = new EnhancedLaunch(testProjectPath);
      
      // Mock user input for interactive setup
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({
        projectType: 'nextjs',
        primaryGoal: 'feature',
        enabledAgents: ['frontend', 'backend', 'security'],
        enableVSCodeIntegration: true,
        enableDashboard: true,
        experienceLevel: 'intermediate'
      });

      // Mock console methods to avoid noise
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'clear').mockImplementation(() => {});
      jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

      await enhancedLaunch.initialize({
        skipWelcome: true,
        quick: false
      });

      // Verify configuration was created
      const configPath = path.join(testProjectPath, '.conductor', 'conductor.config.json');
      expect(await fs.pathExists(configPath)).toBe(true);

      const config = await fs.readJson(configPath);
      expect(config.projectType).toBe('nextjs');
      expect(config.agents).toHaveLength(3);
      expect(config.features.dashboard).toBe(true);
      expect(config.features.vscodeIntegration).toBe(true);

      // Verify agent context files were created
      const frontendContextPath = path.join(testProjectPath, '.conductor', 'frontend-context.json');
      expect(await fs.pathExists(frontendContextPath)).toBe(true);

      // Verify launch script was created
      const launchScriptPath = path.join(testProjectPath, '.conductor', 'scripts', 'launch.sh');
      expect(await fs.pathExists(launchScriptPath)).toBe(true);

      // Verify README was created
      const readmePath = path.join(testProjectPath, '.conductor', 'README.md');
      expect(await fs.pathExists(readmePath)).toBe(true);
      
      const readme = await fs.readFile(readmePath, 'utf8');
      expect(readme).toContain('🦆 Conductor CLI Setup Complete!');
    }, 10000);

    it('should handle quick setup workflow', async () => {
      const quickProjectPath = path.join(testProjectPath, 'quick-setup');
      await fs.ensureDir(quickProjectPath);
      
      // Create package.json for quick setup test
      await fs.writeJson(path.join(quickProjectPath, 'package.json'), {
        name: 'quick-test',
        dependencies: { 'react': '^18.0.0' }
      });

      const enhancedLaunch = new EnhancedLaunch(quickProjectPath);
      
      // Mock console methods
      jest.spyOn(console, 'log').mockImplementation(() => {});

      await enhancedLaunch.initialize({
        skipWelcome: true,
        quick: true
      });

      // Quick setup should still create configuration
      const configPath = path.join(quickProjectPath, '.conductor', 'conductor.config.json');
      expect(await fs.pathExists(configPath)).toBe(true);

      const config = await fs.readJson(configPath);
      expect(config.agents.length).toBeGreaterThan(0);

      // Cleanup
      await fs.remove(quickProjectPath);
    }, 10000);
  });

  describe('Status indicator workflow', () => {
    it('should track agent status changes throughout workflow', async () => {
      const statusIndicator = new StatusIndicator();
      
      // Mock console methods
      jest.spyOn(console, 'log').mockImplementation(() => {});

      // Simulate workflow stages
      statusIndicator.updateAgentStatus('@frontend', 'thinking', 'Analyzing component structure', 0.3);
      statusIndicator.updateAgentStatus('@frontend', 'analyzing', 'Reviewing state management', 0.7);
      statusIndicator.updateAgentStatus('@frontend', 'ready', 'Analysis complete', 1.0);

      statusIndicator.updateTeamConsensus({
        level: 0.85,
        agreementPoints: ['Component structure looks good'],
        disagreementPoints: ['Consider alternative state approach'],
        priority: 'medium'
      });

      // Get status in JSON format for verification
      await statusIndicator.showTeamStatus({ json: true });
      
      const logCalls = (console.log as jest.Mock).mock.calls;
      const lastCall = logCalls[logCalls.length - 1][0];
      const statusData = JSON.parse(lastCall);

      expect(statusData.agents).toBeDefined();
      expect(statusData.consensus).toBeDefined();
      expect(statusData.consensus.level).toBe(0.85);
      
      const frontendAgent = statusData.agents.find((a: any) => a.name === '@frontend');
      expect(frontendAgent.status).toBe('ready');
      expect(frontendAgent.confidence).toBe(1.0);
    });

    it('should handle simulation workflow', () => {
      const statusIndicator = new StatusIndicator();
      
      // Mock timers for simulation
      jest.useFakeTimers();
      
      const updateSpy = jest.spyOn(statusIndicator, 'updateAgentStatus');
      const consensusSpy = jest.spyOn(statusIndicator, 'updateTeamConsensus');
      
      statusIndicator.simulateActivity();
      
      // Fast forward time to trigger simulations
      jest.advanceTimersByTime(3000);
      expect(updateSpy).toHaveBeenCalled();
      
      jest.advanceTimersByTime(5000);
      expect(consensusSpy).toHaveBeenCalled();
      
      jest.useRealTimers();
    });
  });

  describe('Dashboard workflow', () => {
    it('should launch dashboard with different configurations', async () => {
      // Mock blessed components
      const mockScreen = {
        append: jest.fn(),
        render: jest.fn(),
        key: jest.fn()
      };
      
      const mockBox = {
        setContent: jest.fn(),
        key: jest.fn(),
        focus: jest.fn()
      };

      jest.doMock('blessed', () => ({
        screen: jest.fn(() => mockScreen),
        box: jest.fn(() => mockBox),
        log: jest.fn(() => ({ ...mockBox, log: jest.fn(), clear: jest.fn() }))
      }));

      const { SmartDashboard } = await import('../../ux/smart-dashboard');
      
      const dashboard = new SmartDashboard();

      // Test full dashboard
      await dashboard.launch({});
      expect(mockScreen.append).toHaveBeenCalled();
      expect(mockScreen.render).toHaveBeenCalled();

      // Reset mocks
      jest.clearAllMocks();

      // Test minimal dashboard
      await dashboard.launch({ minimal: true });
      expect(mockScreen.append).toHaveBeenCalled();

      // Reset mocks
      jest.clearAllMocks();

      // Test focused dashboard
      await dashboard.launch({ focus: '@frontend' });
      expect(mockScreen.append).toHaveBeenCalled();
    });

    it('should handle dashboard activity logging', () => {
      const dashboard = new SmartDashboard();
      
      // Add some activity
      (dashboard as any).addActivityLog('frontend', 'Component updated', 'Added new props', 'success');
      (dashboard as any).addActivityLog('security', 'Scan complete', 'No issues found', 'success');
      (dashboard as any).addActivityLog('backend', 'API error', 'Connection timeout', 'error');
      
      const activityLog = (dashboard as any).activityLog;
      expect(activityLog.length).toBe(3);
      expect(activityLog[0].agent).toBe('frontend');
      expect(activityLog[2].level).toBe('error');
    });
  });

  describe('Error handling workflow', () => {
    it('should handle file system errors gracefully', async () => {
      const badProjectPath = '/invalid/path/that/does/not/exist';
      const enhancedLaunch = new EnhancedLaunch(badProjectPath);
      
      // Mock console methods
      jest.spyOn(console, 'log').mockImplementation(() => {});

      await expect(enhancedLaunch.initialize({ quick: true }))
        .rejects.toThrow();
    });

    it('should handle missing dependencies', () => {
      // Test status indicator without blessed
      const originalBlessed = require('blessed');
      jest.doMock('blessed', () => {
        throw new Error('blessed not available');
      });

      expect(() => {
        const statusIndicator = new StatusIndicator();
        statusIndicator.createPersistentStatusBar();
      }).toThrow('blessed not available');

      // Restore blessed
      jest.doMock('blessed', () => originalBlessed);
    });
  });

  describe('Configuration persistence workflow', () => {
    it('should persist and reload configuration correctly', async () => {
      const configPath = path.join(testProjectPath, '.conductor');
      
      // Create initial configuration
      const initialConfig = {
        version: '1.0.0',
        projectType: 'nextjs',
        agents: [
          { name: '@frontend', enabled: true },
          { name: '@backend', enabled: false }
        ],
        features: {
          dashboard: true,
          vscodeIntegration: false
        }
      };

      await fs.ensureDir(configPath);
      await fs.writeJson(path.join(configPath, 'conductor.config.json'), initialConfig);

      // Verify configuration can be read back
      const savedConfig = await fs.readJson(path.join(configPath, 'conductor.config.json'));
      expect(savedConfig.projectType).toBe('nextjs');
      expect(savedConfig.agents).toHaveLength(2);
      expect(savedConfig.features.dashboard).toBe(true);

      // Verify configuration updates work
      savedConfig.features.dashboard = false;
      savedConfig.agents.push({ name: '@security', enabled: true });

      await fs.writeJson(path.join(configPath, 'conductor.config.json'), savedConfig);

      const updatedConfig = await fs.readJson(path.join(configPath, 'conductor.config.json'));
      expect(updatedConfig.features.dashboard).toBe(false);
      expect(updatedConfig.agents).toHaveLength(3);
    });

    it('should handle configuration migration', async () => {
      const configPath = path.join(testProjectPath, '.conductor');
      
      // Create old format configuration
      const oldConfig = {
        version: '0.9.0',
        framework: 'nextjs', // Old field name
        subagents: ['frontend', 'backend'], // Old field name
        enableDashboard: true // Old field name
      };

      await fs.writeJson(path.join(configPath, 'conductor.config.json'), oldConfig);

      // Simulate configuration loading and migration
      const config = await fs.readJson(path.join(configPath, 'conductor.config.json'));
      
      // Migration logic would be implemented here in real application
      const migratedConfig = {
        ...config,
        version: '1.0.0',
        projectType: config.framework || 'unknown',
        agents: (config.subagents || []).map((name: string) => ({ name: `@${name}`, enabled: true })),
        features: {
          dashboard: config.enableDashboard || false,
          vscodeIntegration: false
        }
      };

      // Remove old fields
      delete migratedConfig.framework;
      delete migratedConfig.subagents;
      delete migratedConfig.enableDashboard;

      await fs.writeJson(path.join(configPath, 'conductor.config.json'), migratedConfig);

      // Verify migration
      const finalConfig = await fs.readJson(path.join(configPath, 'conductor.config.json'));
      expect(finalConfig.version).toBe('1.0.0');
      expect(finalConfig.projectType).toBe('nextjs');
      expect(finalConfig.agents).toEqual([
        { name: '@frontend', enabled: true },
        { name: '@backend', enabled: true }
      ]);
    });
  });

  describe('Performance workflow', () => {
    it('should handle rapid status updates efficiently', () => {
      const statusIndicator = new StatusIndicator();
      const startTime = Date.now();
      
      // Perform many rapid updates
      for (let i = 0; i < 1000; i++) {
        statusIndicator.updateAgentStatus(
          `@agent${i % 8}`,
          'thinking',
          `Task ${i}`,
          Math.random()
        );
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete updates in reasonable time (< 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('should handle large activity logs efficiently', () => {
      const dashboard = new SmartDashboard();
      const startTime = Date.now();
      
      // Add many activity entries
      for (let i = 0; i < 1000; i++) {
        (dashboard as any).addActivityLog(
          '@frontend',
          `Action ${i}`,
          `Details ${i}`,
          'info'
        );
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should handle large logs efficiently
      expect(duration).toBeLessThan(100);
      
      // Should maintain size limit
      const activityLog = (dashboard as any).activityLog;
      expect(activityLog.length).toBe(100); // Size limit
    });
  });

  describe('User experience workflow', () => {
    it('should provide consistent feedback across all operations', async () => {
      const statusIndicator = new StatusIndicator();
      
      // Mock console methods to capture output
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

      // Test different feedback types
      statusIndicator.start('Processing...');
      expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('Processing...'));

      statusIndicator.succeed('Success!');
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Success!'));

      statusIndicator.fail('Failed!');
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Failed!'));

      statusIndicator.info('Information');
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Information'));

      statusIndicator.warn('Warning');
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Warning'));
    });

    it('should maintain state consistency across components', () => {
      const statusIndicator = new StatusIndicator();
      const dashboard = new SmartDashboard();

      // Update agent status in status indicator
      statusIndicator.updateAgentStatus('@frontend', 'analyzing', 'Component review', 0.8);
      
      // Both components should be able to work with consistent state
      statusIndicator.updateTeamConsensus({
        level: 0.9,
        agreementPoints: ['Good architecture'],
        disagreementPoints: [],
        priority: 'high'
      });

      // Verify state is maintained
      expect(() => {
        statusIndicator.updateAgentStatus('@frontend', 'ready', 'Review complete', 1.0);
        (dashboard as any).addActivityLog('@frontend', 'Review completed', undefined, 'success');
      }).not.toThrow();
    });
  });
});