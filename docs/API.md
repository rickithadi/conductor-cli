# 📋 Conductor CLI - API Reference

> **Complete API documentation for the AI development orchestrator powered by Claude Code and Anthropic's Claude AI**

This document provides comprehensive API reference for Conductor CLI, including all commands, options, configuration, and programmatic usage leveraging the **MULTI_AGENT_WORKFLOW** orchestration system.

---

## 🚀 **Core Commands**

### **`conductor init`**
Initialize Conductor CLI in your project with intelligent framework detection and multi-agent orchestration setup.

```bash
conductor init [options]
```

**Options:**
- `--framework <type>` - Specify framework: `nextjs`, `react`, `vue`, `express`, `jekyll`
- `--typescript` - Enable TypeScript support
- `--security-profile <level>` - Security profile: `enterprise`, `startup`, `government`
- `--database <type>` - Database type: `postgresql`, `mysql`, `mongodb`, `sqlite`
- `--agents <list>` - Comma-separated list of agents to enable
- `--force` - Overwrite existing configuration
- `--verbose` - Detailed initialization output

**Examples:**
```bash
# Auto-detect framework and setup all agents
conductor init

# Next.js with TypeScript and enterprise security
conductor init --framework nextjs --typescript --security-profile enterprise

# Full-stack setup with database
conductor init --framework nextjs --database postgresql --agents frontend,backend,security,testing
```

**Multi-Agent Setup:**
- Creates `.conductor/` directory with orchestration configuration
- Generates agent-specific contexts in `.conductor/agents/`
- Sets up VS Code integration with agent terminals
- Creates main `claude.md` context file with MULTI_AGENT_WORKFLOW
- Initializes checkpoint system for session management

---

### **`conductor recommend`**
Get expert recommendations from the specialized AI agent team using the multi-agent workflow orchestration.

```bash
conductor recommend "<question>" [options]
```

**Options:**
- `--agent <name>` - Consult specific agent: `@frontend`, `@backend`, `@security`, `@testing`, `@seo`, `@ux`, `@review`
- `--priority <level>` - Priority level: `low`, `medium`, `high`, `critical`
- `--format <type>` - Output format: `terminal`, `json`, `markdown`, `html`
- `--export <file>` - Export recommendations to file
- `--security-focus` - Include security analysis from @security agent
- `--detailed` - Include detailed implementation steps
- `--consensus` - Show agent consensus scores
- `--interactive` - Interactive recommendation mode with all agents

**Multi-Agent Workflow Examples:**
```bash
# All agents collaborate on authentication implementation
conductor recommend "Add authentication to my Next.js app"

# Backend-specific recommendation with security review
conductor recommend "Optimize database queries" --agent @backend --security-focus

# Full team consensus on security implementation
conductor recommend "Implement OAuth 2.0" --consensus --detailed

# Export comprehensive recommendation from all agents
conductor recommend "Code review checklist" --format markdown --export checklist.md
```

**Multi-Agent Response Format:**
```json
{
  "id": "rec_abc123",
  "question": "Add authentication to my Next.js app",
  "timestamp": "2025-01-20T10:30:00Z",
  "orchestration_type": "MULTI_AGENT_WORKFLOW",
  "agents_consulted": [
    {
      "name": "@frontend",
      "role": "React/Next.js Specialist",
      "recommendation": "Implement NextAuth.js with JWT strategy for seamless SSR support...",
      "priority": "high",
      "confidence": 95,
      "dependencies": ["@backend", "@security"],
      "implementation_steps": ["Install NextAuth.js", "Configure providers", "Set up session management"],
      "risks": ["Session complexity", "Provider configuration"],
      "benefits": ["SSR compatibility", "Multiple provider support"]
    },
    {
      "name": "@security",
      "role": "Security Expert (Gallifrey Built-in)",
      "recommendation": "Ensure PKCE flow for OAuth 2.0, implement proper session security...",
      "priority": "critical",
      "confidence": 98,
      "security_analysis": {
        "owasp_compliance": "A07:2021-Authentication-Failures",
        "threat_mitigation": ["Session hijacking", "CSRF attacks"],
        "security_score_impact": "+15"
      }
    },
    {
      "name": "@backend",
      "role": "API & Server Expert",
      "recommendation": "Design RESTful auth endpoints with proper error handling...",
      "priority": "high",
      "confidence": 92,
      "api_design": {
        "endpoints": ["/api/auth/signin", "/api/auth/callback", "/api/auth/session"],
        "middleware": ["CORS", "Rate limiting", "Input validation"]
      }
    }
  ],
  "consensus": {
    "overall_score": 95,
    "agent_agreement": 98,
    "implementation_difficulty": "medium",
    "estimated_time": "3-4 hours",
    "security_impact": "high",
    "recommended_approach": "NextAuth.js with custom session management"
  },
  "orchestration_summary": {
    "agents_active": 7,
    "consensus_reached": true,
    "conflict_resolution": "none_required",
    "follow_up_actions": ["Security review after implementation", "Performance testing"]
  }
}
```

