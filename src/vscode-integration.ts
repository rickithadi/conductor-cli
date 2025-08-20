import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectContext, VSCodeTerminalConfig, AgentTerminal, SubagentDefinition } from './types';

export class VSCodeIntegration {
  private projectPath: string;
  private projectContext: ProjectContext;

  constructor(projectPath: string, projectContext: ProjectContext) {
    this.projectPath = projectPath;
    this.projectContext = projectContext;
  }

  async setupTerminalProfiles(subagents: SubagentDefinition[]): Promise<void> {
    const vscodeDir = path.join(this.projectPath, '.vscode');
    await fs.ensureDir(vscodeDir);

    const settingsPath = path.join(vscodeDir, 'settings.json');
    let settings: any = {};

    // Read existing settings if they exist
    if (await fs.pathExists(settingsPath)) {
      try {
        settings = await fs.readJson(settingsPath);
      } catch (error) {
        console.warn('Could not parse existing VSCode settings, creating new ones');
        settings = {};
      }
    }

    // Generate terminal profiles for each agent
    const terminalProfiles = this.generateTerminalProfiles(subagents);
    
    // Update terminal profiles in settings
    settings['terminal.integrated.profiles.osx'] = {
      ...settings['terminal.integrated.profiles.osx'],
      ...terminalProfiles.osx
    };
    
    settings['terminal.integrated.profiles.linux'] = {
      ...settings['terminal.integrated.profiles.linux'],
      ...terminalProfiles.linux
    };
    
    settings['terminal.integrated.profiles.windows'] = {
      ...settings['terminal.integrated.profiles.windows'],
      ...terminalProfiles.windows
    };

    // Add custom commands for agent terminals
    settings['terminal.integrated.defaultProfile.osx'] = 'Multi-Agent Assistant';
    settings['terminal.integrated.defaultProfile.linux'] = 'Multi-Agent Assistant';
    settings['terminal.integrated.defaultProfile.windows'] = 'Multi-Agent Assistant';

    await fs.writeJson(settingsPath, settings, { spaces: 2 });
    
    // Create tasks.json for agent-specific tasks
    await this.createAgentTasks(subagents);
    
    // Create launch configurations for debugging with agents
    await this.createLaunchConfigurations(subagents);
  }

  private generateTerminalProfiles(subagents: SubagentDefinition[]): any {
    const baseProfiles = {
      'Multi-Agent Assistant': {
        path: '/bin/bash',
        args: ['-l'],
        env: {
          'MULTI_AGENT_MODE': 'coordinator',
          'CLAUDE_CONTEXT': 'multi-agent-team'
        },
        icon: 'robot'
      }
    };

    // Create agent-specific profiles
    const agentProfiles: any = {};
    
    subagents.forEach(agent => {
      const profileName = `${agent.name} - ${agent.role}`;
      agentProfiles[profileName] = {
        path: '/bin/bash',
        args: ['-l'],
        env: {
          'MULTI_AGENT_MODE': 'specialized',
          'AGENT_NAME': agent.name,
          'AGENT_ROLE': agent.role,
          'AGENT_CONTEXT': JSON.stringify({
            expertise: agent.expertise,
            technicalStack: agent.technicalStack,
            specialInstructions: agent.specialInstructions
          })
        },
        icon: this.getAgentIcon(agent.name)
      };
    });

    return {
      osx: { ...baseProfiles, ...agentProfiles },
      linux: { ...baseProfiles, ...agentProfiles },
      windows: this.adaptProfilesForWindows({ ...baseProfiles, ...agentProfiles })
    };
  }

  private adaptProfilesForWindows(profiles: any): any {
    const windowsProfiles: any = {};
    
    Object.keys(profiles).forEach(key => {
      windowsProfiles[key] = {
        ...profiles[key],
        path: 'powershell.exe',
        args: ['-NoLogo']
      };
    });

    return windowsProfiles;
  }

  private getAgentIcon(agentName: string): string {
    const iconMap: Record<string, string> = {
      '@frontend': 'browser',
      '@backend': 'server',
      '@ux': 'person',
      '@review': 'checklist',
      '@database': 'database',
      '@testing': 'beaker',
      '@security': 'shield'
    };

    return iconMap[agentName] || 'terminal';
  }

