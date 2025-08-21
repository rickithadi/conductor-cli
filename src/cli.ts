#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ContextScanner } from './context-scanner';
import { SubagentGenerator } from './subagent-generator';
import { ClaudeGenerator } from './claude-generator';
import { VSCodeIntegration } from './vscode-integration';
import { ExternalCollaborationMode } from './external-collaboration';
import { ApprovalSystem } from './approval-system';
import { CheckpointSystem } from './checkpoint-system';
import { TUIDashboard } from './tui-dashboard';
import { SecurityScanner } from './security-scanner';
import { CoordinationMode } from './types';

const program = new Command();

program
  .name('multi-agent')
  .description('Multi-agent development CLI with subagent coordination')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize multi-agent setup for current project')
  .option('-f, --framework <framework>', 'Specify framework manually')
  .option('-m, --mode <mode>', 'Coordination mode (subagents|external-files)', 'subagents')
  .option('--no-vscode', 'Skip VSCode integration setup')
  .option('--force', 'Overwrite existing configuration')
  .action(async (options) => {
    try {
      await initializeProject(options);
    } catch (error) {
      console.error(chalk.red('Error initializing project:'), error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show current multi-agent configuration status')
  .action(async () => {
    await showStatus();
  });

program
  .command('agents')
  .description('List available agents for current project')
  .action(async () => {
    await listAgents();
  });

program
  .command('update')
  .description('Update multi-agent configuration based on current project state')
  .action(async () => {
    await updateConfiguration();
  });

program
  .command('templates')
  .description('List available project templates')
  .action(async () => {
    await listTemplates();
  });

program
  .command('create <projectName>')
  .description('Create new project with multi-agent setup')
  .option('-t, --template <template>', 'Project template to use')
  .option('-m, --mode <mode>', 'Coordination mode (subagents|external-files)', 'subagents')
  .action(async (projectName, options) => {
    await createProject(projectName, options);
  });

program
  .command('proposals')
  .description('Manage change proposals and approvals')
  .option('-l, --list', 'List pending proposals')
  .option('-r, --review <id>', 'Review specific proposal')
  .option('-c, --create', 'Create new proposal interactively')
  .action(async (options) => {
    await manageProposals(options);
  });

program
  .command('recommend <task>')
  .description('Get multi-agent recommendations for a task')
  .option('-t, --type <type>', 'Task type (feature|bugfix|refactor|optimization|security|design)', 'feature')
  .option('--tui', 'Use Terminal UI dashboard (experimental)')
  .action(async (task, options) => {
    await getRecommendations(task, options);
  });

program
  .command('checkpoint')
  .description('Manage session checkpoints')
  .option('-c, --create', 'Create a new checkpoint')
  .option('-l, --list', 'List available checkpoints')
  .option('-r, --restore <id>', 'Restore from checkpoint')
  .option('-s, --status', 'Show context window status')
  .option('--config', 'Show checkpoint configuration')
  .action(async (options) => {
    await manageCheckpoints(options);
  });

program
  .command('scan')
  .description('Security and code quality scanning')
  .option('--security', 'Run security vulnerability scan')
  .option('--deps', 'Scan dependencies for vulnerabilities')
  .option('--detailed', 'Generate detailed report')
  .option('--json', 'Output results as JSON')
  .option('-o, --output <path>', 'Output report to file')
  .action(async (options) => {
    await runSecurityScan(options);
  });

program
  .command('audit')
  .description('Comprehensive security and compliance audit')
  .option('--compliance <type>', 'Compliance framework (gdpr|hipaa|sox)')
  .option('--detailed', 'Generate detailed audit report')
  .action(async (options) => {
    await runSecurityAudit(options);
  });

async function runSecurityScan(options: any): Promise<void> {
  console.log(chalk.blue('AEGIS SECURITY SCAN'));
  console.log(chalk.gray('═'.repeat(50)));
  
  try {
    const scanner = new SecurityScanner();
    const result = await scanner.scanProject();
    
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    }
    
    if (options.detailed) {
      const reportPath = await scanner.generateDetailedReport(result, options.output);
      console.log(chalk.green(`Detailed report: ${reportPath}`));
    }
  } catch (error) {
    console.error(chalk.red('Security scan failed:'), error);
  }
}

async function runSecurityAudit(options: any): Promise<void> {
  console.log(chalk.blue('AEGIS SECURITY AUDIT'));
  console.log(chalk.gray('═'.repeat(50)));
  
  try {
    const scanner = new SecurityScanner();
    const result = await scanner.scanProject();
    
    console.log(`Security Score: ${calculateSecurityScore(result)}/100`);
    
    if (options.compliance) {
      console.log(`Compliance Framework: ${options.compliance.toUpperCase()}`);
      // Add compliance-specific checks here
    }
    
    if (options.detailed) {
      await scanner.generateDetailedReport(result);
    }
  } catch (error) {
    console.error(chalk.red('Security audit failed:'), error);
  }
}

function calculateSecurityScore(result: any): number {
  const baseScore = 100;
  const criticalPenalty = result.critical.length * 20;
  const highPenalty = result.high.length * 10;
  const mediumPenalty = result.medium.length * 5;
  
  return Math.max(0, baseScore - criticalPenalty - highPenalty - mediumPenalty);
}

async function initializeProject(options: any): Promise<void> {
  const projectPath = process.cwd();
  const mode: CoordinationMode = options.mode === 'external-files' ? 'external-files' : 'subagents';

  console.log(chalk.blue('Analyzing project structure...'));
  
  // Scan project context
  const scanner = new ContextScanner(projectPath);
  const projectContext = await scanner.scan();

  // Display detected information
  console.log(chalk.green('Project Analysis Complete'));
  console.log(chalk.yellow('Detected Configuration:'));
  console.log(`   Framework: ${chalk.cyan(projectContext.framework)}`);
  console.log(`   Language: ${chalk.cyan(projectContext.language)}`);
  console.log(`   Package Manager: ${chalk.cyan(projectContext.packageManager)}`);
  
  const features = [];
  if (projectContext.hasTypeScript) features.push('TypeScript');
  if (projectContext.hasDatabase) features.push('Database');
  if (projectContext.hasAuthentication) features.push('Authentication');
  if (projectContext.hasAPI) features.push('API');
  if (projectContext.hasTesting) features.push('Testing');
  if (projectContext.hasLinting) features.push('Linting');
  
  if (features.length > 0) {
    console.log(`   Features: ${chalk.cyan(features.join(', '))}`);
  }

  // Generate subagents
  console.log(chalk.blue('Generating specialized agents...'));
  const subagentGenerator = new SubagentGenerator(projectContext);
  const subagents = subagentGenerator.generateSubagents();

  console.log(chalk.green('Generated Agents:'));
  subagents.forEach(agent => {
    console.log(`   ${chalk.cyan(agent.name)} - ${agent.role}`);
  });

  // Check for existing configuration
  const claudeFile = path.join(projectPath, 'claude.md');
  if (await fs.pathExists(claudeFile) && !options.force) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'claude.md already exists. Overwrite?',
        default: false
      }
    ]);
    
    if (!overwrite) {
      console.log(chalk.yellow('⚠️  Skipping claude.md generation'));
      return;
    }
  }

  // Initialize approval system
  const approvalSystem = new ApprovalSystem(projectPath);
  await approvalSystem.initializeApprovalSystem();
  console.log(chalk.green('Approval system initialized'));

  // Initialize checkpoint system
  const checkpointSystem = new CheckpointSystem(projectPath);
  await checkpointSystem.initialize();
  console.log(chalk.green('Checkpoint system initialized'));

  // Generate Claude context
  console.log(chalk.blue('📝 Generating Claude context...'));
  const claudeGenerator = new ClaudeGenerator(projectContext, subagents, mode);
  await claudeGenerator.writeClaudeFile();
  console.log(chalk.green('Generated: claude.md'));

  // Setup VSCode integration
  if (options.vscode !== false) {
    console.log(chalk.blue('🔧 Setting up VSCode integration...'));
    const vscodeIntegration = new VSCodeIntegration(projectPath, projectContext);
    await vscodeIntegration.setupTerminalProfiles(subagents);
    await vscodeIntegration.generateVSCodeExtensions();
    await vscodeIntegration.createWorkspaceSettings();
    console.log(chalk.green('VSCode integration configured'));
  }

  // Setup external collaboration mode if requested
  if (mode === 'external-files') {
    console.log(chalk.blue('📁 Setting up external collaboration files...'));
    const collaboration = new ExternalCollaborationMode(projectPath, projectContext);
    await collaboration.setupCollaborationFiles(subagents);
    console.log(chalk.green('Collaboration files created'));
  }

  // Display completion message
  console.log(chalk.green('\nMulti-agent setup complete!'));
  console.log(chalk.yellow('\n📋 Next steps:'));
  console.log('   1. Run \'claude-code\' to start with your specialized team');
  console.log('   2. Use agent-specific terminals in VSCode for specialized consultation');
  console.log('   3. Try asking: "What does @frontend think about this component?"');
  console.log('   4. Use \'multi-agent recommend <task>\' for structured recommendations');
  console.log('   5. Review proposals with \'multi-agent proposals --list\'');
}

