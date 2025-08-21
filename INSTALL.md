# Conductor CLI - Installation & Quick Start Guide

> **Transform your development workflow with AI experts** - From PM to ship to secure, all in one command.

## Quick Installation (Recommended)

### Option 1: NPX One-Liner (Zero Setup)
```bash
# Instant start - no installation required
npx conductor-cli@latest init

# Or for existing projects
npx conductor-cli@latest init --quick
```

### Option 2: Global Installation
```bash
# Install globally for easy access
npm install -g conductor-cli

# Initialize in any project
cd your-project
conductor init
```

### Option 3: Local Project Installation
```bash
# Add to your project
npm install conductor-cli --save-dev

# Add to package.json scripts
{
  "scripts": {
    "conductor": "conductor",
    "ai-team": "conductor dashboard",
    "consult": "conductor ask"
  }
}
```

---

## Your First Professional Consultation Session

After installation, try these natural language commands:

```bash
# Ask your AI development team anything
conductor ask "How should I structure my React authentication?"

# Explain complex problems
conductor explain "My state management is getting messy"

# Get expert code review
conductor review --staged

# Professional consultation with context
conductor consult "Why isn't my useEffect working?"

# Launch live AI team dashboard
conductor dashboard
```

---

## Enhanced Launch Experience

### Before (Clunky):
```bash
claude --dangerously-skip-permissions https://github.com/user/repo/blob/main/README.md
```

### After (Professional):
```bash
# Interactive setup wizard
conductor init

# Quick setup with smart defaults
conductor init --quick

# Then start using your AI team
conductor ask "help me plan this feature"
```

---

## Visual Feedback & Status Indicators

### Live Dashboard
```bash
# Full-featured dashboard with real-time updates
conductor dashboard

# Minimal dashboard for smaller screens
conductor dashboard --minimal

# Focus on specific agent
conductor dashboard --focus @frontend
```

### Terminal Status Indicators
```bash
# All commands now show beautiful progress indicators:

$ conductor ask "optimize my database queries"
Consulting with AI experts...
   📋 @pm - Analyzing requirements ████████░░ 80%
   ⚙️ @backend - Database review   ██████████ 100% ✓
   🛡️ @security - Security check   ███████░░░ 70%
Expert consultation complete!
```

### Persistent Status Bar
When active, Conductor shows a non-intrusive status bar:
```
[Conductor Active] ~/project $ 
```

---

## 👥 Natural Command Interface

### Traditional vs Enhanced:

| Traditional | Enhanced | Description |
|-------------|----------|-------------|
| `multi-agent recommend` | `conductor ask` | Natural conversation |
| `multi-agent status` | `conductor health` | Quick team status |
| Complex flags | `conductor explain --simple` | User-friendly options |
| No context | `conductor consult "problem"` | Professional consultation focus |

### Smart Aliases:
```bash
# These all work:
conductor ask "question"
conductor consult "question"     # Professional consultation
conductor explain "topic"
conductor review
conductor audit                  # Review alias  
conductor ship "feature"
conductor watch                  # Dashboard alias
```

---

## 🔧 Configuration Made Simple

### Interactive Setup:
```bash
conductor init
```

Walks you through:
- Project type detection
- AI team selection (@pm, @design, @frontend, etc.)
- VS Code integration setup
- Dashboard preferences
- Experience level adaptation

### Configuration Files:
```
.conductor/
├── conductor.config.json      # Main configuration
├── pm-context.json           # @pm agent context
├── frontend-context.json     # @frontend agent context
├── security-context.json     # @security agent context
└── README.md                 # Your personalized guide
```

---

## VS Code Integration

### Automatic Setup:
- Agent-specific terminals pre-configured
- Command palette integration
- Status bar indicators
- Launch buttons in sidebar

### Manual Setup (Optional):
```json
// .vscode/settings.json (auto-generated)
{
  "conductor.agents.enabled": true,
  "conductor.dashboard.autoStart": true,
  "conductor.statusBar.show": true
}
```

---

## What's Different?

### Launch Experience:
- **Before**: Complex Claude Code flags and URLs
- **After**: Single `conductor init` command with guided setup

### Command Interface:
- **Before**: Technical flags and complex syntax
- **After**: Natural language commands (`ask`, `explain`, `consult`)

### Visual Feedback:
- **Before**: No indication of AI activity
- **After**: Real-time progress bars, status indicators, live dashboard

### User Guidance:
- **Before**: Trial and error
- **After**: Interactive wizard, contextual help, experience levels

### Error Handling:
- **Before**: Cryptic error messages
- **After**: Helpful suggestions and recovery options

---

## 🏥 Health Check & Status

```bash
# Quick team status
conductor status

# Detailed health report
conductor health --verbose

# JSON output for scripts
conductor health --json

# Live monitoring
conductor dashboard --watch
```

---

## 🤝 Getting Help

### Built-in Help System:
```bash
# Contextual help for any command
conductor ask "help with authentication"

# Traditional help
conductor --help
conductor ask --help

# Interactive help in dashboard
conductor dashboard
# Press 'h' for help
```

### Smart Error Recovery:
```bash
# When things go wrong:
❌ Command failed: Invalid project structure

Try running: conductor ask "help fix my project setup"
Or run: conductor init --reset
```

---

## 🎉 Success! What's Next?

After installation, your terminal will show:

```
🎉 SUCCESS! Your AI development team is ready!

📋 What you can do now:
  • conductor ask "explain my project structure"
  • conductor review --help  
  • conductor dashboard
  • conductor consult "help me plan my next feature"
  • conductor ship --help

Pro tip: Run conductor dashboard for a live view of your AI team!

Happy professional consultation with your AI experts!
```

---

## 🔗 Next Steps

1. **Start with questions**: `conductor ask "what should I work on first?"`
2. **Explore the dashboard**: `conductor dashboard`
3. **Get code review**: `conductor review`
4. **Plan features**: `conductor ask @pm "define user stories for auth"`
5. **Ship with confidence**: `conductor ship "my-feature" --security-scan`

Your complete AI development team is ready for professional consultation on any challenge!