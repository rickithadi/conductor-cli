import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectContext, SubagentDefinition } from './types';

export class ExternalCollaborationMode {
  private projectPath: string;
  private projectContext: ProjectContext;
  private collaborationDir: string;

  constructor(projectPath: string, projectContext: ProjectContext) {
    this.projectPath = projectPath;
    this.projectContext = projectContext;
    this.collaborationDir = path.join(projectPath, 'collaboration');
  }

  async setupCollaborationFiles(subagents: SubagentDefinition[]): Promise<void> {
    await fs.ensureDir(this.collaborationDir);
    
    // Create main coordination file
    await this.createMainCoordinationFile();
    
    // Create agent-specific communication files
    for (const agent of subagents) {
      await this.createAgentCommunicationFile(agent);
    }
    
    // Create shared task tracking
    await this.createTaskTrackingFile();
    
    // Create decision log
    await this.createDecisionLogFile();
    
    console.log(`✅ Created external collaboration files in ${this.collaborationDir}`);
  }

  private async createMainCoordinationFile(): Promise<void> {
    const content = `# Multi-Agent Coordination Hub

This file serves as the central coordination point for all agents working on this project.

## Project Overview
- **Framework**: ${this.projectContext.framework}
- **Language**: ${this.projectContext.language}
- **Package Manager**: ${this.projectContext.packageManager}

## Active Agents
<!-- Agents will update their status here -->

## Current Discussions
<!-- Agents post discussion topics here -->

## Decisions Made
<!-- Link to decision-log.md for major decisions -->

## Instructions for Claude
When working with this project:
1. Always read this coordination file first
2. Check relevant agent communication files
3. Update your agent's status before starting work
4. Log important decisions in decision-log.md
5. Communicate with other agents through their respective files
`;

    await fs.writeFile(path.join(this.collaborationDir, 'coordination.md'), content);
  }

  private async createAgentCommunicationFile(agent: SubagentDefinition): Promise<void> {
    const filename = `${agent.name.replace('@', '')}-communication.md`;
    const content = `# ${agent.name} Communication Log

**Role**: ${agent.role}

## Current Status
- Status: Ready
- Last Updated: ${new Date().toISOString()}
- Current Task: None

## Expertise Areas
${agent.expertise.map(e => `- ${e}`).join('\n')}

## Technical Stack
${agent.technicalStack.map(t => `- ${t}`).join('\n')}

${agent.specialInstructions ? `## Special Instructions
${agent.specialInstructions.map(i => `- ${i}`).join('\n')}` : ''}

## Recent Recommendations
<!-- Agent logs recommendations here -->

## Messages from Other Agents
<!-- Other agents can post messages here -->

## Messages to Other Agents
<!-- This agent posts messages to others here -->

## Completed Tasks
<!-- Log completed work here -->

## Blockers/Issues
<!-- Log any blockers or issues here -->
`;

    await fs.writeFile(path.join(this.collaborationDir, filename), content);
  }

  private async createTaskTrackingFile(): Promise<void> {
    const content = `# Task Tracking

## Active Tasks
<!-- Format: - [Agent] Task description (Status: In Progress/Waiting/Blocked) -->

## Completed Tasks
<!-- Archive completed tasks here -->

## Task Dependencies
<!-- Document which tasks depend on others -->

## Priority Queue
### High Priority
<!-- Urgent tasks that need immediate attention -->

### Medium Priority
<!-- Important tasks for next iteration -->

### Low Priority
<!-- Nice-to-have improvements -->

## Task Assignment Rules
1. Assign tasks based on agent expertise
2. Check for dependencies before starting
3. Update status regularly
4. Communicate blockers immediately
5. Archive completed tasks with results summary
`;

    await fs.writeFile(path.join(this.collaborationDir, 'task-tracking.md'), content);
  }

  private async createDecisionLogFile(): Promise<void> {
    const content = `# Decision Log

This file tracks important architectural and implementation decisions made by the multi-agent team.

## Template for New Decisions

### Decision [ID]: [Title]
- **Date**: YYYY-MM-DD
- **Participants**: List of agents involved
- **Problem**: What problem are we solving?
- **Options Considered**: 
  1. Option 1 - pros/cons
  2. Option 2 - pros/cons
- **Decision**: What was decided
- **Reasoning**: Why this option was chosen
- **Consequences**: Expected impact
- **Status**: Proposed/Accepted/Implemented

---

## Decisions

<!-- New decisions will be added here -->
`;

    await fs.writeFile(path.join(this.collaborationDir, 'decision-log.md'), content);
  }

  async updateAgentStatus(agentName: string, status: string, task?: string): Promise<void> {
    const filename = `${agentName.replace('@', '')}-communication.md`;
    const filepath = path.join(this.collaborationDir, filename);
    
    if (await fs.pathExists(filepath)) {
      let content = await fs.readFile(filepath, 'utf8');
      
      // Update status section
      const statusRegex = /## Current Status\n([\s\S]*?)(?=\n## )/;
      const newStatus = `## Current Status
- Status: ${status}
- Last Updated: ${new Date().toISOString()}
- Current Task: ${task || 'None'}`;

      content = content.replace(statusRegex, newStatus);
      await fs.writeFile(filepath, content);
    }
  }

  async logDecision(
    title: string,
    problem: string,
    options: string[],
    decision: string,
    reasoning: string,
    participants: string[]
  ): Promise<void> {
    const decisionFile = path.join(this.collaborationDir, 'decision-log.md');
    
    if (await fs.pathExists(decisionFile)) {
      let content = await fs.readFile(decisionFile, 'utf8');
      
      const timestamp = new Date().toISOString().split('T')[0];
      const decisionId = `D${Date.now()}`;
      
      const newDecision = `
### Decision ${decisionId}: ${title}
- **Date**: ${timestamp}
- **Participants**: ${participants.join(', ')}
- **Problem**: ${problem}
- **Options Considered**: 
${options.map((opt, i) => `  ${i + 1}. ${opt}`).join('\n')}
- **Decision**: ${decision}
- **Reasoning**: ${reasoning}
- **Status**: Accepted

---
`;

      // Insert before the template
      content = content.replace('## Decisions\n\n<!-- New decisions will be added here -->', 
        `## Decisions\n${newDecision}\n<!-- New decisions will be added here -->`);
      
      await fs.writeFile(decisionFile, content);
    }
  }

  async getCollaborationSummary(): Promise<string> {
    const files = await fs.readdir(this.collaborationDir);
    let summary = '# Multi-Agent Collaboration Summary\n\n';
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(this.collaborationDir, file), 'utf8');
        const title = file.replace('.md', '').replace('-', ' ').toUpperCase();
        summary += `## ${title}\n`;
        
        // Extract key information based on file type
        if (file.includes('communication')) {
          const statusMatch = content.match(/Status: (.+)/);
          const taskMatch = content.match(/Current Task: (.+)/);
          if (statusMatch) summary += `- Status: ${statusMatch[1]}\n`;
          if (taskMatch) summary += `- Current Task: ${taskMatch[1]}\n`;
        }
        
        summary += '\n';
      }
    }
    
    return summary;
  }
}