async function showStatus(): Promise<void> {
  const projectPath = process.cwd();
  const claudeFile = path.join(projectPath, 'claude.md');
  const vscodeDir = path.join(projectPath, '.vscode');
  const approvalDir = path.join(projectPath, '.multi-agent');

  console.log(chalk.blue('Multi-Agent Configuration Status\n'));

  // Check Claude context file
  if (await fs.pathExists(claudeFile)) {
    console.log(chalk.green('Claude context: claude.md'));
    
    // Try to detect mode from file content
    const content = await fs.readFile(claudeFile, 'utf8');
    if (content.includes('External File Collaboration')) {
      console.log(chalk.cyan('   Mode: External file coordination'));
    } else {
      console.log(chalk.cyan('   Mode: Internal subagent coordination'));
    }
  } else {
    console.log(chalk.red('❌ No Claude context found'));
    console.log(chalk.yellow('   Run \'multi-agent init\' to set up'));
  }

  // Check approval system
  if (await fs.pathExists(approvalDir)) {
    console.log(chalk.green('Approval system configured'));
    
    const approvalSystem = new ApprovalSystem(projectPath);
    const proposals = await approvalSystem.listPendingProposals();
    if (proposals.length > 0) {
      console.log(chalk.yellow(`   ${proposals.length} pending proposals`));
    }
  } else {
    console.log(chalk.yellow('⚠️  No approval system found'));
  }

  // Check VSCode integration
  if (await fs.pathExists(vscodeDir)) {
    const settingsFile = path.join(vscodeDir, 'settings.json');
    const tasksFile = path.join(vscodeDir, 'tasks.json');
    
    if (await fs.pathExists(settingsFile)) {
      console.log(chalk.green('VSCode terminal profiles configured'));
    }
    if (await fs.pathExists(tasksFile)) {
      console.log(chalk.green('VSCode tasks configured'));
    }
  } else {
    console.log(chalk.yellow('⚠️  No VSCode integration found'));
  }

  // Show project context
  try {
    const scanner = new ContextScanner(projectPath);
    const context = await scanner.scan();
    console.log(chalk.blue('\n🏗️  Project Information:'));
    console.log(`   Framework: ${chalk.cyan(context.framework)}`);
    console.log(`   Language: ${chalk.cyan(context.language)}`);
    console.log(`   Package Manager: ${chalk.cyan(context.packageManager)}`);
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not analyze project context'));
  }
}

