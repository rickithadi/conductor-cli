import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { EventEmitter } from 'events';
import { StatusIndicator } from './ux/status-indicator';

interface AgentDefinition {
  name: string;
  role: string;
  expertise: string[];
  priority: number;
  dependencies: string[];
  contextTemplate: string;
  specialInstructions: string[];
  technicalStack: string[];
}

interface AgentInstance {
  definition: AgentDefinition;
  status: 'initializing' | 'ready' | 'busy' | 'error' | 'offline';
  confidence: number;
  currentTask?: string;
  lastActivity: Date;
  contextData: Record<string, any>;
}

interface ConsultationRequest {
  id: string;
  query: string;
  requiredAgents: string[];
  optionalAgents: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
}

export class AgentOrchestrator extends EventEmitter {
  private agents: Map<string, AgentInstance> = new Map();
  private agentDefinitions: Map<string, AgentDefinition> = new Map();
  private statusIndicator: StatusIndicator;
  private projectPath: string;
  private activeConsultations: Map<string, ConsultationRequest> = new Map();

  constructor(projectPath: string = process.cwd()) {
    super();
    this.statusIndicator = new StatusIndicator();
    this.projectPath = projectPath;
    this.initializeAgentDefinitions();
  }

  private initializeAgentDefinitions(): void {
    const definitions: AgentDefinition[] = [
      {
        name: '@pm',
        role: 'Product Manager',
        expertise: [
          'Requirements gathering', 'User story creation', 'Roadmap planning',
          'Stakeholder communication', 'Feature prioritization', 'Market analysis'
        ],
        priority: 8,
        dependencies: [],
        contextTemplate: 'pm-context-template',
        specialInstructions: [
          'Focus on business value and user needs',
          'Consider technical feasibility in recommendations',
          'Align features with overall product strategy'
        ],
        technicalStack: ['Product Management', 'Analytics', 'User Research']
      },
      {
        name: '@design',
        role: 'UX/UI Designer',
        expertise: [
          'User experience design', 'Interface design', 'Accessibility compliance',
          'Design systems', 'User research', 'Prototyping'
        ],
        priority: 7,
        dependencies: ['@pm'],
        contextTemplate: 'design-context-template',
        specialInstructions: [
          'Ensure WCAG 2.1 AA compliance',
          'Design for mobile-first approach',
          'Consider user cognitive load and accessibility',
          'Focus on conversion optimization'
        ],
        technicalStack: ['Figma', 'Accessibility Guidelines', 'Design Systems']
      },
      {
        name: '@frontend',
        role: 'Frontend Developer',
        expertise: [
          'React development', 'Next.js applications', 'TypeScript',
          'State management', 'Performance optimization', 'Modern web standards'
        ],
        priority: 9,
        dependencies: ['@design'],
        contextTemplate: 'frontend-context-template',
        specialInstructions: [
          'Focus on component reusability and maintainability',
          'Optimize for Core Web Vitals',
          'Follow established design system patterns',
          'Consider SEO and accessibility'
        ],
        technicalStack: ['React', 'Next.js', 'TypeScript', 'CSS-in-JS']
      },
      {
        name: '@backend',
        role: 'Backend Engineer',
        expertise: [
          'API design', 'Database optimization', 'Security patterns',
          'Performance tuning', 'Microservices', 'Authentication'
        ],
        priority: 9,
        dependencies: [],
        contextTemplate: 'backend-context-template',
        specialInstructions: [
          'Follow OpenAPI specification standards',
          'Implement proper error handling and logging',
          'Ensure security best practices',
          'Optimize database queries and performance'
        ],
        technicalStack: ['Node.js', 'TypeScript', 'Databases', 'API Design']
      },
      {
        name: '@security',
        role: 'Security Expert',
        expertise: [
          'OWASP compliance', 'Vulnerability assessment', 'Secure coding',
          'Authentication & authorization', 'Data protection', 'Threat modeling'
        ],
        priority: 8,
        dependencies: ['@backend'],
        contextTemplate: 'security-context-template',
        specialInstructions: [
          'Enforce OWASP Top 10 security practices',
          'Review authentication and authorization flows',
          'Identify potential security vulnerabilities',
          'Ensure data protection compliance'
        ],
        technicalStack: ['Security Frameworks', 'OWASP', 'Encryption', 'Auth Systems']
      },
      {
        name: '@qa',
        role: 'Quality Assurance Engineer',
        expertise: [
          'Test strategy design', 'Unit testing', 'Integration testing',
          'E2E testing', 'Test automation', 'Quality metrics'
        ],
        priority: 7,
        dependencies: ['@frontend', '@backend'],
        contextTemplate: 'qa-context-template',
        specialInstructions: [
          'Implement comprehensive test coverage',
          'Design maintainable test suites',
          'Focus on critical user paths',
          'Ensure test reliability and speed'
        ],
        technicalStack: ['Jest', 'Playwright', 'Testing Library', 'Cypress']
      },
      {
        name: '@devops',
        role: 'DevOps Engineer',
        expertise: [
          'CI/CD pipelines', 'Infrastructure management', 'Deployment automation',
          'Monitoring & alerting', 'Container orchestration', 'Cloud platforms'
        ],
        priority: 6,
        dependencies: ['@backend', '@frontend'],
        contextTemplate: 'devops-context-template',
        specialInstructions: [
          'Optimize deployment pipelines for speed and reliability',
          'Implement comprehensive monitoring',
          'Ensure scalable infrastructure design',
          'Focus on automation and reproducibility'
        ],
        technicalStack: ['Docker', 'Kubernetes', 'GitHub Actions', 'Cloud Platforms']
      },
      {
        name: '@reviewer',
        role: 'Code Quality & Architecture Specialist',
        expertise: [
          'Code quality assessment', 'Architecture patterns', 'Technical debt analysis',
          'Best practices enforcement', 'Integration patterns', 'Performance review'
        ],
        priority: 8,
        dependencies: [],
        contextTemplate: 'reviewer-context-template',
        specialInstructions: [
          'Enforce established coding standards',
          'Identify potential security vulnerabilities',
          'Suggest performance improvements',
          'Ensure maintainability and scalability'
        ],
        technicalStack: ['Code Analysis', 'Architecture Patterns', 'Performance Tools']
      }
    ];

    definitions.forEach(def => {
      this.agentDefinitions.set(def.name, def);
    });
  }

