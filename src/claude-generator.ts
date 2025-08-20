import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectContext, SubagentDefinition, CoordinationMode } from './types';

export class ClaudeGenerator {
  private projectContext: ProjectContext;
  private subagents: SubagentDefinition[];
  private mode: CoordinationMode;

  constructor(
    projectContext: ProjectContext,
    subagents: SubagentDefinition[],
    mode: CoordinationMode = 'subagents'
  ) {
    this.projectContext = projectContext;
    this.subagents = subagents;
    this.mode = mode;
  }

  async generateClaudeContext(): Promise<string> {
    const sections = [
      this.generateHeader(),
      this.generateProjectContext(),
      this.generateSubagentDefinitions(),
      this.generateCoordinationInstructions(),
      this.generateExamples(),
      this.generateToolingInstructions()
    ];

    return sections.join('\n\n');
  }

  private generateHeader(): string {
    return `# Multi-Agent Development Team

You have access to multiple specialized subagents for this ${this.projectContext.framework} project. Coordinate between them internally to provide comprehensive development assistance.

**Project Type**: ${this.projectContext.framework} (${this.projectContext.language})
**Mode**: ${this.mode === 'subagents' ? 'Internal Subagent Coordination' : 'External File Collaboration'}`;
  }

  private generateProjectContext(): string {
    let context = `## Project Context

**Framework**: ${this.projectContext.framework}
**Language**: ${this.projectContext.language}
**Package Manager**: ${this.projectContext.packageManager}`;

    // Add technology stack
    const technologies = [];
    if (this.projectContext.hasTypeScript) technologies.push('TypeScript');
    if (this.projectContext.hasDatabase) technologies.push('Database Integration');
    if (this.projectContext.hasAuthentication) technologies.push('Authentication');
    if (this.projectContext.hasAPI) technologies.push('API Layer');
    if (this.projectContext.hasTesting) technologies.push('Testing Framework');
    if (this.projectContext.hasLinting) technologies.push('Code Linting');

    if (technologies.length > 0) {
      context += `\n**Technologies**: ${technologies.join(', ')}`;
    }

    // Add key dependencies
    if (this.projectContext.dependencies.length > 0) {
      const keyDeps = this.projectContext.dependencies
        .filter(dep => this.isKeyDependency(dep))
        .slice(0, 10);
      
      if (keyDeps.length > 0) {
        context += `\n**Key Dependencies**: ${keyDeps.join(', ')}`;
      }
    }

    // Add project-specific documentation paths
    if (this.projectContext.brandGuidelines) {
      context += `\n**Brand Guidelines**: ${this.projectContext.brandGuidelines}`;
    }
    if (this.projectContext.apiDocs) {
      context += `\n**API Documentation**: ${this.projectContext.apiDocs}`;
    }
    if (this.projectContext.architecturalDecisions?.length) {
      context += `\n**Architecture Decisions**: ${this.projectContext.architecturalDecisions.join(', ')}`;
    }

    // Add available scripts
    const scripts = Object.keys(this.projectContext.scripts);
    if (scripts.length > 0) {
      context += `\n**Available Scripts**: ${scripts.map(s => `npm run ${s}`).join(', ')}`;
    }

    return context;
  }

  private generateSubagentDefinitions(): string {
    let definitions = `## Available Subagents\n`;

    this.subagents.forEach(agent => {
      definitions += `\n### ${agent.name} - ${agent.role}\n`;
      definitions += `**Expertise**: ${agent.expertise.join(', ')}\n`;
      
      if (agent.brandAwareness?.length) {
        definitions += `**Brand Awareness**: ${agent.brandAwareness.join(', ')}\n`;
      }
      
      if (agent.domainKnowledge?.length) {
        definitions += `**Domain Knowledge**: ${agent.domainKnowledge.join(', ')}\n`;
      }
      
      definitions += `**Technical Stack**: ${agent.technicalStack.join(', ')}\n`;
      
      if (agent.specialInstructions?.length) {
        definitions += `**Special Instructions**:\n`;
        agent.specialInstructions.forEach(instruction => {
          definitions += `- ${instruction}\n`;
        });
      }
    });

    return definitions;
  }

  private generateCoordinationInstructions(): string {
    if (this.mode === 'subagents') {
      return this.generateSubagentCoordinationInstructions();
    } else {
      return this.generateExternalFileCoordinationInstructions();
    }
  }

