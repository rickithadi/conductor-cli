# 🤝 Contributing to Conductor CLI

> **Help build the future of AI-powered development orchestration**

Thank you for your interest in contributing to Conductor CLI! This document provides comprehensive guidelines for contributors to our multi-agent workflow system, powered by Claude Code and Anthropic's Claude AI, with professional security integration by Gallifrey Consulting.

## 🚀 Quick Start

1. **Fork and clone the repository**
```bash
git clone https://github.com/your-username/conductor-cli
cd conductor-cli
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

4. **Link for local development**
```bash
npm link
```

5. **Test your changes**
```bash
conductor init --force
conductor recommend "test feature implementation"
conductor dashboard --test-mode
```

## 🛠️ Development Setup

### Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm or yarn** (npm preferred)
- **TypeScript knowledge** (intermediate level)
- **Git** with GitHub account
- **Claude Code access** (for testing AI agent integration)
- **Basic understanding** of multi-agent systems (helpful but not required)

### Project Structure
```
src/
├── types.ts              # Core type definitions
├── context-scanner.ts    # Project analysis & framework detection
├── subagent-generator.ts # Multi-agent creation logic
├── claude-generator.ts   # Claude context generation
├── approval-system.ts    # Multi-agent approval workflow
├── checkpoint-system.ts  # Session management & recovery
├── security-scanner.ts   # Security vulnerability detection (Gallifrey)
├── security-agents.ts    # Security-focused agent definitions
├── tui-dashboard.ts      # Terminal UI dashboard (blessed.js)
├── vscode-integration.ts # VSCode workspace integration
└── cli.ts               # Main CLI interface

templates/                # Framework templates with agent contexts
├── nextjs/
│   └── claude-contexts/  # Next.js specific agent contexts
├── react/
│   └── claude-contexts/  # React specific agent contexts
├── vue/
│   └── claude-contexts/  # Vue specific agent contexts
├── express/
│   └── claude-contexts/  # Express specific agent contexts
└── jekyll/
    └── claude-contexts/  # Jekyll specific agent contexts

docs/                     # Documentation
tests/                    # Test files
examples/                 # Example projects
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Testing Your Changes
```bash
# Test CLI commands
conductor init --force
conductor recommend "test multi-agent workflow"
conductor dashboard --watch
conductor scan --security --test-mode

# Test different project types
cd /path/to/nextjs-project && conductor init --framework nextjs
cd /path/to/react-project && conductor init --framework react
cd /path/to/vue-project && conductor init --framework vue

# Test agent interactions
conductor recommend "implement authentication" --agents frontend,backend,security
conductor recommend "optimize performance" --detailed --consensus
```

## 📝 Code Guidelines

### TypeScript Standards
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper error handling with try/catch
- Document complex functions with JSDoc

### Code Style
- Use Prettier for formatting
- Follow ESLint configuration
- Use meaningful variable and function names
- Keep functions focused and small

### Example Code Style
```typescript
/**
 * Analyzes project structure and detects framework
 * @param projectPath Absolute path to project directory
 * @returns Framework detection result with confidence score
 */
async function detectFramework(projectPath: string): Promise<FrameworkDetectionResult> {
  try {
    const packageJson = await readPackageJson(projectPath);
    
    // Check for Next.js indicators
    if (hasNextJsDependencies(packageJson)) {
      return {
        framework: 'nextjs',
        confidence: 0.9,
        indicators: ['next', 'next.config.js']
      };
    }
    
    return { framework: 'unknown', confidence: 0, indicators: [] };
  } catch (error) {
    throw new Error(`Failed to detect framework: ${error.message}`);
  }
}
```

## 🎯 Contributing Areas

### 🔧 Core Features
- **Framework Support**: Add detection for new frameworks
- **Agent Types**: Create specialized agents for specific domains
- **Integration**: Add support for new editors/IDEs
- **Templates**: Create project templates for different stacks

### 📚 Documentation
- **Examples**: Real-world usage examples
- **Guides**: Step-by-step tutorials
- **API Docs**: Detailed API documentation
- **Video Tutorials**: Screen recordings of workflows

### 🧪 Testing
- **Unit Tests**: Test individual components
- **Integration Tests**: Test complete workflows
- **E2E Tests**: Test CLI commands end-to-end
- **Performance Tests**: Benchmark critical operations

### 🌐 Ecosystem
- **Plugins**: Extend functionality
- **Templates**: Project scaffolding
- **Integrations**: CI/CD, IDEs, tools
- **Community**: Examples, showcases

## 🎨 Adding New Features

### Adding a New Framework

1. **Update ContextScanner**
```typescript
// In context-scanner.ts
private async detectFramework(): Promise<FrameworkDetectionResult> {
  // Add your framework detection logic
  const frameworks = [
    // ... existing frameworks
    {
      name: 'svelte',
      patterns: ['svelte'],
      files: ['svelte.config.js', 'src/app.html'],
      confidence: 0.8,
    }
  ];
  // ... rest of detection logic
}
```

