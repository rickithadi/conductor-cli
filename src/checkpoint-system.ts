import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { ProjectContext, SubagentDefinition, ChangeProposal } from './types';

export interface CheckpointData {
  id: string;
  timestamp: Date;
  projectContext: ProjectContext;
  activeAgents: SubagentDefinition[];
  currentSession: {
    tasksCompleted: string[];
    tasksInProgress: string[];
    tasksPending: string[];
    currentFocus: string;
    keyDecisions: string[];
    importantContext: string[];
  };
  approvalHistory: {
    totalProposals: number;
    approvedProposals: number;
    rejectedProposals: number;
    recentProposals: ChangeProposal[];
  };
  nextSteps: string[];
  warnings: string[];
  estimatedTokenUsage: number;
  contextWindowUtilization: number;
}

export interface CheckpointConfig {
  enabled: boolean;
  warningThreshold: number;     // 90% of context window
  checkpointThreshold: number;  // 95% of context window
  maxContextTokens: number;     // Estimated max tokens for Claude
  autoRestart: boolean;         // Whether to suggest restart automatically
  saveFrequency: number;        // Save checkpoint every N interactions
  retentionDays: number;        // Keep checkpoints for N days
}

export class CheckpointSystem {
  private projectPath: string;
  private checkpointDir: string;
  private config: CheckpointConfig;
  private currentTokenCount: number = 0;
  private interactionCount: number = 0;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.checkpointDir = path.join(projectPath, '.multi-agent', 'checkpoints');
    
