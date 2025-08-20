export interface ProjectContext {
  framework: string;
  language: string;
  packageManager: string;
  hasDatabase: boolean;
  hasAuthentication: boolean;
  hasAPI: boolean;
  hasTesting: boolean;
  hasLinting: boolean;
  hasTypeScript: boolean;
  hasAuth: boolean; // Alias for hasAuthentication for tests
  hasTests: boolean; // Alias for hasTesting for tests
  brandGuidelines?: string;
  apiDocs?: string;
  architecturalDecisions?: string[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  rootPath: string;
}

export interface SubagentDefinition {
  name: string;
  role: string;
  expertise: string[];
  brandAwareness?: string[];
  domainKnowledge?: string[];
  technicalStack: string[];
  specialInstructions?: string[];
  frameworkSpecific?: string[]; // Framework-specific guidance
  businessContext?: any; // Business context for marketing/PM agents
  integrations?: string[]; // Available integrations
  // Security-focused extensions
  securityFocus?: {
    primaryThreats: string[];
    complianceFrameworks: string[];
    tools: string[];
  };
  complianceFocus?: {
    regulations: string[];
    dataTypes: string[];
    rights: string[];
  };
  auditFocus?: {
    frameworks: string[];
    controls: string[];
    evidence: string[];
  };
  reviewFocus?: {
    patterns: string[];
    tools: string[];
    metrics: string[];
  };
  responseFocus?: {
    phases: string[];
    monitoring: string[];
    communication: string[];
  };
}

export interface CLIConfig {
  framework: string;
  projectContext: ProjectContext;
  subagents: string[];
  mode: 'subagents' | 'external-files';
  vscodeIntegration: boolean;
}

export interface FrameworkDetectionResult {
  framework: string;
  confidence: number;
  indicators: string[];
}

export interface VSCodeTerminalConfig {
  name: string;
  agent: string;
  cwd?: string;
  env?: Record<string, string>;
  shellPath?: string;
  shellArgs?: string[];
}

export type CoordinationMode = 'subagents' | 'external-files';

export interface AgentTerminal {
  name: string;
  agent: string;
  specialization: string;
  command: string;
  description: string;
}

export interface AgentRecommendation {
  agent: string;
  role: string;
  recommendation: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impacts: string[];
  dependencies?: string[];
  risks?: string[];
}

export interface ChangeProposal {
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