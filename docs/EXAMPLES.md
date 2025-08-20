# Usage Examples

This document provides real-world examples of using the Multi-Agent CLI in different scenarios.

## 🚀 Getting Started Examples

### Example 1: Next.js E-commerce Project

```bash
# Start a new Next.js project with multi-agent setup
multi-agent create ecommerce-app --template nextjs

cd ecommerce-app

# Get recommendations for adding product catalog
multi-agent recommend "Add product catalog with filtering and search"
```

**Expected Multi-Agent Response:**
- **@frontend**: Suggests Next.js App Router with Server Components for SEO
- **@backend**: Recommends PostgreSQL with Prisma ORM for product data
- **@ux**: Proposes faceted search with progressive disclosure
- **@review**: Emphasizes performance optimization and code structure
- **@security**: Highlights input validation and SQL injection prevention

### Example 2: Existing React Project Migration

```bash
# Initialize in existing React project
cd existing-react-app
multi-agent init

# Get migration recommendations
multi-agent recommend "Migrate from Create React App to Vite" --type optimization
```

**Multi-Agent Analysis:**
- **@frontend**: Build tool comparison, bundle size impact
- **@review**: Breaking changes assessment, migration strategy
- **@testing**: Test configuration updates needed
- **@ux**: Development experience improvements

## 🔧 Common Workflow Examples

### Feature Development Workflow

```bash
# 1. Get initial recommendations
multi-agent recommend "Add real-time chat feature"

# 2. Review proposals
multi-agent proposals --list

# 3. Approve with modifications
multi-agent proposals --review proposal_abc123

# 4. Start development with context
claude-code
```

### Bug Fix Workflow

```bash
# 1. Analyze bug with multi-agent input
multi-agent recommend "Fix memory leak in dashboard component" --type bugfix

# 2. Get comprehensive analysis
# - @frontend: Component lifecycle analysis
# - @review: Code pattern review
# - @testing: Test coverage gaps
# - @security: Potential security implications

# 3. Implement with approved strategy
```

### Architecture Decision Workflow

```bash
# 1. Get architectural guidance
multi-agent recommend "Choose between GraphQL and REST API" --type refactor

# 2. Compare agent perspectives
# - @backend: Performance and complexity analysis
# - @frontend: Data fetching implications
# - @review: Long-term maintainability
# - @security: Attack surface considerations

# 3. Document decision
multi-agent proposals --create
# Creates formal proposal with all agent input
```

## 🎯 Specific Use Cases

### Use Case 1: Performance Optimization

```bash
multi-agent recommend "Optimize Core Web Vitals for mobile users" --type optimization
```

**Agent Collaboration:**
- **@frontend**: Bundle analysis, code splitting recommendations
- **@ux**: Mobile UX impact assessment
- **@review**: Performance monitoring setup
- **@backend**: API optimization opportunities

**Typical Approval Flow:**
1. Review performance metrics and goals
2. Approve infrastructure changes (CDN, caching)
3. Modify UI changes based on UX feedback
4. Reject complex changes that impact accessibility

### Use Case 2: Security Implementation

```bash
multi-agent recommend "Implement OAuth 2.0 with JWT tokens" --type security
```

**Agent Perspectives:**
- **@security**: OAuth flow security best practices
- **@backend**: Token management and refresh strategies
- **@frontend**: Authentication state management
- **@ux**: Login/logout user experience
- **@review**: Code organization and testing requirements

### Use Case 3: Database Migration

```bash
multi-agent recommend "Migrate from MongoDB to PostgreSQL" --type refactor
```

**Comprehensive Analysis:**
- **@database**: Migration strategy, data integrity
- **@backend**: ORM changes, query optimization
- **@review**: Risk assessment, rollback plans
- **@testing**: Data validation test updates

## 🔄 Approval Scenarios

### Scenario 1: Approve All Recommendations

```
✅ All recommendations approved!

Implementation plan:
1. @frontend: Update component architecture
2. @backend: Implement new API endpoints
3. @ux: Design user flow mockups
4. @review: Set up code quality gates
5. @testing: Create test suite
```

### Scenario 2: Approve with Modifications

```
🔧 Recommendations approved with modifications!

Modified actions:
- @frontend: "Use Next.js Server Components" 
  → Modified to: "Use Next.js with client-side rendering for better team familiarity"
  → Reason: "Team needs time to learn Server Components"

- @backend: "Implement GraphQL API"
  → Modified to: "Extend existing REST API with new endpoints"
  → Reason: "Existing infrastructure investment"
```

