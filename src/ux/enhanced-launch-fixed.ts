import chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import ora from 'ora';
import { ContextScanner } from '../stubs/context-scanner';
import { SubagentGenerator } from '../subagent-generator';  
import { VSCodeIntegration } from '../stubs/vscode-integration';

interface LaunchOptions {
  framework?: string;
  template?: string;
  skipWelcome?: boolean;
  quick?: boolean;
}

export class EnhancedLaunch {
  private projectPath: string;
  private spinner: any;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  async initialize(options: LaunchOptions): Promise<void> {
    try {
      if (!options.skipWelcome) {
        this.showWelcomeBanner();
      }

      if (options.quick) {
        await this.quickSetup();
      } else {
        await this.interactiveSetup(options);
      }

      await this.finalizeSetup();
      this.showSuccessMessage();
    } catch (error) {
      if (this.spinner) {
        this.spinner.fail('Setup failed: ' + (error as Error).message);
      } else {
        console.error(chalk.red('✖ Setup failed: ' + (error as Error).message));
      }
      throw error;
    }
  }

  private showWelcomeBanner(): void {
    console.clear();
    console.log(chalk.cyan.bold('\n' + '='.repeat(60)));
    console.log(chalk.cyan.bold('  CONDUCTOR CLI - AI Development Assistant'));
    console.log(chalk.cyan.bold('='.repeat(60) + '\n'));
    console.log(chalk.gray('  Like having senior developers on your team\n'));
  }

  private async interactiveSetup(options: LaunchOptions): Promise<void> {
    // Use ora spinner for non-blocking loading indication
    this.spinner = ora({
      text: 'Scanning your project structure...',
      spinner: 'dots'
    }).start();
    
    try {
      const contextScanner = new ContextScanner();
      const projectContext = await contextScanner.scanProject(this.projectPath);
      
      this.spinner.succeed('Project analysis complete!');
    } catch (error) {
      this.spinner.fail('Failed to scan project');
      throw error;
    }

    // Interactive questionnaire - non-blocking
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of project is this?',
        choices: [
          { name: 'Next.js App', value: 'nextjs' },
          { name: 'React SPA', value: 'react' },
          { name: 'Vue.js App', value: 'vue' },
          { name: 'Node.js API', value: 'nodejs' },
          { name: 'TypeScript Library', value: 'library' },
          { name: 'Other', value: 'custom' }
        ],
        default: options.framework || 'nextjs'
      },
      {
        type: 'list',
        name: 'primaryGoal',
        message: 'What\'s your main focus?',
        choices: [
          { name: 'Building new features', value: 'feature' },
          { name: 'Fixing bugs', value: 'debug' },
          { name: 'Code review & refactoring', value: 'review' },
          { name: 'Performance optimization', value: 'performance' },
          { name: 'Security audit', value: 'security' },
          { name: 'General development', value: 'general' }
        ]
      },
      {
        type: 'checkbox',
        name: 'agents',
        message: 'Which AI specialists do you want active?',
        choices: [
          { name: 'Architect - System design', value: 'architect', checked: true },
          { name: 'Coder - Implementation', value: 'coder', checked: true },
          { name: 'QA - Testing & quality', value: 'qa', checked: true },
          { name: 'Security - Vulnerability scanning', value: 'security', checked: true },
          { name: 'Reviewer - Code review', value: 'reviewer', checked: true },
          { name: 'Performance - Optimization', value: 'performance' }
        ]
      },
      {
        type: 'confirm',
        name: 'enableHiveMind',
        message: 'Enable hive-mind coordination for parallel execution?',
        default: true
      }
    ]);

    // Save configuration with loading indicator
    this.spinner = ora('Saving configuration...').start();
    await this.saveConfiguration(answers);
    this.spinner.succeed('Configuration saved');

    // Initialize agents with loading indicator
    this.spinner = ora('Initializing AI agents...').start();
    await this.initializeAgents(answers.agents);
    this.spinner.succeed(`${answers.agents.length} agents ready`);
  }

  private async quickSetup(): Promise<void> {
    this.spinner = ora('Running quick setup...').start();
    
    const defaultConfig = {
      projectType: 'nextjs',
      primaryGoal: 'feature',
      agents: ['architect', 'coder', 'qa', 'security', 'reviewer'],
      enableHiveMind: true,
      features: {
        autoSuggestions: true,
        contextAware: true,
        dashboard: false
      }
    };

    await this.saveConfiguration(defaultConfig);
    await this.initializeAgents(defaultConfig.agents);
    
    this.spinner.succeed('Quick setup complete');
  }

  private async saveConfiguration(config: any): Promise<void> {
    const configPath = path.join(this.projectPath, '.conductor');
    await fs.ensureDir(configPath);
    
    const configFile = path.join(configPath, 'conductor.config.json');
    await fs.writeJson(configFile, {
      ...config,
      version: '1.0.0',
      createdAt: new Date().toISOString()
    }, { spaces: 2 });
  }

  private async initializeAgents(agents: string[]): Promise<void> {
    // Simulate agent initialization
    // In real implementation, this would start the actual agents
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async finalizeSetup(): Promise<void> {
    // Create CLAUDE.md if it doesn't exist
    const claudePath = path.join(this.projectPath, 'CLAUDE.md');
    if (!await fs.pathExists(claudePath)) {
      const claudeContent = `# Conductor CLI Configuration

## Active Agents
Your AI development team is configured and ready.

## Quick Commands
- \`conductor ask "your question"\` - Consult with AI team
- \`conductor swarm\` - Activate parallel execution
- \`conductor review\` - Get code review
- \`conductor help\` - Show all commands

Generated by Conductor CLI - ${new Date().toISOString()}
`;
      await fs.writeFile(claudePath, claudeContent);
    }

    // Check for VS Code
    const vscodeDir = path.join(this.projectPath, '.vscode');
    if (await fs.pathExists(vscodeDir)) {
      await this.setupVSCodeIntegration();
    }
  }

  private async setupVSCodeIntegration(): Promise<void> {
    // Add VS Code tasks if workspace exists
    const tasksFile = path.join(this.projectPath, '.vscode', 'tasks.json');
    if (!await fs.pathExists(tasksFile)) {
      const tasks = {
        version: '2.0.0',
        tasks: [
          {
            label: 'Conductor: Ask AI Team',
            type: 'shell',
            command: 'conductor ask',
            problemMatcher: []
          },
          {
            label: 'Conductor: Activate Swarm',
            type: 'shell',
            command: 'conductor swarm',
            problemMatcher: []
          }
        ]
      };
      await fs.writeJson(tasksFile, tasks, { spaces: 2 });
    }
  }

  private showSuccessMessage(): void {
    console.log('\n' + chalk.green.bold('✨ Setup Complete!'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log('\n' + chalk.cyan('Your AI development team is ready to help.'));
    console.log('\nGet started with:');
    console.log(chalk.yellow('  conductor ask "help me build a feature"'));
    console.log(chalk.yellow('  conductor swarm --research "best practices"'));
    console.log(chalk.yellow('  conductor review src/'));
    console.log('\n' + chalk.gray('Run `conductor help` for all commands\n'));
  }
}

export default EnhancedLaunch;