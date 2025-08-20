import chalk from 'chalk';
import * as blessed from 'blessed';

interface AgentStatus {
  name: string;
  status: 'idle' | 'thinking' | 'analyzing' | 'ready' | 'error';
  task?: string;
  confidence?: number;
  lastUpdate?: Date;
}

interface TeamConsensus {
  level: number; // 0-1
  agreementPoints: string[];
  disagreementPoints: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class StatusIndicator {
  private currentSpinner?: NodeJS.Timeout;
  private spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private frameIndex = 0;
  private agents: Map<string, AgentStatus> = new Map();
  private consensus: TeamConsensus | null = null;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents(): void {
    const defaultAgents = [
      { name: '@pm', status: 'idle' as const },
      { name: '@design', status: 'idle' as const },
      { name: '@frontend', status: 'idle' as const },
      { name: '@backend', status: 'idle' as const },
      { name: '@qa', status: 'idle' as const },
      { name: '@devops', status: 'idle' as const },
      { name: '@reviewer', status: 'idle' as const },
      { name: '@security', status: 'idle' as const }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.name, {
        name: agent.name,
        status: agent.status,
        lastUpdate: new Date()
      });
    });
  }

  start(message: string): void {
    process.stdout.write(chalk.blue(`${this.spinnerFrames[0]} ${message}`));
    
    this.currentSpinner = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.spinnerFrames.length;
      process.stdout.write(`\r${chalk.blue(this.spinnerFrames[this.frameIndex])} ${message}`);
    }, 100);
  }

  succeed(message: string): void {
    this.stop();
    console.log(chalk.green(`✅ ${message}`));
  }

  fail(message: string): void {
    this.stop();
    console.log(chalk.red(`❌ ${message}`));
  }

  info(message: string): void {
    console.log(chalk.blue(`ℹ️  ${message}`));
  }

  warn(message: string): void {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  private stop(): void {
    if (this.currentSpinner) {
      clearInterval(this.currentSpinner);
      this.currentSpinner = undefined;
    }
    process.stdout.write('\r' + ' '.repeat(80) + '\r'); // Clear line
  }

  updateAgentStatus(agentName: string, status: AgentStatus['status'], task?: string, confidence?: number): void {
    const agent = this.agents.get(agentName);
    if (agent) {
      agent.status = status;
      agent.task = task;
      agent.confidence = confidence;
      agent.lastUpdate = new Date();
    }
  }

  updateTeamConsensus(consensus: TeamConsensus): void {
    this.consensus = consensus;
  }

  async showTeamStatus(options: { verbose?: boolean; json?: boolean } = {}): Promise<void> {
    if (options.json) {
      console.log(JSON.stringify({
        agents: Array.from(this.agents.values()),
        consensus: this.consensus,
        timestamp: new Date().toISOString()
      }, null, 2));
      return;
    }

    console.log(chalk.cyan.bold('\n🎭 CONDUCTOR CLI - AI TEAM STATUS\n'));

    // Agent status overview
    console.log(chalk.white.bold('👥 Agent Orchestra:'));
    console.log('─'.repeat(60));

    Array.from(this.agents.values()).forEach(agent => {
      const statusIcon = this.getStatusIcon(agent.status);
      const statusColor = this.getStatusColor(agent.status);
      const confidence = agent.confidence ? ` (${Math.round(agent.confidence * 100)}%)` : '';
      const task = agent.task ? ` - ${agent.task}` : '';
      
      console.log(
        `${statusIcon} ${chalk.bold(agent.name.padEnd(12))} ` +
        `${statusColor(agent.status.padEnd(10))}` +
        `${chalk.gray(task)}${chalk.dim(confidence)}`
      );
    });

    // Team consensus
    if (this.consensus) {
      console.log(chalk.white.bold('\n📊 Team Consensus:'));
      console.log('─'.repeat(60));
      
      const consensusLevel = Math.round(this.consensus.level * 100);
      const consensusColor = consensusLevel >= 80 ? chalk.green : 
                           consensusLevel >= 60 ? chalk.yellow : chalk.red;
      
      console.log(`${consensusColor('●')} Consensus Level: ${consensusColor(consensusLevel + '%')}`);
      console.log(`🎯 Priority: ${this.getPriorityIcon(this.consensus.priority)} ${this.consensus.priority.toUpperCase()}`);
      
      if (this.consensus.agreementPoints.length > 0) {
        console.log(chalk.green('\n✅ Team Agreements:'));
        this.consensus.agreementPoints.forEach(point => {
          console.log(`   ${chalk.green('•')} ${point}`);
        });
      }
      
      if (this.consensus.disagreementPoints.length > 0 && options.verbose) {
        console.log(chalk.yellow('\n⚡ Discussion Points:'));
        this.consensus.disagreementPoints.forEach(point => {
          console.log(`   ${chalk.yellow('•')} ${point}`);
        });
      }
    }

    // Quick stats
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status !== 'idle').length;
    const totalAgents = this.agents.size;
    
    console.log(chalk.white.bold('\n📈 Quick Stats:'));
    console.log('─'.repeat(60));
    console.log(`Active Agents: ${chalk.cyan(activeAgents)}/${totalAgents}`);
    console.log(`Last Update: ${chalk.gray(new Date().toLocaleTimeString())}`);
    
    if (options.verbose) {
      console.log(`\n${chalk.gray('💡 Tip: Run')} ${chalk.white.bold('conductor dashboard')} ${chalk.gray('for real-time monitoring')}`);
      console.log(`${chalk.gray('💡 Tip: Use')} ${chalk.white.bold('conductor ask "question"')} ${chalk.gray('to consult your team')}`);
    }
    
    console.log('');
  }

  createPersistentStatusBar(): blessed.Widgets.BoxElement {
    const screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true
    });

    const statusBar = blessed.box({
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      border: { type: 'line', fg: 'cyan' },
      style: {
        fg: 'white',
        bg: 'black',
        border: { fg: 'cyan' }
      },
      tags: true
    });

    screen.append(statusBar);

    // Update status bar content
    this.updateStatusBar(statusBar);

    // Auto-refresh every 2 seconds
    const interval = setInterval(() => {
      this.updateStatusBar(statusBar);
      screen.render();
    }, 2000);

    // Cleanup on exit
    screen.key(['q', 'C-c'], () => {
      clearInterval(interval);
      process.exit(0);
    });

    screen.render();
    return statusBar;
  }

  private updateStatusBar(statusBar: blessed.Widgets.BoxElement): void {
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status !== 'idle').length;
    const totalAgents = this.agents.size;
    const consensusLevel = this.consensus ? Math.round(this.consensus.level * 100) : 0;
    
    const statusContent = 
      `🎭 Conductor CLI | ` +
      `Active: ${activeAgents}/${totalAgents} | ` +
      `Consensus: ${consensusLevel}% | ` +
      `${new Date().toLocaleTimeString()} | ` +
      `Press 'q' to exit`;

    statusBar.setContent(` ${statusContent} `);
  }

  async showLiveAgentActivity(): Promise<void> {
    const screen = blessed.screen({
      smartCSR: true,
      title: '🎭 Conductor CLI - Live Agent Activity',
      fullUnicode: true
    });

    // Agent grid
    const agentBox = blessed.box({
      top: 0,
      left: 0,
      width: '70%',
      height: '80%',
      border: { type: 'line', fg: 'cyan' },
      label: ' 👥 Agent Orchestra ',
      scrollable: true,
      tags: true
    });

    // Consensus panel
    const consensusBox = blessed.box({
      top: 0,
      left: '70%',
      width: '30%',
      height: '80%',
      border: { type: 'line', fg: 'green' },
      label: ' 📊 Consensus ',
      scrollable: true,
      tags: true
    });

    // Activity log
    const logBox = blessed.log({
      top: '80%',
      left: 0,
      width: '100%',
      height: '20%',
      border: { type: 'line', fg: 'yellow' },
      label: ' 📋 Activity Log ',
      scrollable: true,
      tags: true
    });

    screen.append(agentBox);
    screen.append(consensusBox);
    screen.append(logBox);

    // Update function
    const updateDisplay = () => {
      // Update agent display
      let agentContent = '';
      Array.from(this.agents.values()).forEach(agent => {
        const icon = this.getStatusIcon(agent.status);
        const status = agent.status.padEnd(10);
        const task = agent.task || 'Waiting for task...';
        const confidence = agent.confidence ? ` (${Math.round(agent.confidence * 100)}%)` : '';
        
        agentContent += `${icon} {bold}${agent.name}{/bold} ${status} ${task}${confidence}\n`;
      });
      agentBox.setContent(agentContent);

      // Update consensus display
      if (this.consensus) {
        let consensusContent = `{center}Level: ${Math.round(this.consensus.level * 100)}%{/center}\n\n`;
        consensusContent += `Priority: ${this.consensus.priority.toUpperCase()}\n\n`;
        
        if (this.consensus.agreementPoints.length > 0) {
          consensusContent += '{green-fg}Agreements:{/green-fg}\n';
          this.consensus.agreementPoints.forEach(point => {
            consensusContent += `• ${point}\n`;
          });
        }
        
        consensusBox.setContent(consensusContent);
      }

      screen.render();
    };

    // Initial update
    updateDisplay();

    // Periodic updates
    const interval = setInterval(updateDisplay, 1000);

    // Add some sample activity
    logBox.log('🎭 Conductor CLI started');
    logBox.log('👥 AI team assembled and ready');
    logBox.log('⚡ Waiting for your questions...');

    // Keyboard shortcuts
    screen.key(['q', 'C-c'], () => {
      clearInterval(interval);
      process.exit(0);
    });

    screen.key(['r'], () => {
      logBox.log('🔄 Refreshing agent status...');
      updateDisplay();
    });

    screen.key(['c'], () => {
      logBox.clear();
      logBox.log('🧹 Activity log cleared');
    });

    screen.render();
  }

  private getStatusIcon(status: AgentStatus['status']): string {
    const icons = {
      idle: '⚫',
      thinking: '🤔',
      analyzing: '🔍',
      ready: '✅',
      error: '❌'
    };
    return icons[status] || '❓';
  }

  private getStatusColor(status: AgentStatus['status']): (text: string) => string {
    const colors = {
      idle: chalk.gray,
      thinking: chalk.yellow,
      analyzing: chalk.blue,
      ready: chalk.green,
      error: chalk.red
    };
    return colors[status] || chalk.white;
  }

  private getPriorityIcon(priority: TeamConsensus['priority']): string {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return icons[priority];
  }

  // Method to simulate agent activity for demo purposes
  simulateActivity(): void {
    const agents = Array.from(this.agents.keys());
    const statuses: AgentStatus['status'][] = ['thinking', 'analyzing', 'ready'];
    const tasks = [
      'Analyzing component structure',
      'Reviewing security patterns',
      'Optimizing database queries',
      'Checking accessibility compliance',
      'Planning deployment strategy',
      'Reviewing code quality',
      'Designing user flow',
      'Testing integration points'
    ];

    setInterval(() => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const randomConfidence = 0.7 + Math.random() * 0.3; // 70-100%

      this.updateAgentStatus(randomAgent, randomStatus, randomTask, randomConfidence);
    }, 3000);

    // Simulate consensus updates
    setInterval(() => {
      this.updateTeamConsensus({
        level: 0.6 + Math.random() * 0.4, // 60-100%
        agreementPoints: [
          'Security implementation looks solid',
          'Component architecture is well-structured',
          'Performance optimizations are effective'
        ],
        disagreementPoints: [
          'Consider alternative state management approach',
          'Database indexing strategy needs review'
        ],
        priority: ['medium', 'high', 'critical'][Math.floor(Math.random() * 3)] as any
      });
    }, 5000);
  }
}