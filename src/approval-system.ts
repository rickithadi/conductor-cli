import * as fs from 'fs-extra';
import * as path from 'path';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import { SubagentDefinition, AgentRecommendation, ChangeProposal } from './types';

export class ApprovalSystem {
  private projectPath: string;
  private proposalsPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.proposalsPath = path.join(projectPath, '.multi-agent', 'proposals');
  }

  async initializeApprovalSystem(): Promise<void> {
    await fs.ensureDir(this.proposalsPath);
    
    const configPath = path.join(this.projectPath, '.multi-agent', 'approval-config.json');
    const defaultConfig = {
      requiresApproval: {
        codeChanges: true,
        newFeatures: true,
        architectureChanges: true,
        dependencies: true,
        configChanges: true
      },
      autoApprove: {
        lowRiskChanges: false,
        documentation: false,
        tests: false
      },
      notificationSettings: {
        showPriority: true,
        showAgentConsensus: true,
        showRiskAssessment: true
      }
    };

    if (!await fs.pathExists(configPath)) {
      await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
    }
  }

  async createProposal(
    title: string,
    description: string,
    type: ChangeProposal['type'],
    agentRecommendations: AgentRecommendation[]
  ): Promise<ChangeProposal> {
    const id = this.generateProposalId();
    const priority = this.calculateOverallPriority(agentRecommendations);
    
    const proposal: ChangeProposal = {
      id,
      title,
      description,
      type,
      status: 'proposed',
      priority,
      agentRecommendations,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.saveProposal(proposal);
    return proposal;
  }

  async getAgentRecommendations(
    task: string,
    subagents: SubagentDefinition[],
    context?: any
  ): Promise<AgentRecommendation[]> {
    const recommendations: AgentRecommendation[] = [];

    // Simulate multi-agent analysis (in real implementation, this would call Claude with specific agent contexts)
    for (const agent of subagents) {
      const recommendation = await this.getAgentPerspective(agent, task, context);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    return recommendations;
  }

  private async getAgentPerspective(
    agent: SubagentDefinition,
    task: string,
    context?: any
  ): Promise<AgentRecommendation | null> {
    // This would integrate with Claude Code to get actual agent perspectives
    // For now, we'll create example perspectives based on agent types
    
    const perspectives: Record<string, (task: string) => AgentRecommendation> = {
      '@frontend': (task) => ({
        agent: '@frontend',
        role: 'Frontend Architecture Specialist',
        recommendation: `Implement ${task} using modern React patterns with proper TypeScript types`,
        reasoning: 'Ensures type safety, maintainability, and follows established component patterns',
        priority: 'medium',
        impacts: ['User experience', 'Component reusability', 'Type safety'],
        dependencies: ['Update component library', 'Add new TypeScript interfaces'],
        risks: ['Potential breaking changes in existing components']
      }),
      
      '@backend': (task) => ({
        agent: '@backend',
        role: 'API & Server Specialist',
        recommendation: `Create secure API endpoints for ${task} with proper validation`,
        reasoning: 'Ensures data integrity, security, and scalable architecture',
        priority: 'high',
        impacts: ['Data security', 'API performance', 'Database schema'],
        dependencies: ['Database migration', 'API documentation update'],
        risks: ['Potential database performance impact']
      }),
      
      '@ux': (task) => ({
        agent: '@ux',
        role: 'User Experience Specialist',
        recommendation: `Design intuitive user flow for ${task} with accessibility considerations`,
        reasoning: 'Ensures usability, accessibility compliance, and positive user experience',
        priority: 'high',
        impacts: ['User satisfaction', 'Accessibility compliance', 'Conversion rates'],
        dependencies: ['Design system updates', 'User testing'],
        risks: ['Learning curve for existing users']
      }),
      
      '@review': (task) => ({
        agent: '@review',
        role: 'Code Quality & Architecture Specialist',
        recommendation: `Implement ${task} following established patterns with comprehensive testing`,
        reasoning: 'Maintains code quality, prevents technical debt, ensures reliability',
        priority: 'medium',
        impacts: ['Code maintainability', 'Test coverage', 'Technical debt'],
        dependencies: ['Update testing suite', 'Code review process'],
        risks: ['Increased complexity in test setup']
      })
    };

    return perspectives[agent.name]?.(task) || null;
  }

  private calculateConsensus(recommendations: AgentRecommendation[]) {
    const priorities = recommendations.map(r => r.priority);
    const uniquePriorities = [...new Set(priorities)];
    const priorityConsensus = {
      level: uniquePriorities.length === 1 ? 'High' : uniquePriorities.length === 2 ? 'Medium' : 'Low',
      value: priorities[0] // Most common priority
    };

    const uniqueRisks = [...new Set(recommendations.flatMap(r => r.risks || []))];
    const uniqueImpacts = [...new Set(recommendations.flatMap(r => r.impacts || []))];

    return {
      priorityConsensus,
      uniqueRisks,
      uniqueImpacts
    };
  }

  private displayAgentDashboard(proposal: ChangeProposal): void {
    // Clear screen for clean display
    console.clear();
    
    // Header
    console.log(chalk.blue('🎭 CONDUCTOR CLI - Agent Dashboard'));
    console.log(chalk.gray('═'.repeat(60)));
    console.log();
    
    // Task Overview
    console.log(chalk.yellow(`📋 TASK: ${proposal.title}`));
    console.log(chalk.gray(`📝 ${proposal.description}`));
    console.log(`🎯 ${chalk.cyan(proposal.type.toUpperCase())} | Priority: ${this.getPriorityEmoji(proposal.priority)} ${chalk.bold(proposal.priority.toUpperCase())}`);
    console.log();
    
    // Agent Status Grid
    console.log(chalk.blue('🤖 AGENT STATUS BOARD'));
    console.log(chalk.gray('─'.repeat(60)));
    
    const agents = proposal.agentRecommendations;
    const maxAgents = 4; // Show 4 agents per row
    
    for (let i = 0; i < agents.length; i += maxAgents) {
      const row = agents.slice(i, i + maxAgents);
      
      // Agent names row
      const nameRow = row.map(agent => {
        const name = agent.agent.padEnd(18);
        return chalk.cyan(name);
      }).join('');
      console.log(nameRow);
      
      // Status row  
      const statusRow = row.map(agent => {
        const priority = this.getPriorityEmoji(agent.priority);
        const status = `${priority} ${agent.priority}`.padEnd(18);
        return status;
      }).join('');
      console.log(statusRow);
      
      // Task summary row
      const taskRow = row.map(agent => {
        const task = agent.recommendation.substring(0, 15) + '...';
        return chalk.gray(task.padEnd(18));
      }).join('');
      console.log(taskRow);
      
      console.log();
    }
    
    // Quick consensus summary
    const consensusData = this.calculateConsensus(proposal.agentRecommendations);
    console.log(chalk.blue('📊 TEAM CONSENSUS'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(`🎯 Priority Alignment: ${consensusData.priorityConsensus.level} (${consensusData.priorityConsensus.value})`);
    console.log(`⚠️  Risk Factors: ${consensusData.uniqueRisks.length} identified`);
    console.log(`📈 Impact Areas: ${consensusData.uniqueImpacts.slice(0, 4).join(', ')}${consensusData.uniqueImpacts.length > 4 ? '...' : ''}`);
    console.log();
  }

  async presentProposalForApproval(proposal: ChangeProposal): Promise<ChangeProposal> {
    // Show the dashboard
    this.displayAgentDashboard(proposal);
    
    // Show detailed recommendations if user wants them
    console.log(chalk.blue('🔍 DETAILED RECOMMENDATIONS'));
    console.log(chalk.gray('─'.repeat(60)));
    
    for (const rec of proposal.agentRecommendations) {
      console.log(chalk.cyan(`${rec.agent}`));
      console.log(`   💡 ${rec.recommendation}`);
      console.log(`   🧠 ${chalk.dim(rec.reasoning)}`);
      
      if (rec.risks?.length) {
        console.log(`   ⚠️  ${chalk.yellow(rec.risks[0])}${rec.risks.length > 1 ? ` (+${rec.risks.length - 1} more)` : ''}`);
      }
      console.log();
    }

    // Present approval options
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'How would you like to proceed?',
        choices: [
          { name: '✅ Approve all recommendations', value: 'approve_all' },
          { name: '🔧 Approve with modifications', value: 'approve_modified' },
          { name: '🔍 Approve individual recommendations', value: 'approve_individual' },
          { name: '❌ Reject proposal', value: 'reject' },
          { name: '⏸️  Save for later review', value: 'postpone' }
        ]
      }
    ]);

    switch (action) {
      case 'approve_all':
        proposal = await this.approveAllRecommendations(proposal);
        break;
      case 'approve_modified':
        proposal = await this.approveWithModifications(proposal);
        break;
      case 'approve_individual':
        proposal = await this.approveIndividualRecommendations(proposal);
        break;
      case 'reject':
        proposal = await this.rejectProposal(proposal);
        break;
      case 'postpone':
        proposal.status = 'proposed';
        break;
    }

    proposal.updatedAt = new Date();
    await this.saveProposal(proposal);
    
    return proposal;
  }

  private showConsensusAnalysis(recommendations: AgentRecommendation[]): void {
    console.log(chalk.blue('📊 Agent Consensus Analysis:\\n'));
    
    // Priority consensus
    const priorities = recommendations.map(r => r.priority);
    const priorityConsensus = this.calculatePriorityConsensus(priorities);
    console.log(`🎯 Priority Consensus: ${priorityConsensus.level} (${priorityConsensus.value})`);
    
    // Risk assessment
    const allRisks = recommendations.flatMap(r => r.risks || []);
    const uniqueRisks = [...new Set(allRisks)];
    if (uniqueRisks.length > 0) {
      console.log(`⚠️  Identified Risks: ${uniqueRisks.length} unique risks identified`);
    }
    
    // Impact areas
    const allImpacts = recommendations.flatMap(r => r.impacts);
    const uniqueImpacts = [...new Set(allImpacts)];
    console.log(`📈 Impact Areas: ${uniqueImpacts.join(', ')}`);
    
    console.log('');
  }

  private async approveAllRecommendations(proposal: ChangeProposal): Promise<ChangeProposal> {
    proposal.status = 'approved';
    proposal.approvedActions = proposal.agentRecommendations.map(r => r.recommendation);
    
    const { feedback } = await inquirer.prompt([
      {
        type: 'input',
        name: 'feedback',
        message: 'Any additional notes or requirements?'
      }
    ]);
    
    proposal.userFeedback = feedback;
    
    console.log(chalk.green('✅ All recommendations approved!'));
    return proposal;
  }

  private async approveWithModifications(proposal: ChangeProposal): Promise<ChangeProposal> {
    proposal.modifiedActions = [];
    
    for (const rec of proposal.agentRecommendations) {
      const { modify } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'modify',
          message: `Modify ${rec.agent}'s recommendation?`,
          default: false
        }
      ]);
      
      if (modify) {
        const { modifiedRec, reason } = await inquirer.prompt([
          {
            type: 'input',
            name: 'modifiedRec',
            message: `Modified recommendation for ${rec.agent}:`,
            default: rec.recommendation
          },
          {
            type: 'input',
            name: 'reason',
            message: 'Reason for modification:'
          }
        ]);
        
        proposal.modifiedActions!.push({
          original: rec.recommendation,
          modified: modifiedRec,
          reason
        });
      }
    }
    
    proposal.status = 'approved';
    console.log(chalk.green('✅ Recommendations approved with modifications!'));
    return proposal;
  }

  private async approveIndividualRecommendations(proposal: ChangeProposal): Promise<ChangeProposal> {
    proposal.approvedActions = [];
    proposal.rejectedActions = [];
    
    for (const rec of proposal.agentRecommendations) {
      const { approve } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'approve',
          message: `Approve ${rec.agent}'s recommendation?`,
          default: true
        }
      ]);
      
      if (approve) {
        proposal.approvedActions.push(rec.recommendation);
      } else {
        proposal.rejectedActions.push(rec.recommendation);
      }
    }
    
    if (proposal.approvedActions.length > 0) {
      proposal.status = 'approved';
      console.log(chalk.green(`✅ ${proposal.approvedActions.length} recommendations approved!`));
    } else {
      proposal.status = 'rejected';
      console.log(chalk.red('❌ All recommendations rejected'));
    }
    
    return proposal;
  }

  private async rejectProposal(proposal: ChangeProposal): Promise<ChangeProposal> {
    const { reason } = await inquirer.prompt([
      {
        type: 'input',
        name: 'reason',
        message: 'Reason for rejection:'
      }
    ]);
    
    proposal.status = 'rejected';
    proposal.userFeedback = reason;
    
    console.log(chalk.red('❌ Proposal rejected'));
    return proposal;
  }

  async listPendingProposals(): Promise<ChangeProposal[]> {
    const files = await fs.readdir(this.proposalsPath);
    const proposals: ChangeProposal[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const proposal = await fs.readJson(path.join(this.proposalsPath, file));
        if (proposal.status === 'proposed') {
          proposals.push(proposal);
        }
      }
    }
    
    return proposals.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private async saveProposal(proposal: ChangeProposal): Promise<void> {
    const filename = `${proposal.id}.json`;
    const filepath = path.join(this.proposalsPath, filename);
    await fs.writeJson(filepath, proposal, { spaces: 2 });
  }

  private generateProposalId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `proposal_${timestamp}_${random}`;
  }

  private calculateOverallPriority(recommendations: AgentRecommendation[]): ChangeProposal['priority'] {
    const priorities = recommendations.map(r => r.priority);
    
    if (priorities.includes('critical')) return 'critical';
    if (priorities.includes('high')) return 'high';
    if (priorities.includes('medium')) return 'medium';
    return 'low';
  }

  private calculatePriorityConsensus(values: string[]): { level: string; value: string } {
    const counts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const max = Math.max(...Object.values(counts));
    const consensusValue = Object.keys(counts).find(key => counts[key] === max)!;
    const percentage = (max / values.length) * 100;
    
    let level = 'Low';
    if (percentage >= 80) level = 'High';
    else if (percentage >= 60) level = 'Medium';
    
    return { level, value: consensusValue };
  }

  private getPriorityEmoji(priority: string): string {
    const emojis = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return emojis[priority as keyof typeof emojis] || '⚪';
  }
}