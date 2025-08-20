# 🎯 OWASP Top 10 Integration Guide

> **Comprehensive OWASP Top 10 2021 coverage in Aegis CLI** - Military-grade vulnerability detection with pixel-perfect precision

Aegis CLI provides industry-leading OWASP Top 10 vulnerability detection, analysis, and remediation guidance. Built with Gallifrey Consulting's obsessive security standards and real-world threat intelligence.

---

## 🔍 **OWASP Top 10 Coverage Matrix**

| OWASP Category | Detection | Analysis | Remediation | Agent Support |
|----------------|-----------|----------|-------------|---------------|
| **A01:2021 - Broken Access Control** | ✅ Advanced | ✅ Complete | ✅ Guided | @security-architect |
| **A02:2021 - Cryptographic Failures** | ✅ Advanced | ✅ Complete | ✅ Guided | @security-architect |
| **A03:2021 - Injection** | ✅ Advanced | ✅ Complete | ✅ Guided | @security-architect |
| **A04:2021 - Insecure Design** | ✅ Pattern-based | ✅ Complete | ✅ Guided | @security-architect |
| **A05:2021 - Security Misconfiguration** | ✅ Advanced | ✅ Complete | ✅ Guided | @compliance-auditor |
| **A06:2021 - Vulnerable Components** | ✅ Advanced | ✅ Complete | ✅ Automated | @security-architect |
| **A07:2021 - Identity/Auth Failures** | ✅ Advanced | ✅ Complete | ✅ Guided | @security-architect |
| **A08:2021 - Software/Data Integrity** | ✅ Pattern-based | ✅ Complete | ✅ Guided | @compliance-auditor |
| **A09:2021 - Security Logging/Monitoring** | ✅ Advanced | ✅ Complete | ✅ Guided | @incident-responder |
| **A10:2021 - Server-Side Request Forgery** | ✅ Advanced | ✅ Complete | ✅ Guided | @security-architect |

---

## 🛡️ **A01:2021 - Broken Access Control**

### **What Aegis Detects**
- **Authorization bypass patterns** - Missing access control checks
- **Privilege escalation vectors** - Vertical and horizontal privilege issues  
- **Insecure direct object references** - Direct database/file access without authorization
- **CORS misconfigurations** - Overly permissive cross-origin policies
- **Force browsing vulnerabilities** - Unprotected admin/restricted endpoints

### **Detection Examples**
```javascript
// ❌ DETECTED: Missing authorization check
app.get('/admin/users', (req, res) => {
  // VULNERABILITY: No role-based access control
  const users = db.getAllUsers();
  res.json(users);
});

// ❌ DETECTED: Insecure direct object reference  
app.get('/user/:id/profile', (req, res) => {
  // VULNERABILITY: No ownership verification
  const profile = db.getUserProfile(req.params.id);
  res.json(profile);
});

// ❌ DETECTED: Overly permissive CORS
app.use(cors({
  origin: '*', // VULNERABILITY: Allows any origin
  credentials: true
}));
```

### **Aegis Remediation Guidance**
```javascript
// ✅ RECOMMENDED: Proper authorization middleware
const authorize = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

app.get('/admin/users', authorize(['admin']), (req, res) => {
  const users = db.getAllUsers();
  res.json(users);
});

// ✅ RECOMMENDED: Ownership verification
app.get('/user/:id/profile', authenticate, (req, res) => {
  if (req.params.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const profile = db.getUserProfile(req.params.id);
  res.json(profile);
});

// ✅ RECOMMENDED: Restrictive CORS policy
app.use(cors({
  origin: ['https://app.company.com', 'https://admin.company.com'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

---

## 🔐 **A02:2021 - Cryptographic Failures**

### **What Aegis Detects**
- **Weak encryption algorithms** - MD5, SHA1, DES, RC4 usage
- **Hardcoded secrets** - API keys, passwords, cryptographic keys in code
- **Insufficient key management** - Weak key generation, storage, rotation
- **Plaintext data transmission** - HTTP instead of HTTPS, unencrypted communications
- **Weak password hashing** - Plain text, MD5, insufficient salt/iterations

### **Detection Examples**
```javascript
// ❌ DETECTED: Weak cryptographic algorithm
const crypto = require('crypto');
const hash = crypto.createHash('md5').update(password).digest('hex'); // VULNERABILITY

// ❌ DETECTED: Hardcoded encryption key
const encryptionKey = 'hardcoded-secret-key-123'; // VULNERABILITY

// ❌ DETECTED: Weak password hashing
const hashedPassword = crypto.createHash('sha1').update(password + 'salt').digest('hex'); // VULNERABILITY