  async createAgentTasks(subagents: SubagentDefinition[]): Promise<void> {
    const tasksPath = path.join(this.projectPath, '.vscode', 'tasks.json');
    
    const tasks = {
      version: '2.0.0',
      tasks: [
        {
          label: 'Start Multi-Agent Session',
          type: 'shell',
          command: 'claude-code',
          args: ['--context', 'multi-agent'],
          group: 'build',
          presentation: {
            echo: true,
            reveal: 'always',
            focus: false,
            panel: 'new'
          },
          problemMatcher: []
        },
        ...subagents.map(agent => ({
          label: `Consult ${agent.name}`,
          type: 'shell',
          command: 'echo',
          args: [
            `Consulting ${agent.name} - ${agent.role}`,
            '&&',
            'claude-code',
            '--agent',
            agent.name
          ],
          group: 'build',
          presentation: {
            echo: true,
            reveal: 'always',
            focus: true,
            panel: 'new'
          },
          problemMatcher: []
        }))
      ]
    };

    await fs.writeJson(tasksPath, tasks, { spaces: 2 });
  }

  async createLaunchConfigurations(subagents: SubagentDefinition[]): Promise<void> {
    const launchPath = path.join(this.projectPath, '.vscode', 'launch.json');
    
    const launch = {
      version: '0.2.0',
      configurations: [
        {
          name: 'Debug with Frontend Agent',
          type: 'node',
          request: 'launch',
          program: '${workspaceFolder}/src/index.ts',
          env: {
            'AGENT_CONTEXT': '@frontend',
            'DEBUG_MODE': 'true'
          },
          console: 'integratedTerminal',
          internalConsoleOptions: 'neverOpen'
        },
        {
          name: 'Debug with Backend Agent',
          type: 'node',
          request: 'launch',
          program: '${workspaceFolder}/src/index.ts',
          env: {
            'AGENT_CONTEXT': '@backend',
            'DEBUG_MODE': 'true'
          },
          console: 'integratedTerminal',
          internalConsoleOptions: 'neverOpen'
        }
      ]
    };

    await fs.writeJson(launchPath, launch, { spaces: 2 });
  }

  async createAgentCommands(): Promise<AgentTerminal[]> {
    const commands: AgentTerminal[] = [
      {
        name: 'multi-agent-frontend',
        agent: '@frontend',
        specialization: 'Frontend Development',
        command: `claude-code --agent frontend --context "${this.projectPath}"`,
        description: 'Start Claude Code with frontend specialization'
      },
      {
        name: 'multi-agent-backend',
        agent: '@backend',
        specialization: 'Backend Development',
        command: `claude-code --agent backend --context "${this.projectPath}"`,
        description: 'Start Claude Code with backend specialization'
      },
      {
        name: 'multi-agent-ux',
        agent: '@ux',
        specialization: 'User Experience',
        command: `claude-code --agent ux --context "${this.projectPath}"`,
        description: 'Start Claude Code with UX specialization'
      },
      {
        name: 'multi-agent-review',
        agent: '@review',
        specialization: 'Code Review',
        command: `claude-code --agent review --context "${this.projectPath}"`,
        description: 'Start Claude Code with code review specialization'
      }
    ];

    return commands;
  }

  async generateVSCodeExtensions(): Promise<void> {
    const extensionsPath = path.join(this.projectPath, '.vscode', 'extensions.json');
    
    const extensions = {
      recommendations: [
        'anthropic.claude-code',
        'ms-vscode.vscode-typescript-next',
        'bradlc.vscode-tailwindcss',
        'esbenp.prettier-vscode',
        'ms-vscode.vscode-json'
      ]
    };

    // Add framework-specific extensions
    if (this.projectContext.framework === 'nextjs' || this.projectContext.framework === 'react') {
      extensions.recommendations.push('ms-vscode.vscode-eslint');
    }

    if (this.projectContext.framework === 'vue') {
      extensions.recommendations.push('Vue.volar');
    }

    if (this.projectContext.hasDatabase && this.projectContext.dependencies.includes('prisma')) {
      extensions.recommendations.push('Prisma.prisma');
    }

    await fs.writeJson(extensionsPath, extensions, { spaces: 2 });
  }

  async createWorkspaceSettings(): Promise<void> {
    const workspacePath = path.join(this.projectPath, 'multi-agent-workspace.code-workspace');
    
    const workspace = {
      folders: [
        {
          name: 'Project Root',
          path: '.'
        }
      ],
      settings: {
        'terminal.integrated.defaultProfile.osx': 'Multi-Agent Assistant',
        'terminal.integrated.defaultProfile.linux': 'Multi-Agent Assistant',
        'terminal.integrated.defaultProfile.windows': 'Multi-Agent Assistant',
        'files.exclude': {
          '**/node_modules': true,
          '**/dist': true,
          '**/.git': true
        },
        'search.exclude': {
          '**/node_modules': true,
          '**/dist': true
        }
      },
      extensions: {
        recommendations: [
          'anthropic.claude-code'
        ]
      }
    };

    await fs.writeJson(workspacePath, workspace, { spaces: 2 });
  }
}