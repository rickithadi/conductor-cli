# API Documentation

This document provides detailed API documentation for developers who want to extend or integrate with the Multi-Agent CLI.

## 📦 Core Classes

### ContextScanner

Analyzes project structure and technology stack.

```typescript
class ContextScanner {
  constructor(projectPath: string = process.cwd())
  
  async scan(): Promise<ProjectContext>
  
  private async detectFramework(): Promise<FrameworkDetectionResult>
  private async detectLanguage(): Promise<string>
  private async detectPackageManager(): Promise<string>
  private async hasTypeScript(): Promise<boolean>
  private async hasDatabase(): Promise<boolean>
  private async hasAuthentication(): Promise<boolean>
  // ... other detection methods
}
```

**Usage:**
```typescript
import { ContextScanner } from './context-scanner';

const scanner = new ContextScanner('/path/to/project');
const context = await scanner.scan();
console.log(context.framework); // "nextjs"
console.log(context.hasDatabase); // true
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