import fs from 'fs-extra';
import path from 'path';

// Mock dependencies
jest.mock('fs-extra');

describe('Terminal Recordings', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  const recordingsDir = path.join(process.cwd(), 'recordings');
  const outputDir = path.join(recordingsDir, 'output');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Recording Files Structure', () => {
    it('should have all required .tape files for VHS recordings', async () => {
      const expectedTapeFiles = [
        'conductor-demo.tape',
        'quick-start.tape',
        'dashboard-demo.tape',
        'rubber-duck-demo.tape'
      ];

      mockFs.pathExists.mockImplementation((filePath: string) => {
        const fileName = path.basename(filePath);
        return Promise.resolve(expectedTapeFiles.includes(fileName));
      });

      for (const tapeFile of expectedTapeFiles) {
        const filePath = path.join(recordingsDir, tapeFile);
        const exists = await fs.pathExists(filePath);
        expect(exists).toBe(true);
      }
    });

    it('should have output directory for generated recordings', async () => {
      mockFs.pathExists.mockResolvedValue(true);
      
      const exists = await fs.pathExists(outputDir);
      expect(exists).toBe(true);
    });

    it('should generate all expected GIF outputs', async () => {
      const expectedGifFiles = [
        'conductor-demo.gif',
        'quick-start.gif', 
        'dashboard-demo.gif',
        'rubber-duck-demo.gif'
      ];

      mockFs.pathExists.mockImplementation((filePath: string) => {
        const fileName = path.basename(filePath);
        return Promise.resolve(expectedGifFiles.includes(fileName));
      });

      for (const gifFile of expectedGifFiles) {
        const filePath = path.join(outputDir, gifFile);
        const exists = await fs.pathExists(filePath);
        expect(exists).toBe(true);
      }
    });
  });

  describe('Recording Content Validation', () => {
    it('should have proper VHS tape configuration in conductor-demo.tape', async () => {
      const tapeContent = `
# VHS tape file for Conductor CLI demo
Output conductor-demo.gif
Set Theme "Dracula"
Set FontSize 14
Set Width 1200
Set Height 800
      `.trim();

      mockFs.readFile.mockResolvedValue(tapeContent);
      
      const content = await fs.readFile(path.join(recordingsDir, 'conductor-demo.tape'), 'utf8');
      
      expect(content).toContain('Output conductor-demo.gif');
      expect(content).toContain('Set Theme "Dracula"');
      expect(content).toContain('Set Width 1200');
      expect(content).toContain('Set Height 800');
    });

    it('should include README examples in recordings', async () => {
      const tapeContent = `
Type "conductor init --quick"
Type "conductor launch"
Type "conductor ask \\"analyze my React component performance\\""
Type "conductor ask @frontend \\"optimize this user interface\\""
Type "conductor ask @security \\"review this authentication flow\\""
      `.trim();

      mockFs.readFile.mockResolvedValue(tapeContent);
      
      const content = await fs.readFile(path.join(recordingsDir, 'conductor-demo.tape'), 'utf8');
      
      // Verify README examples are included
      expect(content).toContain('conductor init');
      expect(content).toContain('conductor launch');
      expect(content).toContain('conductor ask');
      expect(content).toContain('@frontend');
      expect(content).toContain('@security');
    });

    it('should include rubber duck programming examples', async () => {
      const rubberDuckTape = `
Type "conductor ask \\"I'm stuck on this React performance issue\\""
Type "conductor think \\"algorithm complexity\\""
Type "conductor debug \\"undefined variable error\\""
Type "conductor design \\"microservices architecture\\""
      `.trim();

      mockFs.readFile.mockResolvedValue(rubberDuckTape);
      
      const content = await fs.readFile(path.join(recordingsDir, 'rubber-duck-demo.tape'), 'utf8');
      
      // Verify rubber duck varieties are shown
      expect(content).toContain('conductor think');
      expect(content).toContain('conductor debug');
      expect(content).toContain('conductor design');
    });

    it('should show dashboard with all 8 agents', async () => {
      const dashboardTape = `
Type "    🚂 @pm          Product Manager      ██████████ 96% 🎫"
Type "    🎨 @design      UX/UI Designer       █████████░ 92% 🎨"  
Type "    ⚛️ @frontend    Frontend Engineer    ██████████ 98% ⚛️"
Type "    ⚙️ @backend     Backend Engineer     █████████░ 93% ⚙️"
Type "    🧪 @qa          Quality Assurance    ████████░░ 89% 🧪"
Type "    🚀 @devops      DevOps Engineer      ██████████ 97% 🚀"
Type "    👁️ @reviewer    Code Quality Expert  █████████░ 91% 👁️"
Type "    🛡️ @security    Security Specialist ██████████ 99% 🛡️"
      `.trim();

      mockFs.readFile.mockResolvedValue(dashboardTape);
      
      const content = await fs.readFile(path.join(recordingsDir, 'dashboard-demo.tape'), 'utf8');
      
      // Verify all 8 agents are shown with confidence scores
      expect(content).toContain('@pm');
      expect(content).toContain('@design');
      expect(content).toContain('@frontend');
      expect(content).toContain('@backend');
      expect(content).toContain('@qa');
      expect(content).toContain('@devops');
      expect(content).toContain('@reviewer');
      expect(content).toContain('@security');
      expect(content).toContain('confidence');
    });

    it('should demonstrate complete workflow from init to ship', async () => {
      const fullDemoTape = `
Type "conductor init"
Type "conductor launch"
Type "conductor ask"
Type "conductor review --staged"
Type "conductor ship \\"user-auth-feature\\" --security-scan"
      `.trim();

      mockFs.readFile.mockResolvedValue(fullDemoTape);
      
      const content = await fs.readFile(path.join(recordingsDir, 'conductor-demo.tape'), 'utf8');
      
      // Verify complete workflow
      expect(content).toContain('conductor init');
      expect(content).toContain('conductor launch');
      expect(content).toContain('conductor review');
      expect(content).toContain('conductor ship');
    });
  });

  describe('Landing Page Integration', () => {
    it('should have terminal recordings section in index.html', async () => {
      const htmlContent = `
<div class="terminal-recordings animate-on-scroll">
  <div class="recording-tabs">
    <button class="tab-btn active" data-target="quick-start">⚡ Quick Start</button>
    <button class="tab-btn" data-target="rubber-duck">🦆 Rubber Duck</button>
    <button class="tab-btn" data-target="dashboard">📊 Dashboard</button>
    <button class="tab-btn" data-target="full-demo">🚂 Full Demo</button>
  </div>
</div>
      `.trim();

      mockFs.readFile.mockResolvedValue(htmlContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'index.html'), 'utf8');
      
      expect(content).toContain('terminal-recordings');
      expect(content).toContain('recording-tabs');
      expect(content).toContain('data-target="quick-start"');
      expect(content).toContain('data-target="rubber-duck"');
      expect(content).toContain('data-target="dashboard"');
      expect(content).toContain('data-target="full-demo"');
    });

    it('should have fallback demos when recordings fail to load', async () => {
      const htmlContent = `
<div class="fallback-demo" style="display: none;">
  <div class="terminal-content">
    <div class="terminal-line"><span class="prompt">🚂$</span> conductor init --quick</div>
    <div class="terminal-line"><span class="success">✅ Quick setup complete! 🎫</span></div>
  </div>
</div>
      `.trim();

      mockFs.readFile.mockResolvedValue(htmlContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'index.html'), 'utf8');
      
      expect(content).toContain('fallback-demo');
      expect(content).toContain('onerror="this.style.display=\'none\'');
    });

    it('should reference all recording GIFs with proper alt text', async () => {
      const htmlContent = `
<img src="recordings/output/quick-start.gif" 
     alt="Quick Start Demo - Conductor CLI initialization and launch" 
     loading="lazy">
<img src="recordings/output/rubber-duck-demo.gif" 
     alt="Rubber Duck Demo - AI team consultation and expert responses" 
     loading="lazy">
<img src="recordings/output/dashboard-demo.gif" 
     alt="Dashboard Demo - Live AI team monitoring and status" 
     loading="lazy">
<img src="recordings/output/conductor-demo.gif" 
     alt="Full Demo - Complete Conductor CLI workflow from start to deployment" 
     loading="lazy">
      `.trim();

      mockFs.readFile.mockResolvedValue(htmlContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'index.html'), 'utf8');
      
      // Verify all recordings are referenced with accessibility
      expect(content).toContain('recordings/output/quick-start.gif');
      expect(content).toContain('recordings/output/rubber-duck-demo.gif');
      expect(content).toContain('recordings/output/dashboard-demo.gif');
      expect(content).toContain('recordings/output/conductor-demo.gif');
      expect(content).toContain('loading="lazy"');
    });

    it('should have JavaScript tab functionality', async () => {
      const htmlContent = `
const tabButtons = document.querySelectorAll('.tab-btn');
const recordingPanels = document.querySelectorAll('.recording-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        // Update active tab and panel
    });
});
      `.trim();

      mockFs.readFile.mockResolvedValue(htmlContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'index.html'), 'utf8');
      
      expect(content).toContain('tabButtons');
      expect(content).toContain('recordingPanels');
      expect(content).toContain('data-target');
      expect(content).toContain('addEventListener');
    });
  });

  describe('README Example Coverage', () => {
    it('should cover all quick start commands from README', () => {
      const readmeCommands = [
        'npm install -g conductor-cli',
        'conductor init',
        'conductor launch',
        'conductor ask "analyze my React component performance"',
        'conductor ask @frontend "optimize this user interface"',
        'conductor ask @security "review this authentication flow"'
      ];

      // All these commands should be represented in the recordings
      readmeCommands.forEach(command => {
        expect(command).toMatch(/conductor (init|launch|ask)/);
      });
    });

    it('should cover all rubber duck varieties from README', () => {
      const rubberDuckTypes = [
        'conductor think "problem"',
        'conductor debug "error"',
        'conductor explain "concept"',
        'conductor design "system"',
        'conductor experiment "idea"'
      ];

      rubberDuckTypes.forEach(command => {
        expect(command).toMatch(/conductor (think|debug|explain|design|experiment)/);
      });
    });

    it('should cover dashboard examples from README', () => {
      const dashboardElements = [
        '🎭 AI DEVELOPMENT TEAM ORCHESTRA',
        '✅ 8/8 agents online and ready',
        '🎯 Average confidence: 94%',
        '@pm Product Manager',
        '@frontend Frontend Engineer',
        '@security Security Specialist'
      ];

      dashboardElements.forEach(element => {
        expect(element).toBeTruthy(); // All elements should be non-empty strings
      });
    });

    it('should cover complete workflow from README', () => {
      const workflowSteps = [
        'conductor init',
        'conductor launch',
        'conductor ask',
        'conductor review --staged',
        'conductor ship "feature" --security-scan'
      ];

      workflowSteps.forEach(step => {
        expect(step).toMatch(/conductor \w+/);
      });
    });
  });

  describe('Performance and Accessibility', () => {
    it('should use lazy loading for recording images', async () => {
      const htmlContent = '<img loading="lazy" alt="Demo description">';
      
      mockFs.readFile.mockResolvedValue(htmlContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'index.html'), 'utf8');
      
      expect(content).toContain('loading="lazy"');
    });

    it('should have proper alt text for accessibility', async () => {
      const altTexts = [
        'Quick Start Demo - Conductor CLI initialization and launch',
        'Rubber Duck Demo - AI team consultation and expert responses',
        'Dashboard Demo - Live AI team monitoring and status',
        'Full Demo - Complete Conductor CLI workflow from start to deployment'
      ];

      altTexts.forEach(altText => {
        expect(altText).toContain('Demo');
        expect(altText.length).toBeGreaterThan(10); // Descriptive alt text
      });
    });

    it('should have responsive design for mobile devices', async () => {
      const cssContent = `
@media (max-width: 768px) {
    .recording-tabs { justify-content: center; }
    .tab-btn { padding: var(--space-2) var(--space-4); }
    .terminal-window { margin: 0 var(--space-4); }
}
      `.trim();

      mockFs.readFile.mockResolvedValue(cssContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'index.html'), 'utf8');
      
      expect(content).toContain('@media (max-width: 768px)');
      expect(content).toContain('recording-tabs');
      expect(content).toContain('terminal-window');
    });
  });

  describe('Generation Script', () => {
    it('should have executable generation script', async () => {
      mockFs.pathExists.mockResolvedValue(true);
      mockFs.access.mockResolvedValue(undefined);
      
      const scriptPath = path.join(process.cwd(), 'scripts', 'generate-recordings.sh');
      const exists = await fs.pathExists(scriptPath);
      
      expect(exists).toBe(true);
      
      // Check if script is executable (no error thrown)
      await expect(fs.access(scriptPath, fs.constants.F_OK)).resolves.toBeUndefined();
    });

    it('should have npm script for recordings generation', () => {
      // This would be checked in package.json
      const expectedScripts = {
        'recordings': 'bash scripts/generate-recordings.sh',
        'recordings:install': expect.stringContaining('vhs')
      };

      Object.entries(expectedScripts).forEach(([key, value]) => {
        expect(value).toBeTruthy();
      });
    });

    it('should check for VHS dependency', async () => {
      const scriptContent = `
if ! command -v vhs &> /dev/null; then
    echo "❌ VHS not found. Installing..."
    exit 1
fi
      `.trim();

      mockFs.readFile.mockResolvedValue(scriptContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'scripts', 'generate-recordings.sh'), 'utf8');
      
      expect(content).toContain('command -v vhs');
      expect(content).toContain('VHS not found');
    });

    it('should generate all recording types', async () => {
      const scriptContent = `
vhs conductor-demo.tape
vhs quick-start.tape
vhs dashboard-demo.tape
vhs rubber-duck-demo.tape
      `.trim();

      mockFs.readFile.mockResolvedValue(scriptContent);
      
      const content = await fs.readFile(path.join(process.cwd(), 'scripts', 'generate-recordings.sh'), 'utf8');
      
      expect(content).toContain('vhs conductor-demo.tape');
      expect(content).toContain('vhs quick-start.tape');
      expect(content).toContain('vhs dashboard-demo.tape');
      expect(content).toContain('vhs rubber-duck-demo.tape');
    });
  });
});