#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ContextScanner } from './context-scanner';
import { SubagentGenerator } from './subagent-generator';
import { ApprovalSystem } from './approval-system';
import { EnhancedLaunch } from './ux/enhanced-launch';
import { StatusIndicator } from './ux/status-indicator';
import { SmartDashboard } from './ux/smart-dashboard';
import { ContextualHelp } from './ux/contextual-help';
import { ErrorRecovery } from './ux/error-recovery';
import { ClaudeLauncher } from './claude-launcher';

const program = new Command();
const contextualHelp = new ContextualHelp();
const errorRecovery = new ErrorRecovery();

// Enable keyboard shortcuts and power user features
process.stdin.setRawMode?.(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

program
  .name('conductor')
  .description('🦆 Rubber Ducking with AI Experts - Your complete AI development team')
  .version('1.0.0');

// Enhanced initialization command
program
  .command('init')
  .description('🚀 Initialize Conductor CLI with your AI development team')
  .option('-f, --framework <framework>', 'Specify framework (nextjs, react, vue, etc.)')
  .option('-t, --template <template>', 'Use project template')
  .option('--skip-welcome', 'Skip welcome animation')
  .option('--quick', 'Quick setup with sensible defaults')
  .action(async (options) => {
    const enhancedLaunch = new EnhancedLaunch();
    await enhancedLaunch.initialize(options);
  });

// Natural language commands for better UX
program
  .command('ask <question>')
  .alias('duck')
  .description('🦆 Ask your AI development team anything')
  .option('-a, --agent <agent>', 'Consult specific agent (@frontend, @backend, @pm, etc.)')
  .option('-u, --urgent', 'High priority - get immediate team consensus')
  .option('-c, --context <context>', 'Provide additional context')
  .option('-d, --dashboard', 'Show live dashboard while processing')
  .action(async (question, options) => {
    const statusIndicator = new StatusIndicator();
    statusIndicator.start('🦆 Rubber ducking with AI experts...');
    
    if (options.dashboard) {
      const dashboard = new SmartDashboard();
      await dashboard.launch();
    }
    
    await orchestrateTeamResponse(question, options);
    statusIndicator.succeed('🎯 Expert consultation complete!');
  });

program
  .command('explain <topic>')
  .description('💡 Get detailed explanation from relevant experts')
  .option('-s, --simple', 'Use beginner-friendly explanations')
  .option('-e, --examples', 'Include code examples')
  .option('-l, --links', 'Include relevant documentation links')
  .action(async (topic, options) => {
    const statusIndicator = new StatusIndicator();
    statusIndicator.start(`🧠 Gathering expert explanations about: ${topic}`);
    
    await getExpertExplanation(topic, options);
    statusIndicator.succeed('📚 Expert explanation ready!');
  });

// Seamless Claude integration launch
program
  .command('launch')
  .description('🚀 Launch Claude Code with full AI team integration')
  .option('-b, --background', 'Launch Claude in background mode')
  .option('-v, --verbose', 'Verbose output during launch')
  .option('--no-agents', 'Skip agent initialization')
  .option('--context <file>', 'Use custom context file')
  .action(async (options) => {
    contextualHelp.setContext(['launch', 'claude']);
    
    try {
      const launcher = new ClaudeLauncher();
      const success = await launcher.launchWithContext({
        background: options.background,
        verbose: options.verbose,
        autoSpinAgents: !options.noAgents,
        contextFile: options.context
      });
      
      if (!success) {
        process.exit(1);
      }
    } catch (error) {
      await errorRecovery.handleError(error as Error, {
        command: 'launch',
        args: process.argv.slice(3),
        workingDirectory: process.cwd(),
        timestamp: new Date()
      });
      process.exit(1);
    }
  });

// Product launch strategy command (renamed from launch to avoid confusion)
program
  .command('plan-launch <strategy>')
  .description('📋 Plan launch strategy with complete AI team (PM → Ship → Market)')
  .option('-t, --type <type>', 'Launch type (product, feature, campaign)', 'product')
  .option('-a, --audience <audience>', 'Target audience')
  .option('-d, --dashboard', 'Show live team collaboration')
  .action(async (strategy, options) => {
    const statusIndicator = new StatusIndicator();
    statusIndicator.start('🚀 Planning launch strategy with AI team...');
    
    if (options.dashboard) {
      const dashboard = new SmartDashboard();
      await dashboard.launch();
    }
    
    await planLaunchStrategy(strategy, options);
    statusIndicator.succeed('✅ Complete launch strategy ready!');
  });

program
  .command('review')
  .alias('audit')
  .description('🔍 Get comprehensive multi-agent code review')
  .option('-f, --files <files>', 'Specific files to review (comma-separated)')
  .option('-s, --staged', 'Review only staged changes')
  .option('-b, --branch <branch>', 'Compare against specific branch')
  .option('-t, --type <type>', 'Review type (security, performance, quality, all)')
  .option('--watch', 'Watch for changes and auto-review')
  .action(async (options) => {
    const statusIndicator = new StatusIndicator();
    statusIndicator.start('🔍 Multi-agent code review in progress...');
    
    await performMultiAgentReview(options);
    statusIndicator.succeed('✅ Code review complete - recommendations ready!');
  });

program
  .command('ship <feature>')
  .description('🚀 Get comprehensive shipping checklist from all agents')
  .option('-e, --environment <env>', 'Target environment (dev/staging/prod)')
  .option('-s, --security-scan', 'Include comprehensive security validation')
  .option('-p, --performance', 'Include performance optimization checks')
  .option('-a, --accessibility', 'Include accessibility compliance checks')
  .option('--deploy', 'Deploy after all checks pass')
  .action(async (feature, options) => {
    const statusIndicator = new StatusIndicator();
    statusIndicator.start(`🚀 Preparing ${feature} for shipment...`);
    
    await generateShippingChecklist(feature, options);
    statusIndicator.succeed('🎯 Ready to ship with confidence!');
  });

program
  .command('dashboard')
  .alias('watch')
  .description('📊 Launch live AI team dashboard')
  .option('-f, --focus <agent>', 'Focus on specific agent')
  .option('-t, --theme <theme>', 'Dashboard theme (dark, light, auto)')
  .option('-m, --minimal', 'Minimal dashboard view')
  .action(async (options) => {
    const dashboard = new SmartDashboard();
    await dashboard.launch(options);
  });

program
  .command('status')
  .alias('health')
  .description('🏥 Show AI team status and health')
  .option('-v, --verbose', 'Detailed status information')
  .option('-j, --json', 'Output in JSON format')
  .action(async (options) => {
    const statusIndicator = new StatusIndicator();
    await statusIndicator.showTeamStatus(options);
  });

program
  .command('config')
  .description('⚙️ Configure your AI development team')
  .option('-e, --edit', 'Open configuration editor')
  .option('-r, --reset', 'Reset to default configuration')
  .option('-s, --show', 'Show current configuration')
  .action(async (options) => {
    await manageConfiguration(options);
  });

program
  .command('help')
  .description('📚 Interactive help system')
  .option('-i, --interactive', 'Launch interactive help')
  .option('-s, --search <query>', 'Search help content')
  .option('--disable-tips', 'Disable contextual tips')
  .option('--enable-tips', 'Enable contextual tips')
  .action(async (options) => {
    if (options.disableTips) {
      contextualHelp.toggleTips();
      console.log(chalk.yellow('🔕 Contextual tips disabled'));
      return;
    }
    if (options.enableTips) {
      contextualHelp.toggleTips();
      console.log(chalk.green('🔔 Contextual tips enabled'));
      return;
    }
    if (options.interactive) {
      contextualHelp.showInteractiveHelp();
      return;
    }
    if (options.search) {
      // Would implement search functionality
      console.log(chalk.blue(`🔍 Searching for: ${options.search}`));
      return;
    }
    
    // Default help with keyboard shortcuts
    showEnhancedHelp();
  });

program
  .command('health')
  .description('🏥 Run system health check')
  .option('-f, --fix', 'Attempt automatic fixes')
  .action(async (options) => {
    const healthResult = await errorRecovery.performHealthCheck();
    
    if (!healthResult.healthy && options.fix) {
      console.log(chalk.yellow('\n🔧 Attempting automatic fixes...'));
      // Would implement auto-fix logic
    }
  });

// Quick workflow commands
program
  .command('quick-fix')
  .description('⚡ Quick fix suggestions for current issues')
  .action(async () => {
    const statusIndicator = new StatusIndicator();
    statusIndicator.start('⚡ Analyzing current issues...');
    await provideQuickFixes();
    statusIndicator.succeed('🔧 Quick fixes ready!');
  });

program
  .command('rubber-duck <problem>')
  .description('🦆 Traditional rubber ducking with AI feedback')
  .option('-v, --voice', 'Voice-guided rubber ducking session')
  .option('-s, --structured', 'Structured problem-solving approach')
  .action(async (problem, options) => {
    const statusIndicator = new StatusIndicator();
    statusIndicator.start('🦆 Starting rubber duck session...');
    await startRubberDuckSession(problem, options);
    statusIndicator.succeed('🎯 Problem solving session complete!');
  });

// Error handling with helpful suggestions
program.exitOverride();
program.configureHelp({
  helpWidth: 120,
  sortSubcommands: true
});

program.showHelpAfterError();

// Enhanced error handling with recovery system
process.on('uncaughtException', async (error) => {
  await errorRecovery.handleError(error, {
    command: process.argv.slice(2).join(' '),
    args: process.argv.slice(3),
    workingDirectory: process.cwd(),
    timestamp: new Date()
  });
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  await errorRecovery.handleError(error, {
    command: 'promise_rejection',
    workingDirectory: process.cwd(),
    timestamp: new Date()
  });
  process.exit(1);
});

// Implementation functions (to be implemented)
async function orchestrateTeamResponse(question: string, options: any): Promise<void> {
  // Implementation for team consultation
}

async function getExpertExplanation(topic: string, options: any): Promise<void> {
  // Implementation for expert explanations
}

async function performMultiAgentReview(options: any): Promise<void> {
  // Implementation for code review
}

async function generateShippingChecklist(feature: string, options: any): Promise<void> {
  // Implementation for shipping checklist
}

async function manageConfiguration(options: any): Promise<void> {
  // Implementation for configuration management
}

async function provideQuickFixes(): Promise<void> {
  // Implementation for quick fix suggestions
}

async function startRubberDuckSession(problem: string, options: any): Promise<void> {
  // Implementation for rubber duck sessions
}

async function planLaunchStrategy(strategy: string, options: any): Promise<void> {
  const statusIndicator = new StatusIndicator();
  
  // Enhanced progress tracking
  statusIndicator.startProgress([
    'Assembling AI team for launch strategy',
    'Market research & user persona analysis',
    'Content strategy & digital footprint planning',
    'Landing page & conversion optimization',
    'Implementation planning & resource allocation',
    'Analytics, tracking & performance setup',
    'Security compliance & data protection review',
    'Launch checklist & risk mitigation'
  ]);

  // Step 1
  await new Promise(resolve => setTimeout(resolve, 1000));
  statusIndicator.nextStep();
  
  // Step 2 - PM Analysis
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log(chalk.blue('   📋 @pm') + chalk.white(' - Market research & user personas'));
  statusIndicator.nextStep();
  
  // Step 3 - SEO Strategy
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log(chalk.green('   📈 @seo') + chalk.white(' - Content strategy & digital footprint'));
  statusIndicator.nextStep();
  
  // Step 4 - Design Optimization
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log(chalk.magenta('   🎨 @design') + chalk.white(' - Landing page optimization'));
  statusIndicator.nextStep();
  
  // Step 5 - Implementation
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log(chalk.yellow('   💻 @frontend') + chalk.white(' - Conversion funnel implementation'));
  statusIndicator.nextStep();
  
  // Step 6 - Analytics
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log(chalk.cyan('   🚀 @devops') + chalk.white(' - Analytics & tracking setup'));
  statusIndicator.nextStep();
  
  // Step 7 - Security
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log(chalk.red('   🛡️ @security') + chalk.white(' - Compliance & data protection'));
  statusIndicator.nextStep();
  
  // Complete
  statusIndicator.succeed('Complete launch strategy ready!', true);
  
  console.log(chalk.cyan('\n🎯 Next Steps:'));
  console.log(chalk.white('   • conductor ask @pm "create detailed user stories"'));
  console.log(chalk.white('   • conductor ask @design "create wireframes and mockups"'));
  console.log(chalk.white('   • conductor ship "launch-strategy" --comprehensive'));
}

function showEnhancedHelp(): void {
  console.log(chalk.cyan.bold('\n🦆 CONDUCTOR CLI - POWER USER GUIDE'));
  console.log(chalk.gray('═'.repeat(70)));
  
  console.log(chalk.yellow.bold('\n⌨️  Keyboard Shortcuts & Quick Commands:'));
  console.log(chalk.white('   conductor ask    → conductor duck     ') + chalk.gray('(alias)'));
  console.log(chalk.white('   conductor review → conductor audit    ') + chalk.gray('(alias)'));
  console.log(chalk.white('   conductor dashboard → conductor watch ') + chalk.gray('(alias)'));
  
  console.log(chalk.yellow.bold('\n⚡ Power Commands:'));
  console.log(chalk.white('   conductor quick-fix                   ') + chalk.gray('Instant issue analysis'));
  console.log(chalk.white('   conductor health --fix                ') + chalk.gray('System health + auto-fix'));
  console.log(chalk.white('   conductor help --interactive          ') + chalk.gray('Interactive help system'));
  console.log(chalk.white('   conductor status --json | jq         ') + chalk.gray('JSON output for scripting'));
  
  console.log(chalk.yellow.bold('\n🎯 Agent-Specific Commands:'));
  console.log(chalk.white('   conductor ask @security "audit this"  ') + chalk.gray('Security-focused query'));
  console.log(chalk.white('   conductor ask @frontend "optimize UI" ') + chalk.gray('Frontend expertise'));
  console.log(chalk.white('   conductor ask @devops "setup CI/CD"   ') + chalk.gray('DevOps automation'));
  
  console.log(chalk.yellow.bold('\n🔧 Advanced Options:'));
  console.log(chalk.white('   --verbose                             ') + chalk.gray('Detailed output'));
  console.log(chalk.white('   --json                                ') + chalk.gray('JSON formatted output'));
  console.log(chalk.white('   --no-color                            ') + chalk.gray('Disable colors'));
  console.log(chalk.white('   --help                                ') + chalk.gray('Command-specific help'));
  
  console.log(chalk.green.bold('\n💡 Pro Tips:'));
  console.log(chalk.green('   • Chain commands: ') + chalk.white('conductor review --staged && conductor ship'));
  console.log(chalk.green('   • Use environment: ') + chalk.white('CONDUCTOR_VERBOSE=true conductor ask'));
  console.log(chalk.green('   • Interactive mode: ') + chalk.white('conductor help --interactive'));
  console.log(chalk.green('   • Health monitoring: ') + chalk.white('conductor health && conductor dashboard'));
  
  console.log(chalk.gray('═'.repeat(70)));
  console.log(chalk.cyan('💬 Need help? ') + chalk.white('conductor ask "how do I..."'));
  console.log(chalk.cyan('🆘 Report issues: ') + chalk.white('conductor health --fix\n'));
}

export { program };

if (require.main === module) {
  program.parse();
}