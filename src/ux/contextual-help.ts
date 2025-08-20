import chalk from 'chalk';
import * as blessed from 'blessed';

interface HelpTip {
  id: string;
  title: string;
  content: string;
  context: string[];
  priority: 'low' | 'medium' | 'high';
  showOnce?: boolean;
}

interface UserPreferences {
  showTips: boolean;
  shownTips: Set<string>;
  experienceLevel: 'novice' | 'intermediate' | 'expert';
}

export class ContextualHelp {
  private helpTips: Map<string, HelpTip> = new Map();
  private userPrefs: UserPreferences;
  private currentContext: string[] = [];

  constructor() {
    this.userPrefs = {
      showTips: true,
      shownTips: new Set(),
      experienceLevel: 'intermediate'
    };
    this.initializeHelpTips();
  }

  private initializeHelpTips(): void {
    const tips: HelpTip[] = [
      {
        id: 'first_init',
        title: 'Welcome to Conductor CLI! 🦆',
        content: `Your AI development team is ready to help you rubber duck through any problem.
        
💡 Pro tips:
• Use 'conductor ask "question"' to consult your team
• Try 'conductor dashboard' for live monitoring
• Run 'conductor review' for comprehensive code analysis`,
        context: ['init', 'first-run'],
        priority: 'high',
        showOnce: true
      },
      {
        id: 'agent_selection',
        title: 'Choosing Your AI Agents',
        content: `Each agent specializes in different areas:
        
📋 @pm - Product planning and requirements
🎨 @design - UX/UI design and accessibility
⚛️ @frontend - React, Next.js, modern web development
⚙️ @backend - APIs, databases, server architecture
🧪 @qa - Testing strategies and quality assurance
🚀 @devops - CI/CD, deployment, infrastructure
👁️ @reviewer - Code review and best practices
🛡️ @security - Security auditing and compliance`,
        context: ['init', 'agent-selection'],
        priority: 'medium'
      },
      {
        id: 'dashboard_navigation',
        title: 'Dashboard Navigation',
        content: `Keyboard shortcuts for the dashboard:
        
• q, Ctrl+C - Quit dashboard
• r - Refresh display
• h, ? - Show help
• c - Clear activity log
• s - Start agent simulation
• 1, 2, 3 - Focus on different panels`,
        context: ['dashboard'],
        priority: 'medium'
      },
      {
        id: 'rubber_ducking_tips',
        title: 'Effective Rubber Ducking',
        content: `Get the most out of your AI consultations:
        
🎯 Be specific: "How do I optimize this React component?" vs "Fix my code"
🔍 Provide context: Include relevant code snippets or error messages
👥 Use specific agents: conductor ask @security "review this auth flow"
📊 Check consensus: Multiple agents will weigh in on complex decisions`,
        context: ['ask', 'duck', 'explain'],
        priority: 'high'
      },
      {
        id: 'quick_commands',
        title: 'Power User Shortcuts',
        content: `Quick commands for efficient workflows:
        
⚡ conductor quick-fix - Instant suggestions for current issues
🔍 conductor review --staged - Review only staged changes
🚀 conductor ship <feature> --security-scan - Complete shipping checklist
📊 conductor status --verbose - Detailed team status
🦆 conductor duck "problem" - Interactive rubber duck session`,
        context: ['commands', 'shortcuts'],
        priority: 'low'
      },
      {
        id: 'error_recovery',
        title: 'When Things Go Wrong',
        content: `Don't panic! Here's how to recover:
        
1. Check 'conductor status' for team health
2. Try 'conductor ask "help with this error"' with your error message
3. Use 'conductor config --reset' if configuration is corrupted
4. Run 'conductor init --quick' to reinitialize quickly
5. Check .conductor/README.md for troubleshooting`,
        context: ['error', 'troubleshooting'],
        priority: 'high'
      }
    ];

    tips.forEach(tip => this.helpTips.set(tip.id, tip));
  }

  setContext(context: string[]): void {
    this.currentContext = context;
  }

  addContext(context: string): void {
    if (!this.currentContext.includes(context)) {
      this.currentContext.push(context);
    }
  }

