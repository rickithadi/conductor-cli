# 🔧 Conductor CLI - Troubleshooting Guide

> **Common issues and solutions for the AI development orchestrator**

This guide helps resolve common issues when using Conductor CLI's multi-agent workflow system, powered by Claude Code and Anthropic's Claude AI, with professional security integration by Gallifrey Consulting.

---

## 🚀 **Quick Fixes**

### **Common Issues & Solutions**

| Issue | Quick Fix |
|-------|-----------|
| Command not found | Run `npm install -g conductor-cli` |
| Claude API error | Set `CLAUDE_API_KEY` environment variable |
| Initialization fails | Use `conductor init --force` to reset |
| Dashboard won't start | Check port availability with `--port 3001` |
| Security scan fails | Update dependencies and retry |
| Agent context empty | Run `conductor init --force` to regenerate |

---

## ⚠️ **Installation Issues**

### **Problem: `conductor: command not found`**

**Solution:**
```bash
# Check if installed globally
npm list -g conductor-cli

# If not installed, install globally
npm install -g conductor-cli

# If installation fails, try with sudo (macOS/Linux)
sudo npm install -g conductor-cli

# On Windows with PowerShell, run as Administrator
npm install -g conductor-cli

# Verify installation
conductor --version
```

**Alternative: Local installation**
```bash
# Install locally and use npx
npm install conductor-cli
npx conductor init
```

---

### **Problem: Permission denied during installation**

**macOS/Linux Solution:**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g conductor-cli

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then install without sudo
npm install -g conductor-cli
```

**Windows Solution:**
```powershell
# Run PowerShell as Administrator
npm install -g conductor-cli
```

---

### **Problem: Node.js version compatibility**

**Solution:**
```bash
# Check Node.js version
node --version

# Conductor CLI requires Node.js 16+
# Install latest LTS version
nvm install --lts
nvm use --lts

# Or using n (Node version manager)
npm install -g n
n lts

# Reinstall Conductor CLI
npm install -g conductor-cli
```

---

## 🔑 **Authentication Issues**

### **Problem: Claude API key not working**

**Symptoms:**
- Error: "Invalid API key"
- Error: "Authentication failed"
- 401 Unauthorized responses

**Solution:**
```bash
# 1. Verify your Claude Code account and API key
# Visit https://claude.ai/code to get your API key

# 2. Set the environment variable
export CLAUDE_API_KEY="your-api-key-here"

# 3. For persistent setting, add to your shell profile
echo 'export CLAUDE_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc

# 4. Verify the key is set
echo $CLAUDE_API_KEY

# 5. Test with conductor
conductor recommend "test connection"
```

**Windows PowerShell:**
```powershell
# Set environment variable
$env:CLAUDE_API_KEY = "your-api-key-here"

# For persistent setting
[Environment]::SetEnvironmentVariable("CLAUDE_API_KEY", "your-api-key-here", "User")
```

---

### **Problem: API rate limiting**

**Symptoms:**
- Error: "Rate limit exceeded"
- 429 Too Many Requests responses
- Slow response times

**Solution:**
```bash
# Check current usage
conductor analyze --api-usage

# Wait and retry with backoff
sleep 60
conductor recommend "your question"

# Use batch mode for multiple requests
conductor recommend "question 1" --batch
conductor recommend "question 2" --batch
conductor execute-batch
```

---

## 🔧 **Configuration Issues**

### **Problem: Conductor won't initialize in project**

**Symptoms:**
- Error: "Unable to detect project framework"
- Error: "Invalid project structure"
- Initialization hangs

**Solution:**
```bash
# 1. Check if you're in the right directory
pwd
ls -la

# 2. Force initialization with framework specification
conductor init --framework nextjs --force

# 3. For unsupported frameworks
conductor init --framework custom --force

# 4. Clean and retry
rm -rf .conductor
conductor init

# 5. Debug initialization
conductor init --verbose --debug
```

---

### **Problem: Agent contexts not generating**

**Symptoms:**
- Empty `.conductor/agents/` directory
- Error: "No agents available"
- Agents not responding

**Solution:**
```bash
# 1. Check project context detection
conductor analyze --frameworks

# 2. Regenerate agent contexts
conductor init --agents all --force

# 3. Manually specify agents
conductor init --agents frontend,backend,security,testing --force

# 4. Verify agent files
ls -la .conductor/agents/
cat .conductor/agents/frontend.md

# 5. Reset completely
rm -rf .conductor claude.md
conductor init --force
```

---

## 🖥️ **Dashboard Issues**

### **Problem: Dashboard won't start**

**Symptoms:**
- Error: "Port already in use"
- Dashboard crashes on startup
- Blank or unresponsive dashboard

**Solution:**
```bash
# 1. Check port availability
lsof -i :3000  # Check if port 3000 is in use
netstat -tulpn | grep :3000

