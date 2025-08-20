import { ProjectContext, SubagentDefinition } from './types';

export class SubagentGenerator {
  private projectContext: ProjectContext;

  constructor(projectContext: ProjectContext) {
    this.projectContext = projectContext;
  }

  generateSubagents(): SubagentDefinition[] {
    const subagents: SubagentDefinition[] = [];

    // Always include the complete 9-agent team as promised on landing page
    subagents.push(this.generatePMAgent());           // @pm
    subagents.push(this.generateDesignAgent());       // @design (renamed from UX)
    subagents.push(this.generateFrontendAgent());     // @frontend  
    subagents.push(this.generateBackendAgent());      // @backend
    subagents.push(this.generateQAAgent());           // @qa (renamed from testing)
    subagents.push(this.generateDevOpsAgent());       // @devops
    subagents.push(this.generateReviewAgent());       // @reviewer
    subagents.push(this.generateSEOAgent());          // @seo
    subagents.push(this.generateSecurityAgent());     // @security

    return subagents;
  }

  private generateFrontendAgent(): SubagentDefinition {
    const expertise = [
      'Component architecture',
      'State management',
      'Performance optimization',
      'Responsive design',
      'Browser compatibility'
    ];

    const technicalStack = [
      this.projectContext.language,
      this.projectContext.framework
    ];

    // Add framework-specific expertise
    if (this.projectContext.framework === 'nextjs') {
      expertise.push('Next.js App Router', 'Server components', 'Static generation');
      technicalStack.push('Next.js 14', 'React Server Components');
    } else if (this.projectContext.framework === 'react') {
      expertise.push('React hooks', 'Context API', 'Performance patterns');
      technicalStack.push('React 18');
    } else if (this.projectContext.framework === 'vue') {
      expertise.push('Vue composition API', 'Vuex/Pinia', 'Vue Router');
      technicalStack.push('Vue 3');
    }

    // Add styling frameworks
    if (this.projectContext.dependencies.includes('tailwindcss')) {
      technicalStack.push('Tailwind CSS');
    }
    if (this.projectContext.dependencies.includes('styled-components')) {
      technicalStack.push('Styled Components');
    }

    // Add state management
    if (this.projectContext.dependencies.includes('zustand')) {
      technicalStack.push('Zustand');
    }
    if (this.projectContext.dependencies.includes('redux')) {
      technicalStack.push('Redux Toolkit');
    }

    return {
      name: '@frontend',
      role: 'Frontend Architecture Specialist',
      expertise,
      technicalStack,
      specialInstructions: [
        'Focus on component reusability and maintainability',
        'Ensure accessibility compliance (WCAG 2.1 AA)',
        'Optimize for Core Web Vitals',
        'Follow established design system patterns'
      ]
    };
  }

  private generateBackendAgent(): SubagentDefinition {
    const expertise = [
      'API design',
      'Database optimization',
      'Security patterns',
      'Performance tuning',
      'Error handling'
    ];

    const technicalStack = [this.projectContext.language];

    // Add framework-specific expertise
    if (this.projectContext.framework === 'nextjs') {
      expertise.push('Next.js API routes', 'Middleware patterns');
      technicalStack.push('Next.js API Routes');
    } else if (this.projectContext.framework === 'express') {
      expertise.push('Express middleware', 'Route handling');
      technicalStack.push('Express.js');
    }

    // Add database technologies
    if (this.projectContext.dependencies.includes('prisma')) {
      technicalStack.push('Prisma ORM');
    }
    if (this.projectContext.dependencies.includes('mongoose')) {
      technicalStack.push('MongoDB', 'Mongoose');
    }

    return {
      name: '@backend',
      role: 'API & Server Specialist',
      expertise,
      technicalStack,
      domainKnowledge: [
        'RESTful API patterns',
        'GraphQL best practices',
        'Database normalization',
        'Caching strategies'
      ],
      specialInstructions: [
        'Follow OpenAPI specification standards',
        'Implement proper error handling and logging',
        'Ensure security best practices',
        'Optimize database queries'
      ]
    };
  }

