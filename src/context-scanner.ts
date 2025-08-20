import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import { ProjectContext, FrameworkDetectionResult } from './types';

export class ContextScanner {
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  async scan(): Promise<ProjectContext> {
    const packageJson = await this.readPackageJson();
    const framework = await this.detectFramework();
    const language = await this.detectLanguage();
    const packageManager = await this.detectPackageManager();
    
    return {
      framework: framework.framework,
      language,
      packageManager,
      hasDatabase: await this.hasDatabase(),
      hasAuthentication: await this.hasAuthentication(),
      hasAPI: await this.hasAPI(),
      hasTesting: await this.hasTesting(),
      hasLinting: await this.hasLinting(),
      hasTypeScript: await this.hasTypeScript(),
      brandGuidelines: await this.findBrandGuidelines(),
      apiDocs: await this.findAPIDocs(),
      architecturalDecisions: await this.findArchitecturalDecisions(),
      dependencies: packageJson?.dependencies ? Object.keys(packageJson.dependencies) : [],
      devDependencies: packageJson?.devDependencies ? Object.keys(packageJson.devDependencies) : [],
      scripts: packageJson?.scripts || {},
      rootPath: this.projectPath,
    };
  }

  private async readPackageJson(): Promise<any> {
    try {
      const packagePath = path.join(this.projectPath, 'package.json');
      if (await fs.pathExists(packagePath)) {
        return await fs.readJson(packagePath);
      }
    } catch (error) {
      console.warn('Could not read package.json:', error);
    }
    return null;
  }

  private async detectFramework(): Promise<FrameworkDetectionResult> {
    const packageJson = await this.readPackageJson();
    const dependencies = {
      ...packageJson?.dependencies,
      ...packageJson?.devDependencies,
    };

    // Framework detection patterns
    const frameworks = [
      {
        name: 'nextjs',
        patterns: ['next', '@next/'],
        files: ['next.config.js', 'next.config.ts'],
        confidence: 0.9,
      },
      {
        name: 'react',
        patterns: ['react', 'react-dom'],
        files: ['src/App.tsx', 'src/App.jsx'],
        confidence: 0.8,
      },
      {
        name: 'vue',
        patterns: ['vue', '@vue/'],
        files: ['vue.config.js', 'src/App.vue'],
        confidence: 0.8,
      },
      {
        name: 'angular',
        patterns: ['@angular/'],
        files: ['angular.json', 'src/app/app.module.ts'],
        confidence: 0.9,
      },
      {
        name: 'svelte',
        patterns: ['svelte'],
        files: ['svelte.config.js', 'src/App.svelte'],
        confidence: 0.8,
      },
      {
        name: 'express',
        patterns: ['express'],
        files: ['app.js', 'server.js', 'index.js'],
        confidence: 0.7,
      },
      {
        name: 'fastify',
        patterns: ['fastify'],
        files: [],
        confidence: 0.7,
      },
      {
        name: 'jekyll',
        patterns: [],
        files: ['_config.yml', 'Gemfile'],
        confidence: 0.8,
      },
    ];

    for (const framework of frameworks) {
      let score = 0;
      const indicators: string[] = [];

      // Check dependencies
      for (const pattern of framework.patterns) {
        const matchingDeps = Object.keys(dependencies || {}).filter(dep => 
          dep.includes(pattern)
        );
        if (matchingDeps.length > 0) {
          score += framework.confidence;
          indicators.push(...matchingDeps);
        }
      }

      // Check for framework-specific files
      for (const file of framework.files) {
        if (await fs.pathExists(path.join(this.projectPath, file))) {
          score += 0.3;
          indicators.push(file);
        }
      }

      if (score > 0.5) {
        return {
          framework: framework.name,
          confidence: Math.min(score, 1.0),
          indicators,
        };
      }
    }

    return {
      framework: 'unknown',
      confidence: 0,
      indicators: [],
    };
  }

  private async detectLanguage(): Promise<string> {
    const hasTypeScript = await this.hasTypeScript();
    if (hasTypeScript) return 'typescript';

    const jsFiles = await glob('**/*.js', { cwd: this.projectPath });
    if (jsFiles.length > 0) return 'javascript';

    const pyFiles = await glob('**/*.py', { cwd: this.projectPath });
    if (pyFiles.length > 0) return 'python';

    const goFiles = await glob('**/*.go', { cwd: this.projectPath });
    if (goFiles.length > 0) return 'go';

    const rustFiles = await glob('**/*.rs', { cwd: this.projectPath });
    if (rustFiles.length > 0) return 'rust';

    return 'unknown';
  }

