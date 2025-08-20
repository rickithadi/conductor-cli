import { SubagentDefinition } from './types';

export function getSecurityAgents(framework: string, language: string): SubagentDefinition[] {
  return [
    {
      name: '@security-architect',
      role: 'Security Architecture Specialist',
      expertise: [
        'OWASP Top 10 vulnerabilities',
        'Threat modeling and risk assessment', 
        'Security architecture design',
        'Authentication and authorization patterns',
        'Secure coding practices',
        'Cryptography implementation'
      ],
      technicalStack: [
        'OAuth 2.0 / OpenID Connect',
        'JWT implementation',
        'bcrypt / Argon2 password hashing',
        'TLS/SSL configuration',
        'Security headers (CSP, HSTS, etc.)',
        'Rate limiting and DDoS protection'
      ],
      specialInstructions: [
        'Always consider the OWASP Top 10 when reviewing code',
        'Prioritize defense in depth strategies',
        'Recommend specific security libraries and implementations',
        'Focus on preventing injection attacks and XSS',
        'Ensure proper authentication and session management',
        'Validate all input and sanitize all output'
      ],
      securityFocus: {
        primaryThreats: ['Injection', 'Broken Authentication', 'XSS', 'Insecure Design'],
        complianceFrameworks: ['OWASP ASVS', 'NIST Cybersecurity Framework'],
        tools: ['OWASP ZAP', 'Burp Suite', 'Static analysis tools']
      }
    },
    
    {
      name: '@privacy-officer',
      role: 'Data Privacy & Compliance Specialist',
      expertise: [
        'GDPR and CCPA compliance',
        'Privacy by design principles',
        'Data minimization strategies',
        'Consent management systems',
        'Data breach response',
        'Privacy impact assessments'
      ],
      technicalStack: [
        'Cookie consent management',
        'Data anonymization techniques',
        'Secure data storage patterns',
        'Privacy-preserving analytics',
        'Data retention policies',
        'Cross-border data transfer compliance'
      ],
      specialInstructions: [
        'Ensure all data collection has explicit user consent',
        'Implement data minimization - collect only what is necessary',
        'Design systems with privacy controls from the start',
        'Consider data subject rights (access, deletion, portability)',
        'Document data flows and retention policies',
        'Implement privacy-preserving analytics where possible'
      ],
      complianceFocus: {
        regulations: ['GDPR', 'CCPA', 'PIPEDA', 'LGPD'],
        dataTypes: ['PII', 'Sensitive Personal Data', 'Biometric Data', 'Location Data'],
        rights: ['Right to Access', 'Right to Deletion', 'Right to Portability', 'Right to Rectification']
      }
    },

    {
      name: '@compliance-auditor',
      role: 'Regulatory Compliance & Audit Specialist',
      expertise: [
        'SOX compliance for financial data',
        'HIPAA compliance for healthcare',
        'PCI-DSS for payment processing',
        'SOC 2 compliance frameworks',
        'Audit trail implementation',
        'Risk assessment methodologies'
      ],
      technicalStack: [
        'Audit logging systems',
        'Access control matrices',
        'Compliance monitoring tools',
        'Risk assessment frameworks',
        'Evidence collection systems',
        'Compliance reporting dashboards'
      ],
      specialInstructions: [
        'Implement comprehensive audit trails for all sensitive operations',
        'Ensure proper access controls and segregation of duties',
        'Document all compliance-related decisions and implementations',
        'Consider industry-specific regulations for the domain',
        'Implement automated compliance monitoring where possible',
        'Prepare for regular security audits and assessments'
      ],
      auditFocus: {
        frameworks: ['SOX', 'HIPAA', 'PCI-DSS', 'SOC 2', 'ISO 27001'],
        controls: ['Access Controls', 'Data Integrity', 'Audit Logging', 'Incident Response'],
        evidence: ['System Logs', 'Access Reviews', 'Policy Documentation', 'Training Records']
      }
    },

    {
      name: '@security-reviewer',
      role: 'Secure Code Review Specialist',
      expertise: [
        'Static code analysis',
        'Vulnerability assessment',
        'Secure coding patterns',
        'Code review methodologies',
        'Security testing strategies',
        'Dependency security analysis'
      ],
      technicalStack: [
        `${language} security best practices`,
        `${framework} security patterns`,
        'Static analysis tools (SonarQube, CodeQL)',
        'Dependency scanning (npm audit, Snyk)',
        'SAST/DAST tools integration',
        'Security unit testing patterns'
      ],
      specialInstructions: [
        'Review code for common vulnerability patterns',
        'Check for proper input validation and output encoding',
        'Verify secure error handling and logging',
        'Assess third-party dependencies for known vulnerabilities',
        'Ensure proper cryptographic implementations',
        'Validate security test coverage'
      ],
      reviewFocus: {
        patterns: ['Input Validation', 'Output Encoding', 'Error Handling', 'Crypto Implementation'],
        tools: ['ESLint Security Plugin', 'Semgrep', 'CodeQL', 'Bandit', 'Brakeman'],
        metrics: ['Security Test Coverage', 'Vulnerability Density', 'Security Debt']
      }
    },

    {
      name: '@incident-responder',
      role: 'Security Incident Response Specialist',
      expertise: [
        'Incident response planning',
        'Security monitoring and alerting',
        'Forensic analysis techniques',
        'Breach notification procedures',
        'Recovery and business continuity',
        'Lessons learned documentation'
      ],
      technicalStack: [
        'SIEM systems and log analysis',
        'Intrusion detection systems',
        'Security orchestration platforms',
        'Digital forensics tools',
        'Threat intelligence feeds',
        'Incident tracking systems'
      ],
      specialInstructions: [
        'Design systems with incident response capabilities in mind',
        'Implement comprehensive security monitoring and alerting',
        'Ensure proper log retention and forensic capabilities',
        'Create runbooks for common security incidents',
        'Consider regulatory notification requirements',
        'Plan for business continuity during security events'
      ],
      responseFocus: {
        phases: ['Preparation', 'Detection', 'Containment', 'Eradication', 'Recovery', 'Lessons Learned'],
        monitoring: ['Failed Login Attempts', 'Unusual Data Access', 'Network Anomalies', 'System Changes'],
        communication: ['Internal Teams', 'Legal Counsel', 'Regulators', 'Affected Users']
      }
    }
  ];
}

