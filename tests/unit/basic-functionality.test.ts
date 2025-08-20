import fs from 'fs-extra';
import path from 'path';

// Simple tests that should pass in CI without complex mocking
describe('Basic Functionality Tests', () => {
  describe('Project Structure', () => {
    it('should have main source files', () => {
      const requiredFiles = [
        'src/enhanced-cli.ts',
        'package.json',
        'README.md',
        'index.html'
      ];

      requiredFiles.forEach(file => {
        const exists = fs.existsSync(path.join(process.cwd(), file));
        expect(exists).toBe(true);
      });
    });

    it('should have recording infrastructure', () => {
      const recordingFiles = [
        'recordings/conductor-demo.tape',
        'recordings/quick-start.tape',
        'recordings/dashboard-demo.tape',
        'recordings/rubber-duck-demo.tape',
        'recordings/README.md'
      ];

      recordingFiles.forEach(file => {
        const exists = fs.existsSync(path.join(process.cwd(), file));
        expect(exists).toBe(true);
      });
    });

    it('should have test files', () => {
      const testFiles = [
        'tests/setup.ts',
        'tests/unit/terminal-recordings.test.ts',
        'tests/integration/recording-workflow.test.ts',
        'tests/e2e/recording-examples.test.ts'
      ];

      testFiles.forEach(file => {
        const exists = fs.existsSync(path.join(process.cwd(), file));
        expect(exists).toBe(true);
      });
    });
  });

  describe('Configuration Files', () => {
    it('should have valid package.json', () => {
      const packageJson = require('../../package.json');
      
      expect(packageJson.name).toBe('conductor-cli');
      expect(packageJson.version).toBe('1.0.0');
      expect(packageJson.description).toContain('Choo Choo Train');
      expect(packageJson.scripts).toHaveProperty('recordings');
      expect(packageJson.engines.node).toBe('>=18.0.0');
    });

    it('should have valid jest configuration', () => {
      const jestConfig = require('../../jest.config.js');
      
      expect(jestConfig.preset).toBe('ts-jest');
      expect(jestConfig.testEnvironment).toBe('node');
      expect(jestConfig.setupFilesAfterEnv).toContain('<rootDir>/tests/setup.ts');
      expect(jestConfig.coverageThreshold.global.statements).toBe(30);
    });

    it('should have GitHub Actions workflow', () => {
      const workflowExists = fs.existsSync(path.join(process.cwd(), '.github/workflows/update-recordings.yml'));
      expect(workflowExists).toBe(true);
    });
  });

  describe('Recording Files Content', () => {
    it('should have properly configured VHS tape files', () => {
      const tapeFiles = [
        'recordings/conductor-demo.tape',
        'recordings/quick-start.tape',
        'recordings/dashboard-demo.tape',
        'recordings/rubber-duck-demo.tape'
      ];

      tapeFiles.forEach(tapeFile => {
        const content = fs.readFileSync(path.join(process.cwd(), tapeFile), 'utf8');
        
        // Should have VHS configuration
        expect(content).toContain('Output');
        expect(content).toContain('Set Theme');
        expect(content).toContain('Set FontSize');
        expect(content).toContain('Set Width');
        expect(content).toContain('Set Height');
        
        // Should have conductor commands
        expect(content).toMatch(/conductor (init|launch|ask|dashboard|think|debug|design|ship|review)/);
      });
    });

    it('should have comprehensive documentation', () => {
      const readmeContent = fs.readFileSync(path.join(process.cwd(), 'recordings/README.md'), 'utf8');
      
      expect(readmeContent).toContain('Terminal Recordings for Conductor CLI');
      expect(readmeContent).toContain('VHS');
      expect(readmeContent).toContain('npm run recordings');
      expect(readmeContent).toContain('Quick Start');
      expect(readmeContent).toContain('Troubleshooting');
    });
  });

  describe('Landing Page Integration', () => {
    it('should have terminal recordings section in HTML', () => {
      const htmlContent = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
      
      expect(htmlContent).toContain('terminal-recordings');
      expect(htmlContent).toContain('recording-tabs');
      expect(htmlContent).toContain('🎬 See the AI Express in Action');
      expect(htmlContent).toContain('Quick Start');
      expect(htmlContent).toContain('Rubber Duck');
      expect(htmlContent).toContain('Dashboard');
      expect(htmlContent).toContain('Full Demo');
    });

    it('should have proper fallback content', () => {
      const htmlContent = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
      
      expect(htmlContent).toContain('fallback-demo');
      expect(htmlContent).toContain('onerror=');
      expect(htmlContent).toContain('loading="lazy"');
    });

    it('should reference all recording GIFs', () => {
      const htmlContent = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
      
      const expectedGifs = [
        'recordings/output/quick-start.gif',
        'recordings/output/rubber-duck-demo.gif',
        'recordings/output/dashboard-demo.gif',
        'recordings/output/conductor-demo.gif'
      ];

      expectedGifs.forEach(gif => {
        expect(htmlContent).toContain(gif);
      });
    });
  });

  describe('Scripts and Generation', () => {
    it('should have executable generation script', () => {
      const scriptPath = path.join(process.cwd(), 'scripts/generate-recordings.sh');
      const exists = fs.existsSync(scriptPath);
      expect(exists).toBe(true);
      
      const content = fs.readFileSync(scriptPath, 'utf8');
      expect(content).toContain('#!/bin/bash');
      expect(content).toContain('vhs');
      expect(content).toContain('conductor-demo.tape');
    });

    it('should have npm scripts for recordings', () => {
      const packageJson = require('../../package.json');
      
      expect(packageJson.scripts).toHaveProperty('recordings');
      expect(packageJson.scripts).toHaveProperty('recordings:install');
      expect(packageJson.scripts.recordings).toContain('generate-recordings.sh');
    });
  });

  describe('README Integration', () => {
    it('should contain all examples used in recordings', () => {
      const readmeContent = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
      
      // Quick start examples
      expect(readmeContent).toContain('conductor init');
      expect(readmeContent).toContain('conductor launch');
      expect(readmeContent).toContain('conductor ask');
      
      // Rubber duck varieties
      expect(readmeContent).toContain('conductor think');
      expect(readmeContent).toContain('conductor debug');
      expect(readmeContent).toContain('conductor design');
      expect(readmeContent).toContain('conductor experiment');
      
      // Agent specializations
      expect(readmeContent).toContain('@frontend');
      expect(readmeContent).toContain('@security');
      expect(readmeContent).toContain('@backend');
      
      // Workflow commands
      expect(readmeContent).toContain('conductor review');
      expect(readmeContent).toContain('conductor ship');
      expect(readmeContent).toContain('conductor dashboard');
    });

    it('should have conductor branding throughout', () => {
      const readmeContent = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
      
      expect(readmeContent).toContain('🚂'); // Train emoji
      expect(readmeContent).toContain('🦆'); // Duck emoji
      expect(readmeContent).toContain('Choo Choo Train');
      expect(readmeContent).toContain('AI Express');
      expect(readmeContent).toContain('All aboard');
    });
  });
});