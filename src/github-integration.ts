import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export interface GitHubConfig {
  token?: string;
  owner?: string;
  repo?: string;
  defaultBranch?: string;
}

export interface PullRequestOptions {
  title: string;
  body: string;
  head: string;
  base?: string;
  draft?: boolean;
  labels?: string[];
  assignees?: string[];
  reviewers?: string[];
}

export interface IssueOptions {
  title: string;
  body: string;
  labels?: string[];
  assignees?: string[];
  milestone?: number;
}

export class GitHubIntegration {
  private config: GitHubConfig;
  private isGitRepo: boolean = false;
  private hasGHCLI: boolean = false;

  constructor(config: GitHubConfig = {}) {
    this.config = config;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Check if we're in a git repository
    try {
      await execAsync('git rev-parse --git-dir');
      this.isGitRepo = true;
    } catch {
      this.isGitRepo = false;
    }

    // Check if GitHub CLI is installed
    try {
      await execAsync('gh --version');
      this.hasGHCLI = true;
    } catch {
      this.hasGHCLI = false;
    }

    // Get repository info if in a git repo
    if (this.isGitRepo) {
      try {
        const { stdout } = await execAsync('git remote get-url origin');
        const match = stdout.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);
        if (match) {
          this.config.owner = this.config.owner || match[1];
          this.config.repo = this.config.repo || match[2];
        }
      } catch {
        // No remote origin
      }
    }
  }

  /**
   * Create a new pull request with AI-generated description
   */
  async createPullRequest(options: PullRequestOptions): Promise<string> {
    if (!this.hasGHCLI) {
      throw new Error('GitHub CLI (gh) is not installed. Please install it first: https://cli.github.com');
    }

    const { title, body, head, base = this.config.defaultBranch || 'main', draft = false } = options;

    // Build the gh command
    let command = `gh pr create --title "${title}" --body "${body}" --head "${head}" --base "${base}"`;
    
    if (draft) command += ' --draft';
    if (options.labels?.length) command += ` --label "${options.labels.join(',')}"`;
    if (options.assignees?.length) command += ` --assignee "${options.assignees.join(',')}"`;
    if (options.reviewers?.length) command += ` --reviewer "${options.reviewers.join(',')}"`;

    try {
      const { stdout } = await execAsync(command);
      return stdout.trim();
    } catch (error: any) {
      throw new Error(`Failed to create PR: ${error.message}`);
    }
  }

  /**
   * Review a pull request with AI agents
   */
  async reviewPullRequest(prNumber: number): Promise<any> {
    if (!this.hasGHCLI) {
      throw new Error('GitHub CLI is not installed');
    }

    try {
      // Get PR diff
      const { stdout: diff } = await execAsync(`gh pr diff ${prNumber}`);
      
      // Get PR details
      const { stdout: details } = await execAsync(`gh pr view ${prNumber} --json title,body,author,files,additions,deletions`);
      
      return {
        diff,
        details: JSON.parse(details),
        needsReview: true
      };
    } catch (error: any) {
      throw new Error(`Failed to review PR: ${error.message}`);
    }
  }

  /**
   * Create an issue with AI-generated content
   */
  async createIssue(options: IssueOptions): Promise<string> {
    if (!this.hasGHCLI) {
      throw new Error('GitHub CLI is not installed');
    }

    const { title, body } = options;
    
    let command = `gh issue create --title "${title}" --body "${body}"`;
    
    if (options.labels?.length) command += ` --label "${options.labels.join(',')}"`;
    if (options.assignees?.length) command += ` --assignee "${options.assignees.join(',')}"`;
    if (options.milestone) command += ` --milestone ${options.milestone}`;

    try {
      const { stdout } = await execAsync(command);
      return stdout.trim();
    } catch (error: any) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  /**
   * Set up GitHub Actions workflow
   */
  async setupGitHubActions(framework: string): Promise<void> {
    const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }

    // Generate workflow based on framework
    const workflow = this.generateWorkflow(framework);
    const workflowPath = path.join(workflowsDir, 'conductor-ci.yml');
    
    fs.writeFileSync(workflowPath, workflow);
    console.log(`✅ GitHub Actions workflow created at ${workflowPath}`);
  }

  private generateWorkflow(framework: string): string {
    const baseWorkflow = `name: Conductor CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  analysis:
    name: AI Team Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Security Scan
        run: |
          echo "🛡️ Running OWASP security scan..."
          # conductor scan --security --owasp
      
      - name: Run Tests
        run: npm test
      
      - name: Build
        run: npm run build
`;

    // Add framework-specific steps
    if (framework === 'nextjs') {
      return baseWorkflow + `
      - name: Next.js Specific Checks
        run: |
          echo "⚛️ Running Next.js optimizations..."
          npm run lint
          # npm run analyze
      
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: |
          echo "🚀 Deploying to Vercel..."
          # vercel --prod
`;
    }

    return baseWorkflow;
  }

  /**
   * Commit with AI-generated message
   */
  async commitWithAI(files: string[], message?: string): Promise<void> {
    if (!this.isGitRepo) {
      throw new Error('Not in a git repository');
    }

    // Stage files
    for (const file of files) {
      await execAsync(`git add ${file}`);
    }

    // Generate commit message if not provided
    const commitMessage = message || await this.generateCommitMessage();
    
    // Commit with co-author
    const coAuthor = '\n\nCo-authored-by: Conductor CLI <conductor@gallifrey.consulting>';
    await execAsync(`git commit -m "${commitMessage}${coAuthor}"`);
    
    console.log(`✅ Committed with message: ${commitMessage}`);
  }

  private async generateCommitMessage(): Promise<string> {
    try {
      const { stdout } = await execAsync('git diff --cached --stat');
      const files = stdout.split('\n').filter(line => line.includes('|'));
      
      if (files.length === 0) {
        return 'chore: update files';
      }
      
      // Analyze the changes
      const isFeature = files.some(f => f.includes('src/'));
      const isDocs = files.some(f => f.includes('.md'));
      const isConfig = files.some(f => f.includes('config') || f.includes('.json'));
      
      if (isFeature) return 'feat: implement new functionality';
      if (isDocs) return 'docs: update documentation';
      if (isConfig) return 'chore: update configuration';
      
      return 'chore: update project files';
    } catch {
      return 'chore: update files';
    }
  }

  /**
   * Create a branch with naming convention
   */
  async createBranch(type: 'feature' | 'fix' | 'chore', name: string): Promise<void> {
    if (!this.isGitRepo) {
      throw new Error('Not in a git repository');
    }

    const branchName = `${type}/${name.toLowerCase().replace(/\s+/g, '-')}`;
    await execAsync(`git checkout -b ${branchName}`);
    console.log(`✅ Created and switched to branch: ${branchName}`);
  }

  /**
   * Get repository statistics
   */
  async getRepoStats(): Promise<any> {
    if (!this.hasGHCLI) {
      throw new Error('GitHub CLI is not installed');
    }

    try {
      const { stdout } = await execAsync('gh repo view --json name,description,stargazers,forks,issues,pullRequests');
      return JSON.parse(stdout);
    } catch (error: any) {
      throw new Error(`Failed to get repo stats: ${error.message}`);
    }
  }

  /**
   * Run CI/CD checks locally
   */
  async runCIChecks(): Promise<{ passed: boolean; results: any[] }> {
    const results = [];
    let passed = true;

    // Check 1: Linting
    try {
      await execAsync('npm run lint');
      results.push({ check: 'Linting', status: '✅ Passed' });
    } catch (error) {
      results.push({ check: 'Linting', status: '❌ Failed', error });
      passed = false;
    }

    // Check 2: Tests
    try {
      await execAsync('npm test');
      results.push({ check: 'Tests', status: '✅ Passed' });
    } catch (error) {
      results.push({ check: 'Tests', status: '❌ Failed', error });
      passed = false;
    }

    // Check 3: Build
    try {
      await execAsync('npm run build');
      results.push({ check: 'Build', status: '✅ Passed' });
    } catch (error) {
      results.push({ check: 'Build', status: '❌ Failed', error });
      passed = false;
    }

    // Check 4: Security
    try {
      await execAsync('npm audit --audit-level=moderate');
      results.push({ check: 'Security Audit', status: '✅ Passed' });
    } catch (error) {
      results.push({ check: 'Security Audit', status: '⚠️ Warnings', error });
    }

    return { passed, results };
  }
}