export function getSecurityRecommendations(task: string, framework: string, language: string) {
  const recommendations = {
    'authentication': {
      '@security-architect': {
        recommendation: `Implement OAuth 2.0 with PKCE for ${framework} applications`,
        reasoning: 'PKCE provides additional security for public clients and prevents authorization code interception',
        implementation: [
          'Use a proven OAuth 2.0 library (passport.js, NextAuth.js)',
          'Implement proper state parameter validation',
          'Use secure session storage (httpOnly, secure, sameSite cookies)',
          'Add rate limiting to authentication endpoints'
        ],
        security_considerations: [
          'Prevent CSRF attacks with state parameter',
          'Implement proper logout functionality',
          'Consider multi-factor authentication',
          'Use secure password reset flows'
        ]
      },
      '@privacy-officer': {
        recommendation: 'Implement privacy-preserving authentication with minimal data collection',
        reasoning: 'Reduces privacy risk by limiting personal data exposure during authentication',
        implementation: [
          'Use email/username only for identification',
          'Implement proper consent for any additional data collection',
          'Provide clear privacy notices during registration',
          'Allow users to delete their accounts and data'
        ],
        privacy_considerations: [
          'Document data retention periods',
          'Implement right to deletion',
          'Consider pseudonymization techniques',
          'Audit authentication data flows'
        ]
      }
    },
    'api-security': {
      '@security-architect': {
        recommendation: `Implement comprehensive API security for ${framework} REST APIs`,
        reasoning: 'APIs are common attack vectors requiring defense in depth',
        implementation: [
          'Use JWT with proper signing and validation',
          'Implement rate limiting per user/IP',
          'Add request/response validation schemas',
          'Use HTTPS everywhere with HSTS headers'
        ],
        security_considerations: [
          'Validate all input parameters',
          'Implement proper error handling (no sensitive data leakage)',
          'Use API versioning for security updates',
          'Monitor for unusual API usage patterns'
        ]
      },
      '@compliance-auditor': {
        recommendation: 'Implement audit logging and access controls for API endpoints',
        reasoning: 'Regulatory compliance requires comprehensive audit trails',
        implementation: [
          'Log all API requests with user context',
          'Implement role-based access control (RBAC)',
          'Create audit reports for sensitive operations',
          'Ensure log integrity and retention compliance'
        ],
        compliance_considerations: [
          'Follow industry-specific logging requirements',
          'Implement segregation of duties',
          'Create compliance dashboards',
          'Prepare for external audits'
        ]
      }
    },
    'data-protection': {
      '@privacy-officer': {
        recommendation: 'Implement comprehensive data protection strategy',
        reasoning: 'Protects user privacy and ensures regulatory compliance',
        implementation: [
          'Encrypt sensitive data at rest and in transit',
          'Implement data classification schemes',
          'Use data anonymization for analytics',
          'Create data retention and deletion policies'
        ],
        privacy_considerations: [
          'Conduct privacy impact assessments',
          'Implement privacy by design principles',
          'Provide user data export functionality',
          'Monitor third-party data sharing'
        ]
      },
      '@security-reviewer': {
        recommendation: 'Implement secure data handling patterns in application code',
        reasoning: 'Prevents data breaches through secure coding practices',
        implementation: [
          'Use parameterized queries to prevent SQL injection',
          'Implement proper input sanitization',
          'Use secure random number generation',
          'Validate and encode all outputs'
        ],
        security_considerations: [
          'Review all data access points',
          'Implement proper error handling',
          'Use secure coding standards',
          'Regular security code reviews'
        ]
      }
    }
  };

  // Match task to security recommendations
  const taskLower = task.toLowerCase();
  if (taskLower.includes('auth')) {
    return recommendations.authentication;
  } else if (taskLower.includes('api')) {
    return recommendations['api-security'];
  } else if (taskLower.includes('data') || taskLower.includes('privacy')) {
    return recommendations['data-protection'];
  }

  // Default security recommendations
  return {
    '@security-architect': {
      recommendation: 'Apply security-first development principles',
      reasoning: 'Proactive security measures prevent vulnerabilities',
      implementation: [
        'Follow OWASP security guidelines',
        'Implement proper input validation',
        'Use secure communication protocols',
        'Apply principle of least privilege'
      ]
    }
  };
}