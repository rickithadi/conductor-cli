import * as blessed from 'blessed';
import { ChangeProposal, AgentRecommendation } from './types';

export class TUIDashboard {
  private screen: blessed.Widgets.Screen;
  private proposal: ChangeProposal | null = null;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: '🎭 Conductor CLI - Agent Orchestra Dashboard'
    });

    // Enable mouse support
    this.screen.key(['escape', 'q', 'C-c'], () => {
      process.exit(0);
    });
  }

  async showProposalDashboard(proposal: ChangeProposal): Promise<string> {
    this.proposal = proposal;
    this.createLayout();
    this.renderContent();

    return new Promise((resolve) => {
      this.createActionButtons(resolve);
      this.screen.render();
    });
  }

  private createLayout(): void {
    // Clear screen
    this.screen.children.forEach(child => child.destroy());

    // Header
    const header = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 4,
      border: { type: 'line' },
      style: {
        border: { fg: 'cyan' },
        bg: 'black'
      },
      tags: true,
      content: this.getHeaderContent()
    });

    // Agent Status Grid
    const agentGrid = blessed.box({
      top: 4,
      left: 0,
      width: '70%',
      height: '60%',
      border: { type: 'line' },
      label: ' 🤖 Agent Orchestra ',
      style: {
        border: { fg: 'blue' },
        bg: 'black'
      },
      tags: true,
      scrollable: true,
      content: this.getAgentGridContent()
    });

    // Consensus Panel
    const consensusPanel = blessed.box({
      top: 4,
      left: '70%',
      width: '30%',
      height: '60%',
      border: { type: 'line' },
      label: ' 📊 Team Consensus ',
      style: {
        border: { fg: 'green' },
        bg: 'black'
      },
      tags: true,
      content: this.getConsensusContent()
    });

    // Detailed Recommendations
    const detailPanel = blessed.box({
      top: '64%',
      left: 0,
      width: '100%',
      height: '28%',
      border: { type: 'line' },
      label: ' 🔍 Detailed Recommendations ',
      style: {
        border: { fg: 'yellow' },
        bg: 'black'
      },
      tags: true,
      scrollable: true,
      scrollbar: {
        style: { bg: 'yellow' }
      },
      content: this.getDetailedRecommendations()
    });

    // Action Bar
    const actionBar = blessed.box({
      top: '92%',
      left: 0,
      width: '100%',
      height: '8%',
      border: { type: 'line' },
      style: {
        border: { fg: 'magenta' },
        bg: 'black'
      },
      tags: true
    });

    this.screen.append(header);
    this.screen.append(agentGrid);
    this.screen.append(consensusPanel);
    this.screen.append(detailPanel);
    this.screen.append(actionBar);
  }

  private getHeaderContent(): string {
    if (!this.proposal) return '';

    const priority = this.getPriorityDisplay(this.proposal.priority);
    const type = this.proposal.type.toUpperCase();

    return `{center}{bold}{cyan-fg}🎭 CONDUCTOR CLI - AGENT ORCHESTRA{/cyan-fg}{/bold}{/center}
{center}📋 {yellow-fg}${this.proposal.title}{/yellow-fg} | 🎯 {cyan-fg}${type}{/cyan-fg} | ${priority}{/center}`;
  }

  private getAgentGridContent(): string {
    if (!this.proposal) return '';

    const agents = this.proposal.agentRecommendations;
    let content = '';

    // Create grid layout
    const columns = 2;
    for (let i = 0; i < agents.length; i += columns) {
      const row = agents.slice(i, i + columns);
      
      // Agent names
      const names = row.map(agent => {
        const name = agent.agent.substring(0, 18).padEnd(20);
        return `{cyan-fg}${name}{/cyan-fg}`;
      }).join('  ');
      content += names + '\\n';

      // Status
      const statuses = row.map(agent => {
        const priority = this.getPriorityDisplay(agent.priority);
        return `${priority}`.padEnd(20);
      }).join('  ');
      content += statuses + '\\n';

      // Task preview
      const tasks = row.map(agent => {
        const task = agent.recommendation.substring(0, 18) + '...';
        return `{gray-fg}${task.padEnd(20)}{/gray-fg}`;
      }).join('  ');
      content += tasks + '\\n\\n';
    }

    return content;
  }

  private getConsensusContent(): string {
    if (!this.proposal) return '';

    const agents = this.proposal.agentRecommendations;
    const priorities = agents.map(a => a.priority);
    const uniquePriorities = [...new Set(priorities)];
    
    const alignment = uniquePriorities.length === 1 ? 'High' : 
                     uniquePriorities.length === 2 ? 'Medium' : 'Low';

    const risks = [...new Set(agents.flatMap(a => a.risks || []))];
    const impacts = [...new Set(agents.flatMap(a => a.impacts || []))];

    return `
{bold}🎯 Priority Alignment{/bold}
{green-fg}${alignment}{/green-fg} (${priorities[0]})

{bold}⚠️  Risk Factors{/bold}
{yellow-fg}${risks.length} identified{/yellow-fg}

{bold}📈 Impact Areas{/bold}
${impacts.slice(0, 3).map(i => `• ${i}`).join('\\n')}
${impacts.length > 3 ? `... +${impacts.length - 3} more` : ''}

{bold}🤖 Active Agents{/bold}
{cyan-fg}${agents.length} specialists{/cyan-fg}
`;
  }

  private getDetailedRecommendations(): string {
    if (!this.proposal) return '';

    let content = '';
    this.proposal.agentRecommendations.forEach((rec, index) => {
      content += `{bold}{cyan-fg}${rec.agent}{/cyan-fg}{/bold} - {gray-fg}${rec.role}{/gray-fg}\\n`;
      content += `💡 ${rec.recommendation}\\n`;
      content += `🧠 {dim}${rec.reasoning}{/dim}\\n`;
      
      if (rec.risks && rec.risks.length > 0) {
        content += `⚠️  {yellow-fg}${rec.risks[0]}{/yellow-fg}`;
        if (rec.risks.length > 1) {
          content += ` {gray-fg}(+${rec.risks.length - 1} more){/gray-fg}`;
        }
        content += '\\n';
      }

      if (this.proposal && index < this.proposal.agentRecommendations.length - 1) {
        content += '\\n{gray-fg}────────────────────────────────────────{/gray-fg}\\n\\n';
      }
    });

    return content;
  }

  private createActionButtons(resolve: (action: string) => void): void {
    const actions = [
      { key: 'a', label: '✅ Approve All', value: 'approve-all' },
      { key: 'm', label: '🔧 Modify', value: 'modify' },
      { key: 'i', label: '🔍 Individual', value: 'individual' },
      { key: 'r', label: '❌ Reject', value: 'reject' },
      { key: 's', label: '⏸️  Save Later', value: 'save' }
    ];

    actions.forEach((action, index) => {
      const button = blessed.button({
        parent: this.screen.children[this.screen.children.length - 1],
        mouse: true,
        keys: true,
        shrink: true,
        left: 2 + (index * 16),
        top: 1,
        width: 14,
        height: 3,
        content: action.label,
        style: {
          bg: 'blue',
          fg: 'white',
          hover: {
            bg: 'cyan',
            fg: 'black'
          },
          focus: {
            border: { fg: 'yellow' }
          }
        },
        border: { type: 'line' }
      });

      button.on('press', () => {
        resolve(action.value);
      });

      // Keyboard shortcuts
      this.screen.key([action.key], () => {
        resolve(action.value);
      });
    });

    // Instructions
    const instructions = blessed.text({
      parent: this.screen.children[this.screen.children.length - 1],
      right: 2,
      top: 1,
      content: 'Press keys (a,m,i,r,s) or click buttons | ESC/q to quit',
      style: {
        fg: 'gray'
      }
    });
  }

  private getPriorityDisplay(priority: string): string {
    const displays = {
      'critical': '🔴 CRITICAL',
      'high': '🟠 HIGH',
      'medium': '🟡 MEDIUM',
      'low': '🟢 LOW'
    };
    return displays[priority as keyof typeof displays] || '⚪ UNKNOWN';
  }

  private renderContent(): void {
    this.screen.render();
  }

  destroy(): void {
    this.screen.destroy();
  }
}

// Usage example and export
export function createTUIDashboard(): TUIDashboard {
  return new TUIDashboard();
}