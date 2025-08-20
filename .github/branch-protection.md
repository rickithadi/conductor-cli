# Branch Protection Rules Configuration

This document outlines the required branch protection settings for the main branch to ensure code quality and prevent breaking changes.

## Required Settings for `main` branch:

### 🔒 General Protection Rules
- [x] **Restrict pushes that create files that exceed GitHub's file size limit**
- [x] **Restrict pushes that create files that exceed this limit: 100 MB**

### 🧪 Required Status Checks
The following checks must pass before merging:

- [x] **Require status checks to pass before merging**
- [x] **Require branches to be up to date before merging**

**Required Checks:**
- `quality-gates` - Linting, type checking, and unit tests
- `e2e-testing (ubuntu-latest, 18)` - Core E2E tests on primary platform
- `performance-testing` - Performance benchmarks must pass
- `security-scan` - Security vulnerability scanning

**Optional Checks (recommended but not blocking):**
- `e2e-testing (macos-latest, 18)` - macOS compatibility
- `e2e-testing (windows-latest, 18)` - Windows compatibility
- `e2e-testing (ubuntu-latest, 16)` - Node 16 compatibility
- `e2e-testing (ubuntu-latest, 20)` - Node 20 compatibility

### 👥 Pull Request Requirements
- [x] **Require a pull request before merging**
- [x] **Require approvals: 1**
- [x] **Dismiss stale PR approvals when new commits are pushed**
- [x] **Require review from code owners** (if CODEOWNERS file exists)
- [x] **Restrict approvals to users with write permissions**

### 🔐 Push Restrictions
- [x] **Restrict pushes that create files**
- [x] **Include administrators** - Even admins must follow the process

### 📋 Additional Rules
- [x] **Require signed commits** (recommended for security)
- [x] **Require conversation resolution before merging**
- [x] **Do not allow bypassing the above settings**

## GitHub CLI Setup Commands

To configure these settings automatically using GitHub CLI:

```bash
# Enable branch protection for main
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["quality-gates","e2e-testing (ubuntu-latest, 18)","performance-testing","security-scan"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' \
  --field restrictions=null

# Alternatively, use the web interface at:
# https://github.com/YOUR_USERNAME/multi-agent-workflow/settings/branches
```

## E2E Test Quality Gate

The most critical quality gate is the **End-to-End Onboarding Flow Test** which validates:

1. ✅ Project initialization completes successfully
2. ✅ Configuration files are created correctly
3. ✅ Launch command validates environment properly
4. ✅ Agent orchestration works as expected
5. ✅ Context generation produces valid output
6. ✅ User experience flows work end-to-end
7. ✅ Performance benchmarks meet thresholds
8. ✅ Error handling works correctly

If any of these fail, the PR cannot be merged to `main`.

## Performance Thresholds

The performance tests enforce these maximum response times:
- **Initialization**: 15 seconds
- **Launch Validation**: 10 seconds  
- **Status Commands**: 2 seconds
- **Help Commands**: 1 second

Exceeding these thresholds will fail the build.

## Security Requirements

Security scanning includes:
- npm audit for dependency vulnerabilities
- OWASP dependency check
- Static code analysis for security patterns
- No secrets or credentials in code

## Manual Override Process

In emergency situations, administrators can:
1. Create a hotfix branch from `main`
2. Apply critical fixes
3. Create emergency PR with detailed justification
4. Temporarily disable specific checks if needed
5. Merge with admin override (with full audit trail)
6. Immediately re-enable all protections
7. Schedule follow-up to address any skipped checks