---

### **`conductor dashboard`**
Launch the beautiful terminal dashboard with real-time multi-agent monitoring and orchestration visualization.

```bash
conductor dashboard [options]
```

**Options:**
- `--watch` - Enable real-time updates from all agents
- `--agent <name>` - Agent-specific dashboard view
- `--security` - Security-focused dashboard with OWASP monitoring
- `--theme <name>` - Dashboard theme: `gallifrey`, `dark`, `light`, `cyberpunk`
- `--port <number>` - Web dashboard port (if available)
- `--full-screen` - Launch in full-screen mode
- `--minimal` - Minimal dashboard view

**Multi-Agent Dashboard Features:**
- **Agent Status Board** - Real-time activity from all 7 agents
- **Consensus Tracking** - Team agreement metrics and conflict resolution
- **Recommendation Queue** - Pending and completed multi-agent recommendations
- **Security Monitoring** - OWASP compliance and threat detection by @security
- **Performance Metrics** - System and project performance from all agents
- **Agent Communication** - Inter-agent dependency tracking

**Interactive Controls:**
- `Tab` - Switch between agent sections
- `Enter` - Expand multi-agent recommendation details
- `Space` - Toggle specific agent activity
- `c` - Show consensus matrix between agents
- `r` - Refresh all agent data
- `q` - Quit dashboard

**Dashboard Layout:**
```
┌─ CONDUCTOR MULTI-AGENT DASHBOARD ─────────────────────────────────────────────┐
│                                                                               │
│  🤖 AGENT STATUS               📊 CONSENSUS METRICS                          │
│  ─────────────────             ─────────────────────                         │
│  @frontend     🟢 Active        Agent Agreement:    94%                      │
│  @backend      🟢 Active        Conflict Resolution: 0                       │
│  @security     🟡 Analyzing     Implementation Score: 92                     │
│  @testing      🟢 Active        Security Compliance: 100%                    │
│  @seo          💤 Idle                                                        │
│  @ux           🟢 Active        🎯 ACTIVE ORCHESTRATION                      │
│  @review       🟢 Active        ─────────────────────────                    │
│                                 Current Task: "Add authentication"            │
│  📋 RECOMMENDATIONS             Agents Collaborating: 5/7                    │
│  ──────────────────────         Expected Completion: 12 min                 │
│  🔄 In Progress (3)             Cross-Agent Dependencies: 2                  │
│  ✅ Completed (12)                                                            │
│  ⏳ Pending (1)               🛡️ SECURITY STATUS                            │
│                                ─────────────────────                         │
│  🎭 ORCHESTRATION              OWASP Compliance: ✅                          │
│  ───────────────────           Vulnerabilities: 0 Critical                   │
│  Multi-Agent Mode: ON          Security Score: 98/100                        │
│  Consensus Required: YES                                                      │
│  Auto-Resolve: MINOR          📈 PERFORMANCE                                │
│                                ──────────────────                            │
└───────────────────────────────────────────────────────────────────────────────┘
```

