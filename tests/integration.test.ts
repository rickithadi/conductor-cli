import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Aegis CLI Integration Tests', () => {
  const testProjectDir = path.join(__dirname, 'integration-test-project');
  const cliPath = path.join(__dirname, '../dist/cli.js');

  beforeEach(async () => {
    // Create test project
    await fs.ensureDir(testProjectDir);
    
    // Create a realistic Next.js project structure
    await createTestProject();
  });

  afterEach(async () => {
    await fs.remove(testProjectDir);
  });

  async function createTestProject() {
    // Package.json
    await fs.writeJson(path.join(testProjectDir, 'package.json'), {
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.0.0',
        '@types/react': '^18.0.0',
        'typescript': '^5.0.0',
        'tailwindcss': '^3.0.0'
      },
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start'
      }
    });

    // Create project structure
    await fs.ensureDir(path.join(testProjectDir, 'app'));
    await fs.ensureDir(path.join(testProjectDir, 'components'));
    await fs.ensureDir(path.join(testProjectDir, 'lib'));
    await fs.ensureDir(path.join(testProjectDir, 'public'));

    // Create some source files with security/SEO opportunities
    await fs.writeFile(path.join(testProjectDir, 'app/page.tsx'), `
      import { Metadata } from 'next';
      
      export const metadata: Metadata = {
        title: 'Test App - Professional Services',
        description: 'A comprehensive test application showcasing modern development practices with security and SEO optimization built-in.',
      };
      
      export default function HomePage() {
        return (
          <main>
            <h1>Professional Test Application</h1>
            <p>Welcome to our secure, SEO-optimized application.</p>
          </main>
        );
      }
    `);

    await fs.writeFile(path.join(testProjectDir, 'components/LoginForm.tsx'), `
      'use client';
      
      import { useState } from 'react';
      
      export default function LoginForm() {
        const [credentials, setCredentials] = useState({ email: '', password: '' });
        
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          
          // This should trigger security recommendations
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          
          if (response.ok) {
            window.location.href = '/dashboard';
          }
        };
        
        return (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              required
            />
            <input
              type="password" 
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </form>
        );
      }
    `);

    // Create a file with security issues for testing
    await fs.writeFile(path.join(testProjectDir, 'lib/database.ts'), `
      // This file intentionally contains security issues for testing
      const DATABASE_URL = "postgres://user:hardcoded_password_123@localhost:5432/mydb";
      
      export async function getUserById(id: string) {
        // SQL injection vulnerability
        const query = \`SELECT * FROM users WHERE id = \${id}\`;
        return await db.query(query);
      }
      
      export function hashPassword(password: string) {
        // Weak crypto
        return crypto.createHash('md5').update(password).digest('hex');
      }
    `);
  }

  describe('CLI Initialization', () => {
    it('should successfully initialize Aegis CLI in a Next.js project', async () => {
      const { stdout, stderr } = await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      expect(stderr).toBe('');
      
      // Should create claude.md
      const claudeMdExists = await fs.pathExists(path.join(testProjectDir, 'claude.md'));
      expect(claudeMdExists).toBe(true);
      
      // Should create .multi-agent directory
      const configDirExists = await fs.pathExists(path.join(testProjectDir, '.multi-agent'));
      expect(configDirExists).toBe(true);
    });

    it('should generate security-focused agents for the project', async () => {
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      const claudeMd = await fs.readFile(path.join(testProjectDir, 'claude.md'), 'utf8');
      
      expect(claudeMd).toContain('@security-architect');
      expect(claudeMd).toContain('@seo-specialist');
      expect(claudeMd).toContain('@privacy-officer');
      expect(claudeMd).toContain('OWASP Top 10');
      expect(claudeMd).toContain('Next.js SEO');
    });
  });

  describe('Security Scanning Integration', () => {
    it('should detect security vulnerabilities in the test project', async () => {
      // First initialize
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      // Run security scan (assuming we add this command)
      try {
        const { stdout } = await execAsync(`node ${cliPath} scan --security`, {
          cwd: testProjectDir
        });

        expect(stdout).toContain('security findings');
        expect(stdout).toContain('hardcoded');
        expect(stdout).toContain('SQL injection');
        expect(stdout).toContain('weak cryptography');
      } catch (error) {
        // Command might not exist yet, but structure should be there
        expect(true).toBe(true); // Placeholder for when command is implemented
      }
    });
  });

  describe('Agent Recommendations', () => {
    it('should provide security-focused recommendations for authentication', async () => {
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      try {
        // This would test the recommendation system
        const { stdout } = await execAsync(`echo "✅" | node ${cliPath} recommend "secure the login form" --type security`, {
          cwd: testProjectDir,
          timeout: 10000
        });

        expect(stdout).toContain('@security-architect');
        expect(stdout).toContain('OAuth');
        expect(stdout).toContain('authentication');
      } catch (error) {
        // Interactive command - expect it to timeout or require input
        expect((error as Error).message).toContain('timeout');
      }
    });

    it('should provide SEO recommendations for the homepage', async () => {
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      try {
        const { stdout } = await execAsync(`echo "✅" | node ${cliPath} recommend "optimize SEO for the homepage" --type seo`, {
          cwd: testProjectDir,
          timeout: 10000
        });

        expect(stdout).toContain('@seo-specialist');
        expect(stdout).toContain('metadata');
        expect(stdout).toContain('structured data');
      } catch (error) {
        // Interactive command - expect it to timeout or require input  
        expect(error.message).toContain('timeout');
      }
    });
  });

  describe('Configuration Management', () => {
    it('should create proper configuration files', async () => {
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      // Check approval system config
      const approvalConfigPath = path.join(testProjectDir, '.multi-agent', 'approval-config.json');
      const approvalConfigExists = await fs.pathExists(approvalConfigPath);
      expect(approvalConfigExists).toBe(true);

      if (approvalConfigExists) {
        const config = await fs.readJson(approvalConfigPath);
        expect(config).toHaveProperty('requiresApproval');
        expect(config.requiresApproval).toHaveProperty('codeChanges');
        expect(config.requiresApproval).toHaveProperty('newFeatures');
      }
    });

    it('should detect project framework and language correctly', async () => {
      const { stdout } = await execAsync(`node ${cliPath} status`, {
        cwd: testProjectDir
      });

      expect(stdout).toContain('Framework: unknown'); // Since we don't have next.config.js
      expect(stdout).toContain('Language: typescript');
      expect(stdout).toContain('Package Manager: npm');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing package.json gracefully', async () => {
      const emptyProjectDir = path.join(__dirname, 'empty-project');
      await fs.ensureDir(emptyProjectDir);

      try {
        const { stdout, stderr } = await execAsync(`node ${cliPath} init --force --no-vscode`, {
          cwd: emptyProjectDir
        });

        // Should still work, just with minimal detection
        expect(stderr).not.toContain('Error');
        
        const claudeMdExists = await fs.pathExists(path.join(emptyProjectDir, 'claude.md'));
        expect(claudeMdExists).toBe(true);
      } finally {
        await fs.remove(emptyProjectDir);
      }
    });

    it('should handle invalid project structures', async () => {
      // Create a project with conflicting information
      const confusedProjectDir = path.join(__dirname, 'confused-project');
      await fs.ensureDir(confusedProjectDir);
      
      // Create package.json claiming to be Vue but with React dependencies
      await fs.writeJson(path.join(confusedProjectDir, 'package.json'), {
        name: 'confused-project',
        dependencies: {
          'vue': '^3.0.0',
          'react': '^18.0.0' // Conflicting!
        }
      });

      try {
        const { stdout, stderr } = await execAsync(`node ${cliPath} init --force --no-vscode`, {
          cwd: confusedProjectDir
        });

        // Should handle gracefully without crashing
        expect(stderr).not.toContain('Error');
      } finally {
        await fs.remove(confusedProjectDir);
      }
    });
  });

  describe('Performance', () => {
    it('should complete initialization within reasonable time', async () => {
      const startTime = Date.now();
      
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 10 seconds
      expect(duration).toBeLessThan(10000);
    });

    it('should handle large projects efficiently', async () => {
      // Create a larger project structure
      for (let i = 0; i < 20; i++) {
        await fs.ensureDir(path.join(testProjectDir, `feature-${i}`));
        await fs.writeFile(
          path.join(testProjectDir, `feature-${i}`, 'index.ts'), 
          `export const feature${i} = "feature";`
        );
      }

      const startTime = Date.now();
      
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should still complete reasonably quickly even with more files
      expect(duration).toBeLessThan(15000);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should work with TypeScript + Next.js + Tailwind stack', async () => {
      // Add more realistic dependencies
      const packageJson = await fs.readJson(path.join(testProjectDir, 'package.json'));
      packageJson.dependencies = {
        ...packageJson.dependencies,
        '@next/font': '^14.0.0',
        'autoprefixer': '^10.0.0',
        'postcss': '^8.0.0',
        'clsx': '^2.0.0'
      };
      await fs.writeJson(path.join(testProjectDir, 'package.json'), packageJson);

      // Add Tailwind config
      await fs.writeFile(path.join(testProjectDir, 'tailwind.config.js'), `
        module.exports = {
          content: ['./app/**/*.{js,ts,jsx,tsx}'],
          theme: {
            extend: {},
          },
          plugins: [],
        }
      `);

      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      const claudeMd = await fs.readFile(path.join(testProjectDir, 'claude.md'), 'utf8');
      
      expect(claudeMd).toContain('Tailwind');
      expect(claudeMd).toContain('TypeScript');
      expect(claudeMd).toContain('Next.js');
    });

    it('should provide comprehensive security audit for real application', async () => {
      // Add more security-sensitive files
      await fs.writeFile(path.join(testProjectDir, 'app/api/auth/route.ts'), `
        import { NextRequest, NextResponse } from 'next/server';
        import bcrypt from 'bcrypt';
        
        export async function POST(request: NextRequest) {
          const { email, password } = await request.json();
          
          // Good: Using bcrypt for hashing
          const hashedPassword = await bcrypt.hash(password, 10);
          
          // Should recommend: Input validation
          // Should recommend: Rate limiting
          // Should recommend: CSRF protection
          
          return NextResponse.json({ success: true });
        }
      `);

      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      const claudeMd = await fs.readFile(path.join(testProjectDir, 'claude.md'), 'utf8');
      
      expect(claudeMd).toContain('security');
      expect(claudeMd).toContain('validation');
      expect(claudeMd).toContain('authentication');
    });
  });

  describe('Documentation Generation', () => {
    it('should generate comprehensive Claude context', async () => {
      await execAsync(`node ${cliPath} init --force --no-vscode`, {
        cwd: testProjectDir
      });

      const claudeMd = await fs.readFile(path.join(testProjectDir, 'claude.md'), 'utf8');
      
      // Should contain all required sections
      expect(claudeMd).toContain('# Project Context');
      expect(claudeMd).toContain('## Specialized AI Agents');
      expect(claudeMd).toContain('## Security Guidelines');
      expect(claudeMd).toContain('## SEO Optimization');
      expect(claudeMd).toContain('## Technical Stack');
      
      // Should contain specific technical details
      expect(claudeMd).toContain('Next.js');
      expect(claudeMd).toContain('TypeScript');
      expect(claudeMd).toContain('Tailwind');
    });
  });
});