### Scenario 3: Cherry-Pick Recommendations

```
🔍 Individual recommendations approved:

Approved:
✅ @ux: Implement progressive disclosure
✅ @review: Add comprehensive test coverage
✅ @security: Input validation improvements

Rejected:
❌ @frontend: Complete UI framework migration
❌ @backend: Database schema redesign

Reason: "Focus on UX and quality improvements first, defer infrastructure changes"
```

## 🛠️ Advanced Configuration Examples

### Custom Agent Configuration

Add to `claude.md`:

```markdown
### @performance - Performance Specialist
**Expertise**: Core Web Vitals, bundle optimization, lazy loading, caching
**Technical Stack**: Lighthouse, WebPageTest, Bundle Analyzer, Service Workers
**Brand Awareness**: Sub-3s load times, 95+ Lighthouse scores
**Domain Knowledge**: E-commerce performance patterns, mobile-first optimization
**Special Instructions**:
- Always measure before optimizing
- Consider mobile users on slow networks
- Balance performance with user experience
- Monitor real-user metrics, not just synthetic tests
```

### Project-Specific Approval Rules

`.multi-agent/approval-config.json`:

```json
{
  "requiresApproval": {
    "codeChanges": true,
    "newFeatures": true,
    "architectureChanges": true,
    "dependencies": true,
    "configChanges": false,
    "documentationUpdates": false
  },
  "autoApprove": {
    "lowRiskChanges": true,
    "documentation": true,
    "tests": true,
    "linting": true,
    "formatting": true
  },
  "riskThresholds": {
    "high": ["database migrations", "authentication changes", "payment processing"],
    "medium": ["API changes", "component library updates", "build configuration"],
    "low": ["styling updates", "copy changes", "test additions"]
  }
}
```

## 📊 Integration Examples

### GitHub Actions Integration

`.github/workflows/multi-agent-review.yml`:

```yaml
name: Multi-Agent PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  multi-agent-analysis:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Multi-Agent CLI
        run: npm install -g multi-agent-cli
        
      - name: Initialize Multi-Agent
        run: multi-agent init --force --no-vscode
        
      - name: Get changed files
        id: changes
        run: |
          echo "files=$(git diff --name-only HEAD~1 HEAD | tr '\n' ' ')" >> $GITHUB_OUTPUT
          
      - name: Generate recommendations
        run: |
          multi-agent recommend "Review changes in PR: ${{ steps.changes.outputs.files }}" \
            --type review > multi-agent-analysis.md
            
      - name: Post PR comment
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const analysis = fs.readFileSync('multi-agent-analysis.md', 'utf8');
            
            // Find existing comment
            const comments = await github.rest.issues.listComments({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
            });
            
            const existingComment = comments.data.find(
              comment => comment.body.includes('Multi-Agent Analysis')
            );
            
            const body = `## 🤖 Multi-Agent Analysis\n\n${analysis}`;
            
            if (existingComment) {
              await github.rest.issues.updateComment({
                comment_id: existingComment.id,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            } else {
              await github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            }
```

### VSCode Task Integration

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Multi-Agent: Get Recommendations",
      "type": "shell",
      "command": "multi-agent",
      "args": ["recommend", "${input:taskDescription}"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Multi-Agent: Review Proposals",
      "type": "shell", 
      "command": "multi-agent",
      "args": ["proposals", "--list"],
      "group": "build"
    }
  ],
  "inputs": [
    {
      "id": "taskDescription",
      "description": "Describe the task for multi-agent analysis",
      "default": "Analyze current changes",
      "type": "promptString"
    }
  ]
}
```

## 🎪 Demo Project

Try the CLI with our example project:

```bash
# Clone example project
git clone https://github.com/your-org/multi-agent-demo
cd multi-agent-demo

# Initialize multi-agent
multi-agent init

# Try example recommendations
multi-agent recommend "Add user authentication with social login"
multi-agent recommend "Optimize images for better performance"
multi-agent recommend "Implement dark mode theme"
```

Each example includes expected multi-agent responses and approval workflows you can practice with.

---

For more examples and use cases, check out our [community examples repository](https://github.com/your-org/multi-agent-examples) with real-world projects using the Multi-Agent CLI.