### SubagentGenerator

Creates specialized agents based on project context.

```typescript
class SubagentGenerator {
  constructor(projectContext: ProjectContext)
  
  generateSubagents(): SubagentDefinition[]
  
  private generateFrontendAgent(): SubagentDefinition
  private generateBackendAgent(): SubagentDefinition
  private generateUXAgent(): SubagentDefinition
  private generateReviewAgent(): SubagentDefinition
  // ... other agent generators
}
```

**Usage:**
```typescript
import { SubagentGenerator } from './subagent-generator';

const generator = new SubagentGenerator(projectContext);
const agents = generator.generateSubagents();
console.log(agents.map(a => a.name)); // ["@frontend", "@backend", "@ux", ...]
```

### ApprovalSystem

Manages the multi-agent approval workflow.

```typescript
class ApprovalSystem {
  constructor(projectPath: string = process.cwd())
  
  async initializeApprovalSystem(): Promise<void>
  
  async createProposal(
    title: string,
    description: string,
    type: ChangeProposal['type'],
    agentRecommendations: AgentRecommendation[]
  ): Promise<ChangeProposal>
  
  async getAgentRecommendations(
    task: string,
    subagents: SubagentDefinition[],
    context?: any
  ): Promise<AgentRecommendation[]>
  
  async presentProposalForApproval(proposal: ChangeProposal): Promise<ChangeProposal>
  
  async listPendingProposals(): Promise<ChangeProposal[]>
}
```

**Usage:**
```typescript
import { ApprovalSystem } from './approval-system';

const approvalSystem = new ApprovalSystem();
await approvalSystem.initializeApprovalSystem();

const recommendations = await approvalSystem.getAgentRecommendations(
  "Add user authentication", 
  agents
);

const proposal = await approvalSystem.createProposal(
  "Add Authentication",
  "Implement OAuth 2.0 authentication",
  "feature",
  recommendations
);
```

### VSCodeIntegration

Sets up VSCode workspace integration.

```typescript
class VSCodeIntegration {
  constructor(projectPath: string, projectContext: ProjectContext)
  
  async setupTerminalProfiles(subagents: SubagentDefinition[]): Promise<void>
  async createAgentTasks(subagents: SubagentDefinition[]): Promise<void>
  async createLaunchConfigurations(subagents: SubagentDefinition[]): Promise<void>
  async generateVSCodeExtensions(): Promise<void>
  async createWorkspaceSettings(): Promise<void>
}
```

## 📋 Type Definitions

### ProjectContext

```typescript
interface ProjectContext {
  framework: string;
  language: string;
  packageManager: string;
  hasDatabase: boolean;
  hasAuthentication: boolean;
  hasAPI: boolean;
  hasTesting: boolean;
  hasLinting: boolean;
  hasTypeScript: boolean;
  brandGuidelines?: string;
  apiDocs?: string;
  architecturalDecisions?: string[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  rootPath: string;
}
```

### SubagentDefinition

```typescript
interface SubagentDefinition {
  name: string;              // "@frontend"
  role: string;              // "Frontend Architecture Specialist"
  expertise: string[];       // ["React", "Next.js", "TypeScript"]
  brandAwareness?: string[]; // ["Professional tone", "Accessibility-first"]
  domainKnowledge?: string[];// ["E-commerce patterns", "B2B SaaS"]
  technicalStack: string[];  // ["Next.js 14", "Tailwind CSS"]
  specialInstructions?: string[];
}
```

### ChangeProposal