  private generateDesignAgent(): SubagentDefinition {
    return {
      name: '@design',
      role: 'UX/UI Designer',
      expertise: [
        'User interface design',
        'User experience research',
        'Design systems and component libraries',
        'Wireframing and prototyping',
        'Accessibility compliance (WCAG 2.1)',
        'User flow optimization',
        'Mobile-first design',
        'Information architecture',
        'Visual design and branding'
      ],
      technicalStack: [
        'Figma',
        'Adobe Creative Suite',
        'WCAG 2.1 guidelines',
        'Responsive design patterns',
        'Progressive enhancement',
        'Design tokens',
        'Storybook'
      ],
      specialInstructions: [
        'Ensure WCAG 2.1 AA compliance',
        'Design for mobile-first approach',
        'Consider user cognitive load',
        'Implement clear error states and feedback',
        'Focus on conversion optimization for business goals',
        'Create cohesive design systems',
        'Collaborate with frontend for implementation'
      ]
    };
  }

  private generateReviewAgent(): SubagentDefinition {
    const expertise = [
      'Code quality assessment',
      'Architecture patterns',
      'Technical debt analysis',
      'Best practices enforcement',
      'Integration patterns'
    ];

    const technicalStack = [this.projectContext.language];

    if (this.projectContext.hasLinting) {
      technicalStack.push('ESLint configuration');
    }

    if (this.projectContext.hasTesting) {
      expertise.push('Test coverage analysis');
      
      if (this.projectContext.dependencies.includes('jest')) {
        technicalStack.push('Jest');
      }
      if (this.projectContext.dependencies.includes('cypress')) {
        technicalStack.push('Cypress');
      }
      if (this.projectContext.dependencies.includes('playwright')) {
        technicalStack.push('Playwright');
      }
    }

    return {
      name: '@review',
      role: 'Code Quality & Architecture Specialist',
      expertise,
      technicalStack,
      specialInstructions: [
        'Enforce established coding standards',
        'Identify potential security vulnerabilities',
        'Suggest performance improvements',
        'Ensure maintainability and scalability',
        'Review for technical debt accumulation'
      ]
    };
  }

  private generateDatabaseAgent(): SubagentDefinition {
    const expertise = [
      'Database schema design',
      'Query optimization',
      'Migration strategies',
      'Data modeling',
      'Performance tuning'
    ];

    const technicalStack = [];

    if (this.projectContext.dependencies.includes('prisma')) {
      technicalStack.push('Prisma ORM', 'Database migrations');
    }
    if (this.projectContext.dependencies.includes('mongoose')) {
      technicalStack.push('MongoDB', 'Mongoose ODM');
    }
    if (this.projectContext.dependencies.includes('sequelize')) {
      technicalStack.push('Sequelize ORM');
    }

    return {
      name: '@database',
      role: 'Database Specialist',
      expertise,
      technicalStack,
      specialInstructions: [
        'Design normalized and efficient schemas',
        'Implement proper indexing strategies',
        'Ensure data consistency and integrity',
        'Plan for scalability and performance'
      ]
    };
  }

  private generateQAAgent(): SubagentDefinition {
    const expertise = [
      'Test strategy design',
      'Unit testing patterns',
      'Integration testing',
      'End-to-end testing',
      'Test automation'
    ];

    const technicalStack = [];

    if (this.projectContext.dependencies.includes('jest')) {
      technicalStack.push('Jest');
    }
    if (this.projectContext.dependencies.includes('@testing-library/react')) {
      technicalStack.push('React Testing Library');
    }
    if (this.projectContext.dependencies.includes('cypress')) {
      technicalStack.push('Cypress');
    }
    if (this.projectContext.dependencies.includes('playwright')) {
      technicalStack.push('Playwright');
    }

    return {
      name: '@qa',
      role: 'QA Engineer',
      expertise,
      technicalStack,
      specialInstructions: [
        'Implement comprehensive test coverage',
        'Design maintainable test suites',
        'Focus on critical user paths',
        'Ensure test reliability and speed'
      ]
    };
  }

