#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚀 Conductor CLI - Setting up your AI development team...\n');

// Check if this is being run via npx
const isNpx = process.env.npm_config_user_agent && process.env.npm_config_user_agent.includes('npx');
const isGlobalInstall = process.env.npm_config_global === 'true';

if (isNpx) {
    console.log('✨ Running via npx - Quick start mode activated!\n');
    console.log('Usage: npx conductor-cli <command>\n');
    console.log('Commands:');
    console.log('  init           - Initialize AI team in your project');
    console.log('  ask <question> - Consult with AI specialists');
    console.log('  swarm          - Activate hive-mind coordination');
    console.log('  help           - Show all available commands\n');
} else if (isGlobalInstall) {
    console.log('✅ Global installation complete!\n');
    console.log('You can now use: conductor <command>\n');
} else {
    console.log('✅ Local installation complete!\n');
    console.log('Add to your package.json scripts or use: npx conductor <command>\n');
}

// Create default config directory if it doesn't exist
const configDir = path.join(process.cwd(), '.conductor');
if (!fs.existsSync(configDir) && !isNpx) {
    try {
        fs.mkdirSync(configDir, { recursive: true });
        console.log('📁 Created .conductor config directory');
    } catch (error) {
        // Ignore errors in CI or restricted environments
    }
}

console.log('📚 Documentation: https://github.com/rickithadi/conductor-cli');
console.log('💬 Support: https://github.com/rickithadi/conductor-cli/issues\n');

// Show quick start for npx users
if (isNpx) {
    console.log('🎯 Quick Start:');
    console.log('   npx conductor-cli init');
    console.log('   npx conductor-cli ask "help me build a REST API"');
    console.log('   npx conductor-cli swarm --implement\n');
}