```typescript
interface ChangeProposal {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'bugfix' | 'refactor' | 'optimization' | 'security' | 'design';
  status: 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  agentRecommendations: AgentRecommendation[];
  userFeedback?: string;
  approvedActions?: string[];
  rejectedActions?: string[];
  modifiedActions?: Array<{
    original: string;
    modified: string;
    reason: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### AgentRecommendation

```typescript
interface AgentRecommendation {
  agent: string;           // "@frontend"
  role: string;            // "Frontend Architecture Specialist"
  recommendation: string;  // "Use Next.js Server Components"
  reasoning: string;       // "Improves performance and SEO"
  priority: 'low' | 'medium' | 'high' | 'critical';
  impacts: string[];       // ["Performance", "SEO", "Developer Experience"]
  dependencies?: string[]; // ["Upgrade to Next.js 14"]
  risks?: string[];        // ["Learning curve for team"]
}
```

## 🔌 Extension Points

### Custom Agent Creation

Create custom agents by extending the SubagentGenerator:

```typescript
class CustomSubagentGenerator extends SubagentGenerator {
  generateSubagents(): SubagentDefinition[] {
    const defaultAgents = super.generateSubagents();
    
    // Add custom performance agent
    const performanceAgent: SubagentDefinition = {
      name: '@performance',
      role: 'Performance Optimization Specialist',
      expertise: [
        'Core Web Vitals',
        'Bundle optimization',
        'Lazy loading strategies',
        'Caching patterns'
      ],
      technicalStack: [
        'Lighthouse',
        'WebPageTest',
        'Bundle Analyzer',
        'Service Workers'
      ],
      specialInstructions: [
        'Always measure before optimizing',
        'Consider mobile users on slow networks',
        'Monitor real-user metrics'
      ]
    };
    
    return [...defaultAgents, performanceAgent];
  }
}
```

### Custom Framework Detection

Extend ContextScanner for new frameworks:

```typescript
class CustomContextScanner extends ContextScanner {
  protected async detectFramework(): Promise<FrameworkDetectionResult> {
    const baseResult = await super.detectFramework();
    
    // Add custom framework detection
    const packageJson = await this.readPackageJson();
    const deps = { ...packageJson?.dependencies, ...packageJson?.devDependencies };
    
    if (deps['@remix-run/react']) {
      return {
        framework: 'remix',
        confidence: 0.9,
        indicators: ['@remix-run/react']
      };
    }
    
    return baseResult;
  }
}
```

### Custom Approval Workflows

Create custom approval strategies:

```typescript
class CustomApprovalSystem extends ApprovalSystem {
  async presentProposalForApproval(proposal: ChangeProposal): Promise<ChangeProposal> {
    // Custom approval logic
    if (proposal.priority === 'low') {
      // Auto-approve low priority changes
      proposal.status = 'approved';
      proposal.approvedActions = proposal.agentRecommendations.map(r => r.recommendation);
      return proposal;
    }
    
    // Use default approval for higher priority
    return super.presentProposalForApproval(proposal);
  }
}
```

## 🔧 Plugin System

### Creating Plugins

```typescript
interface MultiAgentPlugin {
  name: string;
  version: string;
  agents?: SubagentDefinition[];
  contextEnhancers?: Array<(context: ProjectContext) => ProjectContext>;
  approvalStrategies?: Array<(proposal: ChangeProposal) => ChangeProposal>;
}

class MyCustomPlugin implements MultiAgentPlugin {
  name = 'my-custom-plugin';
  version = '1.0.0';
  
  agents = [
    {
      name: '@seo',
      role: 'SEO Optimization Specialist',
      expertise: ['Technical SEO', 'Content optimization', 'Schema markup'],
      technicalStack: ['Google Analytics', 'Search Console', 'Lighthouse'],
      specialInstructions: [
        'Optimize for Core Web Vitals',
        'Ensure proper semantic HTML',
        'Consider mobile-first indexing'
      ]
    }
  ];
  
  contextEnhancers = [
    (context: ProjectContext) => {
      // Add SEO-specific context
      return {
        ...context,
        hasSEO: this.detectSEOTools(context)
      };
    }
  ];
  
  private detectSEOTools(context: ProjectContext): boolean {
    return context.dependencies.some(dep => 
      dep.includes('next-seo') || dep.includes('react-helmet')
    );
  }
}
```

### Plugin Registration

```typescript
// In your project
import { MultiAgentCLI } from 'multi-agent-cli';
import { MyCustomPlugin } from './my-plugin';

