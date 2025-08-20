import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs-extra';
import * as path from 'path';
import { SecurityScanner, SecurityFinding } from '../src/security-scanner';

describe('SecurityScanner', () => {
  const testDir = path.join(__dirname, 'test-project');
  let scanner: SecurityScanner;

  beforeEach(async () => {
    // Create test project directory
    await fs.ensureDir(testDir);
    scanner = new SecurityScanner(testDir);
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.remove(testDir);
  });

  describe('Secret Detection', () => {
    it('should detect API keys in source code', async () => {
      const testFile = path.join(testDir, 'config.js');
      await fs.writeFile(testFile, `
        const config = {
          api_key: "sk_test_abc123defghijklmnopqrstuv",
          database_url: "postgres://user:pass@host/db"
        };
      `);

      const result = await scanner.scanProject();
      
      expect(result.totalFindings).toBeGreaterThan(0);
      expect(result.critical.some(f => f.description.includes('API Key'))).toBe(true);
    });

    it('should detect JWT secrets', async () => {
      const testFile = path.join(testDir, 'auth.js');
      await fs.writeFile(testFile, `
        const jwt = require('jsonwebtoken');
        const secret = "super_secret_jwt_key_that_should_be_in_env";
        
        function generateToken(payload) {
          return jwt.sign(payload, secret);
        }
      `);

      const result = await scanner.scanProject();
      
      expect(result.critical.some(f => 
        f.description.includes('JWT Secret') || f.description.includes('secret')
      )).toBe(true);
    });

    it('should detect private keys', async () => {
      const testFile = path.join(testDir, 'key.pem');
      await fs.writeFile(testFile, `
        -----BEGIN RSA PRIVATE KEY-----
        MIIEowIBAAKCAQEA4qiw8PWs7PpQKw...
        -----END RSA PRIVATE KEY-----
      `);

      const result = await scanner.scanProject();
      
      expect(result.critical.some(f => f.description.includes('Private Key'))).toBe(true);
    });
  });

  describe('Vulnerability Detection', () => {
    it('should detect SQL injection risks', async () => {
      const testFile = path.join(testDir, 'database.js');
      await fs.writeFile(testFile, `
        function getUserById(id) {
          const query = \`SELECT * FROM users WHERE id = \${id}\`;
          return database.query(query);
        }
      `);

      const result = await scanner.scanProject();
      
      expect(result.critical.some(f => f.description.includes('SQL Injection'))).toBe(true);
    });

    it('should detect XSS risks', async () => {
      const testFile = path.join(testDir, 'frontend.js');
      await fs.writeFile(testFile, `
        function displayUserContent(content) {
          document.getElementById('content').innerHTML = content;
        }
        
        function writeMessage(msg) {
          document.write('<div>' + msg + '</div>');
        }
      `);

      const result = await scanner.scanProject();
      
      expect(result.high.some(f => f.description.includes('XSS'))).toBe(true);
    });

    it('should detect command injection risks', async () => {
      const testFile = path.join(testDir, 'system.js');
      await fs.writeFile(testFile, `
        const { exec } = require('child_process');
        
        function processFile(filename) {
          exec(\`ls -la \${filename}\`, (error, stdout) => {
            console.log(stdout);
          });
        }
      `);

      const result = await scanner.scanProject();
      
      expect(result.high.some(f => f.description.includes('Command Injection'))).toBe(true);
    });

    it('should detect path traversal risks', async () => {
      const testFile = path.join(testDir, 'file-handler.js');
      await fs.writeFile(testFile, `
        function readFile(filename) {
          return fs.readFile('../../../etc/passwd', 'utf8');
        }
      `);

      const result = await scanner.scanProject();
      
      expect(result.medium.some(f => f.description.includes('Path Traversal'))).toBe(true);
    });

    it('should detect weak cryptography', async () => {
      const testFile = path.join(testDir, 'crypto.js');
      await fs.writeFile(testFile, `
        const crypto = require('crypto');
        
        function hashPassword(password) {
          return crypto.createHash('md5').update(password).digest('hex');
        }
      `);

      const result = await scanner.scanProject();
      
      expect(result.medium.some(f => f.description.includes('Weak Cryptography'))).toBe(true);
    });
  });

  describe('OWASP Pattern Detection', () => {
    it('should detect hardcoded credentials', async () => {
      const testFile = path.join(testDir, 'config.js');
      await fs.writeFile(testFile, `
        const dbConfig = {
          password: "hardcoded_password_123",
          token: "abc123def456ghi789jklmnop"
        };
      `);

      const result = await scanner.scanProject();
      
      expect(result.high.some(f => f.description.includes('Hardcoded Credentials'))).toBe(true);
    });

    it('should detect insufficient logging', async () => {
      const testFile = path.join(testDir, 'error-handler.js');
      await fs.writeFile(testFile, `
        try {
          riskyOperation();
        } catch (error) {
          // Silent failure - no logging
        }
      `);

      const result = await scanner.scanProject();
      
      expect(result.medium.some(f => f.description.includes('Insufficient Logging'))).toBe(true);
    });
  });

  describe('File Exclusion', () => {
    it('should exclude node_modules and test files', async () => {
      // Create files that should be excluded
      const nodeModulesDir = path.join(testDir, 'node_modules');
      await fs.ensureDir(nodeModulesDir);
      await fs.writeFile(path.join(nodeModulesDir, 'package.js'), 'api_key: "should_be_ignored"');
      
      const testFile = path.join(testDir, 'test.spec.js');
      await fs.writeFile(testFile, 'api_key: "should_be_ignored_in_tests"');

      // Create a legitimate source file with secrets
      const srcFile = path.join(testDir, 'src.js');
      await fs.writeFile(srcFile, 'api_key: "this_should_be_detected"');

      const result = await scanner.scanProject();
      
      // Should only detect the secret in src file, not in excluded files
      expect(result.totalFindings).toBeGreaterThan(0);
      expect(result.critical.every(f => !f.file.includes('node_modules'))).toBe(true);
      expect(result.critical.every(f => !f.file.includes('test'))).toBe(true);
    });
  });

  describe('Report Generation', () => {
    it('should generate detailed JSON reports', async () => {
      const testFile = path.join(testDir, 'vulnerable.js');
      await fs.writeFile(testFile, `
        const secret = "hardcoded_secret_key_123";
        function query(id) {
          return \`SELECT * FROM users WHERE id = \${id}\`;
        }
      `);

      const result = await scanner.scanProject();
      const reportPath = await scanner.generateDetailedReport(result);
      
      expect(await fs.pathExists(reportPath)).toBe(true);
      
      const report = await fs.readJson(reportPath);
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('findings');
      expect(report.summary).toHaveProperty('totalFindings');
      expect(report.summary.totalFindings).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should complete scans within reasonable time', async () => {
      // Create multiple test files
      for (let i = 0; i < 10; i++) {
        await fs.writeFile(path.join(testDir, `file${i}.js`), `
          const normalCode = "this is fine";
          function process() {
            return "safe operation";
          }
        `);
      }

      const startTime = Date.now();
      const result = await scanner.scanProject();
      const scanTime = Date.now() - startTime;
      
      expect(scanTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(result.scannedFiles).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should handle unreadable files gracefully', async () => {
      const testFile = path.join(testDir, 'binary.bin');
      await fs.writeFile(testFile, Buffer.from([0x00, 0x01, 0x02, 0x03]));

      const result = await scanner.scanProject();
      
      // Should not crash and should return valid result
      expect(result).toHaveProperty('totalFindings');
      expect(typeof result.totalFindings).toBe('number');
    });

    it('should handle empty project gracefully', async () => {
      const result = await scanner.scanProject();
      
      expect(result.totalFindings).toBe(0);
      expect(result.scannedFiles).toBe(0);
    });
  });

  describe('Integration with Package.json', () => {
    it('should scan dependencies when package.json exists', async () => {
      const packageJson = {
        name: 'test-project',
        dependencies: {
          'lodash': '^4.0.0'
        }
      };
      
      await fs.writeJson(path.join(testDir, 'package.json'), packageJson);
      
      const result = await scanner.scanProject();
      
      // Should attempt to scan dependencies (may not find vulnerabilities in test)
      expect(result).toHaveProperty('totalFindings');
    });
  });
});