  private generateSubagentCoordinationInstructions(): string {
    return `## Coordination Instructions

### Multi-Agent Workflow with Approval System

When analyzing code or providing assistance, follow this structured approach:

#### 1. Initial Analysis & Agent Consultation
**Automatically consult relevant subagents** based on the task type:
- Frontend tasks: Consult @frontend, @ux, and @review
- Backend tasks: Consult @backend, @database (if applicable), @security (if applicable), and @review
- Full-stack features: Coordinate between @frontend, @backend, @ux, and @review
- Testing tasks: Involve @testing with relevant specialists

#### 2. Generate Multi-Agent Recommendations
For any significant changes (code modifications, new features, architecture changes):

**Create comprehensive recommendations** that include:
- Each agent's specific perspective on the proposed change
- Priority level from each agent (low/medium/high/critical)
- Potential impacts on their domain (UX, performance, security, etc.)
- Dependencies and prerequisites
- Identified risks and mitigation strategies

#### 3. Present for User Approval
**Before implementing any changes**, present a structured recommendation that includes:

\`\`\`
🔍 MULTI-AGENT RECOMMENDATION

📋 Proposal: [Title]
📝 Description: [What needs to be done]
🎯 Type: [feature/bugfix/refactor/optimization/security/design]
⚡ Overall Priority: [Based on agent consensus]

🤖 AGENT PERSPECTIVES:

@frontend - Frontend Architecture Specialist
  💡 Recommendation: [Specific recommendation]
  🧠 Reasoning: [Why this approach]
  📈 Impacts: [User experience, performance, etc.]
  🔗 Dependencies: [What needs to happen first]
  ⚠️ Risks: [Potential issues]

@backend - API & Server Specialist  
  💡 Recommendation: [Specific recommendation]
  🧠 Reasoning: [Why this approach]
  📈 Impacts: [Security, performance, scalability]
  🔗 Dependencies: [Database changes, etc.]
  ⚠️ Risks: [Potential issues]

@ux - User Experience Specialist
  💡 Recommendation: [Specific recommendation]
  🧠 Reasoning: [Why this approach]
  📈 Impacts: [Usability, accessibility, conversion]
  🔗 Dependencies: [Design updates, user testing]
  ⚠️ Risks: [User confusion, learning curve]

@review - Code Quality & Architecture
  💡 Recommendation: [Specific recommendation]
  🧠 Reasoning: [Why this approach]
  📈 Impacts: [Code quality, maintainability, tech debt]
  🔗 Dependencies: [Testing, documentation]
  ⚠️ Risks: [Complexity, breaking changes]

📊 CONSENSUS ANALYSIS:
- Priority Agreement: [High/Medium/Low consensus on priority]
- Risk Assessment: [X unique risks identified]
- Impact Areas: [All affected domains]

🎯 RECOMMENDED ACTION:
[Synthesized recommendation based on all agent input]
\`\`\`

#### 4. User Decision Process
Wait for user approval before proceeding. Users can:
- ✅ **Approve all recommendations** - Implement as proposed
- 🔧 **Approve with modifications** - User provides specific changes
- 🔍 **Approve individual recommendations** - Cherry-pick which agents' advice to follow
- ❌ **Reject proposal** - Don't implement the changes
- ⏸️ **Save for later** - Store for future consideration

#### 5. Implementation Guidelines
Only after user approval:
- Implement the approved recommendations
- Follow the specified modifications if any
- Skip rejected recommendations
- Document any deviations and reasoning

#### 6. Post-Implementation Review
After completing approved changes:
- Verify implementation meets agent recommendations
- Run quality checks (tests, linting, build)
- Update any affected documentation
- Note lessons learned for future recommendations

### Conflict Resolution
When agents disagree:
1. **Clearly present the conflict** - Show different perspectives
2. **Explain trade-offs** - Help user understand implications
3. **Suggest compromise solutions** - Find middle ground when possible
4. **Recommend decision criteria** - Help user choose based on project priorities`;
  }

  private generateExternalFileCoordinationInstructions(): string {
    return `## Coordination Instructions (External File Mode)

This project uses external collaboration files for agent coordination:

1. **Write to collaboration files** when agents need to communicate
2. **Read collaboration files** before providing responses to understand context
3. **Update task status** in shared files to track progress
4. **Resolve conflicts** through documented discussion in collaboration files

**Collaboration Directory**: \`./collaboration/\`
**Agent Communication**: Use markdown files for inter-agent messages
**Task Tracking**: Maintain shared task lists with agent assignments`;
  }