    this.config = {
      enabled: true,
      warningThreshold: 0.90,      // Warn at 90%
      checkpointThreshold: 0.95,   // Checkpoint at 95%
      maxContextTokens: 180000,    // Conservative estimate for Claude
      autoRestart: false,          // Don't auto-restart by default
      saveFrequency: 10,           // Every 10 interactions
      retentionDays: 7            // Keep for 1 week
    };
  }

  async initialize(): Promise<void> {
    await fs.ensureDir(this.checkpointDir);
    await this.loadConfig();
    await this.cleanupOldCheckpoints();
  }

  private async loadConfig(): Promise<void> {
    const configPath = path.join(this.projectPath, '.multi-agent', 'checkpoint-config.json');
    
    if (await fs.pathExists(configPath)) {
      try {
        const userConfig = await fs.readJson(configPath);
        this.config = { ...this.config, ...userConfig };
      } catch (error) {
        console.warn('Failed to load checkpoint config, using defaults');
      }
    } else {
      // Create default config file
      await fs.writeJson(configPath, this.config, { spaces: 2 });
    }
  }

  async createCheckpoint(
    projectContext: ProjectContext,
    activeAgents: SubagentDefinition[],
    sessionData: CheckpointData['currentSession'],
    approvalHistory: CheckpointData['approvalHistory'],
    nextSteps: string[] = [],
    warnings: string[] = []
  ): Promise<CheckpointData> {
    const checkpointId = this.generateCheckpointId();
    
    const checkpoint: CheckpointData = {
      id: checkpointId,
      timestamp: new Date(),
      projectContext,
      activeAgents,
      currentSession: sessionData,
      approvalHistory,
      nextSteps,
      warnings,
      estimatedTokenUsage: this.currentTokenCount,
      contextWindowUtilization: this.currentTokenCount / this.config.maxContextTokens
    };

    // Save checkpoint to file
    const checkpointPath = path.join(this.checkpointDir, `${checkpointId}.json`);
    await fs.writeJson(checkpointPath, checkpoint, { spaces: 2 });

    // Create human-readable summary
    await this.createCheckpointSummary(checkpoint);

    console.log(chalk.blue(`📄 Checkpoint created: ${checkpointId}`));
    console.log(chalk.cyan(`   Context usage: ${Math.round(checkpoint.contextWindowUtilization * 100)}%`));

    return checkpoint;
  }

  private async createCheckpointSummary(checkpoint: CheckpointData): Promise<void> {
    const summaryPath = path.join(this.checkpointDir, `${checkpoint.id}-summary.md`);
    
    const summary = `# Multi-Agent Session Checkpoint

**Checkpoint ID**: ${checkpoint.id}  
**Created**: ${checkpoint.timestamp.toLocaleString()}  
**Context Usage**: ${Math.round(checkpoint.contextWindowUtilization * 100)}%

## Project Context
- **Framework**: ${checkpoint.projectContext.framework}
- **Language**: ${checkpoint.projectContext.language}
- **Features**: ${this.getProjectFeatures(checkpoint.projectContext)}

## Active Agents
${checkpoint.activeAgents.map(agent => `- **${agent.name}** - ${agent.role}`).join('\n')}

## Session Progress

### ✅ Completed Tasks
${checkpoint.currentSession.tasksCompleted.map(task => `- ${task}`).join('\n') || '- None'}

### 🔄 In Progress Tasks  
${checkpoint.currentSession.tasksInProgress.map(task => `- ${task}`).join('\n') || '- None'}

### 📋 Pending Tasks
${checkpoint.currentSession.tasksPending.map(task => `- ${task}`).join('\n') || '- None'}

### 🎯 Current Focus
${checkpoint.currentSession.currentFocus || 'No specific focus set'}

### 🔑 Key Decisions Made
${checkpoint.currentSession.keyDecisions.map(decision => `- ${decision}`).join('\n') || '- None'}

### 📝 Important Context
${checkpoint.currentSession.importantContext.map(context => `- ${context}`).join('\n') || '- None'}

## Approval History
- **Total Proposals**: ${checkpoint.approvalHistory.totalProposals}
- **Approved**: ${checkpoint.approvalHistory.approvedProposals}
- **Rejected**: ${checkpoint.approvalHistory.rejectedProposals}

### Recent Proposals
${checkpoint.approvalHistory.recentProposals.map(p => `- **${p.title}** (${p.status}) - ${p.type}`).join('\n') || '- None'}

## Next Steps
${checkpoint.nextSteps.map(step => `- [ ] ${step}`).join('\n') || '- No next steps defined'}

## Warnings & Issues
${checkpoint.warnings.map(warning => `⚠️ ${warning}`).join('\n') || '✅ No warnings'}

---

## Recovery Instructions

To resume this session:
1. Run \`multi-agent restore ${checkpoint.id}\`
2. Or manually review this checkpoint and continue with next steps
3. Key context and decisions are preserved above

**Estimated Tokens Used**: ${checkpoint.estimatedTokenUsage.toLocaleString()}  
**Context Window**: ${Math.round(checkpoint.contextWindowUtilization * 100)}% utilized
`;

    await fs.writeFile(summaryPath, summary);
  }

  updateTokenCount(additionalTokens: number): void {
    this.currentTokenCount += additionalTokens;
    this.interactionCount += 1;

    // Check if we should warn or checkpoint
    this.checkContextLimits();
  }

  private checkContextLimits(): void {
    const utilization = this.currentTokenCount / this.config.maxContextTokens;

    if (utilization >= this.config.checkpointThreshold) {
      console.log(chalk.red('\n🚨 CRITICAL: Context window nearly full!'));
      console.log(chalk.yellow(`   Current usage: ${Math.round(utilization * 100)}%`));
      console.log(chalk.blue('   Creating emergency checkpoint...'));
      
      // This would trigger checkpoint creation in the main workflow
      this.triggerEmergencyCheckpoint();
      
    } else if (utilization >= this.config.warningThreshold) {
      console.log(chalk.yellow('\n⚠️ WARNING: Context window getting full'));
      console.log(chalk.cyan(`   Current usage: ${Math.round(utilization * 100)}%`));
      console.log(chalk.blue('   Consider creating a checkpoint soon'));
      
    } else if (this.interactionCount % this.config.saveFrequency === 0) {
      console.log(chalk.blue(`\n💾 Regular checkpoint interval reached (${this.config.saveFrequency} interactions)`));
    }
  }

  private triggerEmergencyCheckpoint(): void {
    // This sets a flag that the main CLI can check
    const flagPath = path.join(this.checkpointDir, '.emergency-checkpoint-needed');
    fs.writeFileSync(flagPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      tokenCount: this.currentTokenCount,
      utilization: this.currentTokenCount / this.config.maxContextTokens
    }));
  }

  async shouldCreateCheckpoint(): Promise<boolean> {
    const utilization = this.currentTokenCount / this.config.maxContextTokens;
    
    return utilization >= this.config.checkpointThreshold || 
           this.interactionCount % this.config.saveFrequency === 0 ||
           await this.hasEmergencyFlag();
  }

  private async hasEmergencyFlag(): Promise<boolean> {
    const flagPath = path.join(this.checkpointDir, '.emergency-checkpoint-needed');
    return await fs.pathExists(flagPath);
  }

  async clearEmergencyFlag(): Promise<void> {
    const flagPath = path.join(this.checkpointDir, '.emergency-checkpoint-needed');
    if (await fs.pathExists(flagPath)) {
      await fs.remove(flagPath);
    }
  }

  async listCheckpoints(): Promise<CheckpointData[]> {
    const files = await fs.readdir(this.checkpointDir);
    const checkpoints: CheckpointData[] = [];

    for (const file of files) {
      if (file.endsWith('.json') && !file.includes('summary')) {
        try {
          const checkpoint = await fs.readJson(path.join(this.checkpointDir, file));
          checkpoints.push(checkpoint);
        } catch (error) {
          console.warn(`Failed to load checkpoint ${file}:`, error);
        }
      }
    }

    return checkpoints.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async restoreCheckpoint(checkpointId: string): Promise<CheckpointData | null> {
    const checkpointPath = path.join(this.checkpointDir, `${checkpointId}.json`);
    
    if (await fs.pathExists(checkpointPath)) {
      try {
        const checkpoint = await fs.readJson(checkpointPath);
        console.log(chalk.green(`✅ Restored checkpoint: ${checkpointId}`));
        console.log(chalk.blue(`   Session from: ${new Date(checkpoint.timestamp).toLocaleString()}`));
        return checkpoint;
      } catch (error) {
        console.error(chalk.red(`Failed to restore checkpoint: ${error}`));
        return null;
      }
    } else {
      console.error(chalk.red(`Checkpoint not found: ${checkpointId}`));
      return null;
    }
  }

  async getContextWindowStatus(): Promise<{
    utilization: number;
    tokensUsed: number;
    tokensRemaining: number;
    status: 'safe' | 'warning' | 'critical';
  }> {
    const utilization = this.currentTokenCount / this.config.maxContextTokens;
    const tokensRemaining = this.config.maxContextTokens - this.currentTokenCount;
    
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (utilization >= this.config.checkpointThreshold) {
      status = 'critical';
    } else if (utilization >= this.config.warningThreshold) {
      status = 'warning';
    }

    return {
      utilization,
      tokensUsed: this.currentTokenCount,
      tokensRemaining,
      status
    };
  }

  generateRestartPrompt(checkpoint: CheckpointData): string {
    return `# Multi-Agent Session Recovery

You are Claude Code with multi-agent capabilities. A previous session was checkpointed due to context limits.

## Session Recovery Context

**Previous Session**: ${checkpoint.id}  
**Timestamp**: ${checkpoint.timestamp.toLocaleString()}  
**Project**: ${checkpoint.projectContext.framework} (${checkpoint.projectContext.language})

## What Was Accomplished
${checkpoint.currentSession.tasksCompleted.map(task => `✅ ${task}`).join('\n')}

## Current State
- **In Progress**: ${checkpoint.currentSession.tasksInProgress.join(', ')}
- **Current Focus**: ${checkpoint.currentSession.currentFocus}
- **Context Usage**: Previous session reached ${Math.round(checkpoint.contextWindowUtilization * 100)}%

## Key Decisions Made
${checkpoint.currentSession.keyDecisions.map(decision => `🔑 ${decision}`).join('\n')}

## Important Context to Remember
${checkpoint.currentSession.importantContext.map(context => `📝 ${context}`).join('\n')}

## Next Steps to Continue
${checkpoint.nextSteps.map(step => `🎯 ${step}`).join('\n')}

## Active Agents Available
${checkpoint.activeAgents.map(agent => `🤖 ${agent.name} - ${agent.role}`).join('\n')}

---

**Instructions**: Continue the multi-agent workflow where the previous session left off. The user will provide additional context or requests. Use the checkpoint information above to maintain continuity and avoid repeating completed work.

Current multi-agent coordination rules and project context remain the same as defined in claude.md.
`;
  }

  private generateCheckpointId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `cp_${timestamp}_${random}`;
  }

  private getProjectFeatures(context: ProjectContext): string {
    const features = [];
    if (context.hasTypeScript) features.push('TypeScript');
    if (context.hasDatabase) features.push('Database');
    if (context.hasAuthentication) features.push('Authentication');
    if (context.hasAPI) features.push('API');
    if (context.hasTesting) features.push('Testing');
    if (context.hasLinting) features.push('Linting');
    
    return features.length > 0 ? features.join(', ') : 'None detected';
  }

  private async cleanupOldCheckpoints(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    const files = await fs.readdir(this.checkpointDir);
    
    for (const file of files) {
      if (file.endsWith('.json') || file.endsWith('.md')) {
        const filePath = path.join(this.checkpointDir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.mtime < cutoffDate) {
          await fs.remove(filePath);
          console.log(chalk.gray(`🗑️ Cleaned up old checkpoint: ${file}`));
        }
      }
    }
  }
}