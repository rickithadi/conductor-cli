# 🚀 Getting Started with Aegis CLI

> **Quick start guide for the world's most secure AI development orchestrator**

Welcome to Aegis CLI - the military-grade security-first AI development orchestrator built with obsessive precision by Gallifrey Consulting. This guide will get you up and running with zero-trust architecture, OWASP Top 10 vulnerability scanning, and enterprise-ready security controls in minutes.

---

## 🛡️ **Quick Installation**

### **Global Installation (Recommended)**
```bash
# Install Aegis CLI globally via npm
npm install -g aegis-cli

# Verify installation with security check
aegis --version
aegis --security-status
```

### **Development Installation**
```bash
# Clone from secure repository
git clone https://github.com/gallifrey-consulting/aegis-cli.git
cd aegis-cli

# Install dependencies with security audit
npm install
npm run security-audit

# Build with security validation
npm run build

# Link for local development
npm link
```

---

## 🎯 **First Steps - Secure Your Project**

### **1. Initialize Security-First Setup**
```bash
# Navigate to your project directory
cd your-project

# Initialize with enterprise security profile
aegis init --security-profile enterprise

# Or for government/defense environments
aegis init --security-profile government --classification-level confidential

# Or for startups with basic security
aegis init --security-profile startup
```

**What happens during initialization:**
- 🔍 **Project analysis** - Scans for frameworks, languages, security patterns
- 🛡️ **Security agent generation** - Creates specialized security agents for your stack
- 📝 **Claude context creation** - Generates comprehensive `claude.md` with security guidelines
- 🔧 **VSCode hardening** - Sets up secure development environment
- ⚙️ **Configuration files** - Creates security policies and compliance settings

### **2. Run Your First Security Scan**
```bash
# Comprehensive security scan with OWASP Top 10 analysis
aegis scan --security --detailed

# Quick vulnerability overview
aegis scan --security --summary

# Export results for SIEM integration
aegis scan --security --json --export results.json
```

**Example scan output:**
```
🔒 AEGIS SECURITY SCAN RESULTS
════════════════════════════════════════════════════════════
📊 Scanned 23 files in 847ms
🎯 Found 7 security findings

🔴 CRITICAL (2)
   src/auth.js:45 - Hardcoded JWT secret detected
   lib/db.js:12 - SQL injection vulnerability

🟡 HIGH (3)
   components/Form.tsx:23 - XSS risk detected
   middleware/cors.js:8 - Overly permissive CORS policy
   utils/crypto.js:15 - Weak MD5 hashing detected

🟠 MEDIUM (2)
   config/session.js:19 - Missing HttpOnly flag
   api/upload.js:34 - File upload without size limits

🔍 OWASP TOP 10 ANALYSIS
─────────────────────────────────────────────────────────
✅ A01:2021 - Broken Access Control: 1 finding
❌ A02:2021 - Cryptographic Failures: 3 findings
✅ A03:2021 - Injection: 2 findings
⚠️  A05:2021 - Security Misconfiguration: 1 finding

🏆 SECURITY SCORE: 68/100 (Good - address critical items)
```

### **3. Launch Security Dashboard**
```bash
# Real-time security monitoring dashboard
aegis dashboard --security --watch

# Compliance-focused dashboard view
aegis dashboard --compliance --frameworks SOC2,ISO27001
```

**Beautiful terminal dashboard features:**
- 📊 Real-time vulnerability metrics
- 🤖 Security agent activity monitoring
- 📈 OWASP compliance status
- 🚨 Live threat intelligence feed
- 🎯 Security score trending

---

## 🎭 **Working with Security Agents**

### **Meet Your Security Team**
```bash
# List all available security agents
aegis agents --security

# Get detailed agent information
aegis agents --info @security-architect
```

**Your security agents:**
- **@security-architect** - OWASP expertise, threat modeling, secure architecture
- **@privacy-officer** - GDPR/CCPA compliance, data protection
- **@compliance-auditor** - SOC2, ISO27001, regulatory validation
- **@code-reviewer** - Secure coding practices, vulnerability analysis
- **@incident-responder** - Security incident handling and monitoring
- **@penetration-tester** - Ethical hacking and security validation

