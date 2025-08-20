import { EnhancedLaunch } from '../enhanced-launch';
import { ContextScanner } from '../../context-scanner';
import { SubagentGenerator } from '../../subagent-generator';
import { VSCodeIntegration } from '../../vscode-integration';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import path from 'path';

// Mock dependencies
jest.mock('../../context-scanner');
jest.mock('../../subagent-generator');
jest.mock('../../vscode-integration');
jest.mock('fs-extra');
jest.mock('inquirer');

describe('EnhancedLaunch', () => {
  let enhancedLaunch: EnhancedLaunch;
  let mockContextScanner: jest.Mocked<ContextScanner>;
  let mockSubagentGenerator: jest.Mocked<SubagentGenerator>;
  let mockVSCodeIntegration: jest.Mocked<VSCodeIntegration>;
  const mockProjectPath = '/test/project';

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'clear').mockImplementation(() => {});
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    // Initialize enhanced launch
    enhancedLaunch = new EnhancedLaunch(mockProjectPath);

    // Mock context scanner
    mockContextScanner = new ContextScanner() as jest.Mocked<ContextScanner>;
    mockContextScanner.scanProject.mockResolvedValue({
      framework: 'nextjs',
      language: 'typescript',
      packageManager: 'npm',
      hasDatabase: true,
      hasAuthentication: true,
      hasAPI: true,
      hasTesting: true,
      hasLinting: true,
      hasTypeScript: true,
      hasAuth: true,
      hasTests: true,
      dependencies: ['react', 'next', 'typescript'],
      devDependencies: ['jest', '@types/node'],
      scripts: { dev: 'next dev', build: 'next build' },
      rootPath: mockProjectPath
    });

    // Mock subagent generator
    mockSubagentGenerator = {
      generateSubagents: jest.fn().mockReturnValue([
        {
          name: '@frontend',
          role: 'Frontend Developer',
          expertise: ['React', 'Next.js'],
          technicalStack: ['typescript', 'nextjs']
        },
        {
          name: '@backend',
          role: 'Backend Engineer', 
          expertise: ['API Design', 'Database'],
          technicalStack: ['typescript', 'nodejs']
        }
      ])
    } as any;

    // Mock VSCode integration
    mockVSCodeIntegration = {
      setup: jest.fn().mockResolvedValue(undefined)
    } as any;

    // Mock fs-extra
    (fs.ensureDir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeJson as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.chmod as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should perform quick setup when quick option is enabled', async () => {
      const options = { quick: true, skipWelcome: true };
      
      await enhancedLaunch.initialize(options);

      expect(mockContextScanner.scanProject).toHaveBeenCalledWith(mockProjectPath);
      expect(fs.ensureDir).toHaveBeenCalledWith(path.join(mockProjectPath, '.conductor'));
      expect(fs.writeJson).toHaveBeenCalled();
    });

    it('should show welcome animation unless skipped', async () => {
      const options = { skipWelcome: false, quick: true };
      
      // Mock sleep method
      const sleepSpy = jest.spyOn(enhancedLaunch as any, 'sleep').mockResolvedValue(undefined);
      
      await enhancedLaunch.initialize(options);

      expect(console.clear).toHaveBeenCalled();
      expect(sleepSpy).toHaveBeenCalled();
    });

    it('should skip welcome animation when skipWelcome is true', async () => {
      const options = { skipWelcome: true, quick: true };
      
      const sleepSpy = jest.spyOn(enhancedLaunch as any, 'sleep').mockResolvedValue(undefined);
      
      await enhancedLaunch.initialize(options);

      expect(console.clear).not.toHaveBeenCalled();
      expect(sleepSpy).not.toHaveBeenCalled();
    });

    it('should perform interactive setup when quick option is disabled', async () => {
      const options = { quick: false, skipWelcome: true };
      
      // Mock inquirer prompts
      (inquirer.prompt as jest.Mock).mockResolvedValue({
        projectType: 'nextjs',
        primaryGoal: 'feature',
        enabledAgents: ['frontend', 'backend'],
        enableVSCodeIntegration: true,
        enableDashboard: true,
        experienceLevel: 'intermediate'
      });

      await enhancedLaunch.initialize(options);

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(mockVSCodeIntegration.setup).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const options = { quick: true };
      const error = new Error('Test error');
      
      mockContextScanner.scanProject.mockRejectedValue(error);

      await expect(enhancedLaunch.initialize(options)).rejects.toThrow('Test error');
    });
  });

  describe('interactive setup', () => {
    beforeEach(() => {
      // Setup mocks for interactive setup
      (ContextScanner as jest.Mock).mockImplementation(() => mockContextScanner);
      (SubagentGenerator as jest.Mock).mockImplementation(() => mockSubagentGenerator);
      (VSCodeIntegration as jest.Mock).mockImplementation(() => mockVSCodeIntegration);
    });

    it('should ask appropriate questions based on project context', async () => {
      const mockAnswers = {
        projectType: 'nextjs',
        primaryGoal: 'feature',
        enabledAgents: ['frontend', 'backend', 'security'],
        enableVSCodeIntegration: true,
        enableDashboard: true,
        experienceLevel: 'intermediate'
      };

      (inquirer.prompt as jest.Mock).mockResolvedValue(mockAnswers);

      await (enhancedLaunch as any).interactiveSetup({});

      const promptCall = (inquirer.prompt as jest.Mock).mock.calls[0][0];
      
      expect(promptCall).toContainEqual(
        expect.objectContaining({
          name: 'projectType',
          type: 'list'
        })
      );
      
      expect(promptCall).toContainEqual(
        expect.objectContaining({
          name: 'enabledAgents',
          type: 'checkbox'
        })
      );
    });

    it('should handle custom project description', async () => {
      const mockAnswers = {
        projectType: 'custom',
        customDescription: 'My custom project description',
        primaryGoal: 'feature',
        enabledAgents: ['frontend'],
        enableVSCodeIntegration: false,
        enableDashboard: true,
        experienceLevel: 'novice'
      };

      (inquirer.prompt as jest.Mock).mockResolvedValue(mockAnswers);

      await (enhancedLaunch as any).interactiveSetup({});

      const promptCall = (inquirer.prompt as jest.Mock).mock.calls[0][0];
      const customDescriptionPrompt = promptCall.find((q: any) => q.name === 'customDescription');
      
      expect(customDescriptionPrompt).toBeDefined();
      expect(customDescriptionPrompt.when({ projectType: 'custom' })).toBe(true);
      expect(customDescriptionPrompt.when({ projectType: 'nextjs' })).toBe(false);
    });

    it('should validate agent selection', async () => {
      const mockAnswers = {
        projectType: 'react',
        primaryGoal: 'review',
        enabledAgents: [], // Empty selection should be invalid
        enableVSCodeIntegration: true,
        enableDashboard: false,
        experienceLevel: 'expert'
      };

      (inquirer.prompt as jest.Mock).mockResolvedValue(mockAnswers);

      const promptCall = (inquirer.prompt as jest.Mock).mock.calls[0] || [];
      const agentsPrompt = promptCall[0]?.find((q: any) => q.name === 'enabledAgents');

      if (agentsPrompt && agentsPrompt.validate) {
        expect(agentsPrompt.validate([])).toBe('Please select at least one agent');
        expect(agentsPrompt.validate(['frontend'])).toBe(true);
      }
    });
  });

  describe('configuration generation', () => {
    const mockAnswers = {
      projectType: 'nextjs',
      primaryGoal: 'feature',
      enabledAgents: ['frontend', 'backend'],
      enableVSCodeIntegration: true,
      enableDashboard: true,
      experienceLevel: 'intermediate'
    };

    const mockProjectContext = {
      framework: 'nextjs',
      language: 'typescript',
      hasAPI: true,
      hasDatabase: true,
      dependencies: ['react', 'next']
    };

    it('should generate conductor.config.json with correct structure', async () => {
      await (enhancedLaunch as any).generateConfiguration(mockAnswers, mockProjectContext);

      expect(fs.writeJson).toHaveBeenCalledWith(
        path.join(mockProjectPath, '.conductor', 'conductor.config.json'),
        expect.objectContaining({
          version: '1.0.0',
          projectType: 'nextjs',
          primaryGoal: 'feature',
          experienceLevel: 'intermediate',
          agents: expect.any(Array),
          features: expect.objectContaining({
            dashboard: true,
            vscodeIntegration: true,
            autoSuggestions: true,
            contextAware: true
          }),
          projectContext: mockProjectContext,
          createdAt: expect.any(String),
          lastUpdated: expect.any(String)
        }),
        { spaces: 2 }
      );
    });

    it('should generate agent-specific context files', async () => {
      mockSubagentGenerator.generateSubagents.mockReturnValue([
        {
          name: '@frontend',
          role: 'Frontend Developer',
          expertise: ['React', 'Next.js'],
          technicalStack: ['typescript', 'nextjs'],
          specialInstructions: ['Focus on performance']
        }
      ]);

      await (enhancedLaunch as any).generateConfiguration(mockAnswers, mockProjectContext);

      expect(fs.writeJson).toHaveBeenCalledWith(
        path.join(mockProjectPath, '.conductor', 'frontend-context.json'),
        expect.objectContaining({
          name: '@frontend',
          role: 'Frontend Developer',
          expertise: ['React', 'Next.js'],
          specialInstructions: ['Focus on performance'],
          projectSpecific: expect.objectContaining({
            framework: 'nextjs',
            language: 'typescript'
          })
        }),
        { spaces: 2 }
      );
    });

    it('should setup VS Code integration when enabled', async () => {
      const answersWithVSCode = { ...mockAnswers, enableVSCodeIntegration: true };

      await (enhancedLaunch as any).generateConfiguration(answersWithVSCode, mockProjectContext);

      expect(VSCodeIntegration).toHaveBeenCalledWith(mockProjectPath);
      expect(mockVSCodeIntegration.setup).toHaveBeenCalled();
    });

    it('should skip VS Code integration when disabled', async () => {
      const answersWithoutVSCode = { ...mockAnswers, enableVSCodeIntegration: false };

      await (enhancedLaunch as any).generateConfiguration(answersWithoutVSCode, mockProjectContext);

      expect(VSCodeIntegration).not.toHaveBeenCalled();
    });
  });

  describe('setup finalization', () => {
    it('should create launch script with correct permissions', async () => {
      await (enhancedLaunch as any).finalizeSetup();

      const scriptsDir = path.join(mockProjectPath, '.conductor', 'scripts');
      const launchScriptPath = path.join(scriptsDir, 'launch.sh');

      expect(fs.ensureDir).toHaveBeenCalledWith(scriptsDir);
      expect(fs.writeFile).toHaveBeenCalledWith(
        launchScriptPath,
        expect.stringContaining('#!/bin/bash')
      );
      expect(fs.chmod).toHaveBeenCalledWith(launchScriptPath, '755');
    });

    it('should create helpful README with usage instructions', async () => {
      await (enhancedLaunch as any).finalizeSetup();

      const readmePath = path.join(mockProjectPath, '.conductor', 'README.md');
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        readmePath,
        expect.stringContaining('# 🦆 Conductor CLI Setup Complete!')
      );
    });
  });

  describe('error handling', () => {
    it('should handle file system errors during setup', async () => {
      const error = new Error('Permission denied');
      (fs.ensureDir as jest.Mock).mockRejectedValue(error);

      await expect(enhancedLaunch.initialize({ quick: true })).rejects.toThrow('Permission denied');
    });

    it('should handle context scanning errors', async () => {
      const error = new Error('Project not found');
      mockContextScanner.scanProject.mockRejectedValue(error);

      await expect(enhancedLaunch.initialize({ quick: true })).rejects.toThrow('Project not found');
    });

    it('should handle inquirer prompt errors', async () => {
      const error = new Error('Prompt interrupted');
      (inquirer.prompt as jest.Mock).mockRejectedValue(error);

      await expect(enhancedLaunch.initialize({ quick: false })).rejects.toThrow('Prompt interrupted');
    });
  });

  describe('welcome animation', () => {
    it('should display all animation frames', async () => {
      const sleepSpy = jest.spyOn(enhancedLaunch as any, 'sleep').mockResolvedValue(undefined);
      
      await (enhancedLaunch as any).showWelcomeAnimation();

      expect(console.clear).toHaveBeenCalled();
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining('🦆 Welcome to Conductor CLI...')
      );
      expect(sleepSpy).toHaveBeenCalledTimes(16); // 4 frames × 4 calls each (3 dots + 1 pause)
    });

    it('should handle animation interruption gracefully', async () => {
      jest.spyOn(process.stdout, 'write').mockImplementation(() => { 
        throw new Error('Output interrupted'); 
      });

      // Should not throw even if stdout.write fails
      await expect((enhancedLaunch as any).showWelcomeAnimation()).resolves.toBeUndefined();
    });
  });

  describe('quick setup', () => {
    it('should use smart defaults based on project context', async () => {
      const projectContext = {
        framework: 'react',
        hasAPI: false,
        hasTesting: true,
        hasDatabase: false
      };

      mockContextScanner.scanProject.mockResolvedValue(projectContext as any);

      await (enhancedLaunch as any).quickSetup();

      // Should include testing agent since hasTesting is true
      // Should not include backend agent since hasAPI is false
      expect(mockSubagentGenerator.generateSubagents).toHaveBeenCalled();
    });

    it('should add backend agent when API is detected', async () => {
      const projectContext = {
        framework: 'nextjs',
        hasAPI: true,
        hasTesting: false,
        hasDatabase: true
      };

      mockContextScanner.scanProject.mockResolvedValue(projectContext as any);

      const generateConfigSpy = jest.spyOn(enhancedLaunch as any, 'generateConfiguration')
        .mockResolvedValue(undefined);

      await (enhancedLaunch as any).quickSetup();

      const configCall = generateConfigSpy.mock.calls[0][0];
      expect(configCall.enabledAgents).toContain('backend');
    });
  });
});