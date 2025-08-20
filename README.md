# Multi-Agent Development CLI

> Transform your development workflow with AI-powered agent coordination and approval workflows

[![npm version](https://badge.fury.io/js/multi-agent-cli.svg)](https://badge.fury.io/js/multi-agent-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A revolutionary CLI tool that brings structured multi-agent collaboration to your development process. Get recommendations backed by specialized AI agents (frontend, backend, UX, security, etc.) with built-in approval workflows before implementing changes.

## 🚀 Quick Start

```bash
# Install globally
npm install -g multi-agent-cli

# Initialize in your project
multi-agent init

# Get structured recommendations
multi-agent recommend "Add user authentication system"

# Review and approve proposals
multi-agent proposals --list
```

## ✨ Key Features

### 🤖 **Intelligent Agent Coordination**
- **@frontend** - React/Next.js architecture specialist
- **@backend** - API & database expert  
- **@ux** - User experience & accessibility specialist
- **@review** - Code quality & architecture guardian
- **@testing** - QA & test automation specialist
- **@security** - Security & authentication expert
- **@database** - Database optimization specialist

### 🔄 **Approval-First Workflow**
Every significant change goes through structured review:
1. **Multi-agent analysis** - All relevant agents provide input
2. **Structured recommendations** - Priority, impacts, risks, dependencies
3. **User approval required** - No changes without explicit consent
4. **Flexible approval options** - Approve all, modify, or cherry-pick

### 🔧 **VSCode Integration**
- **Agent-specific terminals** - Dedicated terminals for each specialist
- **Workspace configuration** - Pre-configured tasks and profiles  
- **Extension recommendations** - Curated tools for your stack

### 📊 **Context-Aware Intelligence**
Automatically detects and adapts to:
- **Framework** (Next.js, React, Vue, Express, etc.)
- **Language** (TypeScript, JavaScript, Python, Go, etc.)
- **Stack** (Database, auth, testing frameworks)
- **Project patterns** (API structure, design system, etc.)

## 🎯 Core Workflow

### 1. Initialize Multi-Agent Setup

```bash
multi-agent init
```

**What happens:**
- 🔍 Analyzes your project structure
- 🤖 Generates specialized agents based on your tech stack
- 📝 Creates comprehensive `claude.md` context
- 🔧 Sets up VSCode integration
- ✅ Initializes approval system

### 2. Request Multi-Agent Recommendations

```bash
multi-agent recommend "Implement user dashboard with analytics"
```

**Example Output:**
```
🔍 MULTI-AGENT RECOMMENDATION

📋 Proposal: Implement user dashboard with analytics
🎯 Type: feature
⚡ Priority: HIGH

🤖 AGENT PERSPECTIVES:

@frontend - Frontend Architecture Specialist
  💡 Recommendation: Use Next.js App Router with React Server Components
  🧠 Reasoning: Optimal performance for data-heavy dashboard
  📈 Impacts: User experience, Performance, SEO
  🔗 Dependencies: Update to Next.js 14, Add chart libraries
  ⚠️ Risks: Learning curve for team, Bundle size increase

@backend - API & Server Specialist  
  💡 Recommendation: Implement GraphQL for flexible data queries
  🧠 Reasoning: Dashboard needs complex, nested data relationships
  📈 Impacts: API performance, Data consistency, Caching strategy
  🔗 Dependencies: Set up Apollo Server, Database optimization
  ⚠️ Risks: Query complexity, N+1 problems

@ux - User Experience Specialist
  💡 Recommendation: Progressive disclosure with customizable widgets
  🧠 Reasoning: Reduces cognitive load, improves user adoption
  📈 Impacts: User satisfaction, Feature adoption, Support burden
  🔗 Dependencies: User research, A/B testing setup
  ⚠️ Risks: Development complexity, User confusion initially

@security - Security Specialist
  💡 Recommendation: Role-based access control for sensitive analytics
  🧠 Reasoning: Different user roles need different data visibility
  📈 Impacts: Data security, Compliance, User trust
  🔗 Dependencies: Auth system upgrade, Audit logging
  ⚠️ Risks: Complex permission matrix, Performance impact

📊 CONSENSUS ANALYSIS:
- Priority Agreement: High consensus (100% agree on HIGH)
- Risk Assessment: 4 unique risks identified
- Impact Areas: Performance, Security, User Experience, Maintainability

🎯 RECOMMENDED ACTION:
Implement in phases: Start with Next.js dashboard structure, add GraphQL API, then progressive UX enhancements with security controls.
```

### 3. Review and Approve

You can then:
- ✅ **Approve all recommendations** - Implement as proposed
- 🔧 **Approve with modifications** - Make specific changes
- 🔍 **Approve individual recommendations** - Cherry-pick which advice to follow
- ❌ **Reject proposal** - Don't implement changes
- ⏸️ **Save for later** - Store for future consideration

### 4. Implementation with Context

After approval, use Claude Code with the generated context:

```bash
claude-code  # Now has full multi-agent context and approved plan
```

## 📚 Commands Reference

### Project Setup

```bash
# Initialize multi-agent setup
multi-agent init [options]
  -f, --framework <framework>    Specify framework manually
  -m, --mode <mode>             Coordination mode (subagents|external-files)
  --no-vscode                   Skip VSCode integration
  --force                       Overwrite existing configuration

# Show current configuration
multi-agent status

# Update configuration
multi-agent update
```

### Agent Management  

```bash
# List available agents for current project
multi-agent agents

# Get structured recommendations
multi-agent recommend <task> [options]
  -t, --type <type>    Task type (feature|bugfix|refactor|optimization|security|design)
```

### Proposal Management

```bash
# List pending proposals
multi-agent proposals --list

# Review specific proposal
multi-agent proposals --review <id>

# Create new proposal interactively
multi-agent proposals --create
```

### Project Templates

```bash
# List available templates
multi-agent templates

# Create new project with template
multi-agent create <projectName> [options]
  -t, --template <template>     Project template to use
  -m, --mode <mode>            Coordination mode
```

## 🏗️ Framework Support

### Frontend Frameworks
- **Next.js** - App Router, Server Components, API routes
- **React** - Hooks, Context API, performance patterns  
- **Vue** - Composition API, Pinia, Vue Router
- **Angular** - Modules, services, RxJS patterns
- **Svelte** - SvelteKit, stores, actions

### Backend Frameworks  
- **Express** - Middleware, routing, security
- **Fastify** - Performance, plugins, validation
- **Next.js API** - Route handlers, middleware
- **NestJS** - Decorators, modules, dependency injection

### Languages
- **TypeScript** - Full type safety and IntelliSense
- **JavaScript** - Modern ES6+ patterns
- **Python** - FastAPI, Django, Flask support
- **Go** - Gin, Echo, standard library patterns

## 🔧 Configuration

The CLI creates several configuration files:

### `claude.md` - Main Context File
Contains project context and agent definitions for Claude Code.

### `.multi-agent/approval-config.json` - Approval Settings
```json
{
  "requiresApproval": {
    "codeChanges": true,
    "newFeatures": true,
    "architectureChanges": true,
    "dependencies": true,
    "configChanges": true
  },
  "autoApprove": {
    "lowRiskChanges": false,
    "documentation": false,
    "tests": false
  }
}
```

### `.vscode/settings.json` - VSCode Integration
- Terminal profiles for each agent
- Task definitions for agent consultation
- Extension recommendations
- Workspace-specific settings

## 🎨 Customization

### Adding Custom Agents

Edit `claude.md` to add specialized agents:

```markdown
### @performance - Performance Specialist
**Expertise**: Core Web Vitals, bundle optimization, caching strategies
**Technical Stack**: Lighthouse, Webpack, Vite, CDN configuration
**Special Instructions**:
- Focus on measurable performance improvements
- Consider mobile-first optimization
- Monitor bundle size impact
```

### Custom Approval Workflows

Modify `.multi-agent/approval-config.json` to customize what requires approval:

```json
{
  "requiresApproval": {
    "codeChanges": true,
    "newFeatures": true,
    "dependencies": false,  // Auto-approve dependency updates
    "tests": false         // Auto-approve test additions
  }
}
```

## 🚀 Advanced Usage

### External Collaboration Mode

For teams wanting persistent collaboration files:

```bash
multi-agent init --mode external-files
```

Creates `./collaboration/` directory with:
- `coordination.md` - Central coordination hub
- `{agent}-communication.md` - Per-agent communication logs
- `task-tracking.md` - Shared task management
- `decision-log.md` - Architecture decision records

### Integration with CI/CD

```yaml
# .github/workflows/multi-agent-review.yml
name: Multi-Agent Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  multi-agent-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Multi-Agent CLI
        run: npm install -g multi-agent-cli
      - name: Generate Recommendations
        run: |
          multi-agent init --force
          multi-agent recommend "Review PR changes" --type review > pr-analysis.md
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const analysis = fs.readFileSync('pr-analysis.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: analysis
            });
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-org/multi-agent-workflow
cd multi-agent-workflow
npm install
npm run build
npm link  # Use local version globally
```

## 📄 License

MIT © [Your Organization](LICENSE)

## 🆘 Support

- **Documentation**: [Full Documentation](docs/)
- **Examples**: [Example Projects](examples/)
- **Issues**: [GitHub Issues](https://github.com/your-org/multi-agent-workflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/multi-agent-workflow/discussions)

---

**Ready to transform your development workflow?** Start with `multi-agent init` and experience structured, AI-powered development collaboration! 🚀