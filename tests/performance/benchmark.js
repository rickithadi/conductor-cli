#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

/**
 * Performance benchmark for Conductor CLI
 * Tests key operations and measures response times
 */

class PerformanceBenchmark {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        memory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
        node: process.version
      },
      benchmarks: {}
    };
    this.testProjectPath = path.join(os.tmpdir(), 'conductor-perf-test', Date.now().toString());
  }

  async run() {
    console.log('🚀 Starting Conductor CLI Performance Benchmark');
    console.log(`📊 System: ${this.results.system.platform} ${this.results.system.arch}, ${this.results.system.cpus} CPUs, ${this.results.system.memory}`);
    console.log(`📁 Test project: ${this.testProjectPath}`);

    try {
      await this.setup();
      await this.benchmarkInitialization();
      await this.benchmarkLaunchValidation();
      await this.benchmarkStatusQueries();
      await this.benchmarkHelpCommands();
      await this.generateReport();
    } finally {
      await this.cleanup();
    }
  }

  async setup() {
    console.log('\n📋 Setting up test environment...');
    await fs.ensureDir(this.testProjectPath);
    
    // Create minimal package.json
    const packageJson = {
      name: 'perf-test-project',
      version: '1.0.0',
      dependencies: {
        react: '^18.0.0',
        next: '^14.0.0',
        typescript: '^5.0.0'
      }
    };
    
    await fs.writeJson(path.join(this.testProjectPath, 'package.json'), packageJson);
    console.log('✅ Test environment ready');
  }

  async benchmarkInitialization() {
    console.log('\n⚡ Benchmarking: Project Initialization');
    
    const iterations = 5;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      // Clean slate for each test
      const conductorDir = path.join(this.testProjectPath, '.conductor');
      if (await fs.pathExists(conductorDir)) {
        await fs.remove(conductorDir);
      }
      
      const startTime = Date.now();
      const result = await this.runCommand(['init', '--quick'], { timeout: 30000 });
      const duration = Date.now() - startTime;
      
      times.push(duration);
      console.log(`  Iteration ${i + 1}: ${duration}ms ${result.exitCode === 0 ? '✅' : '❌'}`);
    }
    
    this.results.benchmarks.initialization = {
      iterations,
      times,
      average: Math.round(times.reduce((a, b) => a + b) / times.length),
      min: Math.min(...times),
      max: Math.max(...times),
      median: this.calculateMedian(times)
    };
    
    console.log(`📊 Initialization Average: ${this.results.benchmarks.initialization.average}ms`);
  }

  async benchmarkLaunchValidation() {
    console.log('\n⚡ Benchmarking: Launch Validation (without actual Claude launch)');
    
    const iterations = 3;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      // This will timeout at user input prompt, which is expected
      await this.runCommand(['launch'], { 
        timeout: 10000, 
        allowTimeout: true 
      });
      const duration = Date.now() - startTime;
      
      times.push(duration);
      console.log(`  Iteration ${i + 1}: ${duration}ms ⚡`);
    }
    
    this.results.benchmarks.launchValidation = {
      iterations,
      times,
      average: Math.round(times.reduce((a, b) => a + b) / times.length),
      min: Math.min(...times),
      max: Math.max(...times),
      median: this.calculateMedian(times)
    };
    
    console.log(`📊 Launch Validation Average: ${this.results.benchmarks.launchValidation.average}ms`);
  }

  async benchmarkStatusQueries() {
    console.log('\n⚡ Benchmarking: Status Queries');
    
    const commands = [
      ['status'],
      ['status', '--verbose'],
      ['status', '--json']
    ];
    
    for (const cmd of commands) {
      const cmdName = cmd.join(' ');
      const iterations = 10;
      const times = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        const result = await this.runCommand(cmd, { timeout: 10000 });
        const duration = Date.now() - startTime;
        
        times.push(duration);
        if (i === 0) console.log(`  ${cmdName}: ${duration}ms ${result.exitCode === 0 ? '✅' : '❌'}`);
      }
      
      this.results.benchmarks[`status_${cmd.join('_')}`] = {
        command: cmdName,
        iterations,
        times,
        average: Math.round(times.reduce((a, b) => a + b) / times.length),
        min: Math.min(...times),
        max: Math.max(...times),
        median: this.calculateMedian(times)
      };
      
      console.log(`📊 ${cmdName} Average: ${this.results.benchmarks[`status_${cmd.join('_')}`].average}ms`);
    }
  }

  async benchmarkHelpCommands() {
    console.log('\n⚡ Benchmarking: Help Commands');
    
    const commands = [
      ['--help'],
      ['help'],
      ['init', '--help'],
      ['launch', '--help']
    ];
    
    for (const cmd of commands) {
      const cmdName = cmd.join(' ');
      const startTime = Date.now();
      const result = await this.runCommand(cmd, { timeout: 5000 });
      const duration = Date.now() - startTime;
      
      this.results.benchmarks[`help_${cmd.join('_').replace('--', '')}`] = {
        command: cmdName,
        duration,
        success: result.exitCode === 0
      };
      
      console.log(`  ${cmdName}: ${duration}ms ${result.exitCode === 0 ? '✅' : '❌'}`);
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Performance Report...');
    
    // Performance thresholds (in milliseconds)
    const thresholds = {
      initialization: 15000, // Should complete init within 15 seconds
      launchValidation: 10000, // Should validate and show UI within 10 seconds
      status: 2000, // Status commands should be under 2 seconds
      help: 1000 // Help commands should be instant
    };
    
    // Analyze results
    const analysis = {
      passed: 0,
      failed: 0,
      warnings: [],
      failures: []
    };
    
    // Check initialization performance
    const initPerf = this.results.benchmarks.initialization;
    if (initPerf.average <= thresholds.initialization) {
      analysis.passed++;
      console.log(`✅ Initialization: ${initPerf.average}ms (under ${thresholds.initialization}ms)`);
    } else {
      analysis.failed++;
      analysis.failures.push(`Initialization too slow: ${initPerf.average}ms > ${thresholds.initialization}ms`);
      console.log(`❌ Initialization: ${initPerf.average}ms (exceeds ${thresholds.initialization}ms)`);
    }
    
    // Check launch validation performance
    const launchPerf = this.results.benchmarks.launchValidation;
    if (launchPerf.average <= thresholds.launchValidation) {
      analysis.passed++;
      console.log(`✅ Launch Validation: ${launchPerf.average}ms (under ${thresholds.launchValidation}ms)`);
    } else {
      analysis.failed++;
      analysis.failures.push(`Launch validation too slow: ${launchPerf.average}ms > ${thresholds.launchValidation}ms`);
      console.log(`❌ Launch Validation: ${launchPerf.average}ms (exceeds ${thresholds.launchValidation}ms)`);
    }
    
    // Check status command performance
    const statusPerf = this.results.benchmarks.status_;
    if (statusPerf && statusPerf.average <= thresholds.status) {
      analysis.passed++;
      console.log(`✅ Status Command: ${statusPerf.average}ms (under ${thresholds.status}ms)`);
    } else if (statusPerf) {
      analysis.failed++;
      analysis.failures.push(`Status command too slow: ${statusPerf.average}ms > ${thresholds.status}ms`);
      console.log(`❌ Status Command: ${statusPerf.average}ms (exceeds ${thresholds.status}ms)`);
    }
    
    // Overall assessment
    this.results.analysis = analysis;
    this.results.thresholds = thresholds;
    
    // Save detailed results
    const resultsPath = path.join(__dirname, '../../performance-results.json');
    await fs.writeJson(resultsPath, this.results, { spaces: 2 });
    
    // Print summary
    console.log('\n📊 PERFORMANCE SUMMARY');
    console.log('═'.repeat(50));
    console.log(`✅ Passed: ${analysis.passed}`);
    console.log(`❌ Failed: ${analysis.failed}`);
    
    if (analysis.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      analysis.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    if (analysis.failures.length > 0) {
      console.log('\n❌ Failures:');
      analysis.failures.forEach(failure => console.log(`  • ${failure}`));
    }
    
    console.log(`\n📁 Detailed results saved to: ${resultsPath}`);
    
    // Exit with appropriate code
    if (analysis.failed > 0) {
      console.log('\n💥 Performance benchmark FAILED');
      process.exit(1);
    } else {
      console.log('\n🎉 Performance benchmark PASSED');
      process.exit(0);
    }
  }

  async runCommand(args, options = {}) {
    const {
      timeout = 10000,
      allowTimeout = false
    } = options;
    
    return new Promise((resolve, reject) => {
      const cliPath = path.join(__dirname, '../../src/enhanced-cli.ts');
      let stdout = '';
      let stderr = '';
      let resolved = false;
      
      const child = spawn('npx', ['tsx', cliPath, ...args], {
        cwd: this.testProjectPath,
        stdio: 'pipe',
        env: {
          ...process.env,
          NODE_ENV: 'test',
          CONDUCTOR_TEST_MODE: 'true',
          CONDUCTOR_LOG_LEVEL: 'error'
        }
      });
      
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (!resolved) {
          resolved = true;
          resolve({ stdout, stderr, exitCode: code || 0 });
        }
      });
      
      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          if (allowTimeout && error.message.includes('timeout')) {
            resolve({ stdout, stderr, exitCode: 0 });
          } else {
            reject(error);
          }
        }
      });
      
      // Timeout handling
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill('SIGTERM');
          
          if (allowTimeout) {
            resolve({ stdout, stderr, exitCode: 0 });
          } else {
            reject(new Error(`Command timed out after ${timeout}ms`));
          }
        }
      }, timeout);
      
      child.on('close', () => clearTimeout(timeoutId));
    });
  }

  calculateMedian(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
    } else {
      return sorted[middle];
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up test environment...');
    
    if (await fs.pathExists(this.testProjectPath)) {
      await fs.remove(this.testProjectPath);
      console.log('✅ Test project removed');
    }
  }
}

// Run benchmark if called directly
if (require.main === module) {
  const benchmark = new PerformanceBenchmark();
  benchmark.run().catch(console.error);
}

module.exports = PerformanceBenchmark;