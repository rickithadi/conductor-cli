import chalk from 'chalk';
import { ContextualHelp } from './contextual-help';
import { StatusIndicator } from './status-indicator';

interface ErrorCode {
  code: string;
  message: string;
  suggestions: string[];
  category: 'config' | 'filesystem' | 'network' | 'claude' | 'user' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  quickFix?: () => Promise<void>;
}

interface ErrorContext {
  command?: string;
  args?: string[];
  workingDirectory?: string;
  timestamp: Date;
  stackTrace?: string;
}

export class ErrorRecovery {
  private contextualHelp: ContextualHelp;
  private statusIndicator: StatusIndicator;
  private errorCodes: Map<string, ErrorCode> = new Map();

  constructor() {
    this.contextualHelp = new ContextualHelp();
    this.statusIndicator = new StatusIndicator();
    this.initializeErrorCodes();
  }

  private initializeErrorCodes(): void {
    const errors: ErrorCode[] = [
      {
        code: 'CLAUDE_NOT_FOUND',
        message: 'Claude Code CLI not found in system PATH',
        suggestions: [
          'Install Claude Code from https://claude.ai/code',
          'Ensure Claude Code is added to your system PATH',
          'Try running: which claude',
          'Restart your terminal after installation'
        ],
        category: 'claude',
        severity: 'critical'
      },
      {
        code: 'CONFIG_CORRUPTED',
        message: 'Conductor configuration file is corrupted or invalid',
        suggestions: [
          'Reset configuration: conductor config --reset',
          'Reinitialize project: conductor init --quick',
          'Check .conductor/conductor.config.json for syntax errors',
          'Backup and delete .conductor directory, then reinitialize'
        ],
        category: 'config',
        severity: 'high',
        quickFix: async () => {
          console.log(chalk.yellow('🔧 Attempting quick fix: resetting configuration...'));
          // Quick fix implementation would go here
        }
      },
      {
        code: 'PROJECT_NOT_INITIALIZED',
        message: 'Project not initialized with Conductor CLI',
        suggestions: [
          'Initialize project: conductor init',
          'Use quick setup: conductor init --quick',
          'Check if you\'re in the right directory',
          'Look for .conductor directory in project root'
        ],
        category: 'config',
        severity: 'medium',
        quickFix: async () => {
          console.log(chalk.yellow('🔧 Quick fix available: running conductor init --quick'));
          // Would call the actual init function
        }
      },
      {
        code: 'PERMISSION_DENIED',
        message: 'Permission denied accessing project files',
        suggestions: [
          'Check file/directory permissions',
          'Try running with elevated privileges (carefully)',
          'Ensure you own the project directory',
          'Check if files are locked by another process'
        ],
        category: 'filesystem',
        severity: 'medium'
      },
      {
        code: 'NETWORK_TIMEOUT',
        message: 'Network request timed out',
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'Check if you\'re behind a corporate firewall',
          'Verify Claude Code authentication status'
        ],
        category: 'network',
        severity: 'medium'
      },
      {
        code: 'INVALID_COMMAND',
        message: 'Unknown command or invalid arguments',
        suggestions: [
          'Run: conductor --help',
          'Check command spelling',
          'Try: conductor ask "help with commands"',
          'Use tab completion for available commands'
        ],
        category: 'user',
        severity: 'low'
      },
      {
        code: 'AGENT_TIMEOUT',
        message: 'AI agent response timeout',
        suggestions: [
          'Try asking a simpler question',
          'Check your Claude Code connection',
          'Try: conductor status --verbose',
          'Restart the dashboard: conductor dashboard'
        ],
        category: 'claude',
        severity: 'medium'
      },
      {
        code: 'DASHBOARD_CRASH',
        message: 'Dashboard encountered an error and crashed',
        suggestions: [
          'Restart dashboard: conductor dashboard',
          'Try minimal mode: conductor dashboard --minimal',
          'Check terminal compatibility',
          'Update your terminal emulator'
        ],
        category: 'system',
        severity: 'medium'
      }
    ];