  async initializeAgents(enabledAgentNames: string[] = []): Promise<void> {
    if (enabledAgentNames.length === 0) {
      enabledAgentNames = Array.from(this.agentDefinitions.keys());
    }

    const agentsToInit = enabledAgentNames
      .filter(name => this.agentDefinitions.has(name))
      .sort((a, b) => {
        const defA = this.agentDefinitions.get(a)!;
        const defB = this.agentDefinitions.get(b)!;
        return defB.priority - defA.priority;
      });

    this.statusIndicator.startProgress([
      'Loading agent definitions',
      'Resolving dependencies',
      'Generating agent contexts',
      'Initializing agent instances',
      'Establishing communication channels',
      'Running readiness checks'
    ]);

    // Step 1: Load definitions
    this.statusIndicator.nextStep();
    await this.sleep(300);

    // Step 2: Resolve dependencies
    this.statusIndicator.nextStep();
    const sortedAgents = this.resolveDependencies(agentsToInit);
    await this.sleep(500);

    // Step 3: Generate contexts
    this.statusIndicator.nextStep();
    const projectContext = await this.loadProjectContext();
    await this.sleep(400);

    // Step 4: Initialize instances
    this.statusIndicator.nextStep();
    for (const agentName of sortedAgents) {
      await this.initializeAgent(agentName, projectContext);
      await this.sleep(200);
    }

    // Step 5: Communication channels
    this.statusIndicator.nextStep();
    await this.establishCommunication();
    await this.sleep(300);

    // Step 6: Readiness checks
    this.statusIndicator.nextStep();
    await this.performReadinessChecks();
    await this.sleep(200);

    this.statusIndicator.succeed(`Successfully initialized ${sortedAgents.length} AI agents`, true);
    
    this.displayAgentSummary();
  }

