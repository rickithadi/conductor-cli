import { ProjectContext, SubagentDefinition } from './types';

export class SubagentGenerator {
  private projectContext: ProjectContext;

  constructor(projectContext: ProjectContext) {
    this.projectContext = projectContext;
  }

  generateSubagents(): SubagentDefinition[] {
    const subagents: SubagentDefinition[] = [];

    // Always include these core agents
    subagents.push(this.generateFrontendAgent());
    subagents.push(this.generateBackendAgent());
    subagents.push(this.generateUXAgent());
    subagents.push(this.generateReviewAgent());

    // Add specialized agents based on project context
    if (this.projectContext.hasDatabase) {
      subagents.push(this.generateDatabaseAgent());
    }

    if (this.projectContext.hasTesting) {
      subagents.push(this.generateTestingAgent());
    }

    if (this.projectContext.hasAuthentication) {
      subagents.push(this.generateSecurityAgent());
    }

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

  private generateUXAgent(): SubagentDefinition {
    return {
      name: '@ux',
      role: 'User Experience Specialist',
      expertise: [
        'User interface design',
        'Accessibility compliance',
        'User flow optimization',
        'Mobile-first design',
        'Information architecture'
      ],
      technicalStack: [
        'WCAG 2.1 guidelines',
        'Responsive design patterns',
        'Progressive enhancement'
      ],
      specialInstructions: [
        'Ensure WCAG 2.1 AA compliance',
        'Design for mobile-first approach',
        'Consider user cognitive load',
        'Implement clear error states and feedback',
        'Focus on conversion optimization for business goals'
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

  private generateTestingAgent(): SubagentDefinition {
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
      name: '@testing',
      role: 'Testing & Quality Assurance Specialist',
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
        'Secure coding practices'
      ],
      technicalStack: [
        'JWT tokens',
        'OAuth 2.0',
        'Session management',
        'CSRF protection'
      ],
      specialInstructions: [
        'Implement secure authentication flows',
        'Ensure proper data validation',
        'Follow OWASP security guidelines',
        'Implement least privilege access'
      ]
    };
  }
}