// ❌ DETECTED: Plaintext storage
await db.users.create({
  email: email,
  password: password // VULNERABILITY: Storing plaintext password
});
```

### **Aegis Remediation Guidance**
```javascript
// ✅ RECOMMENDED: Strong modern algorithms
import argon2 from 'argon2';
import { randomBytes } from 'crypto';

// Strong password hashing
const hashedPassword = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 3,
  parallelism: 1
});

// ✅ RECOMMENDED: Secure key management
import { KMSClient } from '@aws-sdk/client-kms';
const kms = new KMSClient({ region: process.env.AWS_REGION });

const encryptionKey = await kms.generateDataKey({
  KeyId: process.env.KMS_KEY_ID,
  KeySpec: 'AES_256'
});

// ✅ RECOMMENDED: Secure random generation
const secureToken = randomBytes(32).toString('hex');

// ✅ RECOMMENDED: Modern symmetric encryption
import { createCipherGCM, createDecipherGCM } from 'crypto';
const cipher = createCipherGCM('aes-256-gcm', key);
```

---

## 💉 **A03:2021 - Injection**

### **What Aegis Detects**
- **SQL injection vulnerabilities** - Unsafe query construction patterns
- **NoSQL injection** - MongoDB, CouchDB injection patterns
- **Command injection** - System command execution with user input
- **LDAP injection** - Unsafe LDAP query construction
- **XPath injection** - XML query injection patterns

### **Detection Examples**
```javascript
// ❌ DETECTED: SQL injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`; // VULNERABILITY
db.query(query);

// ❌ DETECTED: NoSQL injection (MongoDB)
const user = await User.findOne({
  email: req.body.email, // VULNERABILITY: Direct object assignment
  password: req.body.password
});

// ❌ DETECTED: Command injection
const { exec } = require('child_process');
exec(`ls ${userInput}`, callback); // VULNERABILITY

// ❌ DETECTED: Template injection
const template = `Hello ${userInput}!`; // VULNERABILITY in template engines
eval(template);
```

### **Aegis Remediation Guidance**
```javascript
// ✅ RECOMMENDED: Parameterized queries
const query = 'SELECT * FROM users WHERE id = ? AND status = ?';
const result = await db.query(query, [userId, 'active']);

// ✅ RECOMMENDED: Safe NoSQL operations
const user = await User.findOne({
  email: { $eq: req.body.email }, // Explicit operator
  password: { $eq: hashedPassword }
});

// ✅ RECOMMENDED: Input validation and sanitization
import validator from 'validator';
import { escape } from 'shell-escape';

if (!validator.isAlphanumeric(userInput)) {
  throw new Error('Invalid input');
}
exec(`ls ${escape(userInput)}`, callback);

// ✅ RECOMMENDED: Template security
import DOMPurify from 'dompurify';
const sanitizedInput = DOMPurify.sanitize(userInput);
const template = `Hello ${sanitizedInput}!`;
```

---

## 🏗️ **A04:2021 - Insecure Design**

### **What Aegis Detects**
- **Missing security controls** - No rate limiting, input validation
- **Insufficient business logic validation** - Payment bypass, workflow manipulation
- **Weak authentication mechanisms** - Single-factor auth for sensitive operations
- **Missing security patterns** - No fail-secure defaults, insufficient separation
- **Trust boundary violations** - Client-side security controls only

### **Security Design Patterns Recommended by Aegis**
```javascript
// ✅ RECOMMENDED: Rate limiting implementation
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/auth/login', authLimiter, loginHandler);

// ✅ RECOMMENDED: Business logic validation
const transferFunds = async (fromAccount, toAccount, amount) => {
  // Multi-layer validation
  if (amount <= 0) throw new Error('Invalid amount');
  if (amount > 10000) throw new Error('Exceeds daily limit');
  
  const balance = await getAccountBalance(fromAccount);
  if (balance < amount) throw new Error('Insufficient funds');
  
  // Two-factor authentication for large transfers
  if (amount > 1000 && !req.user.mfaVerified) {
    throw new Error('MFA required for large transfers');
  }
  
  // Atomic transaction
  await db.transaction(async (trx) => {
    await debitAccount(fromAccount, amount, trx);
    await creditAccount(toAccount, amount, trx);
    await logTransaction(fromAccount, toAccount, amount, trx);
  });
};
```

---

## ⚙️ **A05:2021 - Security Misconfiguration**

### **What Aegis Detects**
- **Default configurations** - Unchanged default passwords, settings
- **Verbose error messages** - Stack traces, debug info in production
- **Missing security headers** - HSTS, CSP, X-Frame-Options
- **Unnecessary features enabled** - Debug modes, admin interfaces
- **Insecure cloud configurations** - Open S3 buckets, permissive IAM policies

### **Configuration Hardening Examples**
```javascript
// ❌ DETECTED: Missing security headers
app.get('/', (req, res) => {
  res.send('Hello World'); // VULNERABILITY: No security headers
});