  private generateExamples(): string {
    return `## Example Internal Coordination

### Automatic Coordination (Internal)
When user asks about a React component:
- @frontend analyzes component architecture and performance
- @ux evaluates user experience and accessibility  
- @review checks code quality and patterns
- You synthesize their insights into a comprehensive response

When user asks about API design:
- @backend leads the analysis
- @frontend considers integration implications
- @ux thinks about error handling and loading states
- @review validates against established patterns

### Explicit Subagent Consultation
**User can explicitly request specific agent perspectives**:
- "What does @frontend think about this component?"
- "Can @ux review this user flow?"
- "Have @backend and @frontend discuss this API integration"
- "Get @review's perspective on this architecture decision"

### Multi-Agent Collaboration Examples
- **Feature Implementation**: @frontend + @backend + @ux coordinate on new features
- **Performance Issues**: @frontend + @backend + @review analyze optimization opportunities
- **Security Review**: @security + @backend + @review ensure secure implementation
- **Testing Strategy**: @testing + relevant specialists design comprehensive test plans`;
  }

  private generateToolingInstructions(): string {
    let instructions = `## Development Workflow Integration

### VS Code Integration
This project includes specialized terminal profiles for each agent:
- **Multi-Agent Assistant**: Default terminal with full team coordination
- **Agent-Specific Terminals**: Individual terminals for specialized consultation

### Available Tasks
`;

    // Add framework-specific tasks
    const scripts = Object.keys(this.projectContext.scripts);
    if (scripts.includes('dev')) {
      instructions += `- **Development**: \`npm run dev\` - Start development server\n`;
    }
    if (scripts.includes('build')) {
      instructions += `- **Build**: \`npm run build\` - Build for production\n`;
    }
    if (scripts.includes('test')) {
      instructions += `- **Testing**: \`npm run test\` - Run test suite\n`;
    }
    if (scripts.includes('lint')) {
      instructions += `- **Linting**: \`npm run lint\` - Check code quality\n`;
    }

    instructions += `
### Agent Consultation Commands
You can invoke specific agents using the VS Code command palette:
- \`Tasks: Run Task\` → \`Consult @frontend\`
- \`Tasks: Run Task\` → \`Consult @backend\`
- \`Tasks: Run Task\` → \`Consult @ux\`
- \`Tasks: Run Task\` → \`Consult @review\`

### Quality Assurance
Before completing any significant implementation:
1. **Code Review**: @review validates architecture and patterns
2. **Testing**: Ensure test coverage for new functionality
3. **Linting**: Run \`${this.projectContext.packageManager} run lint\` if available
4. **Build Check**: Verify \`${this.projectContext.packageManager} run build\` succeeds

### 📄 Context Management & Checkpoints

This project includes an intelligent checkpoint system to handle context window limits:

#### Automatic Monitoring
- **Token tracking**: Context usage is monitored automatically
- **Warning at 90%**: You'll be notified when context approaches limits
- **Critical at 95%**: Emergency checkpoint creation is triggered

#### Checkpoint Commands
- \`multi-agent checkpoint --status\` - Check current context usage
- \`multi-agent checkpoint --create\` - Create manual checkpoint
- \`multi-agent checkpoint --list\` - View available checkpoints
- \`multi-agent checkpoint --restore <id>\` - Restore previous session

#### When Context Fills Up
1. **Automatic checkpoint creation** preserves:
   - Current project context and active agents
   - Tasks completed, in progress, and pending
   - Key decisions made and important context
   - Approval history and recent proposals
   - Next steps and any warnings

2. **Session recovery** provides:
   - Human-readable checkpoint summary
   - Structured restart context for Claude Code
   - Continuity across context window resets

#### Best Practices
- Create manual checkpoints before major work sessions
- Review checkpoint status regularly with \`--status\`
- Use descriptive focus and task descriptions for better recovery
- Keep important context and decisions well-documented

**Note**: If you notice context approaching limits, proactively create a checkpoint to ensure smooth continuation of work.`;

    return instructions;
  }

  async writeClaudeFile(outputPath?: string): Promise<void> {
    const claudeContent = await this.generateClaudeContext();
    const filePath = outputPath || path.join(this.projectContext.rootPath, 'claude.md');
    
    await fs.writeFile(filePath, claudeContent, 'utf8');
  }

  private isKeyDependency(dep: string): boolean {
    const keyPatterns = [
      // Frontend frameworks
      'react', 'vue', 'angular', 'svelte', 'next',
      // Backend frameworks
      'express', 'fastify', 'koa', 'nestjs',
      // State management
      'redux', 'zustand', 'mobx', 'recoil',
      // Styling
      'tailwind', 'styled-components', 'emotion', 'sass',
      // Database
      'prisma', 'mongoose', 'sequelize', 'typeorm',
      // Testing
      'jest', 'cypress', 'playwright', 'vitest',
      // Tools
      'typescript', 'eslint', 'prettier', 'webpack'
    ];

    return keyPatterns.some(pattern => dep.includes(pattern));
  }
}