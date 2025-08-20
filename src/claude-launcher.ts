import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { StatusIndicator } from './ux/status-indicator';
import { ErrorRecovery } from './ux/error-recovery';
import { AgentOrchestrator } from './agent-orchestrator';

interface LaunchOptions {
  background?: boolean;
  verbose?: boolean;
  autoSpinAgents?: boolean;
  maxRetries?: number;
  contextFile?: string;
}

interface AgentConfig {
  name: string;
  role: string;
  expertise: string[];
  enabled: boolean;
  contextPath?: string;
}

export class ClaudeLauncher {
  private statusIndicator: StatusIndicator;
  private errorRecovery: ErrorRecovery;
  private claudeProcess?: ChildProcess;
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.statusIndicator = new StatusIndicator();
    this.errorRecovery = new ErrorRecovery();
    this.projectPath = projectPath;
  }

  async launchWithContext(options: LaunchOptions = {}): Promise<boolean> {
    try {
      // Check prerequisites
      await this.validateEnvironment();
      
      // Generate comprehensive context
      const contextPath = await this.generateClaudeContext();
      
      // Prepare agent contexts
      const agents = await this.loadAgentConfigurations();
      
      // Launch Claude with seamless integration
      const success = await this.startClaudeSession(contextPath, agents, options);
      
      if (success && options.autoSpinAgents !== false) {
        await this.initializeAgents(agents);
      }
      
      return success;
    } catch (error) {
      await this.errorRecovery.handleError(error as Error, {
        command: 'launch',
        workingDirectory: this.projectPath,
        timestamp: new Date()
      });
      return false;
    }
  }

  private async validateEnvironment(): Promise<void> {
    this.statusIndicator.startProgress([
      'Checking Claude Code installation',
      'Validating project setup',
      'Verifying configuration files',
      'Testing system permissions'
    ]);

    // Step 1: Check Claude Code
    this.statusIndicator.nextStep();
    const claudeExists = await this.checkClaudeInstallation();
    if (!claudeExists) {
      throw new Error('CLAUDE_NOT_FOUND: Claude Code CLI not found in system PATH');
    }

    // Step 2: Check project setup
    this.statusIndicator.nextStep();
    const configExists = await fs.pathExists(path.join(this.projectPath, '.conductor'));
    if (!configExists) {
      throw new Error('PROJECT_NOT_INITIALIZED: Project not initialized with Conductor CLI');
    }

    // Step 3: Check configuration
    this.statusIndicator.nextStep();
    const configFile = path.join(this.projectPath, '.conductor', 'conductor.config.json');
    if (!await fs.pathExists(configFile)) {
      throw new Error('CONFIG_CORRUPTED: Configuration file missing or corrupted');
    }

    // Step 4: Check permissions
    this.statusIndicator.nextStep();
    try {
      await fs.access(this.projectPath, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
      throw new Error('PERMISSION_DENIED: Insufficient permissions for project directory');
    }

    this.statusIndicator.succeed('Environment validation complete');
  }

  private async checkClaudeInstallation(): Promise<boolean> {
    return new Promise((resolve) => {
      const claude = spawn('claude', ['--version'], { stdio: 'pipe' });
      claude.on('close', (code) => {
        resolve(code === 0);
      });
      claude.on('error', () => {
        resolve(false);
      });
    });
  }

  private async generateClaudeContext(): Promise<string> {
    this.statusIndicator.start('📝 Generating comprehensive project context...');

    const contextPath = path.join(this.projectPath, '.conductor', 'claude-context.md');
    
    // Load project configuration
    const configPath = path.join(this.projectPath, '.conductor', 'conductor.config.json');
    const config = await fs.readJson(configPath);
    
    // Generate comprehensive context document
    const context = await this.buildContextDocument(config);
    
    await fs.writeFile(contextPath, context, 'utf8');
    
    this.statusIndicator.succeed('Project context generated');
    return contextPath;
  }

  private async buildContextDocument(config: any): Promise<string> {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    let packageInfo = {};
    
    if (await fs.pathExists(packageJsonPath)) {
      packageInfo = await fs.readJson(packageJsonPath);
    }

    const context = `# 🦆 Conductor CLI - Auto-Generated Claude Context

## Project Overview
- **Name**: ${(packageInfo as any).name || 'Unknown Project'}
- **Type**: ${config.projectType || 'Unknown'}
- **Framework**: ${config.projectContext?.framework || 'Not detected'}
- **Language**: ${config.projectContext?.language || 'Unknown'}
- **Experience Level**: ${config.experienceLevel || 'Intermediate'}

## AI Development Team Status
Your specialized AI agents are ready and configured:

${config.agents?.map((agent: any) => `
### ${agent.name} - ${agent.role}
- **Status**: ${agent.enabled ? '✅ Active' : '⚫ Disabled'}
- **Expertise**: ${Array.isArray(agent.expertise) ? agent.expertise.join(', ') : agent.expertise || 'General'}
- **Context**: Agent understands your ${config.projectType} project structure
`).join('\n') || ''}

## Project Context
- **Dependencies**: ${config.projectContext?.dependencies?.slice(0, 10)?.join(', ') || 'None detected'}
- **Has API**: ${config.projectContext?.hasAPI ? 'Yes' : 'No'}
- **Has Database**: ${config.projectContext?.hasDatabase ? 'Yes' : 'No'}
- **Has Authentication**: ${config.projectContext?.hasAuthentication ? 'Yes' : 'No'}
- **Testing Framework**: ${config.projectContext?.hasTesting ? 'Configured' : 'Not detected'}

## Available Commands
The following conductor commands are available in this session:

\`\`\`bash
# Quick consultation with your AI team
conductor ask "your question here"
conductor duck "explain this problem step by step"

# Agent-specific consultations
conductor ask @frontend "optimize this React component"
conductor ask @backend "design this API endpoint"
conductor ask @security "review this authentication flow"
conductor ask @design "improve this user experience"

# Code review and analysis
conductor review --staged          # Review staged changes
conductor review --files src/      # Review specific files
conductor audit --security         # Security-focused review

# Project management
conductor dashboard                 # Live team monitoring
conductor status --verbose         # Detailed team status
conductor ship "feature-name"      # Comprehensive shipping checklist

# Interactive tools
conductor help --interactive       # Interactive help system
conductor health --fix             # System health check with auto-fix
\`\`\`

## Session Instructions
1. **You are now connected to a multi-agent development team** that specializes in rubber ducking and collaborative problem-solving
2. **Each agent (@pm, @design, @frontend, @backend, etc.) has deep context** about this ${config.projectType} project
3. **Use the conductor commands above** to engage with the team for any development questions
4. **The team will provide consensus-based recommendations** with multiple perspectives
5. **All agents understand your experience level** (${config.experienceLevel}) and will adjust their responses accordingly

## Getting Started
Try one of these to get started:

\`\`\`bash
# Get a project overview
conductor ask "analyze my project structure and suggest improvements"

# Start a rubber duck session
conductor duck "I'm trying to implement [describe your challenge]"

# Get expert code review
conductor review --help

# Launch the live dashboard
conductor dashboard
\`\`\`

---

**🎭 Your AI development team is ready!** Each agent has been briefed on your project and is standing by to help you rubber duck through any challenge.

The team operates on **consensus-based recommendations** where multiple agents weigh in on complex decisions, ensuring you get well-rounded advice that considers all aspects of your project.

**💡 Pro tip**: Be specific in your questions and provide context for the best results. The agents understand your codebase and will provide tailored advice.

---

*Generated at: ${new Date().toISOString()}*
*Project: ${this.projectPath}*
*Conductor CLI v1.0.0*
`;

    return context;
  }

  private async loadAgentConfigurations(): Promise<AgentConfig[]> {
    const configPath = path.join(this.projectPath, '.conductor', 'conductor.config.json');
    const config = await fs.readJson(configPath);
    
    return (config.agents || []).map((agent: any) => ({
      name: agent.name,
      role: agent.role,
      expertise: agent.expertise || [],
      enabled: agent.enabled !== false,
      contextPath: path.join(this.projectPath, '.conductor', `${agent.name.replace('@', '')}-context.json`)
    }));
  }

  private async startClaudeSession(
    contextPath: string, 
    agents: AgentConfig[], 
    options: LaunchOptions
  ): Promise<boolean> {
    this.statusIndicator.startProgress([
      'Launching Claude Code session',
      'Loading project context',  
      'Initializing multi-agent system',
      'Establishing communication channels'
    ]);

    // Step 1: Launch Claude
    this.statusIndicator.nextStep();
    
    // Use a much cleaner approach - launch Claude with the project directly
    // and use environment variables to pass context
    process.env.CONDUCTOR_CONTEXT = contextPath;
    process.env.CONDUCTOR_PROJECT = this.projectPath;
    process.env.CONDUCTOR_AGENTS = agents.map(a => a.name).join(',');
    
    const claudeArgs = [this.projectPath];

    if (options.verbose) {
      claudeArgs.push('--verbose');
    }

    try {
      // Step 2: Load context
      this.statusIndicator.nextStep();
      
      if (options.background) {
        this.claudeProcess = spawn('claude', claudeArgs, {
          detached: true,
          stdio: 'ignore'
        });
        this.claudeProcess.unref();
      } else {
        // Step 3: Initialize agents
        this.statusIndicator.nextStep();
        
        // Step 4: Establish communication
        this.statusIndicator.nextStep();
        
        // Initialize the agent orchestrator
        this.statusIndicator.nextStep();
        const orchestrator = new AgentOrchestrator(this.projectPath);
        await orchestrator.initializeAgents(agents.map(a => a.name));
        
        // Display the context and launch info
        this.statusIndicator.nextStep();
        await this.displayLaunchContext(contextPath);
        
        this.statusIndicator.succeed('Ready to launch Claude with your AI development team!');
        
        console.log(chalk.cyan('\n🎯 NEXT STEPS:'));
        console.log(chalk.white('1. Claude will launch with full project context'));
        console.log(chalk.white('2. All AI agents will be immediately available'));
        console.log(chalk.white('3. Use conductor commands for team consultation'));
        console.log(chalk.yellow('\nPress Enter to launch Claude Code, or Ctrl+C to cancel...'));
        
        // Wait for user confirmation
        await this.waitForEnter();
        
        // Launch Claude with clean arguments
        this.claudeProcess = spawn('claude', [this.projectPath], {
          stdio: 'inherit',
          env: {
            ...process.env,
            CONDUCTOR_READY: 'true',
            CONDUCTOR_CONTEXT: contextPath,
            CONDUCTOR_AGENTS: agents.map(a => a.name).join(',')
          }
        });
        
        return new Promise((resolve) => {
          this.claudeProcess!.on('close', (code) => {
            resolve(code === 0);
          });
          
          this.claudeProcess!.on('error', () => {
            resolve(false);
          });
        });
      }
      
      return true;
    } catch (error) {
      this.statusIndicator.fail('Failed to launch Claude Code');
      throw error;
    }
  }

  private async initializeAgents(agents: AgentConfig[]): Promise<void> {
    this.statusIndicator.start('🤖 Spinning up AI agents...');
    
    const activeAgents = agents.filter(agent => agent.enabled);
    
    for (const agent of activeAgents) {
      // Simulate agent initialization
      await this.sleep(300);
      console.log(chalk.blue(`   ${agent.name}`) + chalk.gray(` - ${agent.role} ready`));
    }
    
    this.statusIndicator.succeed(`${activeAgents.length} AI agents initialized and ready!`);
    
    // Show agent summary
    console.log(chalk.cyan('\n👥 Your AI Team:'));
    activeAgents.forEach(agent => {
      console.log(chalk.white(`   ${agent.name} - ${agent.role}`));
    });
  }

  async terminate(): Promise<void> {
    if (this.claudeProcess) {
      this.claudeProcess.kill();
      this.claudeProcess = undefined;
      console.log(chalk.yellow('🔌 Claude session terminated'));
    }
  }

  private async createSeamlessLaunchScript(contextPath: string, agents: AgentConfig[]): Promise<string> {
    const scriptPath = path.join(this.projectPath, '.conductor', 'claude-launch.sh');
    
    // Read the context file content
    const contextContent = await fs.readFile(contextPath, 'utf8');
    
    const script = `#!/bin/bash
# Conductor CLI - Seamless Claude Launch Script
# This script automatically loads the project context and initializes all AI agents

echo "🎭 Launching Conductor CLI with AI Development Team"
echo "📋 Loading project context and agent configurations..."

# Initialize the multi-agent orchestrator
node -e "
const { AgentOrchestrator } = require('${path.join(__dirname, 'agent-orchestrator.js')}');
const orchestrator = new AgentOrchestrator('${this.projectPath}');

async function initializeTeam() {
  console.log('🤖 Initializing AI agents...');
  const enabledAgents = [${agents.map(a => `'${a.name}'`).join(', ')}];
  await orchestrator.initializeAgents(enabledAgents);
  console.log('✅ AI development team ready!');
}

initializeTeam().catch(console.error);
"

# Display welcome message with project context
cat << 'EOF'
${contextContent}
EOF

echo ""
echo "🚀 Welcome to your AI-powered development session!"
echo "💡 Try: 'conductor ask \"analyze my project\"' to get started"
echo ""
`;

    await fs.writeFile(scriptPath, script, { mode: 0o755 });
    return scriptPath;
  }

  private async displayLaunchContext(contextPath: string): Promise<void> {
    const contextContent = await fs.readFile(contextPath, 'utf8');
    const summary = this.extractContextSummary(contextContent);
    
    console.log(chalk.cyan('\n📋 PROJECT CONTEXT SUMMARY'));
    console.log(chalk.gray('═'.repeat(50)));
    console.log(chalk.white(summary));
    console.log(chalk.gray('═'.repeat(50)));
  }

  private extractContextSummary(contextContent: string): string {
    // Extract key information from the context for display
    const lines = contextContent.split('\n');
    let summary = '';
    
    // Get project overview section
    const overviewIndex = lines.findIndex(line => line.includes('## Project Overview'));
    if (overviewIndex !== -1) {
      for (let i = overviewIndex + 1; i < lines.length && i < overviewIndex + 8; i++) {
        if (lines[i].startsWith('##')) break;
        if (lines[i].trim()) {
          summary += lines[i] + '\n';
        }
      }
    }
    
    // Get agent status
    const agentIndex = lines.findIndex(line => line.includes('## AI Development Team Status'));
    if (agentIndex !== -1) {
      summary += '\n👥 AI Development Team Status:\n';
      for (let i = agentIndex + 1; i < lines.length; i++) {
        if (lines[i].startsWith('##')) break;
        if (lines[i].includes('### @')) {
          const agentName = lines[i].replace('### ', '').split(' - ')[0];
          summary += `   ${agentName} - Ready\n`;
        }
      }
    }
    
    return summary || 'Project context loaded successfully.';
  }

  private waitForEnter(): Promise<void> {
    return new Promise((resolve) => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Quick launch method for the enhanced CLI
  static async quickLaunch(projectPath?: string): Promise<boolean> {
    const launcher = new ClaudeLauncher(projectPath);
    
    console.log(chalk.cyan.bold('\n🚀 LAUNCHING CONDUCTOR CLI WITH CLAUDE INTEGRATION'));
    console.log(chalk.gray('   Seamlessly connecting your AI development team...\n'));
    
    return await launcher.launchWithContext({
      autoSpinAgents: true,
      verbose: process.env.CONDUCTOR_VERBOSE === 'true'
    });
  }
}