  private resolveDependencies(agentNames: string[]): string[] {
    const resolved: string[] = [];
    const resolving: Set<string> = new Set();

    const resolve = (agentName: string): void => {
      if (resolved.includes(agentName)) return;
      if (resolving.has(agentName)) {
        throw new Error(`Circular dependency detected: ${agentName}`);
      }

      resolving.add(agentName);
      const definition = this.agentDefinitions.get(agentName);
      if (!definition) return;

      // Resolve dependencies first
      for (const dep of definition.dependencies) {
        if (agentNames.includes(dep)) {
          resolve(dep);
        }
      }

      resolving.delete(agentName);
      resolved.push(agentName);
    };

    agentNames.forEach(resolve);
    return resolved;
  }

  private async loadProjectContext(): Promise<Record<string, any>> {
    const configPath = path.join(this.projectPath, '.conductor', 'conductor.config.json');
    let config = {};
    
    if (await fs.pathExists(configPath)) {
      config = await fs.readJson(configPath);
    }

    const packageJsonPath = path.join(this.projectPath, 'package.json');
    let packageInfo = {};
    
    if (await fs.pathExists(packageJsonPath)) {
      packageInfo = await fs.readJson(packageJsonPath);
    }

    return {
      config,
      packageInfo,
      projectPath: this.projectPath,
      timestamp: new Date().toISOString()
    };
  }

  private async initializeAgent(agentName: string, projectContext: Record<string, any>): Promise<void> {
    const definition = this.agentDefinitions.get(agentName);
    if (!definition) return;

    const instance: AgentInstance = {
      definition,
      status: 'initializing',
      confidence: 0.0,
      lastActivity: new Date(),
      contextData: {
        ...projectContext,
        agentSpecific: await this.generateAgentContext(definition, projectContext)
      }
    };

    this.agents.set(agentName, instance);
    
    // Simulate initialization process
    await this.sleep(100);
    instance.status = 'ready';
    instance.confidence = 0.85 + Math.random() * 0.15; // 85-100%
    
    this.emit('agentInitialized', agentName, instance);
  }

  private async generateAgentContext(
    definition: AgentDefinition, 
    projectContext: Record<string, any>
  ): Promise<Record<string, any>> {
    const config = projectContext.config || {};
    const packageInfo = projectContext.packageInfo || {};

    return {
      role: definition.role,
      expertise: definition.expertise,
      specialInstructions: definition.specialInstructions,
      technicalStack: definition.technicalStack,
      projectSpecific: {
        framework: config.projectContext?.framework,
        language: config.projectContext?.language,
        dependencies: packageInfo.dependencies || {},
        scripts: packageInfo.scripts || {},
        hasDatabase: config.projectContext?.hasDatabase,
        hasAuthentication: config.projectContext?.hasAuthentication,
        experienceLevel: config.experienceLevel
      },
      capabilities: {
        canReviewCode: ['@reviewer', '@frontend', '@backend', '@security'].includes(definition.name),
        canPlanArchitecture: ['@backend', '@frontend', '@reviewer'].includes(definition.name),
        canDesignUI: ['@design', '@frontend'].includes(definition.name),
        canManageProject: ['@pm', '@reviewer'].includes(definition.name)
      }
    };
  }

  private async establishCommunication(): Promise<void> {
    // Set up event listeners for agent communication
    this.on('consultationRequest', this.handleConsultationRequest.bind(this));
    this.on('agentResponse', this.handleAgentResponse.bind(this));
    
    // Initialize inter-agent communication channels
    await this.sleep(200);
  }

