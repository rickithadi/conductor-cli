import * as blessed from 'blessed';
import chalk from 'chalk';
import { StatusIndicator } from './status-indicator';

interface DashboardOptions {
  focus?: string;
  theme?: 'dark' | 'light' | 'auto';
  minimal?: boolean;
}

interface ActivityLogEntry {
  timestamp: Date;
  agent: string;
  action: string;
  details?: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

interface Recommendation {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  agent: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
}

export class SmartDashboard {
  private screen?: blessed.Widgets.Screen;
  private statusIndicator: StatusIndicator;
  private activityLog: ActivityLogEntry[] = [];
  private recommendations: Recommendation[] = [];
  private currentFocus: string = 'overview';
  
  constructor() {
    this.statusIndicator = new StatusIndicator();
    this.initializeSampleData();
  }

  async launch(options: DashboardOptions = {}): Promise<void> {
    await this.createFullDashboard(options);
  }

  private async createFullDashboard(options: DashboardOptions): Promise<void> {
    this.screen = blessed.screen({
      smartCSR: true,
      title: '🎭 Conductor CLI - AI Team Dashboard',
      fullUnicode: true,
      cursor: {
        artificial: true,
        shape: 'line',
        blink: true,
        color: 'cyan'
      }
    });

    // Create layout based on options
    if (options.minimal) {
      await this.createMinimalLayout();
    } else {
      await this.createFullLayout(options);
    }

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Start real-time updates
    this.startRealTimeUpdates();
    
    // Focus on specific agent if requested
    if (options.focus) {
      this.currentFocus = options.focus;
    }
    
    this.screen.render();
  }

  private async createFullLayout(options: DashboardOptions): Promise<void> {
    if (!this.screen) return;

    // Header with title and status
    const header = blessed.box({
      top: 0,
      left: 0,
      width: '100%' as any,
      height: 3,
      content: this.getHeaderContent(),
      style: {
        fg: 'white',
        bg: 'blue',
        bold: true
      },
      tags: true
    });

    // Agent status panel (left side)
    const agentPanel = blessed.box({
      top: 3,
      left: 0,
      width: '40%' as any,
      height: '60%' as any,
      border: { type: 'line', fg: 'cyan' } as any,
      label: ' 👥 Agent Orchestra ',
      scrollable: true,
      alwaysScroll: true,
      tags: true,
      style: {
        border: { fg: 'cyan' },
        focus: { border: { fg: 'yellow' } }
      }
    });

    // Consensus and recommendations panel (right side)
    const consensusPanel = blessed.box({
      top: 3,
      left: '40%' as any,
      width: '60%' as any,
      height: '60%' as any,
      border: { type: 'line', fg: 'green' } as any,
      label: ' 📊 Team Consensus & Recommendations ',
      scrollable: true,
      alwaysScroll: true,
      tags: true,
      style: {
        border: { fg: 'green' },
        focus: { border: { fg: 'yellow' } }
      }
    });

    // Activity log (bottom)
    const activityPanel = blessed.log({
      top: '63%' as any,
      left: 0,
      width: '100%' as any,
      height: '32%' as any,
      border: { type: 'line', fg: 'yellow' } as any,
      label: ' 📋 Live Activity Feed ',
      scrollable: true,
      alwaysScroll: true,
      tags: true,
      style: {
        border: { fg: 'yellow' },
        focus: { border: { fg: 'yellow' } }
      }
    });

    // Status bar (very bottom)
    const statusBar = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%' as any,
      height: 1,
      content: this.getStatusBarContent(),
      style: {
        fg: 'white',
        bg: 'black'
      },
      tags: true
    });

    // Add all panels to screen
    this.screen.append(header);
    this.screen.append(agentPanel);
    this.screen.append(consensusPanel);
    this.screen.append(activityPanel);
    this.screen.append(statusBar);

    // Store references for updates
    (this.screen as any).agentPanel = agentPanel;
    (this.screen as any).consensusPanel = consensusPanel;
    (this.screen as any).activityPanel = activityPanel;
    (this.screen as any).statusBar = statusBar;
    (this.screen as any).header = header;

    // Make panels focusable
    agentPanel.key(['enter'], () => {
      this.currentFocus = 'agents';
      this.updateDisplay();
    });

    consensusPanel.key(['enter'], () => {
      this.currentFocus = 'consensus';
      this.updateDisplay();
    });