async function listAgents(): Promise<void> {
  const projectPath = process.cwd();
  
  try {
    const scanner = new ContextScanner(projectPath);
    const projectContext = await scanner.scan();
    const subagentGenerator = new SubagentGenerator(projectContext);
    const subagents = subagentGenerator.generateSubagents();

    console.log(chalk.blue('Available Agents for Current Project\n'));
    
    subagents.forEach(agent => {
      console.log(chalk.cyan(`${agent.name} - ${agent.role}`));
      console.log(`   Expertise: ${agent.expertise.slice(0, 3).join(', ')}`);
      console.log(`   Stack: ${agent.technicalStack.slice(0, 3).join(', ')}`);
      console.log('');
    });
  } catch (error) {
    console.error(chalk.red('Error listing agents:'), error);
  }
}

async function updateConfiguration(): Promise<void> {
  console.log(chalk.blue('🔄 Updating multi-agent configuration...'));
  
  const options = {
    force: true,
    vscode: true,
    mode: 'subagents'
  };
  
  await initializeProject(options);
  console.log(chalk.green('Configuration updated'));
}

async function listTemplates(): Promise<void> {
  const templatesDir = path.join(__dirname, '..', 'templates');
  
  if (await fs.pathExists(templatesDir)) {
    const templates = await fs.readdir(templatesDir);
    
    console.log(chalk.blue('📋 Available Project Templates\n'));
    
    for (const template of templates) {
      const templatePath = path.join(templatesDir, template);
      const stat = await fs.stat(templatePath);
      
      if (stat.isDirectory()) {
        console.log(chalk.cyan(`${template}`));
        
        // Try to read template description
        const descFile = path.join(templatePath, 'description.md');
        if (await fs.pathExists(descFile)) {
          const desc = await fs.readFile(descFile, 'utf8');
          const firstLine = desc.split('\n')[0];
          console.log(`   ${firstLine}`);
        }
        console.log('');
      }
    }
  } else {
    console.log(chalk.yellow('No templates directory found'));
  }
}