### **Get Security Recommendations**
```bash
# General security improvement recommendations
aegis recommend "Improve authentication security" --type security

# OWASP-specific recommendations
aegis recommend "Fix SQL injection vulnerabilities" --owasp-category A03

# Compliance-focused recommendations
aegis recommend "Prepare for SOC2 audit" --compliance-framework SOC2
```

**Example security recommendation:**
```
🔒 AEGIS SECURITY RECOMMENDATION

📋 Proposal: Implement OAuth 2.0 with PKCE for mobile authentication
🎯 Type: security | 🚨 Priority: CRITICAL | 🛡️ Security Score: +25

🤖 SECURITY AGENT ANALYSIS:

@security-architect - Security Architecture Specialist
  🎯 Recommendation: Implement RFC 7636 PKCE with S256 challenge method
  🧠 Security Reasoning: Prevents authorization code interception in mobile apps
  📈 Security Impact: Eliminates CSRF attacks, reduces token theft risk
  🔗 Dependencies: Auth service updates, mobile SDK integration
  ⚠️ Threats Mitigated: Code interception, CSRF, replay attacks
  🎖️ Compliance: OWASP Mobile Security, NIST Guidelines

@privacy-officer - Data Protection Specialist
  🎯 Recommendation: Implement privacy-preserving scopes with consent
  🧠 Privacy Reasoning: GDPR requires explicit consent and data minimization
  📈 Privacy Impact: Granular consent, audit trails, user rights
  🔗 Dependencies: Consent platform, privacy policy updates
  🎖️ Compliance: GDPR Article 25, Privacy by Design

🔒 SECURITY CONSENSUS: 97% agreement on implementation approach
🛡️ RISK REDUCTION: High (significant improvement to mobile security posture)
```

---

## 🔧 **Configuration & Customization**

### **Security Profiles**
Choose from pre-configured security profiles:

**Enterprise Profile:**
```json
{
  "security": {
    "profile": "enterprise",
    "threatModel": "comprehensive",
    "compliance": ["SOC2", "ISO27001", "GDPR"],
    "scanning": {
      "realTime": true,
      "owaspCategories": ["all"],
      "dependencyScanning": true,
      "secretScanning": true
    },
    "alerts": {
      "critical": "immediate",
      "high": "1-hour",
      "medium": "daily"
    }
  }
}
```

**Government Profile:**
```json
{
  "security": {
    "profile": "government",
    "classification": "confidential",
    "compliance": ["NIST-800-53", "FISMA"],
    "encryption": {
      "fipsCompliance": true,
      "quantumResistant": true
    },
    "auditLogging": "comprehensive"
  }
}
```

### **Custom Security Agents**
Add specialized security agents to `claude.md`:

```markdown
### @crypto-specialist - Cryptography Expert
**Expertise**: Modern cryptographic algorithms, key management, quantum-resistant crypto
**Technical Stack**: libsodium, OpenSSL, Hardware Security Modules (HSM)
**Special Instructions**:
- Focus on FIPS 140-2 Level 3 compliance
- Recommend post-quantum cryptography migration paths
- Validate cryptographic implementations against NIST standards
- Monitor for cryptographic agility best practices

### @cloud-security - Cloud Security Architect  
**Expertise**: AWS/GCP/Azure security, container security, Kubernetes hardening
**Technical Stack**: AWS Security Hub, GCP Security Command Center, Azure Defender
**Special Instructions**:
- Implement cloud security posture management (CSPM)
- Focus on identity and access management (IAM) best practices
- Validate infrastructure as code (IaC) security configurations
- Monitor for cloud misconfigurations and compliance drift
```

---

## 📊 **Advanced Security Features**

### **Continuous Security Monitoring**
```bash
# Set up continuous monitoring
aegis monitor --security --realtime --alerts webhook https://security-ops.company.com

# Schedule automated scans
aegis schedule --security --daily --time "02:00" --report-email security@company.com

# Integration with CI/CD
aegis ci --security --fail-on critical,high --export-sarif results.sarif
```

