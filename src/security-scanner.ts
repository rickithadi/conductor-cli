import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export interface SecurityFinding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  file: string;
  line?: number;
  description: string;
  recommendation: string;
  cwe?: string; // Common Weakness Enumeration
  owasp?: string; // OWASP category
}

export interface SecurityScanResult {
  totalFindings: number;
  critical: SecurityFinding[];
  high: SecurityFinding[];
  medium: SecurityFinding[];
  low: SecurityFinding[];
  info: SecurityFinding[];
  scanTime: number;
  scannedFiles: number;
}

export class SecurityScanner {
  private projectPath: string;
  private excludePatterns: string[];

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.excludePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.env.example',
      'test',
      'tests',
      '__tests__'
    ];
  }

  async scanProject(): Promise<SecurityScanResult> {
    const startTime = Date.now();
    console.log(chalk.blue('🔒 AEGIS SECURITY SCAN - Starting comprehensive security analysis...'));
    
    const findings: SecurityFinding[] = [];
    const files = await this.getProjectFiles();
    
    // Run multiple security scans
    const [
      secretFindings,
      vulnerabilityFindings,
      owaspFindings,
      dependencyFindings
    ] = await Promise.all([
      this.scanForSecrets(files),
      this.scanForVulnerabilities(files),
      this.scanOWASPPatterns(files),
      this.scanDependencies()
    ]);

    findings.push(...secretFindings, ...vulnerabilityFindings, ...owaspFindings, ...dependencyFindings);

    const result = this.categorizeFindings(findings);
    result.scanTime = Date.now() - startTime;
    result.scannedFiles = files.length;

    this.displayResults(result);
    return result;
  }

  private async getProjectFiles(): Promise<string[]> {
    const files: string[] = [];
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.php', '.go', '.rb', '.cs', '.pem', '.key', '.env', '.conf', '.config', '.yaml', '.yml', '.json', '.xml'];
    
    const walkDir = async (dir: string): Promise<void> => {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        // Skip if the path contains exclude patterns
        if (this.excludePatterns.some(pattern => {
          // Exclude based on specific conditions
          if (pattern === 'node_modules') {
            return item === pattern || fullPath.includes('node_modules');
          }
          if (pattern === 'test' || pattern === 'tests' || pattern === '__tests__') {
            // Exclude files that have test in the name, but allow test directories for running tests
            return item.includes(pattern) && !stat.isDirectory();
          }
          return item === pattern;
        })) {
          continue;
        }
        
        if (stat.isDirectory()) {
          await walkDir(fullPath);
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };

    await walkDir(this.projectPath);
    return files;
  }

  private async scanForSecrets(files: string[]): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const secretPatterns = [
      { name: 'API Key', pattern: /api[_-]?key['"]*\s*[:=]\s*['"][a-zA-Z0-9_]{15,}['"]/, severity: 'critical' as const },
      { name: 'Database Password', pattern: /password['"]*\s*[:=]\s*['"][^'"]{4,}['"]/, severity: 'high' as const },
      { name: 'JWT Secret', pattern: /(jwt[_-]?secret|secret)['"]*\s*[:=]\s*['"][^'"]{15,}['"]/, severity: 'critical' as const },
      { name: 'Private Key', pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/, severity: 'critical' as const },
      { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/, severity: 'critical' as const },
      { name: 'Generic Secret', pattern: /secret['"]*\s*[:=]\s*['"][^'"]{10,}['"]/, severity: 'medium' as const },
      { name: 'Hardcoded Credentials', pattern: /(username|user|password|pass)['"]*\s*[:=]\s*['"][^'"]{3,}['"]/, severity: 'high' as const }
    ];

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          for (const pattern of secretPatterns) {
            if (pattern.pattern.test(line)) {
              findings.push({
                severity: pattern.severity,
                category: 'Secret Detection',
                file: path.relative(this.projectPath, file),
                line: i + 1,
                description: `Potential ${pattern.name} found in source code`,
                recommendation: 'Move sensitive data to environment variables or secure key management',
                cwe: 'CWE-798',
                owasp: 'A02:2021 – Cryptographic Failures'
              });
            }
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async scanForVulnerabilities(files: string[]): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const vulnPatterns = [
      { 
        name: 'SQL Injection Risk',
        pattern: /\$\{.*\}.*SELECT|SELECT.*\$\{.*\}|query\s*\(\s*['"`].*\$\{/i,
        severity: 'critical' as const,
        cwe: 'CWE-89',
        owasp: 'A03:2021 – Injection'
      },
      {
        name: 'XSS Risk',
        pattern: /innerHTML\s*=|document\.write\s*\(|\.html\s*\(/i,
        severity: 'high' as const,
        cwe: 'CWE-79',
        owasp: 'A03:2021 – Injection'
      },
      {
        name: 'Command Injection Risk',
        pattern: /exec\s*\(|system\s*\(|shell_exec/i,
        severity: 'high' as const,
        cwe: 'CWE-78',
        owasp: 'A03:2021 – Injection'
      },
      {
        name: 'Path Traversal Risk',
        pattern: /\.\.\//,
        severity: 'medium' as const,
        cwe: 'CWE-22',
        owasp: 'A01:2021 – Broken Access Control'
      },
      {
        name: 'Weak Cryptography',
        pattern: /md5|sha1(?![\d])|DES|RC4/i,
        severity: 'medium' as const,
        cwe: 'CWE-327',
        owasp: 'A02:2021 – Cryptographic Failures'
      }
    ];

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          for (const pattern of vulnPatterns) {
            if (pattern.pattern.test(line)) {
              findings.push({
                severity: pattern.severity,
                category: 'Vulnerability',
                file: path.relative(this.projectPath, file),
                line: i + 1,
                description: `${pattern.name} detected`,
                recommendation: this.getRecommendation(pattern.name),
                cwe: pattern.cwe,
                owasp: pattern.owasp
              });
            }
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async scanOWASPPatterns(files: string[]): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const owaspPatterns = [
      {
        name: 'Hardcoded Credentials',
        pattern: /(password|user|username)['"\s]*[:=]\s*['"][^'"]+['"]|hardcoded_password/i,
        severity: 'high' as const,
        owasp: 'A07:2021 – Identification and Authentication Failures'
      },
      {
        name: 'Insufficient Logging',
        pattern: /catch\s*\([^)]*\)\s*\{\s*(\/\/.*|\s*)\}|no\s+logging|insufficient.*log/i,
        severity: 'medium' as const,
        owasp: 'A09:2021 – Security Logging and Monitoring Failures'
      },
      {
        name: 'Insecure Direct Object Reference',
        pattern: /req\.params\.[^.]*id.*database|findById\s*\(\s*req\.params/i,
        severity: 'medium' as const,
        owasp: 'A01:2021 – Broken Access Control'
      }
    ];

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          for (const pattern of owaspPatterns) {
            if (pattern.pattern.test(line)) {
              findings.push({
                severity: pattern.severity,
                category: 'OWASP',
                file: path.relative(this.projectPath, file),
                line: i + 1,
                description: pattern.name,
                recommendation: this.getOWASPRecommendation(pattern.name),
                owasp: pattern.owasp
              });
            }
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return findings;
  }

  private async scanDependencies(): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        // Run npm audit if available
        const { stdout } = await execAsync('npm audit --json', { cwd: this.projectPath });
        const auditResult = JSON.parse(stdout);
        
        if (auditResult.vulnerabilities) {
          Object.entries(auditResult.vulnerabilities).forEach(([pkg, vuln]: [string, any]) => {
            findings.push({
              severity: this.mapNpmSeverity(vuln.severity),
              category: 'Dependency',
              file: 'package.json',
              description: `${pkg}: ${vuln.title}`,
              recommendation: `Update ${pkg} to version ${vuln.fixAvailable || 'latest'}`,
              cwe: vuln.cwe || 'Unknown'
            });
          });
        }
      } catch (error) {
        // npm audit not available or failed
      }
    }

    return findings;
  }

  private mapNpmSeverity(npmSeverity: string): SecurityFinding['severity'] {
    const mapping: Record<string, SecurityFinding['severity']> = {
      'critical': 'critical',
      'high': 'high',
      'moderate': 'medium',
      'low': 'low',
      'info': 'info'
    };
    return mapping[npmSeverity] || 'medium';
  }

  private getRecommendation(vulnType: string): string {
    const recommendations: Record<string, string> = {
      'SQL Injection Risk': 'Use parameterized queries or ORM with proper escaping',
      'XSS Risk': 'Sanitize user input and use safe DOM manipulation methods',
      'Command Injection Risk': 'Validate input and use safe command execution methods',
      'Path Traversal Risk': 'Validate file paths and use path.resolve() to prevent directory traversal',
      'Weak Cryptography': 'Use strong cryptographic algorithms like AES-256 or SHA-256+'
    };
    return recommendations[vulnType] || 'Review code for security implications';
  }

  private getOWASPRecommendation(owaspType: string): string {
    const recommendations: Record<string, string> = {
      'Hardcoded Credentials': 'Store credentials in environment variables or secure vault',
      'Insufficient Logging': 'Add proper error logging and monitoring',
      'Insecure Direct Object Reference': 'Implement proper authorization checks'
    };
    return recommendations[owaspType] || 'Follow OWASP security guidelines';
  }

  private categorizeFindings(findings: SecurityFinding[]): SecurityScanResult {
    return {
      totalFindings: findings.length,
      critical: findings.filter(f => f.severity === 'critical'),
      high: findings.filter(f => f.severity === 'high'),
      medium: findings.filter(f => f.severity === 'medium'),
      low: findings.filter(f => f.severity === 'low'),
      info: findings.filter(f => f.severity === 'info'),
      scanTime: 0, // Will be set by caller
      scannedFiles: 0 // Will be set by caller
    };
  }

  private displayResults(result: SecurityScanResult): void {
    console.log(chalk.blue('\n🔒 AEGIS SECURITY SCAN RESULTS'));
    console.log(chalk.gray('═'.repeat(60)));
    
    console.log(`📊 Scanned ${result.scannedFiles} files in ${result.scanTime}ms`);
    console.log(`🎯 Found ${result.totalFindings} security findings\n`);

    if (result.critical.length > 0) {
      console.log(chalk.red(`🔴 CRITICAL (${result.critical.length})`));
      result.critical.slice(0, 3).forEach(f => {
        console.log(`   ${f.file}:${f.line} - ${f.description}`);
      });
      if (result.critical.length > 3) {
        console.log(chalk.gray(`   ... and ${result.critical.length - 3} more`));
      }
      console.log();
    }

    if (result.high.length > 0) {
      console.log(chalk.yellow(`🟠 HIGH (${result.high.length})`));
      result.high.slice(0, 2).forEach(f => {
        console.log(`   ${f.file}:${f.line} - ${f.description}`);
      });
      if (result.high.length > 2) {
        console.log(chalk.gray(`   ... and ${result.high.length - 2} more`));
      }
      console.log();
    }

    if (result.medium.length > 0) {
      console.log(chalk.blue(`🟡 MEDIUM (${result.medium.length})`));
      result.medium.slice(0, 2).forEach(f => {
        console.log(`   ${f.file}:${f.line} - ${f.description}`);
      });
      if (result.medium.length > 2) {
        console.log(chalk.gray(`   ... and ${result.medium.length - 2} more`));
      }
      console.log();
    }

    if (result.totalFindings === 0) {
      console.log(chalk.green('✅ No security issues found'));
    }

    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.blue('💡 Use --detailed flag for full findings report'));
    console.log(chalk.blue('💡 Use --json flag for machine-readable output'));
  }

  async generateDetailedReport(result: SecurityScanResult, outputPath?: string): Promise<string> {
    const report = {
      summary: {
        scanTime: new Date().toISOString(),
        totalFindings: result.totalFindings,
        scannedFiles: result.scannedFiles,
        scanDuration: result.scanTime
      },
      findings: {
        critical: result.critical,
        high: result.high,
        medium: result.medium,
        low: result.low,
        info: result.info
      }
    };

    const reportPath = outputPath || path.join(this.projectPath, 'aegis-security-report.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(chalk.green(`📄 Detailed report saved to: ${reportPath}`));
    return reportPath;
  }
}