// ❌ DETECTED: Verbose error handling
app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: err.stack // VULNERABILITY: Exposing stack trace
  });
});

// ✅ RECOMMENDED: Comprehensive security headers
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// ✅ RECOMMENDED: Secure error handling
app.use((err, req, res, next) => {
  logger.error(err.stack); // Log detailed error internally
  
  const errorResponse = process.env.NODE_ENV === 'production' 
    ? { error: 'Internal Server Error' }
    : { error: err.message }; // Limited info in production
    
  res.status(500).json(errorResponse);
});
```

---

## 📦 **A06:2021 - Vulnerable and Outdated Components**

### **What Aegis Detects**
- **Outdated dependencies** - Known CVE vulnerabilities in dependencies
- **Unmaintained packages** - Packages without recent updates or security patches
- **Excessive permissions** - Dependencies with unnecessary access rights
- **Supply chain risks** - Suspicious package patterns, typosquatting
- **License compliance issues** - Incompatible or risky license terms

### **Dependency Security Management**
```bash
# Automated dependency vulnerability scanning
aegis scan --dependencies --fix-suggestions

# Generate dependency security report
aegis report --dependencies --format json --include-licenses

# Monitor for new vulnerabilities
aegis monitor --dependencies --realtime --alerts

# Dependency update recommendations with risk assessment
aegis update --dependencies --risk-analysis --test-required
```

```javascript
// ✅ RECOMMENDED: Dependency security best practices
{
  "scripts": {
    "security-audit": "aegis scan --dependencies --fail-on high,critical",
    "update-check": "aegis update --dependencies --dry-run",
    "license-check": "aegis scan --licenses --policy strict"
  },
  "engines": {
    "node": ">=18.17.0" // Pin to secure Node.js versions
  }
}
```

---

## 🔑 **A07:2021 - Identification and Authentication Failures**

### **What Aegis Detects**
- **Weak password policies** - No complexity requirements, short passwords
- **Missing multi-factor authentication** - Single-factor auth for sensitive operations
- **Insecure session management** - Predictable session IDs, no timeout
- **Credential stuffing vulnerabilities** - No account lockout, rate limiting
- **Weak account recovery** - Security questions, email-only recovery

### **Secure Authentication Implementation**
```javascript
// ✅ RECOMMENDED: Comprehensive authentication system
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

const loginHandler = async (req, res) => {
  const { email, password, mfaToken } = req.body;
  
  // Rate limiting
  await authLimiter(req, res);
  
  // User lookup with constant-time comparison
  const user = await User.findOne({ email });
  if (!user) {
    await bcrypt.compare(password, 'dummy-hash'); // Prevent timing attacks
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Password verification
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    await logFailedAttempt(user.id, req.ip);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Multi-factor authentication
  if (user.mfaEnabled) {
    const validMFA = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaToken,
      window: 1
    });
    
    if (!validMFA) {
      return res.status(401).json({ error: 'Invalid MFA token' });
    }
  }
  
  // Secure session creation
  const sessionToken = await createSecureSession(user.id);
  res.cookie('session', sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({ success: true, user: sanitizeUser(user) });
};
```

---

## 🔐 **A08:2021 - Software and Data Integrity Failures**

### **What Aegis Detects**
- **Unsigned code execution** - Loading unsigned libraries, plugins
- **Insecure CI/CD pipelines** - No integrity verification in build process
- **Auto-update vulnerabilities** - Unverified software updates
- **Deserialization flaws** - Unsafe object deserialization
- **Missing subresource integrity** - Unverified external resources

### **Integrity Protection Examples**
```javascript
// ✅ RECOMMENDED: Subresource integrity
<script src="https://cdn.jsdelivr.net/npm/library@1.0.0/dist/library.min.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>

// ✅ RECOMMENDED: Secure deserialization
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number().positive(),
  email: z.string().email(),
  role: z.enum(['user', 'admin'])
});

const deserializeUser = (data) => {
  try {
    return UserSchema.parse(JSON.parse(data));
  } catch (error) {
    throw new Error('Invalid user data format');
  }
};