    // Initialize with sample data
    this.addActivityLog('system', 'Dashboard initialized', 'All agents ready for consultation', 'success');
    this.addActivityLog('system', 'Monitoring started', 'Real-time updates active', 'info');
  }

  private async createMinimalLayout(): Promise<void> {
    if (!this.screen) return;

    // Simple header
    const header = blessed.box({
      top: 0,
      left: 0,
      width: '100%' as any,
      height: 1,
      content: ' 🎭 Conductor CLI - Minimal Dashboard ',
      style: {
        fg: 'white',
        bg: 'blue'
      }
    });

    // Combined status panel
    const statusPanel = blessed.box({
      top: 1,
      left: 0,
      width: '100%' as any,
      height: '90%' as any,
      border: { type: 'line', fg: 'cyan' } as any,
      label: ' AI Team Status ',
      scrollable: true,
      tags: true
    });

    // Mini status bar
    const statusBar = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%' as any,
      height: 1,
      content: ' Press q to quit, r to refresh ',
      style: {
        fg: 'white',
        bg: 'black'
      }
    });

    this.screen.append(header);
    this.screen.append(statusPanel);
    this.screen.append(statusBar);

    (this.screen as any).statusPanel = statusPanel;
  }

  private setupKeyboardShortcuts(): void {
    if (!this.screen) return;

    // Global shortcuts
    this.screen.key(['q', 'C-c'], () => {
      process.exit(0);
    });

    this.screen.key(['r'], () => {
      this.addActivityLog('system', 'Manual refresh', 'Dashboard updated', 'info');
      this.updateDisplay();
    });

    this.screen.key(['h', '?'], () => {
      this.showHelpModal();
    });

    this.screen.key(['1'], () => {
      this.currentFocus = 'agents';
      this.updateDisplay();
    });

    this.screen.key(['2'], () => {
      this.currentFocus = 'consensus';
      this.updateDisplay();
    });

    this.screen.key(['3'], () => {
      this.currentFocus = 'activity';
      this.updateDisplay();
    });

    this.screen.key(['c'], () => {
      this.clearActivityLog();
    });

    this.screen.key(['s'], () => {
      this.statusIndicator.simulateActivity();
      this.addActivityLog('system', 'Simulation started', 'Agents will show random activity', 'info');
    });
  }

  private startRealTimeUpdates(): void {
    setInterval(() => {
      this.updateDisplay();
    }, 2000);

    // Simulate some activity
    setInterval(() => {
      this.simulateRandomActivity();
    }, 5000);
  }

  private updateDisplay(): void {
    if (!this.screen) return;

    const screenAny = this.screen as any;
    
    if (screenAny.agentPanel) {
      screenAny.agentPanel.setContent(this.getAgentPanelContent());
    }

    if (screenAny.consensusPanel) {
      screenAny.consensusPanel.setContent(this.getConsensusPanelContent());
    }

    if (screenAny.statusBar) {
      screenAny.statusBar.setContent(this.getStatusBarContent());
    }

    if (screenAny.header) {
      screenAny.header.setContent(this.getHeaderContent());
    }

    if (screenAny.statusPanel) {
      screenAny.statusPanel.setContent(this.getMinimalStatusContent());
    }

    this.screen.render();
  }

  private getHeaderContent(): string {
    const timestamp = new Date().toLocaleTimeString();
    const activeAgents = 5; // This would come from actual agent status
    const totalAgents = 8;
    
    return `{center}🎭 CONDUCTOR CLI - AI TEAM DASHBOARD | Active: ${activeAgents}/${totalAgents} | ${timestamp}{/center}`;
  }

  private getAgentPanelContent(): string {
    let content = '';
    
    const agents = [
      { name: '@pm', status: 'thinking', task: 'Analyzing requirements', confidence: 0.85 },
      { name: '@design', status: 'ready', task: 'UI mockups complete', confidence: 0.92 },
      { name: '@frontend', status: 'analyzing', task: 'Component review', confidence: 0.78 },
      { name: '@backend', status: 'idle', task: null, confidence: null },
      { name: '@qa', status: 'thinking', task: 'Test strategy', confidence: 0.67 },
      { name: '@devops', status: 'ready', task: 'Pipeline optimized', confidence: 0.91 },
      { name: '@reviewer', status: 'analyzing', task: 'Code quality check', confidence: 0.83 },
      { name: '@security', status: 'ready', task: 'OWASP scan complete', confidence: 0.96 }
    ];

    agents.forEach((agent, index) => {
      const icon = this.getStatusIcon(agent.status);
      const statusColor = this.getStatusColorTag(agent.status);
      const confidence = agent.confidence ? ` (${Math.round(agent.confidence * 100)}%)` : '';
      const task = agent.task || 'Waiting...';
      
      content += `${icon} {bold}${agent.name.padEnd(10)}{/bold} `;
      content += `${statusColor}${agent.status.padEnd(10)}{/${statusColor.split('-')[0]}-fg} `;
      content += `${task}${confidence}\n`;
      
      if (agent.confidence) {
        const barLength = 20;
        const filled = Math.round(agent.confidence * barLength);
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        content += `           {cyan-fg}${bar}{/cyan-fg}\n`;
      }
      
      content += '\n';
    });

    return content;
  }

  private getConsensusPanelContent(): string {
    let content = '{center}{bold}📊 TEAM CONSENSUS{/bold}{/center}\n\n';
    
    const consensusLevel = 87;
    const priority = 'high';
    
    content += `{center}Level: {green-fg}${consensusLevel}%{/green-fg}{/center}\n`;
    content += `{center}Priority: {yellow-fg}${priority.toUpperCase()}{/yellow-fg}{/center}\n\n`;
    
    content += '{green-fg}✅ Team Agreements:{/green-fg}\n';
    content += '• Security implementation approved\n';
    content += '• Component architecture solid\n';
    content += '• Performance meets requirements\n\n';
    
    content += '{yellow-fg}⚡ Discussion Points:{/yellow-fg}\n';
    content += '• Consider state management alternatives\n';
    content += '• Database indexing needs review\n\n';
    
    content += '{bold}🎯 ACTIVE RECOMMENDATIONS{/bold}\n';
    content += '─'.repeat(30) + '\n';
    
    this.recommendations.slice(0, 5).forEach((rec, index) => {
      const priorityIcon = this.getPriorityIcon(rec.priority);
      const statusIcon = rec.status === 'pending' ? '⏳' : rec.status === 'approved' ? '✅' : '❌';
      
      content += `${priorityIcon} ${statusIcon} ${rec.title}\n`;
      content += `   {gray-fg}by ${rec.agent} - ${rec.priority}{/gray-fg}\n`;
    });

    return content;
  }

  private getStatusBarContent(): string {
    const timestamp = new Date().toLocaleString();
    return ` 🎭 Conductor | ${timestamp} | Press 'h' for help, 'q' to quit, 'r' to refresh `;
  }

  private getMinimalStatusContent(): string {
    let content = '{center}{bold}🎭 AI TEAM STATUS{/bold}{/center}\n\n';
    
    content += '👥 Agents: 5/8 active\n';
    content += '📊 Consensus: 87%\n';
    content += '🎯 Priority: HIGH\n';
    content += '⚡ Recommendations: 3 pending\n\n';
    
    content += 'Recent Activity:\n';
    content += '─'.repeat(40) + '\n';
    
    this.activityLog.slice(-10).forEach(entry => {
      const icon = this.getLogIcon(entry.level);
      const time = entry.timestamp.toLocaleTimeString();
      content += `${icon} ${time} ${entry.agent}: ${entry.action}\n`;
    });

    return content;
  }

  private showHelpModal(): void {
    if (!this.screen) return;

    const helpBox = blessed.box({
      top: 'center' as any,
      left: 'center' as any,
      width: '60%' as any,
      height: '70%' as any,
      border: { type: 'line', fg: 'yellow' } as any,
      label: ' 📚 Conductor CLI Dashboard Help ',
      content: this.getHelpContent(),
      scrollable: true,
      tags: true,
      style: {
        bg: 'black',
        fg: 'white'
      }
    });

    helpBox.key(['escape', 'q', 'enter'], () => {
      this.screen!.remove(helpBox);
      this.screen!.render();
    });

    helpBox.focus();
    this.screen.append(helpBox);
    this.screen.render();
  }

  private getHelpContent(): string {
    return `
{center}{bold}🎭 CONDUCTOR CLI DASHBOARD{/bold}{/center}

{yellow-fg}Keyboard Shortcuts:{/yellow-fg}
• q, Ctrl+C    - Quit dashboard
• r            - Refresh display
• h, ?         - Show this help
• c            - Clear activity log
• s            - Start agent simulation
• 1            - Focus on agents panel
• 2            - Focus on consensus panel
• 3            - Focus on activity panel

{yellow-fg}Panel Navigation:{/yellow-fg}
• Use Tab to cycle through panels
• Enter to select/expand panels
• Arrow keys to scroll within panels

{yellow-fg}Status Icons:{/yellow-fg}
• ⚫ Idle       - Agent waiting for tasks
• 🤔 Thinking   - Agent processing request
• 🔍 Analyzing  - Agent reviewing code/data
• ✅ Ready      - Agent completed task
• ❌ Error      - Agent encountered issue

{yellow-fg}Priority Levels:{/yellow-fg}
• 🟢 Low       - Nice to have improvements
• 🟡 Medium    - Should be addressed soon
• 🟠 High      - Important, needs attention
• 🔴 Critical  - Urgent, fix immediately

{yellow-fg}Activity Log Levels:{/yellow-fg}
• ℹ️ Info       - General information
• ✅ Success    - Successful operations
• ⚠️ Warning    - Potential issues
• ❌ Error      - Failed operations

Press any key to close this help...
`;
  }

  private addActivityLog(agent: string, action: string, details?: string, level: ActivityLogEntry['level'] = 'info'): void {
    const entry: ActivityLogEntry = {
      timestamp: new Date(),
      agent,
      action,
      details,
      level
    };

    this.activityLog.push(entry);

    // Keep only last 100 entries
    if (this.activityLog.length > 100) {
      this.activityLog.shift();
    }

    // Add to blessed log if available
    const screenAny = this.screen as any;
    if (screenAny?.activityPanel) {
      const icon = this.getLogIcon(level);
      const timestamp = entry.timestamp.toLocaleTimeString();
      const message = `${icon} [${timestamp}] ${agent}: ${action}`;
      screenAny.activityPanel.log(message);
    }
  }

  private clearActivityLog(): void {
    this.activityLog = [];
    const screenAny = this.screen as any;
    if (screenAny?.activityPanel) {
      screenAny.activityPanel.clear();
      this.addActivityLog('system', 'Activity log cleared', undefined, 'info');
    }
  }

  private simulateRandomActivity(): void {
    const agents = ['@pm', '@design', '@frontend', '@backend', '@qa', '@devops', '@reviewer', '@security'];
    const actions = [
      'Analyzing code structure',
      'Reviewing security patterns',
      'Optimizing performance',
      'Checking accessibility',
      'Planning deployment',
      'Running tests',
      'Updating documentation',
      'Scanning dependencies'
    ];
    
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const levels: ActivityLogEntry['level'][] = ['info', 'success', 'warning'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    
    this.addActivityLog(randomAgent, randomAction, undefined, randomLevel);
  }

  private initializeSampleData(): void {
    this.recommendations = [
      {
        id: '1',
        title: 'Implement authentication middleware',
        priority: 'high',
        agent: '@security',
        description: 'Add JWT token validation middleware',
        status: 'pending'
      },
      {
        id: '2',
        title: 'Optimize database queries',
        priority: 'medium',
        agent: '@backend',
        description: 'Add proper indexing for user lookups',
        status: 'pending'
      },
      {
        id: '3',
        title: 'Improve component accessibility',
        priority: 'medium',
        agent: '@design',
        description: 'Add ARIA labels and keyboard navigation',
        status: 'approved'
      },
      {
        id: '4',
        title: 'Setup CI/CD pipeline',
        priority: 'high',
        agent: '@devops',
        description: 'Configure GitHub Actions for deployment',
        status: 'pending'
      },
      {
        id: '5',
        title: 'Add unit tests for auth module',
        priority: 'medium',
        agent: '@qa',
        description: 'Ensure 90% test coverage for authentication',
        status: 'pending'
      }
    ];
  }

  private getStatusIcon(status: string): string {
    const icons = {
      idle: '⚫',
      thinking: '🤔',
      analyzing: '🔍',
      ready: '✅',
      error: '❌'
    };
    return icons[status as keyof typeof icons] || '❓';
  }

  private getStatusColorTag(status: string): string {
    const colors = {
      idle: 'gray-fg',
      thinking: 'yellow-fg',
      analyzing: 'blue-fg',
      ready: 'green-fg',
      error: 'red-fg'
    };
    return colors[status as keyof typeof colors] || 'white-fg';
  }

  private getPriorityIcon(priority: string): string {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return icons[priority as keyof typeof icons] || '⚪';
  }

  private getLogIcon(level: ActivityLogEntry['level']): string {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[level];
  }
}