  clearContext(): void {
    this.currentContext = [];
  }

  showContextualTips(): void {
    if (!this.userPrefs.showTips) return;

    const relevantTips = this.getRelevantTips();
    if (relevantTips.length === 0) return;

    // Show the highest priority tip that hasn't been shown yet
    const tip = relevantTips[0];
    if (tip.showOnce && this.userPrefs.shownTips.has(tip.id)) return;

    this.displayTip(tip);
    this.userPrefs.shownTips.add(tip.id);
  }

  private getRelevantTips(): HelpTip[] {
    const relevant: HelpTip[] = [];

    this.helpTips.forEach(tip => {
      const hasRelevantContext = tip.context.some(context => 
        this.currentContext.includes(context)
      );
      
      if (hasRelevantContext) {
        relevant.push(tip);
      }
    });

    // Sort by priority and whether they've been shown
    return relevant.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aShown = this.userPrefs.shownTips.has(a.id);
      const bShown = this.userPrefs.shownTips.has(b.id);
      
      if (aShown !== bShown) return aShown ? 1 : -1;
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private displayTip(tip: HelpTip): void {
    console.log(chalk.cyan(`\n💡 ${tip.title}`));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.white(tip.content));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.dim(`💡 Tip: Run 'conductor help --disable-tips' to turn off tips\n`));
  }

  showInteractiveHelp(context?: string): void {
    const screen = blessed.screen({
      smartCSR: true,
      title: '💡 Conductor CLI - Interactive Help',
      fullUnicode: true
    });

    // Help categories
    // @ts-ignore - blessed.js type issue with percentage strings
    const categories = blessed.list({
      top: 0,
      left: 0,
      width: '30%' as any,
      height: '100%' as any,
      border: { type: 'line', fg: 'cyan' } as any,
      label: ' 📚 Help Categories ',
      items: [
        '🚀 Getting Started',
        '🦆 Rubber Ducking',
        '👥 AI Agents',
        '📊 Dashboard',
        '⚙️ Configuration',
        '🔧 Troubleshooting',
        '⌨️ Keyboard Shortcuts',
        '💡 Pro Tips'
      ],
      style: {
        selected: { bg: 'blue', fg: 'white' },
        focus: { border: { fg: 'yellow' } }
      },
      keys: true,
      vi: true
    });

    // Help content
    const content = blessed.box({
      top: 0,
      left: '30%' as any,
      width: '70%' as any,
      height: '90%' as any,
      border: { type: 'line', fg: 'green' } as any,
      label: ' 📖 Help Content ',
      scrollable: true,
      alwaysScroll: true,
      tags: true,
      content: this.getHelpContent('getting-started'),
      style: {
        focus: { border: { fg: 'yellow' } }
      }
    });

    // Status bar
    const statusBar = blessed.box({
      bottom: 0,
      left: '30%' as any,
      width: '70%' as any,
      height: 3,
      border: { type: 'line', fg: 'gray' } as any,
      content: ' Use ↑↓ to navigate categories, Tab to switch panels, q to quit, / to search ',
      style: {
        fg: 'white',
        bg: 'black'
      }
    });

    screen.append(categories);
    screen.append(content);
    screen.append(statusBar);

    // Handle category selection
    categories.on('select', (item, index) => {
      const contentMap = [
        'getting-started', 'rubber-ducking', 'agents', 'dashboard',
        'configuration', 'troubleshooting', 'shortcuts', 'pro-tips'
      ];
      content.setContent(this.getHelpContent(contentMap[index]));
      screen.render();
    });

    // Keyboard shortcuts
    screen.key(['q', 'escape'], () => {
      process.exit(0);
    });

    screen.key(['tab'], () => {
      if ((categories as any).focused) {
        content.focus();
      } else {
        categories.focus();
      }
      screen.render();
    });

    screen.key(['/'], () => {
      this.showSearchDialog(screen, content);
    });

    categories.focus();
    screen.render();
  }

  private getHelpContent(section: string): string {
    const sections = {
      'getting-started': `{center}{bold}🚀 Getting Started with Conductor CLI{/bold}{/center}

Welcome to your AI development team! Here's how to get started:

{yellow-fg}1. Initialize Your Project{/yellow-fg}
   conductor init
   
   This sets up your AI team and analyzes your project automatically.

{yellow-fg}2. Ask Your Team Questions{/yellow-fg}
   conductor ask "How should I structure my authentication?"
   conductor duck "I'm having trouble with React state management"
   
{yellow-fg}3. Get Code Reviews{/yellow-fg}
   conductor review --staged    # Review staged changes
   conductor review --files src/components/auth.tsx
   
{yellow-fg}4. Monitor Your Team{/yellow-fg}
   conductor dashboard          # Live team monitoring
   conductor status            # Quick team status

{yellow-fg}5. Ship with Confidence{/yellow-fg}
   conductor ship "user-auth" --security-scan
   
{green-fg}💡 Pro Tip:{/green-fg} Each agent specializes in different areas. Use @agent syntax to consult specific experts!`,

      'rubber-ducking': `{center}{bold}🦆 Effective Rubber Ducking{/bold}{/center}

Traditional rubber ducking helps you think through problems. Conductor CLI adds AI expertise to the mix!

{yellow-fg}How to Ask Great Questions:{/yellow-fg}
• Be specific about your problem
• Provide relevant context and code snippets
• Explain what you've already tried
• Mention your constraints and requirements

{yellow-fg}Examples of Good Questions:{/yellow-fg}
❌ "Fix my code"
✅ "My React component re-renders too often. How can I optimize it?"

❌ "Database is slow"
✅ "User queries are taking 2+ seconds. Here's my current schema..."

{yellow-fg}Using Specific Agents:{/yellow-fg}
conductor ask @frontend "How to implement lazy loading?"
conductor ask @security "Is this authentication flow secure?"
conductor ask @backend "How to optimize these database queries?"

{green-fg}💡 Pro Tip:{/green-fg} The team will reach consensus on complex decisions automatically!`,

      'agents': `{center}{bold}👥 Your AI Agent Team{/bold}{/center}

Each agent brings specialized expertise to help you:

{blue-fg}📋 @pm - Product Manager{/blue-fg}
• Requirements gathering and analysis
• User story creation
• Roadmap planning
• Stakeholder communication

{magenta-fg}🎨 @design - UX/UI Designer{/magenta-fg}
• User flow optimization
• Interface design
• Accessibility compliance
• Mobile-first design

{green-fg}⚛️ @frontend - Frontend Developer{/green-fg}
• React, Next.js, Vue development
• State management
• Performance optimization
• Modern web standards

{cyan-fg}⚙️ @backend - Backend Engineer{/cyan-fg}
• API design and implementation
• Database optimization
• Security patterns
• Scalability planning

{yellow-fg}🧪 @qa - Quality Assurance{/yellow-fg}
• Test strategy design
• Automation frameworks
• Quality metrics
• Bug prevention

{red-fg}🚀 @devops - DevOps Engineer{/red-fg}
• CI/CD pipeline setup
• Infrastructure management
• Deployment automation
• Monitoring and alerts

{gray-fg}👁️ @reviewer - Code Reviewer{/gray-fg}
• Code quality assessment
• Best practices enforcement
• Architecture review
• Technical debt analysis

{red-fg}🛡️ @security - Security Expert{/red-fg}
• OWASP compliance
• Vulnerability scanning
• Secure coding practices
• Threat modeling`,

      'dashboard': `{center}{bold}📊 Live Dashboard Guide{/bold}{/center}

The dashboard provides real-time monitoring of your AI team:

{yellow-fg}Launching the Dashboard:{/yellow-fg}
conductor dashboard              # Full dashboard
conductor dashboard --minimal   # Simplified view
conductor dashboard --focus @frontend  # Focus on specific agent

{yellow-fg}Dashboard Panels:{/yellow-fg}
• {cyan-fg}Agent Orchestra{/cyan-fg} - Real-time agent status and tasks
• {green-fg}Team Consensus{/green-fg} - Agreement levels and recommendations
• {yellow-fg}Activity Feed{/yellow-fg} - Live activity log

{yellow-fg}Keyboard Shortcuts:{/yellow-fg}
• q, Ctrl+C - Quit dashboard
• r - Refresh display manually
• h, ? - Show help overlay
• c - Clear activity log
• s - Start agent simulation
• 1, 2, 3 - Focus on specific panels

{yellow-fg}Status Indicators:{/yellow-fg}
⚫ Idle - Agent waiting for tasks
🤔 Thinking - Processing your request
🔍 Analyzing - Reviewing code or data
✅ Ready - Task completed successfully
❌ Error - Issue encountered

{green-fg}💡 Pro Tip:{/green-fg} Leave the dashboard running while you work to monitor your team's activity!`,

      'shortcuts': `{center}{bold}⌨️ Keyboard Shortcuts & Quick Commands{/bold}{/center}

{yellow-fg}Command Shortcuts:{/yellow-fg}
conductor ask    → conductor duck    # Rubber duck alias
conductor review → conductor audit   # Code review alias
conductor dashboard → conductor watch # Dashboard alias

{yellow-fg}Quick Commands:{/yellow-fg}
conductor quick-fix              # Instant issue suggestions
conductor rubber-duck "problem" # Interactive problem solving
conductor ship <feature>        # Complete shipping checklist
conductor status --verbose      # Detailed team status

{yellow-fg}Dashboard Navigation:{/yellow-fg}
q, Ctrl+C - Quit
r - Refresh
h, ? - Help
c - Clear logs
s - Simulation
1, 2, 3 - Panel focus
Tab - Switch panels
↑↓ - Navigate lists

{yellow-fg}Power User Tips:{/yellow-fg}
# Chain commands with &&
conductor review --staged && conductor ship "feature" --security-scan

# Use specific agents for targeted help
conductor ask @security "review auth implementation"

# Quick status checks
conductor status --json | jq '.consensus.level'

{green-fg}💡 Pro Tip:{/green-fg} Create shell aliases for your most-used commands!`
    };

    return sections[section as keyof typeof sections] || `{center}Help content for "${section}" coming soon...{/center}`;
  }

  private showSearchDialog(screen: blessed.Widgets.Screen, content: blessed.Widgets.BoxElement): void {
    const searchBox = blessed.textbox({
      top: 'center' as any,
      left: 'center' as any,
      width: '60%' as any,
      height: 3,
      border: { type: 'line', fg: 'yellow' } as any,
      label: ' 🔍 Search Help ',
      inputOnFocus: true,
      style: {
        bg: 'black',
        fg: 'white'
      }
    });

    searchBox.key(['escape'], () => {
      screen.remove(searchBox);
      screen.render();
    });

    searchBox.key(['enter'], () => {
      const query = searchBox.getValue();
      const searchResults = this.searchHelpContent(query);
      content.setContent(searchResults);
      screen.remove(searchBox);
      screen.render();
    });

    screen.append(searchBox);
    searchBox.focus();
    screen.render();
  }

  private searchHelpContent(query: string): string {
    const allContent = [
      'getting-started', 'rubber-ducking', 'agents', 'dashboard',
      'configuration', 'troubleshooting', 'shortcuts', 'pro-tips'
    ].map(section => ({
      section,
      content: this.getHelpContent(section)
    }));

    const results = allContent.filter(item => 
      item.content.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
      return `{center}{bold}🔍 No results found for "${query}"{/bold}{/center}\n\nTry searching for:\n• agent names (@frontend, @security)\n• commands (ask, review, dashboard)\n• concepts (rubber ducking, consensus)`;
    }

    return `{center}{bold}🔍 Search Results for "${query}"{/bold}{/center}\n\n${
      results.map(result => `{yellow-fg}Found in: ${result.section}{/yellow-fg}\n${result.content}\n\n`).join('')
    }`;
  }

  setExperienceLevel(level: 'novice' | 'intermediate' | 'expert'): void {
    this.userPrefs.experienceLevel = level;
  }

  toggleTips(): void {
    this.userPrefs.showTips = !this.userPrefs.showTips;
  }

  resetShownTips(): void {
    this.userPrefs.shownTips.clear();
  }
}