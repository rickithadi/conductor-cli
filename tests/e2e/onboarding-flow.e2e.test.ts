import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('Conductor CLI - End-to-End Onboarding Flow', () => {
  let testProjectPath: string;
  let cliPath: string;

  beforeAll(async () => {
    // Set up test environment
    testProjectPath = path.join(os.tmpdir(), 'conductor-e2e-test', Date.now().toString());
    await fs.ensureDir(testProjectPath);
    
    // CLI path for testing
    cliPath = path.join(__dirname, '../../src/enhanced-cli.ts');
    
    console.log(`🧪 Test project created at: ${testProjectPath}`);
  }, 30000);

  afterAll(async () => {
    // Clean up test project
    if (await fs.pathExists(testProjectPath)) {
      await fs.remove(testProjectPath);
      console.log(`🧹 Test project cleaned up: ${testProjectPath}`);
    }
  });

  describe('Project Initialization Flow', () => {
    test('should handle quick initialization successfully', async () => {
      // Create minimal package.json for the test project
      const packageJson = {
        name: 'test-conductor-project',
        version: '1.0.0',
        scripts: {
          dev: 'next dev',
          build: 'next build',
          test: 'jest'
        },
        dependencies: {
          react: '^18.0.0',
          next: '^14.0.0',
          typescript: '^5.0.0'
        }
      };
      
      await fs.writeJson(path.join(testProjectPath, 'package.json'), packageJson);

      // Run initialization
      const result = await runCLICommand(['init', '--quick'], {
        cwd: testProjectPath,
        timeout: 30000
      });

      // Verify successful initialization
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('✅ Quick setup complete!');
      expect(result.stdout).toContain('🎉 SUCCESS! Your AI development team is ready!');

      // Verify configuration files were created
      const configPath = path.join(testProjectPath, '.conductor', 'conductor.config.json');
      expect(await fs.pathExists(configPath)).toBe(true);

      const config = await fs.readJson(configPath);
      expect(config).toHaveProperty('version');
      expect(config).toHaveProperty('projectType');
      expect(config).toHaveProperty('agents');
      expect(Array.isArray(config.agents)).toBe(true);
      expect(config.agents.length).toBeGreaterThan(0);

      // Verify context file exists
      const contextPath = path.join(testProjectPath, '.conductor', 'claude-context.md');
      expect(await fs.pathExists(contextPath)).toBe(true);

      console.log('✅ Quick initialization test passed');
    }, 45000);

    test('should detect project type correctly', async () => {
      // Test Next.js project detection
      const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`;
      
      await fs.writeFile(path.join(testProjectPath, 'next.config.js'), nextConfig);

      const result = await runCLICommand(['init', '--quick'], {
        cwd: testProjectPath,
        timeout: 20000
      });

      expect(result.exitCode).toBe(0);

      const config = await fs.readJson(path.join(testProjectPath, '.conductor', 'conductor.config.json'));
      expect(config.projectType).toBe('nextjs');

      console.log('✅ Project type detection test passed');
    }, 30000);
  });

  describe('Launch Flow End-to-End', () => {
    beforeEach(async () => {
      // Ensure project is initialized
      const configPath = path.join(testProjectPath, '.conductor', 'conductor.config.json');
      if (!await fs.pathExists(configPath)) {
        await runCLICommand(['init', '--quick'], {
          cwd: testProjectPath,
          timeout: 20000
        });
      }
    });

    test('should validate environment and generate context', async () => {
      const result = await runCLICommand(['launch', '--verbose'], {
        cwd: testProjectPath,
        timeout: 15000,
        expectInteraction: true
      });

      // Should show validation steps
      expect(result.stdout).toContain('Checking Claude Code installation');
      expect(result.stdout).toContain('Validating project setup');
      expect(result.stdout).toContain('Verifying configuration files');
      expect(result.stdout).toContain('Testing system permissions');

      // Should show context generation
      expect(result.stdout).toContain('📝 Generating comprehensive project context');
      expect(result.stdout).toContain('✅ Project context generated');

      // Should show agent initialization
      expect(result.stdout).toContain('🎭 AI DEVELOPMENT TEAM ORCHESTRA');
      expect(result.stdout).toContain('agents online and ready');
      expect(result.stdout).toContain('Average confidence:');

      // Should show context summary
      expect(result.stdout).toContain('📋 PROJECT CONTEXT SUMMARY');
      expect(result.stdout).toContain('👥 AI Development Team Status:');

      // Should show ready state
      expect(result.stdout).toContain('✅ Ready to launch Claude with your AI development team!');
      expect(result.stdout).toContain('Press Enter to launch Claude Code, or Ctrl+C to cancel...');

      console.log('✅ Launch flow validation test passed');
    }, 30000);

    test('should generate comprehensive Claude context', async () => {
      // Run launch to generate context (will timeout at user input, which is expected)
      await runCLICommand(['launch'], {
        cwd: testProjectPath,
        timeout: 10000,
        expectInteraction: true,
        allowTimeout: true
      });

      // Verify context file was generated
      const contextPath = path.join(testProjectPath, '.conductor', 'claude-context.md');
      expect(await fs.pathExists(contextPath)).toBe(true);

      const contextContent = await fs.readFile(contextPath, 'utf8');

      // Verify context structure
      expect(contextContent).toContain('# 🦆 Conductor CLI - Auto-Generated Claude Context');
      expect(contextContent).toContain('## Project Overview');
      expect(contextContent).toContain('## AI Development Team Status');
      expect(contextContent).toContain('## Available Commands');
      expect(contextContent).toContain('## Session Instructions');

      // Verify project information
      expect(contextContent).toContain('test-conductor-project');
      expect(contextContent).toContain('nextjs');

      // Verify agent information
      expect(contextContent).toContain('@frontend');
      expect(contextContent).toContain('@backend');

      // Verify command examples
      expect(contextContent).toContain('conductor ask');
      expect(contextContent).toContain('conductor duck');
      expect(contextContent).toContain('conductor review');

      console.log('✅ Context generation test passed');
    }, 20000);
  });

  describe('Command Integration Tests', () => {
    beforeEach(async () => {
      // Ensure project is initialized
      const configPath = path.join(testProjectPath, '.conductor', 'conductor.config.json');
      if (!await fs.pathExists(configPath)) {
        await runCLICommand(['init', '--quick'], {
          cwd: testProjectPath,
          timeout: 20000
        });
      }
    });

    test('should show team status correctly', async () => {
      const result = await runCLICommand(['status', '--verbose'], {
        cwd: testProjectPath,
        timeout: 10000
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('🎭 CONDUCTOR CLI - AI TEAM STATUS');
      expect(result.stdout).toContain('👥 Agent Orchestra:');
      expect(result.stdout).toContain('📊 Team Consensus:');
      expect(result.stdout).toContain('📈 Quick Stats:');

      console.log('✅ Status command test passed');
    }, 15000);

    test('should provide helpful error messages', async () => {
      // Test with invalid command
      const result = await runCLICommand(['invalid-command'], {
        cwd: testProjectPath,
        timeout: 5000,
        expectFailure: true
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr || result.stdout).toContain('Unknown command');

      console.log('✅ Error handling test passed');
    }, 10000);

    test('should show interactive help', async () => {
      const result = await runCLICommand(['help'], {
        cwd: testProjectPath,
        timeout: 5000
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('🦆 CONDUCTOR CLI - POWER USER GUIDE');
      expect(result.stdout).toContain('⌨️  Keyboard Shortcuts & Quick Commands');
      expect(result.stdout).toContain('⚡ Power Commands');
      expect(result.stdout).toContain('🎯 Agent-Specific Commands');

      console.log('✅ Help command test passed');
    }, 10000);
  });

  describe('Configuration Management', () => {
    test('should handle configuration validation', async () => {
      // Create invalid configuration
      const invalidConfig = {
        version: '0.0.1', // Old version
        invalidField: 'should-not-exist'
      };

      await fs.writeJson(
        path.join(testProjectPath, '.conductor', 'conductor.config.json'),
        invalidConfig
      );

      const result = await runCLICommand(['status'], {
        cwd: testProjectPath,
        timeout: 10000,
        expectFailure: true
      });

      // Should handle gracefully or provide upgrade path
      expect(result.stdout || result.stderr).toMatch(/config|version|invalid/i);

      console.log('✅ Configuration validation test passed');
    }, 15000);

    test('should support configuration reset', async () => {
      const result = await runCLICommand(['config', '--reset'], {
        cwd: testProjectPath,
        timeout: 10000
      });

      expect(result.exitCode).toBe(0);
      
      // Verify config was reset
      const configPath = path.join(testProjectPath, '.conductor', 'conductor.config.json');
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJson(configPath);
        expect(config.version).toBeDefined();
      }

      console.log('✅ Configuration reset test passed');
    }, 15000);
  });

  describe('Performance and Reliability', () => {
    test('should complete initialization within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await runCLICommand(['init', '--quick'], {
        cwd: testProjectPath,
        timeout: 20000
      });

      const duration = Date.now() - startTime;
      
      expect(result.exitCode).toBe(0);
      expect(duration).toBeLessThan(15000); // Should complete in under 15 seconds

      console.log(`✅ Performance test passed (${duration}ms)`);
    }, 25000);

    test('should handle concurrent operations gracefully', async () => {
      // Run multiple status commands simultaneously
      const promises = Array.from({ length: 3 }, () =>
        runCLICommand(['status'], {
          cwd: testProjectPath,
          timeout: 10000
        })
      );

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach((result, index) => {
        expect(result.exitCode).toBe(0);
        console.log(`✅ Concurrent operation ${index + 1} passed`);
      });
    }, 20000);
  });

  // Helper function to run CLI commands
  async function runCLICommand(
    args: string[], 
    options: {
      cwd?: string;
      timeout?: number;
      expectFailure?: boolean;
      expectInteraction?: boolean;
      allowTimeout?: boolean;
    } = {}
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const {
        cwd = process.cwd(),
        timeout = 10000,
        expectFailure = false,
        expectInteraction = false,
        allowTimeout = false
      } = options;

      let stdout = '';
      let stderr = '';
      let resolved = false;

      // Use tsx to run TypeScript directly in tests
      const child = spawn('npx', ['tsx', cliPath, ...args], {
        cwd,
        stdio: 'pipe',
        env: {
          ...process.env,
          NODE_ENV: 'test',
          CONDUCTOR_TEST_MODE: 'true'
        }
      });

      child.stdout?.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        
        // If expecting interaction, terminate on confirmation prompt
        if (expectInteraction && chunk.includes('Press Enter to launch Claude Code')) {
          child.kill('SIGTERM');
        }
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (!resolved) {
          resolved = true;
          resolve({
            stdout,
            stderr,
            exitCode: code || 0
          });
        }
      });

      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          if (allowTimeout && error.message.includes('timeout')) {
            resolve({
              stdout,
              stderr,
              exitCode: 0 // Treat timeout as success for interactive commands
            });
          } else {
            reject(error);
          }
        }
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill('SIGTERM');
          
          if (allowTimeout || expectInteraction) {
            resolve({
              stdout,
              stderr,
              exitCode: 0
            });
          } else {
            reject(new Error(`Command timed out after ${timeout}ms`));
          }
        }
      }, timeout);

      // Clean up timeout if process completes
      child.on('close', () => {
        clearTimeout(timeoutId);
      });
    });
  }
});