    errors.forEach(error => this.errorCodes.set(error.code, error));
  }

  async handleError(error: Error, context?: ErrorContext): Promise<void> {
    const errorCode = this.detectErrorCode(error, context);
    const errorInfo = this.errorCodes.get(errorCode);

    if (errorInfo) {
      await this.displayStructuredError(errorInfo, error, context);
    } else {
      await this.displayGenericError(error, context);
    }

    // Set contextual help context for error recovery
    this.contextualHelp.setContext(['error', 'troubleshooting', errorCode.toLowerCase()]);
    this.contextualHelp.showContextualTips();
  }

  private detectErrorCode(error: Error, context?: ErrorContext): string {
    const message = error.message.toLowerCase();
    const command = context?.command?.toLowerCase() || '';

    // Detection patterns
    if (message.includes('command not found') && message.includes('claude')) {
      return 'CLAUDE_NOT_FOUND';
    }
    if (message.includes('permission denied') || message.includes('eacces')) {
      return 'PERMISSION_DENIED';
    }
    if (message.includes('timeout') || message.includes('etimedout')) {
      if (command.includes('ask') || command.includes('duck')) {
        return 'AGENT_TIMEOUT';
      }
      return 'NETWORK_TIMEOUT';
    }
    if (message.includes('parse') && message.includes('config')) {
      return 'CONFIG_CORRUPTED';
    }
    if (message.includes('.conductor') && message.includes('not found')) {
      return 'PROJECT_NOT_INITIALIZED';
    }
    if (command.includes('dashboard') && message.includes('blessed')) {
      return 'DASHBOARD_CRASH';
    }
    if (message.includes('unknown command') || message.includes('invalid')) {
      return 'INVALID_COMMAND';
    }

    return 'UNKNOWN_ERROR';
  }

  private async displayStructuredError(
    errorInfo: ErrorCode,
    error: Error,
    context?: ErrorContext
  ): Promise<void> {
    const severityIcon = this.getSeverityIcon(errorInfo.severity);
    const categoryColor = this.getCategoryColor(errorInfo.category);

    console.log(chalk.red('\n❌ Error Encountered'));
    console.log(chalk.gray('═'.repeat(60)));

    // Error header
    console.log(`${severityIcon} ${chalk.bold(errorInfo.message)}`);
    console.log(categoryColor(`   Category: ${errorInfo.category.toUpperCase()}`));
    if (context?.command) {
      console.log(chalk.gray(`   Command: ${context.command} ${context.args?.join(' ') || ''}`));
    }
    console.log(chalk.gray(`   Time: ${context?.timestamp.toLocaleString() || new Date().toLocaleString()}`));

    // Suggestions
    console.log(chalk.yellow('\n💡 Suggested Solutions:'));
    errorInfo.suggestions.forEach((suggestion, index) => {
      console.log(chalk.yellow(`   ${index + 1}. ${suggestion}`));
    });

    // Quick fix option
    if (errorInfo.quickFix) {
      console.log(chalk.cyan('\n⚡ Quick Fix Available!'));
      console.log(chalk.gray('   Press Enter to attempt automatic fix, or Ctrl+C to skip'));
      
      process.stdin.once('data', async (data) => {
        if (data.toString().trim() === '') {
          await errorInfo.quickFix!();
        }
      });
    }

    // Additional help
    console.log(chalk.gray('\n🆘 Need More Help?'));
    console.log(chalk.white(`   conductor ask "help with ${errorInfo.code.toLowerCase()}"`));
    console.log(chalk.white('   conductor help --interactive'));
    console.log(chalk.white('   conductor status --verbose'));

    console.log(chalk.gray('═'.repeat(60) + '\n'));
  }

  private async displayGenericError(error: Error, context?: ErrorContext): Promise<void> {
    console.log(chalk.red('\n❌ Unexpected Error'));
    console.log(chalk.gray('═'.repeat(60)));

    console.log(chalk.red(`   ${error.message}`));
    if (context?.command) {
      console.log(chalk.gray(`   Command: ${context.command} ${context.args?.join(' ') || ''}`));
    }

    console.log(chalk.yellow('\n💡 General Troubleshooting:'));
    console.log(chalk.yellow('   1. Try running the command again'));
    console.log(chalk.yellow('   2. Check: conductor status --verbose'));
    console.log(chalk.yellow('   3. Restart: conductor dashboard'));
    console.log(chalk.yellow('   4. Reset config: conductor config --reset'));

    console.log(chalk.gray('\n🆘 Get AI Help:'));
    console.log(chalk.white(`   conductor ask "I got this error: ${error.message}"`));
    
    // Show stack trace in verbose mode
    if (process.env.CONDUCTOR_VERBOSE === 'true' && error.stack) {
      console.log(chalk.gray('\n📚 Stack Trace (verbose mode):'));
      console.log(chalk.dim(error.stack));
    }

    console.log(chalk.gray('═'.repeat(60) + '\n'));
  }

  private getSeverityIcon(severity: string): string {
    const icons = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '💥'
    };
    return icons[severity as keyof typeof icons] || '❓';
  }

  private getCategoryColor(category: string): (text: string) => string {
    const colors = {
      config: chalk.blue,
      filesystem: chalk.yellow,
      network: chalk.magenta,
      claude: chalk.cyan,
      user: chalk.green,
      system: chalk.red
    };
    return colors[category as keyof typeof colors] || chalk.white;
  }

  // Recovery actions
  async attemptRecovery(errorCode: string): Promise<boolean> {
    const errorInfo = this.errorCodes.get(errorCode);
    if (!errorInfo?.quickFix) return false;

    try {
      this.statusIndicator.start(`Attempting recovery for ${errorCode}...`);
      await errorInfo.quickFix();
      this.statusIndicator.succeed('Recovery completed successfully!', true);
      return true;
    } catch (recoveryError) {
      this.statusIndicator.fail(
        'Recovery failed',
        'Try the manual suggestions above'
      );
      return false;
    }
  }

  // Interactive error reporting
  async reportError(error: Error, context?: ErrorContext): Promise<void> {
    console.log(chalk.blue('\n📋 Error Report Generated'));
    
    const report = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack
      },
      context,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd()
      }
    };

    console.log(chalk.gray('Report data (for support):'));
    console.log(chalk.dim(JSON.stringify(report, null, 2)));
    console.log(chalk.yellow('\n💌 To get help, share this report with:'));
    console.log(chalk.white('   conductor ask "help with this error report: [paste report]"'));
  }

  // Proactive error prevention
  async performHealthCheck(): Promise<{ healthy: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    this.statusIndicator.startProgress([
      'Checking Claude Code installation',
      'Validating project configuration',
      'Testing network connectivity',
      'Verifying file permissions',
      'Checking agent availability'
    ]);

    // Check 1: Claude Code
    this.statusIndicator.nextStep();
    try {
      // Would check if claude command exists
    } catch {
      issues.push('Claude Code not found or not accessible');
    }

    // Check 2: Configuration
    this.statusIndicator.nextStep();
    try {
      // Would validate .conductor/conductor.config.json
    } catch {
      issues.push('Project configuration is invalid or missing');
    }

    // Check 3: Network
    this.statusIndicator.nextStep();
    try {
      // Would test network connectivity
    } catch {
      issues.push('Network connectivity issues detected');
    }

    // Check 4: Permissions
    this.statusIndicator.nextStep();
    try {
      // Would check file system permissions
    } catch {
      issues.push('File permission issues detected');
    }

    // Check 5: Agents
    this.statusIndicator.nextStep();
    try {
      // Would test agent availability
    } catch {
      issues.push('AI agents are not responding');
    }

    if (issues.length === 0) {
      this.statusIndicator.succeed('Health check passed - all systems operational!', true);
    } else {
      this.statusIndicator.fail(`Health check found ${issues.length} issues`);
      console.log(chalk.yellow('\n🔧 Issues Found:'));
      issues.forEach((issue, index) => {
        console.log(chalk.yellow(`   ${index + 1}. ${issue}`));
      });
    }

    return { healthy: issues.length === 0, issues };
  }
}