  private async detectPackageManager(): Promise<string> {
    if (await fs.pathExists(path.join(this.projectPath, 'pnpm-lock.yaml'))) {
      return 'pnpm';
    }
    if (await fs.pathExists(path.join(this.projectPath, 'yarn.lock'))) {
      return 'yarn';
    }
    if (await fs.pathExists(path.join(this.projectPath, 'package-lock.json'))) {
      return 'npm';
    }
    return 'npm';
  }

  private async hasTypeScript(): Promise<boolean> {
    return await fs.pathExists(path.join(this.projectPath, 'tsconfig.json'));
  }

  private async hasDatabase(): Promise<boolean> {
    const packageJson = await this.readPackageJson();
    const deps = Object.keys({
      ...packageJson?.dependencies,
      ...packageJson?.devDependencies,
    });

    const dbPatterns = [
      'prisma', 'mongoose', 'sequelize', 'typeorm', 'drizzle',
      'pg', 'mysql', 'sqlite', 'mongodb', 'redis'
    ];

    return dbPatterns.some(pattern => 
      deps.some(dep => dep.includes(pattern))
    );
  }

  private async hasAuthentication(): Promise<boolean> {
    const packageJson = await this.readPackageJson();
    const deps = Object.keys({
      ...packageJson?.dependencies,
      ...packageJson?.devDependencies,
    });

    const authPatterns = [
      'auth', 'passport', 'jwt', 'bcrypt', 'next-auth',
      'firebase-auth', 'supabase', 'clerk'
    ];

    return authPatterns.some(pattern => 
      deps.some(dep => dep.includes(pattern))
    );
  }

  private async hasAPI(): Promise<boolean> {
    const apiFiles = await glob('**/api/**/*.{js,ts}', { cwd: this.projectPath });
    const routeFiles = await glob('**/routes/**/*.{js,ts}', { cwd: this.projectPath });
    const controllerFiles = await glob('**/controllers/**/*.{js,ts}', { cwd: this.projectPath });
    
    return apiFiles.length > 0 || routeFiles.length > 0 || controllerFiles.length > 0;
  }

  private async hasTesting(): Promise<boolean> {
    const packageJson = await this.readPackageJson();
    const deps = Object.keys({
      ...packageJson?.dependencies,
      ...packageJson?.devDependencies,
    });

    const testPatterns = [
      'jest', 'vitest', 'cypress', 'playwright', 'mocha',
      'chai', 'testing-library', 'enzyme'
    ];

    return testPatterns.some(pattern => 
      deps.some(dep => dep.includes(pattern))
    );
  }

  private async hasLinting(): Promise<boolean> {
    const eslintConfig = await fs.pathExists(path.join(this.projectPath, '.eslintrc.json')) ||
                        await fs.pathExists(path.join(this.projectPath, '.eslintrc.js')) ||
                        await fs.pathExists(path.join(this.projectPath, 'eslint.config.js'));
    
    return eslintConfig;
  }

  private async findBrandGuidelines(): Promise<string | undefined> {
    const brandFiles = await glob('**/brand*', { cwd: this.projectPath });
    const styleGuideFiles = await glob('**/style-guide*', { cwd: this.projectPath });
    const designFiles = await glob('**/design/**/*.md', { cwd: this.projectPath });
    
    const allFiles = [...brandFiles, ...styleGuideFiles, ...designFiles];
    return allFiles.length > 0 ? allFiles[0] : undefined;
  }

  private async findAPIDocs(): Promise<string | undefined> {
    const apiDocFiles = await glob('**/api/**/*.md', { cwd: this.projectPath });
    const docsApiFiles = await glob('**/docs/api/**/*', { cwd: this.projectPath });
    const swaggerFiles = await glob('**/swagger*', { cwd: this.projectPath });
    
    const allFiles = [...apiDocFiles, ...docsApiFiles, ...swaggerFiles];
    return allFiles.length > 0 ? allFiles[0] : undefined;
  }

  private async findArchitecturalDecisions(): Promise<string[]> {
    const adrFiles = await glob('**/adr/**/*.md', { cwd: this.projectPath });
    const decisionFiles = await glob('**/decisions/**/*.md', { cwd: this.projectPath });
    const archFiles = await glob('**/architecture/**/*.md', { cwd: this.projectPath });
    
    return [...adrFiles, ...decisionFiles, ...archFiles];
  }
}