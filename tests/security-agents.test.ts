import { describe, it, expect } from '@jest/globals';
import { getSecurityAgents, getSecurityRecommendations } from '../src/security-agents';

describe('Security Agents', () => {
  describe('getSecurityAgents', () => {
    it('should return all security-focused agents', () => {
      const agents = getSecurityAgents('nextjs', 'typescript');
      
      expect(agents).toHaveLength(5);
      expect(agents.map(a => a.name)).toContain('@security-architect');
      expect(agents.map(a => a.name)).toContain('@privacy-officer');
      expect(agents.map(a => a.name)).toContain('@compliance-auditor');
      expect(agents.map(a => a.name)).toContain('@security-reviewer');
      expect(agents.map(a => a.name)).toContain('@incident-responder');
    });

    it('should configure security architect correctly', () => {
      const agents = getSecurityAgents('react', 'typescript');
      const securityArchitect = agents.find(a => a.name === '@security-architect');
      
      expect(securityArchitect).toBeDefined();
      expect(securityArchitect?.role).toBe('Security Architecture Specialist');
      expect(securityArchitect?.expertise).toContain('OWASP Top 10 vulnerabilities');
      expect(securityArchitect?.expertise).toContain('Threat modeling and risk assessment');
      expect(securityArchitect?.technicalStack).toContain('OAuth 2.0 / OpenID Connect');
      expect(securityArchitect?.specialInstructions).toContain('Always consider the OWASP Top 10 when reviewing code');
    });

    it('should configure privacy officer with GDPR expertise', () => {
      const agents = getSecurityAgents('vue', 'javascript');
      const privacyOfficer = agents.find(a => a.name === '@privacy-officer');
      
      expect(privacyOfficer).toBeDefined();
      expect(privacyOfficer?.role).toBe('Data Privacy & Compliance Specialist');
      expect(privacyOfficer?.expertise).toContain('GDPR and CCPA compliance');
      expect(privacyOfficer?.expertise).toContain('Privacy by design principles');
      expect(privacyOfficer?.specialInstructions).toContain('Ensure all data collection has explicit user consent');
    });

    it('should configure compliance auditor with regulatory frameworks', () => {
      const agents = getSecurityAgents('express', 'javascript');
      const complianceAuditor = agents.find(a => a.name === '@compliance-auditor');
      
      expect(complianceAuditor).toBeDefined();
      expect(complianceAuditor?.role).toBe('Regulatory Compliance & Audit Specialist');
      expect(complianceAuditor?.expertise).toContain('SOX compliance for financial data');
      expect(complianceAuditor?.expertise).toContain('HIPAA compliance for healthcare');
      expect(complianceAuditor?.expertise).toContain('PCI-DSS for payment processing');
    });

    it('should configure security reviewer with code analysis skills', () => {
      const agents = getSecurityAgents('django', 'python');
      const securityReviewer = agents.find(a => a.name === '@security-reviewer');
      
      expect(securityReviewer).toBeDefined();
      expect(securityReviewer?.role).toBe('Secure Code Review Specialist');
      expect(securityReviewer?.expertise).toContain('Static code analysis');
      expect(securityReviewer?.expertise).toContain('Vulnerability assessment');
      expect(securityReviewer?.technicalStack).toContain('python security best practices');
    });

    it('should configure incident responder with IR capabilities', () => {
      const agents = getSecurityAgents('rails', 'ruby');
      const incidentResponder = agents.find(a => a.name === '@incident-responder');
      
      expect(incidentResponder).toBeDefined();
      expect(incidentResponder?.role).toBe('Security Incident Response Specialist');
      expect(incidentResponder?.expertise).toContain('Incident response planning');
      expect(incidentResponder?.expertise).toContain('Security monitoring and alerting');
      expect(incidentResponder?.technicalStack).toContain('SIEM systems and log analysis');
    });
  });

  describe('getSecurityRecommendations', () => {
    it('should provide authentication recommendations', () => {
      const recommendations = getSecurityRecommendations('implement user authentication', 'nextjs', 'typescript');
      
      expect(recommendations).toHaveProperty('@security-architect');
      expect(recommendations).toHaveProperty('@privacy-officer');
      
      const secArch = recommendations['@security-architect'];
      expect(secArch.recommendation).toContain('OAuth 2.0 with PKCE');
      expect(secArch.reasoning).toContain('PKCE provides additional security');
      expect(secArch.implementation).toContain('Use a proven OAuth 2.0 library');
      
      const privacyOff = recommendations['@privacy-officer'];
      expect(privacyOff.recommendation).toContain('privacy-preserving authentication');
      expect(privacyOff.implementation).toContain('Use email/username only');
    });

    it('should provide API security recommendations', () => {
      const recommendations = getSecurityRecommendations('secure REST API endpoints', 'express', 'typescript');
      
      expect(recommendations).toHaveProperty('@security-architect');
      expect(recommendations).toHaveProperty('@compliance-auditor');
      
      const secArch = recommendations['@security-architect'];
      expect(secArch.recommendation).toContain('comprehensive API security');
      expect(secArch.implementation).toContain('Use JWT with proper signing');
      expect(secArch.implementation).toContain('Implement rate limiting');
      
      const compAuditor = recommendations['@compliance-auditor'];
      expect(compAuditor.recommendation).toContain('audit logging and access controls');
      expect(compAuditor.implementation).toContain('Log all API requests');
    });

    it('should provide data protection recommendations', () => {
      const recommendations = getSecurityRecommendations('implement data privacy controls', 'django', 'python');
      
      expect(recommendations).toHaveProperty('@privacy-officer');
      expect(recommendations).toHaveProperty('@security-reviewer');
      
      const privacyOff = recommendations['@privacy-officer'];
      expect(privacyOff.recommendation).toContain('comprehensive data protection strategy');
      expect(privacyOff.implementation).toContain('Encrypt sensitive data');
      expect(privacyOff.implementation).toContain('data anonymization');
      
      const secReviewer = recommendations['@security-reviewer'];
      expect(secReviewer.recommendation).toContain('secure data handling patterns');
      expect(secReviewer.implementation).toContain('parameterized queries');
    });

    it('should provide default security recommendations for general tasks', () => {
      const recommendations = getSecurityRecommendations('implement user dashboard', 'react', 'javascript');
      
      expect(recommendations).toHaveProperty('@security-architect');
      
      const secArch = recommendations['@security-architect'];
      expect(secArch.recommendation).toContain('security-first development principles');
      expect(secArch.implementation).toContain('Follow OWASP security guidelines');
      expect(secArch.implementation).toContain('proper input validation');
    });

    it('should adapt recommendations based on framework and language', () => {
      const nextjsRecs = getSecurityRecommendations('implement auth', 'nextjs', 'typescript');
      const djangoRecs = getSecurityRecommendations('implement auth', 'django', 'python');
      
      // Both should provide OAuth recommendations but tailored to framework
      expect(nextjsRecs['@security-architect'].recommendation).toContain('OAuth 2.0');
      expect(nextjsRecs['@security-architect'].implementation).toContain('NextAuth.js');
      
      expect(djangoRecs['@security-architect'].recommendation).toContain('OAuth 2.0');
      // Should be framework-agnostic but still relevant
    });
  });

  describe('Security Agent Expertise Validation', () => {
    it('should ensure all agents have required security expertise', () => {
      const agents = getSecurityAgents('any', 'any');
      
      agents.forEach(agent => {
        // All agents should have expertise array
        expect(Array.isArray(agent.expertise)).toBe(true);
        expect(agent.expertise.length).toBeGreaterThan(0);
        
        // All agents should have technical stack
        expect(Array.isArray(agent.technicalStack)).toBe(true);
        expect(agent.technicalStack.length).toBeGreaterThan(0);
        
        // All agents should have special instructions
        expect(Array.isArray(agent.specialInstructions)).toBe(true);
        expect(agent.specialInstructions.length).toBeGreaterThan(0);
        
        // Role should be descriptive
        expect(agent.role).toBeTruthy();
        expect(agent.role.length).toBeGreaterThan(10);
      });
    });

    it('should ensure security-specific properties exist', () => {
      const agents = getSecurityAgents('any', 'any');
      
      const securityArchitect = agents.find(a => a.name === '@security-architect');
      expect(securityArchitect).toHaveProperty('securityFocus');
      expect(securityArchitect?.securityFocus).toHaveProperty('primaryThreats');
      expect(securityArchitect?.securityFocus).toHaveProperty('complianceFrameworks');
      expect(securityArchitect?.securityFocus).toHaveProperty('tools');
      
      const privacyOfficer = agents.find(a => a.name === '@privacy-officer');
      expect(privacyOfficer).toHaveProperty('complianceFocus');
      expect(privacyOfficer?.complianceFocus).toHaveProperty('regulations');
      expect(privacyOfficer?.complianceFocus).toHaveProperty('dataTypes');
      expect(privacyOfficer?.complianceFocus).toHaveProperty('rights');
      
      const complianceAuditor = agents.find(a => a.name === '@compliance-auditor');
      expect(complianceAuditor).toHaveProperty('auditFocus');
      expect(complianceAuditor?.auditFocus).toHaveProperty('frameworks');
      expect(complianceAuditor?.auditFocus).toHaveProperty('controls');
      
      const securityReviewer = agents.find(a => a.name === '@security-reviewer');
      expect(securityReviewer).toHaveProperty('reviewFocus');
      expect(securityReviewer?.reviewFocus).toHaveProperty('patterns');
      expect(securityReviewer?.reviewFocus).toHaveProperty('tools');
      
      const incidentResponder = agents.find(a => a.name === '@incident-responder');
      expect(incidentResponder).toHaveProperty('responseFocus');
      expect(incidentResponder?.responseFocus).toHaveProperty('phases');
      expect(incidentResponder?.responseFocus).toHaveProperty('monitoring');
    });
  });

  describe('Recommendation Quality', () => {
    it('should provide specific, actionable recommendations', () => {
      const recommendations = getSecurityRecommendations('secure API', 'fastapi', 'python');
      
      Object.values(recommendations).forEach(rec => {
        // Should have a clear recommendation
        expect(rec.recommendation).toBeTruthy();
        expect(rec.recommendation.length).toBeGreaterThan(20);
        
        // Should have reasoning
        expect(rec.reasoning).toBeTruthy();
        expect(rec.reasoning.length).toBeGreaterThan(20);
        
        // Should have implementation steps
        expect(Array.isArray(rec.implementation)).toBe(true);
        expect(rec.implementation.length).toBeGreaterThan(0);
        
        // Implementation steps should be specific
        rec.implementation.forEach(step => {
          expect(step.length).toBeGreaterThan(10);
          expect(step).not.toContain('TODO');
          expect(step).not.toContain('implement');
        });
      });
    });

    it('should include security considerations where appropriate', () => {
      const authRecs = getSecurityRecommendations('authentication system', 'nextjs', 'typescript');
      
      const secArch = authRecs['@security-architect'];
      expect(secArch).toHaveProperty('security_considerations');
      expect(Array.isArray(secArch.security_considerations)).toBe(true);
      expect(secArch.security_considerations.length).toBeGreaterThan(0);
      
      const privacyOff = authRecs['@privacy-officer'];
      expect(privacyOff).toHaveProperty('privacy_considerations');
      expect(Array.isArray(privacyOff.privacy_considerations)).toBe(true);
      expect(privacyOff.privacy_considerations.length).toBeGreaterThan(0);
    });
  });
});