// ✅ RECOMMENDED: Code signing verification
const verifySignature = async (code, signature, publicKey) => {
  const crypto = require('crypto');
  const verify = crypto.createVerify('RSA-SHA256');
  verify.write(code);
  verify.end();
  
  return verify.verify(publicKey, signature, 'hex');
};
```

---

## 📊 **A09:2021 - Security Logging and Monitoring Failures**

### **What Aegis Detects**
- **Missing security event logging** - No audit trails for critical operations
- **Insufficient log detail** - Missing context, user IDs, timestamps
- **Log injection vulnerabilities** - Unsanitized user input in logs
- **Missing real-time monitoring** - No alerting for suspicious activities
- **Log tampering risks** - Logs stored without integrity protection

### **Comprehensive Security Logging**
```javascript
// ✅ RECOMMENDED: Structured security logging
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/security-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      auditFile: 'logs/security-audit.json'
    })
  ]
});

const logSecurityEvent = (event, details) => {
  securityLogger.info({
    type: 'security_event',
    event: event,
    timestamp: new Date().toISOString(),
    userId: details.userId,
    userAgent: details.userAgent,
    ipAddress: details.ipAddress,
    sessionId: details.sessionId,
    details: details.eventData
  });
};

// Usage examples
logSecurityEvent('login_success', { userId, ipAddress, userAgent });
logSecurityEvent('permission_denied', { userId, resource, action });
logSecurityEvent('password_change', { userId, previousPasswordAge });
```

---

## 🌐 **A10:2021 - Server-Side Request Forgery (SSRF)**

### **What Aegis Detects**
- **Unvalidated URL inputs** - Direct URL fetching from user input
- **Internal network access** - Requests to private IP ranges
- **Cloud metadata access** - AWS/GCP/Azure metadata endpoint access
- **File system access** - File:// protocol usage in URL handlers
- **Port scanning patterns** - Suspicious port access patterns

### **SSRF Prevention Implementation**
```javascript
// ✅ RECOMMENDED: SSRF protection
import { URL } from 'url';
import fetch from 'node-fetch';

const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const BLOCKED_HOSTS = [
  '127.0.0.1',
  'localhost',
  '169.254.169.254', // AWS metadata
  '169.254.169.254',  // GCP metadata
  '10.0.0.0/8',      // Private networks
  '172.16.0.0/12',
  '192.168.0.0/16'
];

const isPrivateIP = (ip) => {
  // Implementation to check private IP ranges
  return /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(ip);
};

const safeFetch = async (userUrl) => {
  let parsedUrl;
  
  try {
    parsedUrl = new URL(userUrl);
  } catch (error) {
    throw new Error('Invalid URL format');
  }
  
  // Protocol validation
  if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
    throw new Error('Protocol not allowed');
  }
  
  // Hostname validation
  const hostname = parsedUrl.hostname;
  if (BLOCKED_HOSTS.includes(hostname) || isPrivateIP(hostname)) {
    throw new Error('Access to internal resources not allowed');
  }
  
  // Port validation (only allow standard ports)
  const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);
  if (![80, 443, 8080, 8443].includes(parseInt(port))) {
    throw new Error('Port not allowed');
  }
  
  // Request timeout and size limits
  try {
    const response = await fetch(userUrl, {
      timeout: 5000, // 5 second timeout
      size: 1024 * 1024, // 1MB size limit
      redirect: 'manual' // Prevent redirect-based SSRF
    });
    
    return response;
  } catch (error) {
    throw new Error('Request failed or timed out');
  }
};
```

---

## 📈 **OWASP Compliance Dashboard**

### **Real-Time OWASP Monitoring**
```bash
# Generate comprehensive OWASP compliance report
aegis scan --owasp --compliance-dashboard

# Monitor specific OWASP categories
aegis monitor --owasp --categories A01,A02,A03 --realtime

# Export OWASP findings for external tools
aegis export --owasp --format SARIF --tool integration
```

### **Integration with Security Tools**
- **SAST Integration** - SonarQube, CodeQL, Semgrep integration
- **DAST Integration** - OWASP ZAP, Burp Suite automated scanning
- **IAST Integration** - Runtime application security testing
- **Dependency Scanning** - Snyk, FOSSA, WhiteSource integration
- **Container Security** - Trivy, Twistlock, Aqua Security integration

---

## 🎓 **OWASP Training & Certification**

### **Built-in Security Training**
```bash
# Interactive OWASP Top 10 training
aegis training --owasp-top10 --interactive

# Hands-on vulnerability labs
aegis lab --owasp --category A03 --environment sandbox

# Security code review workshop
aegis workshop --secure-code-review --owasp-focused
```

### **Certification Support**
- **OWASP Application Security Verification Standard (ASVS)** compliance
- **OWASP Software Assurance Maturity Model (SAMM)** integration
- **OWASP Testing Guide** automated test case generation
- **OWASP Code Review Guide** integration with code analysis

---

**OWASP Excellence Through Automated Security**

Built with military-grade OWASP compliance by [Hadi Rickit](https://rickithadi.dev) and [Gallifrey Consulting](https://gallifrey.consulting) 🎯