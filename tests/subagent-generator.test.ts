import { describe, it, expect, beforeEach } from '@jest/globals';
import { SubagentGenerator } from '../src/subagent-generator';
import { ProjectContext } from '../src/types';

describe('SubagentGenerator', () => {
  let mockProjectContext: ProjectContext;
  let generator: SubagentGenerator;

  beforeEach(() => {
    mockProjectContext = {
      framework: 'nextjs',
      language: 'typescript',
      packageManager: 'npm',
      hasDatabase: true,
      hasAuthentication: false,
      hasAuth: false,
      hasAPI: true,
      hasTesting: true,
      hasTests: true,
      hasLinting: true,
      hasTypeScript: true,
      dependencies: ['react', 'next', '@types/react'],
      devDependencies: [],
      scripts: {},
      rootPath: '/test/project'
    };
    generator = new SubagentGenerator(mockProjectContext);
  });

  describe('Agent Generation', () => {
    it('should generate appropriate agents for Next.js projects', () => {
      const agents = generator.generateSubagents();
      
      expect(agents.length).toBeGreaterThan(4);
      expect(agents.map(a => a.name)).toContain('@frontend');
      expect(agents.map(a => a.name)).toContain('@backend');
      expect(agents.map(a => a.name)).toContain('@seo-specialist');
      expect(agents.map(a => a.name)).toContain('@testing');
    });

    it('should include SEO specialist for web frameworks', () => {
      const agents = generator.generateSubagents();
      const seoAgent = agents.find(a => a.name === '@seo-specialist');
      
      expect(seoAgent).toBeDefined();
      expect(seoAgent?.role).toContain('SEO');
      expect(seoAgent?.expertise).toContain('Next.js SEO optimization');
      expect(seoAgent?.expertise).toContain('Core Web Vitals');
      expect(seoAgent?.technicalStack).toContain('next-seo');
    });

    it('should include security agents when security features detected', () => {
      mockProjectContext.hasAuth = true;
      mockProjectContext.dependencies.push('bcrypt', 'jsonwebtoken');
      
      const agents = generator.generateSubagents();
      const securityAgent = agents.find(a => a.name === '@security');
      
      expect(securityAgent).toBeDefined();
      expect(securityAgent?.expertise).toContain('Authentication security');
      expect(securityAgent?.expertise).toContain('OWASP Top 10');
    });

    it('should adapt agents based on project structure', () => {
      mockProjectContext.hasDatabase = true;
      mockProjectContext.dependencies.push('prisma');
      
      const agents = generator.generateSubagents();
      const backendAgent = agents.find(a => a.name === '@backend');
      
      expect(backendAgent?.technicalStack).toContain('Prisma ORM');
      expect(backendAgent?.expertise).toContain('Database optimization');
    });

    it('should include design-focused agents for UI projects', () => {
      mockProjectContext.dependencies.push('tailwindcss', 'styled-components');
      
      const agents = generator.generateSubagents();
      const uxAgent = agents.find(a => a.name === '@ux');
      const frontendAgent = agents.find(a => a.name === '@frontend');
      
      expect(uxAgent).toBeDefined();
      expect(frontendAgent?.technicalStack).toContain('Tailwind CSS');
      expect(uxAgent?.expertise).toContain('Design systems');
    });
  });

  describe('Framework-Specific Customization', () => {
    it('should customize agents for React projects', () => {
      mockProjectContext.framework = 'react';
      
      const agents = generator.generateSubagents();
      const frontendAgent = agents.find(a => a.name === '@frontend');
      
      expect(frontendAgent?.expertise).toContain('React hooks patterns');
      expect(frontendAgent?.technicalStack).toContain('React');
    });

    it('should customize agents for Vue projects', () => {
      mockProjectContext.framework = 'vue';
      mockProjectContext.language = 'javascript';
      
      const agents = generator.generateSubagents();
      const frontendAgent = agents.find(a => a.name === '@frontend');
      
      expect(frontendAgent?.expertise).toContain('Vue.js composition API');
      expect(frontendAgent?.technicalStack).toContain('Vue');
    });

    it('should include Jekyll-specific agents for static sites', () => {
      mockProjectContext.framework = 'jekyll';
      mockProjectContext.language = 'ruby';
      
      const agents = generator.generateSubagents();
      const seoAgent = agents.find(a => a.name === '@seo-specialist');
      const contentAgent = agents.find(a => a.name === '@content-strategist');
      
      expect(seoAgent?.expertise).toContain('Jekyll SEO optimization');
      expect(contentAgent?.expertise).toContain('Markdown optimization');
    });
  });

  describe('Agent Quality Validation', () => {
    it('should ensure all agents have required properties', () => {
      const agents = generator.generateSubagents();
      
      agents.forEach(agent => {
        expect(agent.name).toBeTruthy();
        expect(agent.name.startsWith('@')).toBe(true);
        expect(agent.role).toBeTruthy();
        expect(Array.isArray(agent.expertise)).toBe(true);
        expect(agent.expertise.length).toBeGreaterThan(0);
        expect(Array.isArray(agent.technicalStack)).toBe(true);
        expect(agent.technicalStack.length).toBeGreaterThan(0);
        expect(Array.isArray(agent.specialInstructions)).toBe(true);
        expect(agent.specialInstructions?.length ?? 0).toBeGreaterThan(0);
      });
    });

    it('should ensure agent expertise is specific and actionable', () => {
      const agents = generator.generateSubagents();
      
      agents.forEach(agent => {
        agent.expertise.forEach(skill => {
          expect(skill.length).toBeGreaterThan(10);
          expect(skill).not.toMatch(/generic|basic|simple/i);
        });
        
        agent.specialInstructions?.forEach(instruction => {
          expect(instruction.length).toBeGreaterThan(15);
          expect(instruction).toMatch(/^(Focus on|Ensure|Implement|Consider|Use|Avoid)/);
        });
      });
    });

    it('should avoid duplicate agents', () => {
      const agents = generator.generateSubagents();
      const agentNames = agents.map(a => a.name);
      const uniqueNames = [...new Set(agentNames)];
      
      expect(agentNames.length).toBe(uniqueNames.length);
    });
  });

  describe('Security Integration', () => {
    it('should include security considerations in all agents', () => {
      const agents = generator.generateSubagents();
      
      const frontendAgent = agents.find(a => a.name === '@frontend');
      const backendAgent = agents.find(a => a.name === '@backend');
      
      expect(frontendAgent?.specialInstructions?.some(s => 
        s.toLowerCase().includes('security') || 
        s.toLowerCase().includes('sanitiz') ||
        s.toLowerCase().includes('xss')
      )).toBe(true);
      
      expect(backendAgent?.specialInstructions?.some(s => 
        s.toLowerCase().includes('security') || 
        s.toLowerCase().includes('validat') ||
        s.toLowerCase().includes('inject')
      )).toBe(true);
    });
  });

  describe('SEO Integration', () => {
    it('should include SEO specialist for web projects', () => {
      const agents = generator.generateSubagents();
      const seoAgent = agents.find(a => a.name === '@seo-specialist');
      
      expect(seoAgent).toBeDefined();
      expect(seoAgent?.expertise).toContain('Technical SEO implementation');
      expect(seoAgent?.expertise).toContain('Core Web Vitals optimization');
      expect(seoAgent?.expertise).toContain('Schema.org structured data');
    });

    it('should customize SEO agent for specific frameworks', () => {
      const agents = generator.generateSubagents();
      const seoAgent = agents.find(a => a.name === '@seo-specialist');
      
      expect(seoAgent?.technicalStack).toContain('Next.js SEO');
      expect(seoAgent?.specialInstructions?.some(s => 
        s.includes('Next.js') || s.includes('metadata API')
      )).toBe(true);
    });
  });

  describe('Design Integration', () => {
    it('should include UX agent with design expertise', () => {
      const agents = generator.generateSubagents();
      const uxAgent = agents.find(a => a.name === '@ux');
      
      expect(uxAgent).toBeDefined();
      expect(uxAgent?.expertise).toContain('Design systems and component libraries');
      expect(uxAgent?.expertise).toContain('Accessibility compliance (WCAG 2.1 AA)');
      expect(uxAgent?.expertise).toContain('User interface design patterns');
    });

    it('should include design considerations in frontend agent', () => {
      const agents = generator.generateSubagents();
      const frontendAgent = agents.find(a => a.name === '@frontend');
      
      expect(frontendAgent?.specialInstructions?.some(s => 
        s.toLowerCase().includes('responsive') || 
        s.toLowerCase().includes('accessibility') ||
        s.toLowerCase().includes('design')
      )).toBe(true);
    });
  });

  describe('Testing Integration', () => {
    it('should include testing agent when tests detected', () => {
      mockProjectContext.hasTests = true;
      
      const agents = generator.generateSubagents();
      const testingAgent = agents.find(a => a.name === '@testing');
      
      expect(testingAgent).toBeDefined();
      expect(testingAgent?.expertise).toContain('Test strategy design');
      expect(testingAgent?.expertise).toContain('Unit testing patterns');
    });

    it('should suggest testing tools based on framework', () => {
      mockProjectContext.hasTests = true;
      mockProjectContext.dependencies.push('jest', '@testing-library/react');
      
      const agents = generator.generateSubagents();
      const testingAgent = agents.find(a => a.name === '@testing');
      
      expect(testingAgent?.technicalStack).toContain('Jest');
      expect(testingAgent?.technicalStack).toContain('Testing Library');
    });
  });
});