# 2. Use different port
conductor dashboard --port 3001

# 3. Kill existing processes
pkill -f conductor-dashboard
# Or on Windows:
taskkill /f /im conductor-dashboard.exe

# 4. Reset dashboard cache
rm -rf ~/.conductor/dashboard-cache

# 5. Launch with debug info
conductor dashboard --debug --verbose
```

---

### **Problem: Dashboard performance issues**

**Symptoms:**
- Slow rendering
- High CPU usage
- Memory leaks

**Solution:**
```bash
# 1. Use minimal mode
conductor dashboard --minimal

# 2. Disable animations
conductor dashboard --no-animations

# 3. Reduce update frequency
conductor dashboard --update-interval 5000

# 4. Check system resources
top | grep conductor
ps aux | grep conductor

# 5. Clear cache and restart
conductor cache clear
conductor dashboard --fresh
```

---

## 🛡️ **Security Issues**

### **Problem: Security scan fails**

**Symptoms:**
- Error: "Security scan timeout"
- Error: "Unable to analyze files"
- Incomplete scan results

**Solution:**
```bash
# 1. Check file permissions
find . -type f -name "*.js" -o -name "*.ts" | head -10
ls -la src/

# 2. Exclude problematic directories
conductor scan --security --exclude node_modules,dist,build

# 3. Increase timeout
conductor scan --security --timeout 300

# 4. Run incremental scan
conductor scan --security --changed-files-only

# 5. Debug scan process
conductor scan --security --debug --verbose

# 6. Check dependencies
npm audit
npm outdated
```

---

### **Problem: OWASP scan errors**

**Symptoms:**
- Error: "OWASP categories not found"
- False positives in security results
- Missing vulnerability categories

**Solution:**
```bash
# 1. Update security patterns
conductor update --security-patterns

# 2. Specify OWASP categories explicitly
conductor scan --owasp --category A01,A02,A03

# 3. Configure scan sensitivity
conductor scan --owasp --sensitivity medium

# 4. Exclude false positives
echo "src/test/" >> .conductor/security-ignore
echo "*.test.js" >> .conductor/security-ignore

# 5. Validate scan configuration
conductor scan --owasp --dry-run --verbose
```

---

## 🤖 **Agent Issues**

### **Problem: Agents not responding**

**Symptoms:**
- Timeout waiting for agent response
- Empty recommendations
- Error: "Agent unavailable"

**Solution:**
```bash
# 1. Check agent health
conductor agents --status

# 2. Test individual agents
conductor recommend "test" --agent @frontend

# 3. Regenerate agent contexts
conductor agents --regenerate

# 4. Check Claude API connectivity
curl -H "Authorization: Bearer $CLAUDE_API_KEY" https://api.anthropic.com/v1/models

# 5. Reset agent cache
rm -rf ~/.conductor/agent-cache
conductor init --force
```

---

### **Problem: Poor recommendation quality**

**Symptoms:**
- Generic or irrelevant recommendations
- Inconsistent agent responses
- Missing context awareness

**Solution:**
```bash
# 1. Update project context
conductor analyze --update-context

# 2. Provide more specific questions
conductor recommend "Add React authentication with NextAuth.js for TypeScript project" --detailed

# 3. Use agent-specific queries
conductor recommend "optimize React component performance" --agent @frontend

# 4. Include project context
conductor recommend "secure API endpoints" --context-file project-context.md

# 5. Review and update agent contexts
vim .conductor/agents/frontend.md  # Add project-specific details
```

---

## 📊 **Performance Issues**

### **Problem: Slow response times**

**Symptoms:**
- Long wait times for recommendations
- Timeout errors
- High memory usage

**Solution:**
```bash
# 1. Check system resources
htop
free -h
df -h

# 2. Clear caches
conductor cache clear --all

# 3. Optimize request size
conductor recommend "question" --concise

# 4. Use batch processing
conductor batch --file questions.txt

# 5. Monitor performance
conductor --profile recommend "your question"

# 6. Update to latest version
npm update -g conductor-cli
```

---

### **Problem: High memory usage**

**Solution:**
```bash
# 1. Monitor memory usage
ps aux | grep conductor
top -p $(pgrep conductor)

# 2. Limit concurrent operations
conductor config set max-concurrent-agents 3

# 3. Use streaming mode
conductor recommend "question" --stream

# 4. Clear memory caches
conductor cache clear --memory

# 5. Restart if needed
conductor restart
```

---

## 🔍 **Debugging Tips**

### **Enable Debug Mode**

```bash
# Enable verbose logging
export CONDUCTOR_DEBUG=true
export CONDUCTOR_LOG_LEVEL=debug

