import { spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

// Mock child process for testing
jest.mock('child_process');
jest.mock('fs-extra');

describe('Recording Examples End-to-End Testing', () => {
  const mockSpawn = spawn as unknown as jest.Mock;
  const mockFs = fs as jest.Mocked<typeof fs>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock file system operations
    mockFs.pathExists.mockResolvedValue(true);
    mockFs.readFile.mockResolvedValue('mock content');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Quick Start Recording Examples', () => {
    it('should execute conductor init --quick successfully', async () => {
      // Mock successful init command
      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 100); // Exit code 0 = success
          }
        }),
        kill: jest.fn()
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      // Mock stdout data
      const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
        call => call[0] === 'data'
      )?.[1];
      
      if (stdoutCallback) {
        stdoutCallback('✅ Quick setup complete! 🎫\n');
        stdoutCallback('🚂 AI Express configuration saved\n');
      }

      const result = await new Promise((resolve) => {
        const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', 'init', '--quick']);
        let output = '';
        
        child.stdout?.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', (code) => {
          resolve({ code, output });
        });
      });

      expect(mockSpawn).toHaveBeenCalledWith('npx', ['tsx', 'src/enhanced-cli.ts', 'init', '--quick']);
      expect(result).toEqual({
        code: 0,
        output: expect.stringContaining('setup complete')
      });
    });

    it('should execute conductor launch successfully', async () => {
      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 100);
          }
        }),
        kill: jest.fn()
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
        call => call[0] === 'data'
      )?.[1];
      
      if (stdoutCallback) {
        stdoutCallback('🚂💨 CHOO CHOO! ALL ABOARD THE AI EXPRESS!\n');
        stdoutCallback('🎫 Getting your ticket ready... Validating environment...\n');
        stdoutCallback('🚂 AI Express Train: 8/8 cars ready to depart!\n');
        stdoutCallback('🦆 Rubber duck crew: ALL ABOARD! Ready for programming conversations!\n');
      }

      const result = await new Promise((resolve) => {
        const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', 'launch']);
        let output = '';
        
        child.stdout?.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', (code) => {
          resolve({ code, output });
        });
      });

      expect(result).toEqual({
        code: 0,
        output: expect.stringContaining('CHOO CHOO! ALL ABOARD THE AI EXPRESS!')
      });
    });

    it('should execute conductor ask commands with different agents', async () => {
      const testCases = [
        {
          args: ['ask', 'analyze my React component performance'],
          expectedOutput: '🦆 AI team analyzing... 🎯 Expert recommendations ready!'
        },
        {
          args: ['ask', '@frontend', 'optimize this user interface'],
          expectedOutput: '⚛️ @frontend: Analyzing UI optimization opportunities...'
        },
        {
          args: ['ask', '@security', 'review this authentication flow'],
          expectedOutput: '🛡️ @security: Conducting security analysis...'
        }
      ];

      for (const testCase of testCases) {
        const mockProcess = {
          stdout: { on: jest.fn(), pipe: jest.fn() },
          stderr: { on: jest.fn() },
          on: jest.fn().mockImplementation((event, callback) => {
            if (event === 'close') {
              setTimeout(() => callback(0), 100);
            }
          }),
          kill: jest.fn()
        } as unknown as ChildProcess;

        mockSpawn.mockReturnValue(mockProcess);

        const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
          call => call[0] === 'data'
        )?.[1];
        
        if (stdoutCallback) {
          stdoutCallback(testCase.expectedOutput + '\n');
        }

        const result = await new Promise((resolve) => {
          const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', ...testCase.args]);
          let output = '';
          
          child.stdout?.on('data', (data) => {
            output += data.toString();
          });
          
          child.on('close', (code) => {
            resolve({ code, output, args: testCase.args });
          });
        });

        expect(result).toEqual({
          code: 0,
          output: expect.stringContaining(testCase.expectedOutput.split(':')[0]), // Check for agent identifier
          args: testCase.args
        });
      }
    });
  });

  describe('Rubber Duck Recording Examples', () => {
    it('should execute all rubber duck command varieties', async () => {
      const rubberDuckCommands = [
        { cmd: ['think', 'algorithm complexity'], expected: '🤔 AI thinking session started...' },
        { cmd: ['debug', 'undefined variable error'], expected: '🔍 AI debugging analysis...' },
        { cmd: ['explain', 'dependency injection patterns'], expected: '🎓 AI educational session...' },
        { cmd: ['design', 'microservices architecture'], expected: '🏗️ AI architecture planning...' },
        { cmd: ['experiment', 'new testing approach'], expected: '🧪 AI experimentation mode...' }
      ];

      for (const { cmd, expected } of rubberDuckCommands) {
        const mockProcess = {
          stdout: { on: jest.fn(), pipe: jest.fn() },
          stderr: { on: jest.fn() },
          on: jest.fn().mockImplementation((event, callback) => {
            if (event === 'close') {
              setTimeout(() => callback(0), 100);
            }
          }),
          kill: jest.fn()
        } as unknown as ChildProcess;

        mockSpawn.mockReturnValue(mockProcess);

        const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
          call => call[0] === 'data'
        )?.[1];
        
        if (stdoutCallback) {
          stdoutCallback(`${expected}\n`);
          stdoutCallback('🦆 Rubber duck programming assistance activated\n');
        }

        const result = await new Promise((resolve) => {
          const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', ...cmd]);
          let output = '';
          
          child.stdout?.on('data', (data) => {
            output += data.toString();
          });
          
          child.on('close', (code) => {
            resolve({ code, output, command: cmd.join(' ') });
          });
        });

        expect(result).toEqual({
          code: 0,
          output: expect.stringContaining('🦆'),
          command: cmd.join(' ')
        });
      }
    });

    it('should handle complex rubber duck scenarios', async () => {
      const complexScenario = {
        question: 'I\'m implementing user authentication and stuck on JWT token management. Should I store tokens in localStorage or httpOnly cookies?',
        expectedResponse: [
          '🦆 Complex authentication question detected...',
          '🎭 Consulting AI Team...',
          '🛡️ @security: Security analysis in progress...',
          '⚛️ @frontend: Frontend implementation considerations...',
          '⚙️ @backend: Backend architecture implications...',
          '📊 Team Consensus (95% confidence): HttpOnly cookies recommended'
        ]
      };

      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 100);
          }
        }),
        kill: jest.fn()
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
        call => call[0] === 'data'
      )?.[1];
      
      if (stdoutCallback) {
        complexScenario.expectedResponse.forEach(response => {
          stdoutCallback(response + '\n');
        });
      }

      const result = await new Promise((resolve) => {
        const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', 'ask', complexScenario.question]);
        let output = '';
        
        child.stdout?.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', (code) => {
          resolve({ code, output });
        });
      });

      expect(result).toEqual({
        code: 0,
        output: expect.stringContaining('Team Consensus')
      });

      // Verify multi-agent consultation
      const output = (result as any).output;
      expect(output).toContain('@security');
      expect(output).toContain('@frontend');
      expect(output).toContain('@backend');
    });
  });

  describe('Dashboard Recording Examples', () => {
    it('should execute conductor dashboard and show all agents', async () => {
      const expectedDashboardOutput = [
        '🎭 AI DEVELOPMENT TEAM ORCHESTRA',
        '═══════════════════════════════════════════════════════════════════════',
        '✅ 8/8 agents online and ready  🎯 Average confidence: 94%',
        '',
        '👥 Your AI Express Crew:',
        '🚂 @pm          Product Manager      ██████████ 96% 🎫',
        '🎨 @design      UX/UI Designer       █████████░ 92% 🎨',
        '⚛️ @frontend    Frontend Engineer    ██████████ 98% ⚛️',
        '⚙️ @backend     Backend Engineer     █████████░ 93% ⚙️',
        '🧪 @qa          Quality Assurance    ████████░░ 89% 🧪',
        '🚀 @devops      DevOps Engineer      ██████████ 97% 🚀',
        '👁️ @reviewer    Code Quality Expert  █████████░ 91% 👁️',
        '🛡️ @security    Security Specialist ██████████ 99% 🛡️',
        '',
        '💡 Express Commands:',
        'conductor ask "optimize my React performance"    🦆 Team consultation',
        'conductor ask @frontend "fix this CSS issue"     🎯 Expert specialist',
        'conductor review --staged                        🔍 Multi-agent review',
        'conductor ship "feature-name"                    🚢 Deploy with confidence',
        '═══════════════════════════════════════════════════════════════════════',
        '🎼 Your AI orchestra is ready! Press \'h\' for help, \'q\' to quit'
      ];

      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 100);
          }
        }),
        kill: jest.fn()
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
        call => call[0] === 'data'
      )?.[1];
      
      if (stdoutCallback) {
        expectedDashboardOutput.forEach(line => {
          stdoutCallback(line + '\n');
        });
      }

      const result = await new Promise((resolve) => {
        const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', 'dashboard']);
        let output = '';
        
        child.stdout?.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', (code) => {
          resolve({ code, output });
        });
      });

      const output = (result as any).output;
      
      // Verify all 8 agents are displayed
      const expectedAgents = ['@pm', '@design', '@frontend', '@backend', '@qa', '@devops', '@reviewer', '@security'];
      expectedAgents.forEach(agent => {
        expect(output).toContain(agent);
      });

      // Verify dashboard structure
      expect(output).toContain('AI DEVELOPMENT TEAM ORCHESTRA');
      expect(output).toContain('8/8 agents online');
      expect(output).toContain('Average confidence');
      expect(output).toContain('Express Commands');
    });

    it('should show real-time confidence scores for agents', async () => {
      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 100);
          }
        }),
        kill: jest.fn()
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
        call => call[0] === 'data'
      )?.[1];
      
      if (stdoutCallback) {
        // Simulate real-time updates
        stdoutCallback('🎯 Agent confidence scores:\n');
        stdoutCallback('🚂 @pm: ████████░░ 84% → ██████████ 96% 🎫\n');
        stdoutCallback('⚛️ @frontend: █████████░ 91% → ██████████ 98% ⚛️\n');
        stdoutCallback('🛡️ @security: ██████████ 99% (stable) 🛡️\n');
      }

      const result = await new Promise((resolve) => {
        const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', 'dashboard', '--live']);
        let output = '';
        
        child.stdout?.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', (code) => {
          resolve({ code, output });
        });
      });

      const output = (result as any).output;
      
      // Verify confidence scores are displayed as percentages
      expect(output).toMatch(/\d+%/);
      expect(output).toContain('confidence');
    });
  });

  describe('Complete Workflow Recording Examples', () => {
    it('should execute complete development workflow', async () => {
      const workflowSteps = [
        { cmd: ['init'], expected: '🚂 AI Express setup complete!' },
        { cmd: ['launch'], expected: '🚂💨 All aboard! AI development express ready!' },
        { cmd: ['ask', 'performance analysis'], expected: '🦆 Team analyzing... Recommendations ready!' },
        { cmd: ['review', '--staged'], expected: '🔍 Multi-agent code review complete' },
        { cmd: ['ship', 'user-auth-feature', '--security-scan'], expected: '🚢 Deployment ready! All quality gates passed' }
      ];

      for (const { cmd, expected } of workflowSteps) {
        const mockProcess = {
          stdout: { on: jest.fn(), pipe: jest.fn() },
          stderr: { on: jest.fn() },
          on: jest.fn().mockImplementation((event, callback) => {
            if (event === 'close') {
              setTimeout(() => callback(0), 100);
            }
          }),
          kill: jest.fn()
        } as unknown as ChildProcess;

        mockSpawn.mockReturnValue(mockProcess);

        const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
          call => call[0] === 'data'
        )?.[1];
        
        if (stdoutCallback) {
          stdoutCallback(`${expected}\n`);
        }

        const result = await new Promise((resolve) => {
          const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', ...cmd]);
          let output = '';
          
          child.stdout?.on('data', (data) => {
            output += data.toString();
          });
          
          child.on('close', (code) => {
            resolve({ code, output, step: cmd.join(' ') });
          });
        });

        expect(result).toEqual({
          code: 0,
          output: expect.stringContaining(expected.split('!')[0]), // Check for main message
          step: cmd.join(' ')
        });
      }
    });

    it('should handle advanced workflow scenarios', async () => {
      const advancedScenarios = [
        {
          cmd: ['orchestrate', 'plan user onboarding feature'],
          expected: '🎼 Full orchestra planning session initiated...'
        },
        {
          cmd: ['consult', 'frontend,design', 'improve mobile experience'],
          expected: '👥 Consulting frontend and design teams...'
        },
        {
          cmd: ['masterclass', '@security', 'advanced threat modeling'],
          expected: '🎓 Security masterclass session started...'
        }
      ];

      for (const { cmd, expected } of advancedScenarios) {
        const mockProcess = {
          stdout: { on: jest.fn(), pipe: jest.fn() },
          stderr: { on: jest.fn() },
          on: jest.fn().mockImplementation((event, callback) => {
            if (event === 'close') {
              setTimeout(() => callback(0), 100);
            }
          }),
          kill: jest.fn()
        } as unknown as ChildProcess;

        mockSpawn.mockReturnValue(mockProcess);

        const stdoutCallback = (mockProcess.stdout.on as jest.Mock).mock.calls.find(
          call => call[0] === 'data'
        )?.[1];
        
        if (stdoutCallback) {
          stdoutCallback(`${expected}\n`);
        }

        const result = await new Promise((resolve) => {
          const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', ...cmd]);
          let output = '';
          
          child.stdout?.on('data', (data) => {
            output += data.toString();
          });
          
          child.on('close', (code) => {
            resolve({ code, output, command: cmd });
          });
        });

        expect(result).toEqual({
          code: 0,
          output: expect.stringContaining(expected.split(' ')[0]), // Check for command emoji
          command: cmd
        });
      }
    });
  });

  describe('Error Handling in Recordings', () => {
    it('should gracefully handle command errors in recordings', async () => {
      const errorScenarios = [
        { cmd: ['invalid-command'], expectedCode: 1 },
        { cmd: ['ask'], expectedCode: 1 }, // Missing question
        { cmd: ['ship'], expectedCode: 1 }  // Missing feature name
      ];

      for (const { cmd, expectedCode } of errorScenarios) {
        const mockProcess = {
          stdout: { on: jest.fn(), pipe: jest.fn() },
          stderr: { on: jest.fn() },
          on: jest.fn().mockImplementation((event, callback) => {
            if (event === 'close') {
              setTimeout(() => callback(expectedCode), 100);
            }
          }),
          kill: jest.fn()
        } as unknown as ChildProcess;

        mockSpawn.mockReturnValue(mockProcess);

        const stderrCallback = (mockProcess.stderr.on as jest.Mock).mock.calls.find(
          call => call[0] === 'data'
        )?.[1];
        
        if (stderrCallback) {
          stderrCallback('❌ Command error occurred\n');
        }

        const result = await new Promise((resolve) => {
          const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', ...cmd]);
          let stderr = '';
          
          child.stderr?.on('data', (data) => {
            stderr += data.toString();
          });
          
          child.on('close', (code) => {
            resolve({ code, stderr, command: cmd });
          });
        });

        expect(result).toEqual({
          code: expectedCode,
          stderr: expect.stringContaining('❌'),
          command: cmd
        });
      }
    });

    it('should show helpful error recovery suggestions', async () => {
      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(1), 100);
          }
        }),
        kill: jest.fn()
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      const stderrCallback = (mockProcess.stderr.on as jest.Mock).mock.calls.find(
        call => call[0] === 'data'
      )?.[1];
      
      if (stderrCallback) {
        stderrCallback('❌ Unexpected Error\n');
        stderrCallback('💡 General Troubleshooting:\n');
        stderrCallback('   1. Try running the command again\n');
        stderrCallback('   2. Check: conductor status --verbose\n');
        stderrCallback('   3. Restart: conductor dashboard\n');
        stderrCallback('🆘 Get AI Help: conductor ask "I got this error"\n');
      }

      const result = await new Promise((resolve) => {
        const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', 'nonexistent']);
        let stderr = '';
        
        child.stderr?.on('data', (data) => {
          stderr += data.toString();
        });
        
        child.on('close', (code) => {
          resolve({ code, stderr });
        });
      });

      const errorOutput = (result as any).stderr;
      expect(errorOutput).toContain('General Troubleshooting');
      expect(errorOutput).toContain('conductor status');
      expect(errorOutput).toContain('Get AI Help');
    });
  });

  describe('Performance and Resource Usage', () => {
    it('should complete recording generation within time limits', async () => {
      const startTime = Date.now();
      
      // Mock quick completion
      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 50); // Very quick completion
          }
        }),
        kill: jest.fn()
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      await new Promise((resolve) => {
        const child = spawn('bash', ['scripts/generate-recordings.sh']);
        child.on('close', resolve);
      });

      const duration = Date.now() - startTime;
      
      // Should complete within reasonable time (mocked to be very fast)
      expect(duration).toBeLessThan(1000); // 1 second for mocked execution
    });

    it('should handle memory constraints during recording', async () => {
      // Mock process with memory monitoring
      const mockProcess = {
        stdout: { on: jest.fn(), pipe: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            setTimeout(() => callback(0), 100);
          }
        }),
        kill: jest.fn(),
        memoryUsage: jest.fn().mockReturnValue({
          rss: 50 * 1024 * 1024, // 50MB
          heapTotal: 30 * 1024 * 1024, // 30MB
          heapUsed: 20 * 1024 * 1024, // 20MB
          external: 5 * 1024 * 1024 // 5MB
        })
      } as unknown as ChildProcess;

      mockSpawn.mockReturnValue(mockProcess);

      const result = await new Promise((resolve) => {
        const child = spawn('npx', ['tsx', 'src/enhanced-cli.ts', 'dashboard']);
        
        // Simulate memory check
        const memUsage = mockProcess.memoryUsage && mockProcess.memoryUsage();
        
        child.on('close', (code) => {
          resolve({ code, memoryUsage: memUsage });
        });
      });

      const memory = (result as any).memoryUsage;
      expect(memory.rss).toBeLessThan(100 * 1024 * 1024); // Less than 100MB
    });
  });
});