// Stub implementation for ContextScanner to satisfy TypeScript
export interface ProjectContext {
  framework?: string;
  language?: string;
  hasAPI?: boolean;
  hasDatabase?: boolean;
  hasAuthentication?: boolean;
  hasTesting?: boolean;
  dependencies?: string[];
}

export class ContextScanner {
  async scanProject(projectPath: string): Promise<ProjectContext> {
    // This would be implemented with actual project scanning logic
    return {
      framework: 'nextjs',
      language: 'typescript',
      hasAPI: true,
      hasDatabase: false,
      hasAuthentication: false,
      hasTesting: true,
      dependencies: ['react', 'next', 'typescript']
    };
  }
}