/**
 * GitHub Context Manager - integrates with Claude context
 */
export class GitHubContextManager {
  private integration: GitHubIntegration;
  private contextFile: string = '.conductor/github-context.json';

  constructor() {
    this.integration = new GitHubIntegration();
  }

  async saveContext(context: any): Promise<void> {
    const contextDir = path.dirname(this.contextFile);
    if (!fs.existsSync(contextDir)) {
      fs.mkdirSync(contextDir, { recursive: true });
    }

    const gitContext = {
      ...context,
      github: {
        hasRepo: this.integration['isGitRepo'],
        hasCLI: this.integration['hasGHCLI'],
        config: this.integration['config'],
        timestamp: new Date().toISOString()
      }
    };

    fs.writeFileSync(this.contextFile, JSON.stringify(gitContext, null, 2));
  }

  async loadContext(): Promise<any> {
    if (!fs.existsSync(this.contextFile)) {
      return null;
    }

    const content = fs.readFileSync(this.contextFile, 'utf-8');
    return JSON.parse(content);
  }

  async updateWithPRContext(prNumber: number): Promise<void> {
    const context = await this.loadContext() || {};
    const prData = await this.integration.reviewPullRequest(prNumber);
    
    context.currentPR = {
      number: prNumber,
      ...prData.details,
      lastUpdated: new Date().toISOString()
    };

    await this.saveContext(context);
  }
}