const cli = new MultiAgentCLI();
cli.registerPlugin(new MyCustomPlugin());
```

## 📡 Event System

### Available Events

```typescript
interface MultiAgentEvents {
  'project:analyzed': (context: ProjectContext) => void;
  'agents:generated': (agents: SubagentDefinition[]) => void;
  'proposal:created': (proposal: ChangeProposal) => void;
  'proposal:approved': (proposal: ChangeProposal) => void;
  'proposal:rejected': (proposal: ChangeProposal) => void;
  'recommendation:generated': (recommendation: AgentRecommendation) => void;
}
```

### Event Handling

```typescript
import { EventEmitter } from 'events';

class MultiAgentEventBus extends EventEmitter {
  constructor() {
    super();
    
    // Log all proposals
    this.on('proposal:created', (proposal) => {
      console.log(`New proposal: ${proposal.title}`);
    });
    
    // Track approvals
    this.on('proposal:approved', (proposal) => {
      this.logApproval(proposal);
    });
  }
  
  private logApproval(proposal: ChangeProposal): void {
    // Custom approval logging
    console.log(`Approved: ${proposal.title}`);
    // Send to analytics, Slack, etc.
  }
}
```

## 🧪 Testing Utilities

### Test Helpers

```typescript
// test-utils.ts
export class TestContextScanner extends ContextScanner {
  constructor(private mockContext: Partial<ProjectContext>) {
    super('/test/path');
  }
  
  async scan(): Promise<ProjectContext> {
    return {
      framework: 'test',
      language: 'typescript',
      packageManager: 'npm',
      hasDatabase: false,
      hasAuthentication: false,
      hasAPI: false,
      hasTesting: true,
      hasLinting: true,
      hasTypeScript: true,
      dependencies: [],
      devDependencies: [],
      scripts: {},
      rootPath: '/test/path',
      ...this.mockContext
    };
  }
}

export class MockApprovalSystem extends ApprovalSystem {
  constructor(private autoApprove: boolean = false) {
    super('/test/path');
  }
  
  async presentProposalForApproval(proposal: ChangeProposal): Promise<ChangeProposal> {
    if (this.autoApprove) {
      proposal.status = 'approved';
      proposal.approvedActions = proposal.agentRecommendations.map(r => r.recommendation);
    }
    return proposal;
  }
}
```

### Example Tests

```typescript
// example.test.ts
import { TestContextScanner, MockApprovalSystem } from './test-utils';
import { SubagentGenerator } from '../src/subagent-generator';

describe('SubagentGenerator', () => {
  it('should generate frontend agent for React project', async () => {
    const scanner = new TestContextScanner({
      framework: 'react',
      dependencies: ['react', 'react-dom']
    });
    
    const context = await scanner.scan();
    const generator = new SubagentGenerator(context);
    const agents = generator.generateSubagents();
    
    const frontendAgent = agents.find(a => a.name === '@frontend');
    expect(frontendAgent).toBeDefined();
    expect(frontendAgent!.technicalStack).toContain('React 18');
  });
  
  it('should create and approve proposals', async () => {
    const approvalSystem = new MockApprovalSystem(true);
    const proposal = await approvalSystem.createProposal(
      'Test Feature',
      'Test Description',
      'feature',
      []
    );
    
    const result = await approvalSystem.presentProposalForApproval(proposal);
    expect(result.status).toBe('approved');
  });
});
```

## 🔄 Migration Guide

### From v1.x to v2.x

```typescript
// v1.x
const scanner = new ContextScanner();
const context = scanner.analyzeProject();

// v2.x
const scanner = new ContextScanner();
const context = await scanner.scan();
```

### Breaking Changes

- `analyzeProject()` → `scan()` (now async)
- `AgentDefinition` → `SubagentDefinition`
- Added required `projectPath` parameter to constructors
- Approval system now requires initialization

---

For more detailed API examples, see the [source code](../src/) and [test files](../__tests__/).