async function createProject(projectName: string, options: any): Promise<void> {
  const projectPath = path.join(process.cwd(), projectName);
  
  if (await fs.pathExists(projectPath)) {
    console.error(chalk.red(`Project directory ${projectName} already exists`));
    return;
  }
  
  console.log(chalk.blue(`📁 Creating project: ${projectName}`));
  
  if (options.template) {
    const templatesDir = path.join(__dirname, '..', 'templates');
    const templatePath = path.join(templatesDir, options.template);
    
    if (await fs.pathExists(templatePath)) {
      console.log(chalk.blue(`📋 Using template: ${options.template}`));
      await fs.copy(templatePath, projectPath);
    } else {
      console.error(chalk.red(`Template ${options.template} not found`));
      return;
    }
  } else {
    // Create minimal project structure
    await fs.ensureDir(projectPath);
    await fs.writeJson(path.join(projectPath, 'package.json'), {
      name: projectName,
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1'
      },
      keywords: [],
      author: '',
      license: 'ISC'
    }, { spaces: 2 });
  }
  
  // Initialize multi-agent setup in new project
  process.chdir(projectPath);
  
  const initOptions = {
    mode: options.mode || 'subagents',
    vscode: true,
    force: true
  };
  
  await initializeProject(initOptions);
  
  console.log(chalk.green(`\nProject ${projectName} created successfully!`));
  console.log(chalk.yellow('Next steps:'));
  console.log(`   cd ${projectName}`);
  console.log('   claude-code');
}

async function manageProposals(options: any): Promise<void> {
  const approvalSystem = new ApprovalSystem();
  await approvalSystem.initializeApprovalSystem();
  
  if (options.list) {
    const proposals = await approvalSystem.listPendingProposals();
    
    if (proposals.length === 0) {
      console.log(chalk.yellow('📭 No pending proposals'));
      return;
    }
    
    console.log(chalk.blue('📋 Pending Change Proposals\n'));
    proposals.forEach(proposal => {
      console.log(chalk.cyan(`${proposal.id}`));
      console.log(`   📋 ${proposal.title}`);
      console.log(`   Type: ${proposal.type}`);
      console.log(`   ⚡ Priority: ${proposal.priority}`);
      console.log(`   📅 Created: ${new Date(proposal.createdAt).toLocaleDateString()}`);
      console.log(`   Agents: ${proposal.agentRecommendations.length} recommendations`);
      console.log('');
    });
    
    console.log(chalk.yellow(`Use 'multi-agent proposals --review <id>' to review a specific proposal`));
  }
  
  if (options.review) {
    const proposals = await approvalSystem.listPendingProposals();
    const proposal = proposals.find(p => p.id === options.review);
    
    if (!proposal) {
      console.error(chalk.red(`Proposal ${options.review} not found`));
      return;
    }
    
    await approvalSystem.presentProposalForApproval(proposal);
  }
  
  if (options.create) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Proposal title:'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Proposal description:'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Proposal type:',
        choices: ['feature', 'bugfix', 'refactor', 'optimization', 'security', 'design']
      }
    ]);
    
    // Get agent recommendations
    const scanner = new ContextScanner();
    const projectContext = await scanner.scan();
    const subagentGenerator = new SubagentGenerator(projectContext);
    const subagents = subagentGenerator.generateSubagents();
    
    const agentRecommendations = await approvalSystem.getAgentRecommendations(
      answers.title,
      subagents
    );
    
    const proposal = await approvalSystem.createProposal(
      answers.title,
      answers.description,
      answers.type,
      agentRecommendations
    );
    
    console.log(chalk.green(`Proposal created: ${proposal.id}`));
    
    const { reviewNow } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'reviewNow',
        message: 'Review proposal now?',
        default: true
      }
    ]);
    
    if (reviewNow) {
      await approvalSystem.presentProposalForApproval(proposal);
    }
  }
}

