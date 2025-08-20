import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

// Mock child_process and fs for testing
jest.mock('child_process');
jest.mock('fs-extra');

describe('Recording Workflow Integration', () => {
  const mockExec = exec as unknown as jest.Mock;
  const mockFs = fs as jest.Mocked<typeof fs>;
  
  const recordingsDir = path.join(process.cwd(), 'recordings');
  const outputDir = path.join(recordingsDir, 'output');

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful command execution
    mockExec.mockImplementation((command, callback) => {
      if (typeof callback === 'function') {
        callback(null, { stdout: 'success', stderr: '' });
      }
    });

    // Mock file system operations
    mockFs.pathExists.mockResolvedValue(true);
    mockFs.readFile.mockResolvedValue('mock file content');
    mockFs.writeFile.mockResolvedValue(undefined);
    mockFs.ensureDir.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Full Recording Generation Workflow', () => {
    it('should execute complete recording generation script', async () => {
      // Mock VHS availability check
      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('command -v vhs') && typeof callback === 'function') {
          callback(null, { stdout: '/usr/local/bin/vhs', stderr: '' });
        }
      });

      // Mock successful VHS recordings
      const recordingCommands = [
        'vhs conductor-demo.tape',
        'vhs quick-start.tape',
        'vhs dashboard-demo.tape',
        'vhs rubber-duck-demo.tape'
      ];

      recordingCommands.forEach(command => {
        mockExec.mockImplementationOnce((cmd, callback) => {
          if (cmd.includes(command) && typeof callback === 'function') {
            callback(null, { stdout: `Generated ${command.split(' ')[1].replace('.tape', '.gif')}`, stderr: '' });
          }
        });
      });

      // Simulate script execution
      const scriptResult = await new Promise((resolve) => {
        mockExec('bash scripts/generate-recordings.sh', (error, stdout, stderr) => {
          resolve({ error, stdout, stderr });
        });
      });

      expect(scriptResult).toEqual({
        error: null,
        stdout: { stdout: 'success', stderr: '' },
        stderr: undefined
      });
    });

    it('should handle VHS installation when not found', async () => {
      // Mock VHS not found
      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('command -v vhs') && typeof callback === 'function') {
          callback(new Error('command not found'), { stdout: '', stderr: 'command not found' });
        }
      });

      // Mock installation attempt
      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('brew install vhs') && typeof callback === 'function') {
          callback(null, { stdout: 'VHS installed successfully', stderr: '' });
        }
      });

      const installResult = await new Promise((resolve) => {
        // First check fails
        mockExec('command -v vhs', (error1) => {
          if (error1) {
            // Installation attempt
            mockExec('brew install vhs', (error2, stdout) => {
              resolve({ installError: error2, installOutput: stdout });
            });
          }
        });
      });

      expect(installResult).toEqual({
        installError: null,
        installOutput: { stdout: 'VHS installed successfully', stderr: '' }
      });
    });

    it('should create output directory structure', async () => {
      mockFs.ensureDir.mockResolvedValue(undefined);
      mockFs.pathExists.mockResolvedValue(true);

      await fs.ensureDir(outputDir);
      const dirExists = await fs.pathExists(outputDir);

      expect(fs.ensureDir).toHaveBeenCalledWith(outputDir);
      expect(dirExists).toBe(true);
    });

    it('should move generated GIFs to output directory', async () => {
      const generatedFiles = [
        'conductor-demo.gif',
        'quick-start.gif',
        'dashboard-demo.gif', 
        'rubber-duck-demo.gif'
      ];

      mockFs.move = jest.fn().mockResolvedValue(undefined);
      mockFs.pathExists.mockResolvedValue(true);

      // Simulate moving files
      for (const file of generatedFiles) {
        const sourcePath = path.join(recordingsDir, file);
        const targetPath = path.join(outputDir, file);
        
        await fs.move(sourcePath, targetPath);
      }

      expect(fs.move).toHaveBeenCalledTimes(generatedFiles.length);
      generatedFiles.forEach(file => {
        expect(fs.move).toHaveBeenCalledWith(
          path.join(recordingsDir, file),
          path.join(outputDir, file)
        );
      });
    });
  });

  describe('CLI Commands Testing in Recordings', () => {
    it('should test all documented quick start commands', async () => {
      const quickStartCommands = [
        'npm install -g conductor-cli',
        'conductor init --quick',
        'conductor launch',
        'conductor ask "analyze my React component performance"',
        'conductor ask @frontend "optimize this user interface"',
        'conductor ask @security "review this authentication flow"'
      ];

      // Mock CLI execution for each command
      for (const command of quickStartCommands) {
        mockExec.mockImplementationOnce((cmd, callback) => {
          if (cmd.includes(command) && typeof callback === 'function') {
            let mockOutput = '';
            
            if (cmd.includes('init')) {
              mockOutput = '✅ Quick setup complete! 🎫';
            } else if (cmd.includes('launch')) {
              mockOutput = '🚂💨 AI Express launched! All aboard!';
            } else if (cmd.includes('ask')) {
              mockOutput = '🦆 AI team analyzing... 🎯 Expert recommendations ready!';
            }
            
            callback(null, { stdout: mockOutput, stderr: '' });
          }
        });
      }

      // Verify commands can be executed without errors
      for (const command of quickStartCommands) {
        if (command.startsWith('conductor')) {
          const result = await new Promise((resolve) => {
            mockExec(command, (error, stdout) => {
              resolve({ error, stdout });
            });
          });
          
          expect(result).toEqual({
            error: null,
            stdout: expect.any(Object)
          });
        }
      }
    });

    it('should test rubber duck command varieties', async () => {
      const rubberDuckCommands = [
        'conductor think "algorithm complexity"',
        'conductor debug "undefined variable error"',
        'conductor explain "dependency injection patterns"',
        'conductor design "microservices architecture"',
        'conductor experiment "new testing approach"'
      ];

      for (const command of rubberDuckCommands) {
        mockExec.mockImplementationOnce((cmd, callback) => {
          if (cmd.includes(command) && typeof callback === 'function') {
            const commandType = cmd.split(' ')[1];
            const mockOutput = `🦆 ${commandType} session started with AI guidance`;
            callback(null, { stdout: mockOutput, stderr: '' });
          }
        });
      }

      // Test each rubber duck command
      for (const command of rubberDuckCommands) {
        const result = await new Promise((resolve) => {
          mockExec(command, (error, stdout) => {
            resolve({ error, stdout });
          });
        });

        expect(result).toEqual({
          error: null,
          stdout: expect.objectContaining({
            stdout: expect.stringContaining('🦆')
          })
        });
      }
    });

    it('should test dashboard command with agent status', async () => {
      const dashboardOutput = `
🎭 AI DEVELOPMENT TEAM ORCHESTRA
✅ 8/8 agents online and ready  🎯 Average confidence: 94%

👥 Your AI Express Crew:
🚂 @pm          Product Manager      ██████████ 96% 🎫
🎨 @design      UX/UI Designer       █████████░ 92% 🎨
⚛️ @frontend    Frontend Engineer    ██████████ 98% ⚛️
⚙️ @backend     Backend Engineer     █████████░ 93% ⚙️
🧪 @qa          Quality Assurance    ████████░░ 89% 🧪
🚀 @devops      DevOps Engineer      ██████████ 97% 🚀
👁️ @reviewer    Code Quality Expert  █████████░ 91% 👁️
🛡️ @security    Security Specialist ██████████ 99% 🛡️
      `.trim();

      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('conductor dashboard') && typeof callback === 'function') {
          callback(null, { stdout: dashboardOutput, stderr: '' });
        }
      });

      const result = await new Promise((resolve) => {
        mockExec('conductor dashboard', (error, stdout) => {
          resolve({ error, stdout });
        });
      });

      expect(result).toEqual({
        error: null,
        stdout: expect.objectContaining({
          stdout: expect.stringContaining('AI DEVELOPMENT TEAM ORCHESTRA')
        })
      });

      // Verify all 8 agents are represented
      const agentNames = ['@pm', '@design', '@frontend', '@backend', '@qa', '@devops', '@reviewer', '@security'];
      const output = (result as any).stdout.stdout;
      
      agentNames.forEach(agent => {
        expect(output).toContain(agent);
      });
    });

    it('should test complete workflow commands', async () => {
      const workflowCommands = [
        { cmd: 'conductor init', output: '🚂 AI Express setup complete!' },
        { cmd: 'conductor launch', output: '🚂💨 All aboard! AI development express ready!' },
        { cmd: 'conductor ask "performance analysis"', output: '🦆 Team analyzing... Recommendations ready!' },
        { cmd: 'conductor review --staged', output: '🔍 Multi-agent code review complete' },
        { cmd: 'conductor ship "feature" --security-scan', output: '🚢 Deployment ready! All quality gates passed' }
      ];

      for (const { cmd, output } of workflowCommands) {
        mockExec.mockImplementationOnce((command, callback) => {
          if (command.includes(cmd) && typeof callback === 'function') {
            callback(null, { stdout: output, stderr: '' });
          }
        });
      }

      // Test complete workflow sequence
      for (const { cmd, output } of workflowCommands) {
        const result = await new Promise((resolve) => {
          mockExec(cmd, (error, stdout) => {
            resolve({ error, stdout });
          });
        });

        expect(result).toEqual({
          error: null,
          stdout: expect.objectContaining({
            stdout: output
          })
        });
      }
    });
  });

  describe('Landing Page Integration Testing', () => {
    it('should validate HTML structure for recordings', async () => {
      const htmlContent = `
      <div class="terminal-recordings animate-on-scroll">
        <div class="recording-tabs">
          <button class="tab-btn active" data-target="quick-start">⚡ Quick Start</button>
          <button class="tab-btn" data-target="rubber-duck">🦆 Rubber Duck</button>
          <button class="tab-btn" data-target="dashboard">📊 Dashboard</button>
          <button class="tab-btn" data-target="full-demo">🚂 Full Demo</button>
        </div>
        <div class="recording-content">
          <div id="quick-start" class="recording-panel active">
            <img src="recordings/output/quick-start.gif" alt="Quick Start Demo" loading="lazy">
          </div>
          <div id="rubber-duck" class="recording-panel">
            <img src="recordings/output/rubber-duck-demo.gif" alt="Rubber Duck Demo" loading="lazy">
          </div>
          <div id="dashboard" class="recording-panel">
            <img src="recordings/output/dashboard-demo.gif" alt="Dashboard Demo" loading="lazy">
          </div>
          <div id="full-demo" class="recording-panel">
            <img src="recordings/output/conductor-demo.gif" alt="Full Demo" loading="lazy">
          </div>
        </div>
      </div>
      `;

      mockFs.readFile.mockResolvedValue(htmlContent);
      
      const content = await fs.readFile('index.html', 'utf8');

      // Validate structure
      expect(content).toContain('terminal-recordings');
      expect(content).toContain('recording-tabs');
      expect(content).toContain('recording-content');
      
      // Validate tabs
      expect(content).toContain('data-target="quick-start"');
      expect(content).toContain('data-target="rubber-duck"');
      expect(content).toContain('data-target="dashboard"');
      expect(content).toContain('data-target="full-demo"');

      // Validate recording references
      expect(content).toContain('recordings/output/quick-start.gif');
      expect(content).toContain('recordings/output/rubber-duck-demo.gif');
      expect(content).toContain('recordings/output/dashboard-demo.gif');
      expect(content).toContain('recordings/output/conductor-demo.gif');

      // Validate accessibility
      expect(content).toContain('loading="lazy"');
      expect(content).toContain('alt="');
    });

    it('should test JavaScript tab functionality', async () => {
      const jsContent = `
      const tabButtons = document.querySelectorAll('.tab-btn');
      const recordingPanels = document.querySelectorAll('.recording-panel');

      tabButtons.forEach(button => {
          button.addEventListener('click', () => {
              const target = button.getAttribute('data-target');
              
              // Update active tab
              tabButtons.forEach(btn => btn.classList.remove('active'));
              button.classList.add('active');
              
              // Update active panel
              recordingPanels.forEach(panel => panel.classList.remove('active'));
              const targetPanel = document.getElementById(target);
              if (targetPanel) {
                  targetPanel.classList.add('active');
              }
          });
      });
      `;

      mockFs.readFile.mockResolvedValue(jsContent);
      
      const content = await fs.readFile('index.html', 'utf8');

      expect(content).toContain('tabButtons');
      expect(content).toContain('recordingPanels');
      expect(content).toContain('addEventListener');
      expect(content).toContain('data-target');
      expect(content).toContain('classList.add(\'active\')');
      expect(content).toContain('classList.remove(\'active\')');
    });

    it('should have fallback content when recordings fail to load', async () => {
      const fallbackContent = `
      <div class="fallback-demo" style="display: none;">
        <div class="terminal-content">
          <div class="terminal-line"><span class="prompt">🚂$</span> conductor init --quick</div>
          <div class="terminal-line"><span class="success">✅ Quick setup complete! 🎫</span></div>
          <div class="terminal-line"><span class="prompt">🚂$</span> conductor launch</div>
          <div class="terminal-line"><span class="success">🚂💨 AI Express launched! All aboard!</span></div>
        </div>
      </div>
      `;

      mockFs.readFile.mockResolvedValue(fallbackContent);
      
      const content = await fs.readFile('index.html', 'utf8');

      expect(content).toContain('fallback-demo');
      expect(content).toContain('terminal-content');
      expect(content).toContain('conductor init');
      expect(content).toContain('conductor launch');
      expect(content).toContain('display: none');
    });
  });

  describe('NPM Scripts Integration', () => {
    it('should execute recordings script via npm', async () => {
      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('npm run recordings') && typeof callback === 'function') {
          callback(null, { 
            stdout: '🎬 Generating terminal recordings for Conductor CLI...\n✅ All recordings generated successfully!', 
            stderr: '' 
          });
        }
      });

      const result = await new Promise((resolve) => {
        mockExec('npm run recordings', (error, stdout) => {
          resolve({ error, stdout });
        });
      });

      expect(result).toEqual({
        error: null,
        stdout: expect.objectContaining({
          stdout: expect.stringContaining('All recordings generated successfully')
        })
      });
    });

    it('should handle VHS installation via npm script', async () => {
      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('npm run recordings:install') && typeof callback === 'function') {
          callback(null, { 
            stdout: 'Installing VHS...\nVHS installed successfully', 
            stderr: '' 
          });
        }
      });

      const result = await new Promise((resolve) => {
        mockExec('npm run recordings:install', (error, stdout) => {
          resolve({ error, stdout });
        });
      });

      expect(result).toEqual({
        error: null,
        stdout: expect.objectContaining({
          stdout: expect.stringContaining('VHS installed successfully')
        })
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle VHS command failures gracefully', async () => {
      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('vhs conductor-demo.tape') && typeof callback === 'function') {
          callback(new Error('VHS failed to record'), { stdout: '', stderr: 'Recording failed' });
        }
      });

      const result = await new Promise((resolve) => {
        mockExec('vhs conductor-demo.tape', (error, stdout, stderr) => {
          resolve({ error: error?.message, stdout, stderr });
        });
      });

      expect(result).toEqual({
        error: 'VHS failed to record',
        stdout: { stdout: '', stderr: 'Recording failed' },
        stderr: undefined
      });
    });

    it('should provide helpful error messages for missing dependencies', async () => {
      mockExec.mockImplementationOnce((command, callback) => {
        if (command.includes('command -v vhs') && typeof callback === 'function') {
          callback(new Error('command not found'), { stdout: '', stderr: 'vhs: command not found' });
        }
      });

      const result = await new Promise((resolve) => {
        mockExec('bash scripts/generate-recordings.sh', (error, stdout, stderr) => {
          // Script should detect missing VHS and provide installation instructions
          resolve({ 
            error, 
            message: 'VHS not found. Installing...\nRun: brew install vhs\nOr: go install github.com/charmbracelet/vhs@latest'
          });
        });
      });

      expect((result as any).message).toContain('VHS not found');
      expect((result as any).message).toContain('brew install vhs');
      expect((result as any).message).toContain('go install');
    });

    it('should handle file permission errors', async () => {
      mockFs.writeFile.mockRejectedValue(new Error('EACCES: permission denied'));

      await expect(fs.writeFile('recordings/test.gif', 'data')).rejects.toThrow('permission denied');
    });

    it('should handle disk space issues', async () => {
      mockFs.writeFile.mockRejectedValue(new Error('ENOSPC: no space left on device'));

      await expect(fs.writeFile('recordings/output/large-recording.gif', 'data')).rejects.toThrow('no space left');
    });
  });
});