# Conductor CLI 🚀

AI-powered development assistant with specialized agents working in your terminal. Built on Claude Flow's enterprise orchestration platform.

## Quick Start (No Installation!)

```bash
npx conductor-cli init
```

That's it! Start using your AI development team immediately with npx.

## What is Conductor?

Think of it as having senior developers, architects, and QA engineers available 24/7 in your terminal. Each specialized agent brings deep expertise to help you build better software, faster.

```bash
# Ask your AI team anything
npx conductor-cli ask "how do I implement OAuth?"

# Get instant code reviews
npx conductor-cli review src/auth.ts

# Activate parallel execution with hive-mind
npx conductor-cli swarm --implement
```

## Features

### 🧠 **87 MCP Tools**
Enterprise-grade AI capabilities from Claude Flow integration

### 👥 **Specialized Agents**
- **@architect** - System design and architecture decisions
- **@coder** - Implementation and code generation  
- **@researcher** - Information gathering and analysis
- **@qa** - Testing strategies and quality assurance
- **@security** - Vulnerability scanning and OWASP compliance
- **@reviewer** - Code quality and best practices

### 🐝 **Hive-Mind Coordination**
Queen-led architecture orchestrates multiple agents working in parallel

### 💾 **Persistent Memory**
SQLite-based system remembers context across sessions

## Installation Options

### Quick Use (Recommended)
```bash
# No installation needed!
npx conductor-cli <command>
```

### Global Installation
```bash
npm install -g conductor-cli
conductor init
```

### Project Installation
```bash
npm install --save-dev conductor-cli
```

Then add to your `package.json`:
```json
{
  "scripts": {
    "ai": "conductor",
    "ai:init": "conductor init",
    "ai:ask": "conductor ask"
  }
}
```

## Core Commands

### Initialize Your AI Team
```bash
npx conductor-cli init

# With options
npx conductor-cli init --framework=nextjs --quick
```

### Consult with Specialists
```bash
# General consultation
npx conductor-cli ask "how do I optimize this database query?"

# Target specific agent
npx conductor-cli ask "review my authentication flow" --agent=@security

# Urgent mode - get immediate consensus
npx conductor-cli ask "production is down, help!" --urgent
```

### Activate Swarm Intelligence
```bash
# Research mode - gather information
npx conductor-cli swarm --research "microservices vs monolith"

# Implementation mode - build features
npx conductor-cli swarm --implement "user authentication system"

# Analysis mode - deep dive into codebase
npx conductor-cli swarm --analyze
```

### Code Review & Security
```bash
# Comprehensive code review
npx conductor-cli review src/

# Security audit
npx conductor-cli audit --owasp

# Performance analysis
npx conductor-cli analyze --performance
```

## Real-World Examples

### Building a REST API
```bash
npx conductor-cli ask "help me build a REST API for a blog"
# Agents provide architecture, implementation, testing strategy

npx conductor-cli swarm --implement
# Parallel execution creates routes, models, tests
```

### Adding Authentication
```bash
npx conductor-cli ask "add JWT authentication to my Next.js app"
# @architect designs the system
# @security ensures OWASP compliance
# @coder implements the solution
# @qa creates test cases
```

### Debugging Production Issues
```bash
npx conductor-cli ask "API endpoint returning 500 errors" --urgent
# Immediate team consultation with debugging steps
```

## Advanced Features

### Hive-Mind Mode
Activate full parallel processing with queen coordination:
```bash
npx conductor-cli hive-mind init
npx conductor-cli hive-mind spawn --workers=5
npx conductor-cli hive-mind status
```

### Memory Management
```bash
# View memory usage
npx conductor-cli memory status

# Clear session memory
npx conductor-cli memory clear

# Export memory for backup
npx conductor-cli memory export > backup.json
```

### Custom Workflows
Create `.conductor/workflows/` directory with YAML configs:
```yaml
# .conductor/workflows/feature.yaml
name: feature-development
agents:
  - architect
  - coder
  - tester
steps:
  - design
  - implement
  - test
  - review
```

Run with:
```bash
npx conductor-cli workflow run feature-development
```

## Integration with CI/CD

### GitHub Actions
```yaml
name: AI Code Review
on: [pull_request]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: AI Team Review
        run: |
          npx conductor-cli review ${{ github.event.pull_request.head.sha }}
          npx conductor-cli audit --security
```

### Pre-commit Hook
```bash
# .git/hooks/pre-commit
#!/bin/sh
npx conductor-cli review --staged
npx conductor-cli test --affected
```

## Configuration

Create `.conductor/config.json`:
```json
{
  "agents": {
    "architect": { "enabled": true, "model": "claude-3" },
    "coder": { "enabled": true, "parallel": true },
    "security": { "enabled": true, "strict": true }
  },
  "memory": {
    "backend": "sqlite",
    "persistent": true
  },
  "swarm": {
    "maxWorkers": 5,
    "timeout": 30000
  }
}
```

## Performance

Conductor CLI leverages Claude Flow's optimization:
- ⚡ Parallel task execution
- 🔄 Intelligent caching
- 📊 Load balancing across agents
- 🎯 Smart task routing

Benchmarks:
- Feature implementation: 70% faster than sequential
- Code review: 100+ files/second
- Memory usage: < 100MB baseline

## Troubleshooting

### First Run via NPX
If running via npx for the first time:
```bash
# Clear npx cache if needed
npx clear-npx-cache
npx conductor-cli@latest init
```

### Permission Issues
```bash
# Unix/Mac
chmod +x node_modules/.bin/conductor

# Windows - Run as Administrator
npx conductor-cli init
```

### Memory Issues
```bash
# Reset memory database
npx conductor-cli memory reset

# Use lightweight mode
npx conductor-cli --lite ask "your question"
```

## Development

### Local Development
```bash
# Clone and install
git clone https://github.com/rickithadi/conductor-cli
cd conductor-cli
npm install

# Run in dev mode
npm run dev

# Run tests
npm test
```

### Contributing
We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md)

## Architecture

Built on Claude Flow v2.0.0's enterprise orchestration:
- **Hive-Mind System**: Queen-led coordination with worker agents
- **MCP Protocol**: 87 specialized tools for development tasks
- **Neural Networks**: Pattern recognition for optimal agent selection
- **SQLite Persistence**: Cross-session memory management

## License

MIT © [Gallifrey Consulting](https://gallifreyconsulting.com)

## Support

- 📚 [Documentation](https://github.com/rickithadi/conductor-cli/wiki)
- 💬 [GitHub Issues](https://github.com/rickithadi/conductor-cli/issues)
- 🐦 [Twitter](https://twitter.com/rickithadi)
- 📧 [Email](mailto:team@gallifreyconsulting.com)

---

**Built with ❤️ by developers, for developers**

*Powered by Claude Flow's enterprise AI orchestration platform*