  private async performReadinessChecks(): Promise<void> {
    for (const [agentName, instance] of this.agents.entries()) {
      if (instance.status !== 'ready') {
        console.log(chalk.yellow(`⚠️ Agent ${agentName} not ready: ${instance.status}`));
      }
    }
  }

  private displayAgentSummary(): void {
    console.log(chalk.cyan('\n🎭 AI DEVELOPMENT TEAM ORCHESTRA'));
    console.log(chalk.gray('═'.repeat(70)));

    const readyAgents = Array.from(this.agents.values()).filter(a => a.status === 'ready');
    const totalAgents = this.agents.size;

    console.log(chalk.green(`✅ ${readyAgents.length}/${totalAgents} agents online and ready`));
    console.log(chalk.blue(`🎯 Average confidence: ${Math.round(readyAgents.reduce((acc, a) => acc + a.confidence, 0) / readyAgents.length * 100)}%`));

    console.log(chalk.yellow('\n👥 Agent Lineup:'));
    readyAgents
      .sort((a, b) => b.definition.priority - a.definition.priority)
      .forEach(agent => {
        const confidenceBar = '█'.repeat(Math.round(agent.confidence * 10)) + 
                            '░'.repeat(10 - Math.round(agent.confidence * 10));
        console.log(
          `   ${agent.definition.name.padEnd(12)} ${agent.definition.role.padEnd(20)} ` +
          `${chalk.cyan(confidenceBar)} ${Math.round(agent.confidence * 100)}%`
        );
      });

    console.log(chalk.gray('\n💡 Usage:'));
    console.log(chalk.white('   conductor ask "your question"           ') + chalk.gray('- Consult full team'));
    console.log(chalk.white('   conductor ask @frontend "optimize UI"   ') + chalk.gray('- Specific agent'));
    console.log(chalk.white('   conductor review --staged               ') + chalk.gray('- Multi-agent review'));
    console.log(chalk.white('   conductor dashboard                     ') + chalk.gray('- Live monitoring'));

    console.log(chalk.gray('═'.repeat(70)));
  }

  async consultTeam(query: string, specificAgents: string[] = []): Promise<any> {
    const consultationId = this.generateId();
    const relevantAgents = specificAgents.length > 0 
      ? specificAgents 
      : this.determineRelevantAgents(query);

    const request: ConsultationRequest = {
      id: consultationId,
      query,
      requiredAgents: relevantAgents,
      optionalAgents: [],
      priority: 'medium',
      timestamp: new Date()
    };

    this.activeConsultations.set(consultationId, request);
    this.emit('consultationRequest', request);

    // Simulate consultation process
    console.log(chalk.cyan('\n🦆 CONSULTING AI DEVELOPMENT TEAM'));
    console.log(chalk.gray(`Query: ${query}`));
    console.log(chalk.gray(`Agents: ${relevantAgents.join(', ')}`));

    const responses: Record<string, any> = {};
    
    for (const agentName of relevantAgents) {
      const agent = this.agents.get(agentName);
      if (agent && agent.status === 'ready') {
        agent.status = 'busy';
        agent.currentTask = `Analyzing: ${query.substring(0, 30)}...`;
        
        // Simulate agent thinking time
        await this.sleep(500 + Math.random() * 1000);
        
        responses[agentName] = await this.simulateAgentResponse(agent, query);
        
        agent.status = 'ready';
        agent.currentTask = undefined;
        agent.lastActivity = new Date();
      }
    }

    this.activeConsultations.delete(consultationId);
    return this.synthesizeResponses(responses, query);
  }