### **Compliance Automation**
```bash
# Generate SOC2 compliance report
aegis compliance --framework SOC2 --generate-report --timeframe quarterly

# GDPR privacy impact assessment
aegis privacy --gdpr --impact-assessment --data-flows

# Export audit evidence
aegis audit --export --format SOC2 --evidence-collection --timeframe 2024-Q1
```

### **Security Integration**
```bash
# SIEM integration
aegis integrate --siem splunk --endpoint https://splunk.company.com:8088/collector

# Vulnerability management integration
aegis integrate --vuln-scanner tenable --api-key $TENABLE_API_KEY

# Slack notifications for critical findings
aegis integrate --slack --webhook $SLACK_WEBHOOK --severity critical,high
```

---

## 🚀 **Best Practices & Workflows**

### **Daily Security Workflow**
1. **Morning Security Check**
   ```bash
   aegis dashboard --security --quick-status
   ```

2. **Pre-Commit Security Validation**
   ```bash
   aegis scan --security --staged-files --fail-on critical
   ```

3. **Feature Development Security**
   ```bash
   aegis recommend "Implement user authentication" --security-focused
   ```

4. **End-of-Day Security Review**
   ```bash
   aegis report --security --daily --summary
   ```

### **Security Incident Response**
When critical vulnerabilities are found:

1. **Immediate Assessment**
   ```bash
   aegis scan --security --critical-only --detailed
   aegis analyze --incident --vulnerability $VULN_ID
   ```

2. **Agent Consultation**
   ```bash
   aegis recommend "Address critical SQL injection in auth module" --urgent
   ```

3. **Remediation Tracking**
   ```bash
   aegis track --vulnerability $VULN_ID --status in-progress
   aegis validate --fix --vulnerability $VULN_ID
   ```

### **Team Security Collaboration**
```bash
# Share security findings with team
aegis share --findings --team --format slack

# Create security tasks for team members
aegis assign --finding $FINDING_ID --assignee developer@company.com

# Track team security metrics
aegis metrics --team --timeframe monthly --export dashboard.json
```

---

## 🎓 **Learning & Training**

### **Built-in Security Training**
```bash
# Interactive OWASP Top 10 training
aegis training --owasp --interactive

# Secure coding workshop
aegis workshop --secure-coding --language typescript

# Security architecture masterclass
aegis training --architecture --advanced
```

### **Security Certification Preparation**
- **CISSP** - Comprehensive Information Systems Security Professional
- **CISM** - Certified Information Security Manager  
- **CEH** - Certified Ethical Hacker
- **OSCP** - Offensive Security Certified Professional

---

## 🆘 **Support & Resources**

### **Documentation**
- [Security Guide](SECURITY.md) - Comprehensive security documentation
- [OWASP Integration](OWASP.md) - OWASP Top 10 compliance guide
- [API Reference](API.md) - Complete API documentation
- [Examples](../examples/) - Real-world security examples

### **Community & Support**
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/gallifrey-consulting/aegis-cli/issues)
- **Security Issues**: [security@gallifrey.consulting](mailto:security@gallifrey.consulting) 
- **Commercial Support**: [Gallifrey Consulting](https://gallifrey.consulting)
- **Training**: Professional security training available

### **Integration Resources**
- **VS Code Extension** - Enhanced IDE integration
- **GitHub Actions** - CI/CD security automation
- **Docker Images** - Containerized security scanning
- **Terraform Modules** - Infrastructure security automation

---

## 🏆 **Success Metrics**

Track your security improvement with Aegis CLI:

- **📊 Security Score Trending** - Monitor security posture over time
- **🎯 OWASP Compliance Progress** - Track vulnerability remediation  
- **🔍 Threat Detection Rate** - Measure security scanning effectiveness
- **⚡ Mean Time to Remediation** - Optimize incident response
- **🛡️ Zero-Day Protection** - Proactive security measures
- **📋 Compliance Readiness** - Audit preparation metrics

---

**Ready to secure your development workflow?** 

Start with `aegis init --security-profile enterprise` and join the most secure AI development platform in the world! 🛡️

---

**Built with military-grade precision and obsessive security standards by [Hadi Rickit](https://rickithadi.dev) and [Gallifrey Consulting](https://gallifrey.consulting)** ⚡