async function getRecommendations(task: string, options: any): Promise<void> {
  console.log(chalk.blue(`Getting multi-agent recommendations for: ${task}\n`));
  
  try {
    const scanner = new ContextScanner();
    const projectContext = await scanner.scan();
    const subagentGenerator = new SubagentGenerator(projectContext);
    const subagents = subagentGenerator.generateSubagents();
    
    const approvalSystem = new ApprovalSystem();
    await approvalSystem.initializeApprovalSystem();
    const recommendations = await approvalSystem.getAgentRecommendations(task, subagents);
    
    // Create a proposal for this task
    const proposal = await approvalSystem.createProposal(
      task,
      `Implementation of: ${task}`,
      options.type,
      recommendations
    );
    
    // Present for approval - Use TUI if requested
    if (options.tui) {
      const tui = new TUIDashboard();
      try {
        const action = await tui.showProposalDashboard(proposal);
        console.log(chalk.green(`Action selected: ${action}`));
      } finally {
        tui.destroy();
      }
    } else {
      await approvalSystem.presentProposalForApproval(proposal);
    }
    
  } catch (error) {
    console.error(chalk.red('Error getting recommendations:'), error);
  }
}

async function manageCheckpoints(options: any): Promise<void> {
  const checkpointSystem = new CheckpointSystem();
  await checkpointSystem.initialize();

  if (options.status) {
    const status = await checkpointSystem.getContextWindowStatus();
    
    console.log(chalk.blue('Context Window Status\n'));
    console.log(`Usage: ${Math.round(status.utilization * 100)}%`);
    console.log(`Tokens Used: ${status.tokensUsed.toLocaleString()}`);
    console.log(`Tokens Remaining: ${status.tokensRemaining.toLocaleString()}`);
    
    const statusColor = status.status === 'critical' ? 'red' : 
                       status.status === 'warning' ? 'yellow' : 'green';
    console.log(`Status: ${chalk[statusColor](status.status.toUpperCase())}`);
    
    if (status.status === 'critical') {
      console.log(chalk.red('\n🚨 Critical: Create checkpoint immediately!'));
      console.log(chalk.yellow('Run: multi-agent checkpoint --create'));
    } else if (status.status === 'warning') {
      console.log(chalk.yellow('\n⚠️ Warning: Consider creating checkpoint soon'));
    }
    
    return;
  }

  if (options.list) {
    const checkpoints = await checkpointSystem.listCheckpoints();
    
    if (checkpoints.length === 0) {
      console.log(chalk.yellow('📭 No checkpoints found'));
      return;
    }

    console.log(chalk.blue('Available Checkpoints\n'));
    checkpoints.forEach(cp => {
      const age = Math.round((Date.now() - new Date(cp.timestamp).getTime()) / (1000 * 60 * 60));
      const utilization = Math.round(cp.contextWindowUtilization * 100);
      
      console.log(chalk.cyan(`${cp.id}`));
      console.log(`   📅 Created: ${new Date(cp.timestamp).toLocaleString()} (${age}h ago)`);
      console.log(`   Context: ${utilization}% utilized`);
      console.log(`   Focus: ${cp.currentSession.currentFocus || 'No focus set'}`);
      console.log(`   Tasks: ${cp.currentSession.tasksCompleted.length} completed, ${cp.currentSession.tasksInProgress.length} in progress`);
      console.log('');
    });
    
    console.log(chalk.yellow(`Use 'multi-agent checkpoint --restore <id>' to restore a checkpoint`));
    return;
  }

  if (options.restore) {
    const checkpoint = await checkpointSystem.restoreCheckpoint(options.restore);
    
    if (checkpoint) {
      console.log(chalk.green('\nCheckpoint restored successfully!'));
      console.log(chalk.blue('\n📋 Session Summary:'));
      console.log(`   Project: ${checkpoint.projectContext.framework} (${checkpoint.projectContext.language})`);
      console.log(`   Agents: ${checkpoint.activeAgents.length} active`);
      console.log(`   Focus: ${checkpoint.currentSession.currentFocus || 'None'}`);
      
      if (checkpoint.nextSteps.length > 0) {
        console.log(chalk.yellow('\nNext Steps:'));
        checkpoint.nextSteps.forEach(step => console.log(`   - ${step}`));
      }
      
      if (checkpoint.warnings.length > 0) {
        console.log(chalk.red('\n⚠️ Warnings:'));
        checkpoint.warnings.forEach(warning => console.log(`   - ${warning}`));
      }

      // Generate restart prompt file
      const restartPrompt = checkpointSystem.generateRestartPrompt(checkpoint);
      const promptPath = path.join(process.cwd(), '.multi-agent', 'restart-context.md');
      await fs.writeFile(promptPath, restartPrompt);
      
      console.log(chalk.green(`\n📝 Restart context saved to: ${promptPath}`));
      console.log(chalk.blue('   Use this file to provide context when restarting Claude Code'));
    }
    return;
  }

  if (options.create) {
    // Create manual checkpoint (would need session data in real implementation)
    console.log(chalk.blue('🔄 Creating manual checkpoint...'));
    
    try {
      const scanner = new ContextScanner();
      const projectContext = await scanner.scan();
      const subagentGenerator = new SubagentGenerator(projectContext);
      const agents = subagentGenerator.generateSubagents();
      
      // Mock session data for manual checkpoint
      const sessionData = {
        tasksCompleted: ['Project analysis completed'],
        tasksInProgress: ['Manual checkpoint creation'],
        tasksPending: [],
        currentFocus: 'Checkpoint management',
        keyDecisions: ['Enabled checkpoint system'],
        importantContext: ['User manually created checkpoint']
      };
      
      const approvalHistory = {
        totalProposals: 0,
        approvedProposals: 0,
        rejectedProposals: 0,
        recentProposals: []
      };
      
      const checkpoint = await checkpointSystem.createCheckpoint(
        projectContext,
        agents,
        sessionData,
        approvalHistory,
        ['Continue with planned development tasks'],
        []
      );
      
      console.log(chalk.green('Manual checkpoint created successfully!'));
      console.log(chalk.cyan(`   Checkpoint ID: ${checkpoint.id}`));
      
    } catch (error) {
      console.error(chalk.red('Error creating checkpoint:'), error);
    }
    return;
  }

  if (options.config) {
    const configPath = path.join(process.cwd(), '.multi-agent', 'checkpoint-config.json');
    
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      
      console.log(chalk.blue('⚙️ Checkpoint Configuration\n'));
      console.log(`Enabled: ${config.enabled ? chalk.green('Yes') : chalk.red('No')}`);
      console.log(`Warning Threshold: ${Math.round(config.warningThreshold * 100)}%`);
      console.log(`Checkpoint Threshold: ${Math.round(config.checkpointThreshold * 100)}%`);
      console.log(`Max Context Tokens: ${config.maxContextTokens.toLocaleString()}`);
      console.log(`Auto Restart: ${config.autoRestart ? chalk.yellow('Yes') : 'No'}`);
      console.log(`Save Frequency: Every ${config.saveFrequency} interactions`);
      console.log(`Retention: ${config.retentionDays} days`);
      
      console.log(chalk.yellow(`\nEdit configuration: ${configPath}`));
    } else {
      console.log(chalk.red('⚠️ Checkpoint configuration not found'));
      console.log(chalk.yellow('Run: multi-agent init --force'));
    }
    return;
  }

  // Default: show help
  console.log(chalk.yellow('Please specify an option:'));
  console.log('  --status    Show context window status');
  console.log('  --list      List available checkpoints');
  console.log('  --create    Create a new checkpoint');
  console.log('  --restore   Restore from checkpoint');
  console.log('  --config    Show configuration');
}

if (require.main === module) {
  program.parse();
}

export { program };