# Run with debug output
conductor recommend "your question" --debug --verbose

# Check logs
tail -f ~/.conductor/logs/conductor.log
```

---

### **Check Configuration**

```bash
# View current configuration
conductor config list

# Validate configuration
conductor config validate

# Reset to defaults
conductor config reset

# Check agent configuration
conductor agents --list --detailed
```

---

### **Network Issues**

```bash
# Test internet connectivity
ping api.anthropic.com

# Check DNS resolution
nslookup api.anthropic.com

# Test HTTPS connectivity
curl -I https://api.anthropic.com

# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Bypass proxy if needed
export NO_PROXY=*
conductor recommend "test"
```

---

## 📱 **Platform-Specific Issues**

### **macOS Issues**

**Problem: Gatekeeper blocking execution**
```bash
# Allow conductor to run
sudo spctl --add /usr/local/lib/node_modules/conductor-cli/bin/conductor

# Or disable Gatekeeper temporarily
sudo spctl --master-disable
```

**Problem: Outdated Command Line Tools**
```bash
# Update Xcode Command Line Tools
xcode-select --install
```

---

### **Windows Issues**

**Problem: PowerShell execution policy**
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Check current policy
Get-ExecutionPolicy
```

**Problem: Long path names**
```powershell
# Enable long path support
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

---

### **Linux Issues**

**Problem: Missing dependencies**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install curl build-essential

# CentOS/RHEL
sudo yum update
sudo yum groupinstall "Development Tools"

# Check for missing libraries
ldd $(which node)
```

---

## 🔄 **Reset & Recovery**

### **Complete Reset**

When all else fails, perform a complete reset:

```bash
# 1. Backup any custom configurations
cp -r .conductor .conductor.backup

# 2. Remove all conductor files
rm -rf .conductor claude.md

# 3. Clear global cache
rm -rf ~/.conductor

# 4. Reinstall conductor
npm uninstall -g conductor-cli
npm cache clean --force
npm install -g conductor-cli

# 5. Reinitialize
conductor init --force

# 6. Test basic functionality
conductor recommend "test recommendation"
```

---

### **Backup & Restore**

```bash
# Create backup
conductor backup create --name "pre-update-backup"

# List backups
conductor backup list

# Restore from backup
conductor backup restore --name "pre-update-backup"

# Export configuration
conductor config export > conductor-config.json

# Import configuration
conductor config import < conductor-config.json
```

---

## 📞 **Getting Help**

### **Built-in Help**

```bash
# General help
conductor --help
conductor help

# Command-specific help
conductor recommend --help
conductor dashboard --help

# Get system info for support
conductor --version --system-info
```

---

### **Log Files**

Check these locations for detailed logs:

**macOS/Linux:**
- `~/.conductor/logs/conductor.log`
- `~/.conductor/logs/agent-errors.log`
- `~/.conductor/logs/security-scan.log`

**Windows:**
- `%USERPROFILE%\.conductor\logs\conductor.log`
- `%USERPROFILE%\.conductor\logs\agent-errors.log`
- `%USERPROFILE%\.conductor\logs\security-scan.log`

---

### **Community Support**

- **GitHub Issues**: [Report bugs and get help](https://github.com/rickithadi/multi-agent-workflow/issues)
- **Security Issues**: [security@gallifrey.consulting](mailto:security@gallifrey.consulting)
- **Commercial Support**: [Gallifrey Consulting](https://gallifrey.consulting)

**When reporting issues, include:**
1. Conductor CLI version (`conductor --version`)
2. Node.js version (`node --version`)
3. Operating system and version
4. Complete error message
5. Steps to reproduce
6. Relevant log files

---

## 🎯 **Best Practices for Prevention**

### **Regular Maintenance**

```bash
# Weekly maintenance routine
conductor update
conductor cache optimize
conductor config validate
conductor agents --health-check

# Monthly cleanup
conductor cleanup --old-logs --old-cache
conductor backup create --auto-name
```

---

### **Environment Setup**

```bash
# Recommended .bashrc additions
export CLAUDE_API_KEY="your-key-here"
export CONDUCTOR_LOG_LEVEL="info"
export CONDUCTOR_CACHE_SIZE="100MB"

# Alias for convenience
alias c="conductor"
alias cdash="conductor dashboard"
alias cscan="conductor scan --security"
```

---

**For more support and advanced troubleshooting:**
- [API Reference](API.md) - Technical implementation details
- [Examples](EXAMPLES.md) - Working examples and use cases
- [Contributing](../CONTRIBUTING.md) - Development and debugging guide

---

*Troubleshooting guide for Conductor CLI | Powered by Claude Code and Anthropic's Claude AI | Professional Support by Gallifrey Consulting*