  private determineRelevantAgents(query: string): string[] {
    const queryLower = query.toLowerCase();
    const relevant: string[] = [];

    // Keyword-based agent selection
    const keywords = {
      '@pm': ['requirements', 'user story', 'feature', 'roadmap', 'business', 'product'],
      '@design': ['ui', 'ux', 'design', 'interface', 'user experience', 'accessibility', 'mockup'],
      '@frontend': ['react', 'component', 'ui', 'frontend', 'javascript', 'typescript', 'css'],
      '@backend': ['api', 'database', 'server', 'backend', 'endpoint', 'performance'],
      '@security': ['security', 'auth', 'authentication', 'vulnerability', 'owasp', 'encrypt'],
      '@qa': ['test', 'testing', 'quality', 'bug', 'coverage', 'automation'],
      '@devops': ['deploy', 'ci/cd', 'pipeline', 'docker', 'cloud', 'infrastructure'],
      '@reviewer': ['code', 'review', 'quality', 'architecture', 'pattern', 'best practice']
    };

    Object.entries(keywords).forEach(([agent, words]) => {
      if (words.some(word => queryLower.includes(word))) {
        relevant.push(agent);
      }
    });

    // Always include reviewer for code-related queries
    if (queryLower.includes('code') && !relevant.includes('@reviewer')) {
      relevant.push('@reviewer');
    }

    // Default to key agents if no specific matches
    if (relevant.length === 0) {
      relevant.push('@pm', '@reviewer');
    }

    return relevant.filter(agent => this.agents.has(agent));
  }

  private async simulateAgentResponse(agent: AgentInstance, query: string): Promise<any> {
    // This would integrate with actual AI models in production
    return {
      agent: agent.definition.name,
      role: agent.definition.role,
      confidence: agent.confidence,
      recommendation: `${agent.definition.role} recommendation for: ${query}`,
      reasoning: `Based on my expertise in ${agent.definition.expertise.slice(0, 3).join(', ')}`,
      priority: Math.random() > 0.5 ? 'medium' : 'high',
      implementationSteps: [
        'Step 1: Analysis and planning',
        'Step 2: Implementation approach',
        'Step 3: Testing and validation'
      ]
    };
  }

  private synthesizeResponses(responses: Record<string, any>, originalQuery: string): any {
    const agents = Object.keys(responses);
    const avgConfidence = Object.values(responses).reduce((acc: number, r: any) => acc + r.confidence, 0) / agents.length;
    
    return {
      query: originalQuery,
      consensus: {
        level: avgConfidence,
        participatingAgents: agents.length,
        avgConfidence: Math.round(avgConfidence * 100)
      },
      recommendations: Object.values(responses),
      timestamp: new Date().toISOString()
    };
  }

  private async handleConsultationRequest(request: ConsultationRequest): Promise<void> {
    console.log(chalk.blue(`📋 Processing consultation: ${request.id}`));
  }

  private async handleAgentResponse(agentName: string, response: any): Promise<void> {
    console.log(chalk.green(`✅ Response from ${agentName}`));
  }

  getAgentStatus(agentName?: string): any {
    if (agentName) {
      const agent = this.agents.get(agentName);
      return agent ? {
        name: agentName,
        role: agent.definition.role,
        status: agent.status,
        confidence: agent.confidence,
        currentTask: agent.currentTask,
        lastActivity: agent.lastActivity
      } : null;
    }

    return Array.from(this.agents.entries()).map(([name, agent]) => ({
      name,
      role: agent.definition.role,
      status: agent.status,
      confidence: agent.confidence,
      currentTask: agent.currentTask,
      lastActivity: agent.lastActivity
    }));
  }

  async shutdown(): Promise<void> {
    this.statusIndicator.start('🔌 Shutting down AI agents...');
    
    for (const [agentName, agent] of this.agents.entries()) {
      agent.status = 'offline';
      console.log(chalk.gray(`   ${agentName} - Offline`));
      await this.sleep(100);
    }

    this.agents.clear();
    this.activeConsultations.clear();
    
    this.statusIndicator.succeed('All agents shut down successfully');
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}