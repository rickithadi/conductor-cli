import chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ContextScanner } from '../context-scanner';
import { SubagentGenerator } from '../subagent-generator';
import { VSCodeIntegration } from '../vscode-integration';
import { StatusIndicator } from './status-indicator';

interface LaunchOptions {
  framework?: string;
  template?: string;
  skipWelcome?: boolean;
  quick?: boolean;
}

export class EnhancedLaunch {
  private statusIndicator: StatusIndicator;
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.statusIndicator = new StatusIndicator();
  }

  async initialize(options: LaunchOptions): Promise<void> {
    try {
      if (!options.skipWelcome) {
        await this.showWelcomeAnimation();
      }

      if (options.quick) {
        await this.quickSetup();
      } else {
        await this.interactiveSetup(options);
      }

      await this.finalizeSetup();
      await this.showSuccessMessage();
    } catch (error) {
      this.statusIndicator.fail('Setup failed: ' + (error as Error).message);
      throw error;
    }
  }

  private async showWelcomeAnimation(): Promise<void> {
    const frames = [
      '🦆 Welcome to Conductor CLI...',
      '🤖 Assembling your AI development team...',
      '🎭 Orchestrating expert consultation...',
      '⚡ Ready to transform your development workflow!'
    ];

    console.clear();
    console.log(chalk.cyan.bold('\n' + '='.repeat(60)));
    console.log(chalk.cyan.bold('  🦆 CONDUCTOR CLI - RUBBER DUCKING WITH AI EXPERTS'));
    console.log(chalk.cyan.bold('='.repeat(60) + '\n'));

    for (let i = 0; i < frames.length; i++) {
      process.stdout.write('\r' + ' '.repeat(80) + '\r');
      process.stdout.write(chalk.yellow(frames[i]));
      
      // Add dots animation
      for (let j = 0; j < 3; j++) {
        await this.sleep(300);
        process.stdout.write(chalk.gray('.'));
      }
      
      await this.sleep(500);
      
      if (i < frames.length - 1) {
        console.log('');
      }
    }

    console.log(chalk.green('\n✨ Ready to get started!\n'));
    await this.sleep(1000);
  }

  private async interactiveSetup(options: LaunchOptions): Promise<void> {
    this.statusIndicator.info('🔍 Scanning your project...');
    
    const contextScanner = new ContextScanner();
    const projectContext = await contextScanner.scanProject(this.projectPath);
    
    this.statusIndicator.succeed('Project analysis complete!');

    // Interactive questionnaire
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: '🎯 What kind of project are you working on?',
        choices: [
          { name: '🚀 Next.js App (Full-stack)', value: 'nextjs' },
          { name: '⚛️ React SPA', value: 'react' },
          { name: '🌐 Vue.js Application', value: 'vue' },
          { name: '🔧 Node.js API Service', value: 'nodejs' },
          { name: '📚 TypeScript Library', value: 'library' },
          { name: '🤔 Let me describe it...', value: 'custom' }
        ],
        default: projectContext.framework || 'nextjs'
      },
      {
        type: 'input',
        name: 'customDescription',
        message: '📝 Please describe your project:',
        when: (answers) => answers.projectType === 'custom',
        validate: (input) => input.trim().length > 0 || 'Please provide a description'
      },
      {
        type: 'list',
        name: 'primaryGoal',
        message: '🎯 What\'s your main goal today?',
        choices: [
          { name: '🚀 Start a new feature', value: 'feature' },
          { name: '🐛 Debug and fix issues', value: 'debug' },
          { name: '🔍 Code review and optimization', value: 'review' },
          { name: '🦆 Rubber duck a complex problem', value: 'duck' },
          { name: '🛡️ Security audit and improvements', value: 'security' },
          { name: '📚 Learn and understand codebase', value: 'learn' }
        ]
      },
      {
        type: 'checkbox',
        name: 'enabledAgents',
        message: '👥 Which AI experts do you want in your team?',
        choices: [
          { name: '📋 @pm - Product Manager (requirements, planning)', value: 'pm', checked: true },
          { name: '🎨 @design - UX/UI Designer (user flows, interfaces)', value: 'design', checked: true },
          { name: '⚛️ @frontend - Frontend Developer (React, Next.js)', value: 'frontend', checked: true },
          { name: '⚙️ @backend - Backend Engineer (APIs, databases)', value: 'backend', checked: projectContext.hasAPI },
          { name: '🧪 @qa - QA Engineer (testing, quality)', value: 'qa', checked: projectContext.hasTesting },
          { name: '🚀 @devops - DevOps Engineer (CI/CD, deployment)', value: 'devops', checked: false },
          { name: '👁️ @reviewer - Code Reviewer (quality, patterns)', value: 'reviewer', checked: true },
          { name: '🛡️ @security - Security Expert (OWASP, compliance)', value: 'security', checked: true }
        ],
        validate: (choices) => choices.length > 0 || 'Please select at least one agent'
      },
      {
        type: 'confirm',
        name: 'enableVSCodeIntegration',
        message: '🔧 Enable VS Code integration with agent-specific terminals?',
        default: true
      },
      {
        type: 'confirm',
        name: 'enableDashboard',
        message: '📊 Enable live dashboard for real-time agent monitoring?',
        default: true
      },
      {
        type: 'list',
        name: 'experienceLevel',
        message: '🎓 What\'s your experience level with AI-assisted development?',
        choices: [
          { name: '🌱 New to AI development tools', value: 'novice' },
          { name: '🌿 Some experience with AI tools', value: 'intermediate' },
          { name: '🌳 Very experienced with AI development', value: 'expert' }
        ],
        default: 'intermediate'
      }
    ]);

    // Generate configuration
    await this.generateConfiguration(answers, projectContext);
  }

  private async quickSetup(): Promise<void> {
    this.statusIndicator.start('⚡ Quick setup in progress...');
    
    const contextScanner = new ContextScanner();
    const projectContext = await contextScanner.scanProject(this.projectPath);
    
    // Smart defaults based on project analysis
    const defaultConfig = {
      projectType: projectContext.framework || 'nextjs',
      primaryGoal: 'feature',
      enabledAgents: ['pm', 'design', 'frontend', 'reviewer', 'security'],
      enableVSCodeIntegration: true,
      enableDashboard: true,
      experienceLevel: 'intermediate'
    };

    if (projectContext.hasAPI) defaultConfig.enabledAgents.push('backend');
    if (projectContext.hasTesting) defaultConfig.enabledAgents.push('qa');
    if (projectContext.hasDatabase) defaultConfig.enabledAgents.push('backend');

    await this.generateConfiguration(defaultConfig, projectContext);
    this.statusIndicator.succeed('Quick setup complete!');
  }

  private async generateConfiguration(answers: any, projectContext: any): Promise<void> {
    this.statusIndicator.start('🔧 Generating AI team configuration...');

    // Create .conductor directory
    const configDir = path.join(this.projectPath, '.conductor');
    await fs.ensureDir(configDir);

    // Generate agent configurations
    const subagentGenerator = new SubagentGenerator(projectContext);
    const agents = subagentGenerator.generateSubagents()
      .filter(agent => answers.enabledAgents.includes(agent.name.replace('@', '')));

    // Create conductor.config.json
    const config = {
      version: '1.0.0',
      projectType: answers.projectType,
      primaryGoal: answers.primaryGoal,
      experienceLevel: answers.experienceLevel,
      agents: agents.map(agent => ({
        name: agent.name,
        role: agent.role,
        enabled: true,
        expertise: agent.expertise,
        technicalStack: agent.technicalStack
      })),
      features: {
        dashboard: answers.enableDashboard,
        vscodeIntegration: answers.enableVSCodeIntegration,
        autoSuggestions: true,
        contextAware: true
      },
      ui: {
        theme: 'auto',
        animations: true,
        statusIndicators: true,
        progressBars: true
      },
      projectContext: projectContext,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    await fs.writeJson(path.join(configDir, 'conductor.config.json'), config, { spaces: 2 });

    // Generate agent-specific context files
    for (const agent of agents) {
      const agentContext = {
        name: agent.name,
        role: agent.role,
        expertise: agent.expertise,
        specialInstructions: agent.specialInstructions || [],
        projectSpecific: {
          framework: projectContext.framework,
          language: projectContext.language,
          hasDatabase: projectContext.hasDatabase,
          hasAuthentication: projectContext.hasAuthentication,
          dependencies: projectContext.dependencies.slice(0, 10) // Top 10 deps
        }
      };

      await fs.writeJson(
        path.join(configDir, `${agent.name.replace('@', '')}-context.json`),
        agentContext,
        { spaces: 2 }
      );
    }

    // Setup VS Code integration if requested
    if (answers.enableVSCodeIntegration) {
      const vscodeIntegration = new VSCodeIntegration(this.projectPath);
      await vscodeIntegration.setup(agents);
    }

    this.statusIndicator.succeed('AI team configuration generated!');
  }

  private async finalizeSetup(): Promise<void> {
    this.statusIndicator.start('🎯 Finalizing setup...');

    // Create helpful scripts
    const scriptsDir = path.join(this.projectPath, '.conductor', 'scripts');
    await fs.ensureDir(scriptsDir);

    // Claude Code launch script
    const launchScript = `#!/bin/bash
# Conductor CLI Launch Script
echo "🦆 Launching Conductor CLI with Claude Code..."
echo "📋 Loading project context and AI agents..."

# Check if Claude Code is available
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Please install Claude Code first."
    echo "💡 Visit: https://claude.ai/code"
    exit 1
fi

# Launch with project context
claude --project-path="$(pwd)" --load-context=".conductor/conductor.config.json"
`;

    await fs.writeFile(path.join(scriptsDir, 'launch.sh'), launchScript);
    await fs.chmod(path.join(scriptsDir, 'launch.sh'), '755');

    // Create helpful README
    const readmeContent = `# 🦆 Conductor CLI Setup Complete!

Your AI development team is ready to help you rubber duck through any problem.

## 🚀 Quick Start Commands

\`\`\`bash
# Ask your AI team anything
conductor ask "How should I structure my auth flow?"

# Get expert code review
conductor review --staged

# Rubber duck a complex problem
conductor duck "My React state isn't updating properly"

# Launch live dashboard
conductor dashboard

# Ship with confidence
conductor ship "user-authentication" --security-scan
\`\`\`

## 👥 Your AI Team

Your configured agents are ready to help:
- 📋 **@pm** - Product planning and requirements
- 🎨 **@design** - UX/UI design and user flows  
- ⚛️ **@frontend** - React/Next.js development
- ⚙️ **@backend** - API and database architecture
- 🧪 **@qa** - Testing and quality assurance
- 🚀 **@devops** - CI/CD and deployment
- 👁️ **@reviewer** - Code review and best practices
- 🛡️ **@security** - Security and compliance

## 🔧 Configuration

Your team configuration is stored in \`.conductor/conductor.config.json\`.
You can always run \`conductor config --edit\` to modify it.

Happy rubber ducking! 🦆✨
`;

    await fs.writeFile(path.join(this.projectPath, '.conductor', 'README.md'), readmeContent);

    this.statusIndicator.succeed('Setup finalized!');
  }

  private async showSuccessMessage(): Promise<void> {
    console.log('\n' + chalk.green('🎉 SUCCESS! Your AI development team is ready!'));
    console.log(chalk.cyan('\n📋 What you can do now:'));
    
    const suggestions = [
      '🦆 conductor ask "explain my project structure"',
      '🔍 conductor review --help',
      '📊 conductor dashboard',
      '🤔 conductor duck "help me plan my next feature"',
      '🚀 conductor ship --help'
    ];

    suggestions.forEach(suggestion => {
      console.log(chalk.yellow('  • ') + chalk.white(suggestion));
    });

    console.log(chalk.cyan('\n💡 Pro tip: Run ') + chalk.bold.white('conductor dashboard') + chalk.cyan(' for a live view of your AI team!'));
    console.log(chalk.gray('\n📚 Full documentation: ') + chalk.underline.blue('.conductor/README.md'));
    console.log(chalk.green('\n✨ Happy rubber ducking with your AI experts! 🦆'));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}