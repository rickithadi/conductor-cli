#!/usr/bin/env node

/**
 * NPX Runner for Conductor CLI
 * Enables: npx conductor-cli <command>
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Detect if running via npx
const isNpx = !require.main.filename.includes('node_modules/.bin');

// Get the actual CLI path
const cliPath = path.join(__dirname, 'dist', 'enhanced-cli.js');

// Check if built files exist
if (!fs.existsSync(cliPath)) {
    console.log('⏳ First run detected - Building Conductor CLI...');
    
    try {
        // Build the project
        require('child_process').execSync('npm run build', {
            cwd: __dirname,
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('❌ Build failed. Trying fallback mode...');
        // Fallback to TypeScript runner
        const tsxPath = path.join(__dirname, 'src', 'enhanced-cli.ts');
        require('child_process').spawn('npx', ['tsx', tsxPath, ...process.argv.slice(2)], {
            stdio: 'inherit',
            shell: true
        });
        return;
    }
}

// Run the CLI with passed arguments
const child = spawn('node', [cliPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: {
        ...process.env,
        CONDUCTOR_NPX_MODE: 'true'
    }
});

child.on('exit', (code) => {
    process.exit(code);
});