2. **Update SubagentGenerator**
```typescript
// In subagent-generator.ts
private generateFrontendAgent(): SubagentDefinition {
  // Add framework-specific expertise
  if (this.projectContext.framework === 'svelte') {
    expertise.push('Svelte stores', 'SvelteKit routing', 'Svelte animations');
    technicalStack.push('SvelteKit');
  }
  // ... rest of logic
}
```

3. **Add Template** (optional)
```bash
mkdir templates/svelte
# Add template files
```

4. **Add Tests**
```typescript
// In tests/
describe('Svelte Framework Detection', () => {
  it('should detect SvelteKit projects', async () => {
    // Test implementation
  });
});
```

### Adding a New Agent Type

1. **Define Agent in SubagentGenerator**
```typescript
private generateSEOAgent(): SubagentDefinition {
  return {
    name: '@seo',
    role: 'SEO Optimization Specialist',
    expertise: [
      'Technical SEO',
      'Core Web Vitals',
      'Schema markup',
      'Content optimization'
    ],
    technicalStack: [
      'Google Analytics',
      'Search Console',
      'Lighthouse'
    ],
    specialInstructions: [
      'Optimize for mobile-first indexing',
      'Ensure proper semantic HTML',
      'Monitor Core Web Vitals'
    ]
  };
}
```

2. **Add to Agent Generation**
```typescript
generateSubagents(): SubagentDefinition[] {
  const subagents = [
    // ... existing agents
  ];
  
  // Add SEO agent if project has SEO tools
  if (this.hasSEOTools()) {
    subagents.push(this.generateSEOAgent());
  }
  
  return subagents;
}
```

3. **Add Detection Logic**
```typescript
private hasSEOTools(): boolean {
  return this.projectContext.dependencies.some(dep =>
    dep.includes('next-seo') || 
    dep.includes('react-helmet') ||
    dep.includes('@nuxtjs/sitemap')
  );
}
```

### Adding New CLI Commands

1. **Add Command Definition**
```typescript
// In cli.ts
program
  .command('analyze')
  .description('Analyze project for optimization opportunities')
  .option('-d, --depth <depth>', 'Analysis depth (shallow|deep)', 'shallow')
  .action(async (options) => {
    await analyzeProject(options);
  });
```

2. **Implement Command Handler**
```typescript
async function analyzeProject(options: any): Promise<void> {
  console.log(chalk.blue('🔍 Analyzing project...'));
  
  const scanner = new ContextScanner();
  const context = await scanner.scan();
  
  // Analysis logic here
  
  console.log(chalk.green('✅ Analysis complete'));
}
```

## 🐛 Bug Reports

When reporting bugs, please include:

### Bug Report Template
```markdown
## Bug Description
Clear description of what happened vs what you expected.

## Steps to Reproduce
1. Run `multi-agent init`
2. Execute `multi-agent recommend "test"`
3. See error

## Environment
- OS: macOS/Windows/Linux
- Node.js version: 18.x
- multi-agent-cli version: 1.x.x
- Project type: Next.js/React/Vue/etc

## Error Output
```
Paste full error output here
```

## Additional Context
Any other context about the problem.
```

## 💡 Feature Requests

Use this template for feature requests:

```markdown
## Feature Description
Clear description of the feature you'd like to see.

## Use Case
Explain the problem this feature would solve.

## Proposed Solution
Describe how you envision this feature working.

## Alternative Solutions
Any alternative approaches you've considered.

## Additional Context
Any other context, screenshots, examples, etc.
```

## 📋 Pull Request Process

1. **Create Issue First**: For significant changes, create an issue first to discuss
2. **Branch Naming**: Use descriptive branch names (`feature/add-vue-support`, `fix/cli-crash-on-windows`)
3. **Commit Messages**: Use conventional commits format
4. **Tests**: Add tests for new features
5. **Documentation**: Update relevant documentation
6. **Pull Request**: Follow the PR template

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Commit Message Format
```
type(scope): description

feat(agents): add SEO optimization agent
fix(cli): handle missing package.json gracefully
docs(readme): update installation instructions
test(scanner): add tests for Vue.js detection
```

## 🏗️ Architecture Decisions

When making significant architectural changes:

1. **Create ADR** (Architecture Decision Record)
2. **Discuss in Issues** before implementation
3. **Consider Backward Compatibility**
4. **Update Documentation**

### ADR Template
```markdown
# ADR-XXX: Title

## Status
Proposed/Accepted/Deprecated

## Context
What is the issue that we're seeing?

## Decision
What is the change that we're proposing?

## Consequences
What becomes easier or more difficult?
```

## 🌟 Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation they help create

## 📞 Getting Help

- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Discord/Slack**: [Community chat link]

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Multi-Agent CLI better! 🚀