  private generateSecurityAgent(): SubagentDefinition {
    return {
      name: '@security',
      role: 'Security & Authentication Specialist',
      expertise: [
        'Authentication patterns',
        'Authorization strategies',
        'Security vulnerabilities',
        'Data protection',
        'Secure coding practices',
        'OWASP Top 10 compliance',
        'Threat modeling',
        'Vulnerability scanning'
      ],
      technicalStack: [
        'JWT tokens',
        'OAuth 2.0',
        'Session management',
        'CSRF protection',
        'HTTPS/TLS',
        'Security headers'
      ],
      specialInstructions: [
        'Implement secure authentication flows',
        'Ensure proper data validation',
        'Follow OWASP security guidelines',
        'Implement least privilege access',
        'Regular security audits and scanning',
        'Monitor for security vulnerabilities'
      ]
    };
  }

  // New agents to match landing page promises
  
  private generatePMAgent(): SubagentDefinition {
    return {
      name: '@pm',
      role: 'Product Manager',
      expertise: [
        'Requirements gathering and analysis',
        'User story creation and management',
        'Roadmap planning and prioritization',
        'Stakeholder communication',
        'Product strategy and vision',
        'Market research and competitive analysis',
        'Feature specification and acceptance criteria',
        'User persona development',
        'Product metrics and KPI tracking'
      ],
      technicalStack: [
        'JIRA/Linear',
        'Confluence/Notion',
        'Figma/Miro',
        'Google Analytics',
        'User research tools',
        'A/B testing platforms'
      ],
      specialInstructions: [
        'Focus on user needs and business value',
        'Write clear and actionable user stories',
        'Prioritize features based on impact and effort',
        'Facilitate communication between stakeholders',
        'Ensure alignment with business objectives',
        'Track and measure product success metrics'
      ]
    };
  }

  private generateDevOpsAgent(): SubagentDefinition {
    const expertise = [
      'CI/CD pipeline design and implementation',
      'Infrastructure as Code (IaC)',
      'Container orchestration',
      'Cloud platform management',
      'Monitoring and observability',
      'Deployment strategies',
      'Security in DevOps (DevSecOps)',
      'Performance optimization',
      'Disaster recovery and backup'
    ];

    const technicalStack = ['Docker', 'GitHub Actions'];

    // Add cloud-specific tools based on context
    if (this.projectContext.framework === 'nextjs') {
      technicalStack.push('Vercel', 'Next.js deployment');
    }

    // Add common DevOps tools
    technicalStack.push(
      'Kubernetes',
      'Terraform',
      'AWS/GCP/Azure',
      'Prometheus/Grafana',
      'Jenkins',
      'Helm'
    );

    return {
      name: '@devops',
      role: 'DevOps Engineer',
      expertise,
      technicalStack,
      specialInstructions: [
        'Automate deployment and infrastructure management',
        'Implement robust CI/CD pipelines',
        'Ensure high availability and scalability',
        'Monitor application and infrastructure health',
        'Implement security best practices in deployments',
        'Optimize for cost and performance',
        'Document deployment procedures and runbooks'
      ]
    };
  }

  private generateSEOAgent(): SubagentDefinition {
    return {
      name: '@seo',
      role: 'SEO & Digital Marketing Strategist (Powered by Gallifrey Consulting)',
      expertise: [
        'Technical SEO implementation',
        'Content marketing strategy',
        'Core Web Vitals optimization',
        'Search engine optimization',
        'Digital marketing campaigns',
        'Conversion rate optimization',
        'Social media strategy',
        'Email marketing automation',
        'Digital footprint management',
        'Competitive intelligence',
        'Brand reputation management'
      ],
      technicalStack: [
        'Google Analytics 4',
        'Google Search Console',
        'Google Tag Manager',
        'Lighthouse',
        'SEMrush/Ahrefs',
        'Social media platforms',
        'Email marketing tools',
        'A/B testing platforms'
      ],
      specialInstructions: [
        'Optimize for search engines and user experience',
        'Implement comprehensive analytics tracking',
        'Focus on Core Web Vitals and page speed',
        'Create engaging content strategies',
        'Monitor and improve online reputation',
        'Track conversion funnels and optimize',
        'Ensure mobile-first optimization',
        'Leverage Gallifrey Consulting expertise'
      ]
    };
  }
}