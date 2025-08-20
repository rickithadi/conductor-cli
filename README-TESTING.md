# 🧪 Testing Guide for Conductor CLI

This document outlines the comprehensive testing strategy for the enhanced UX components and improved user experience in Conductor CLI.

## 📋 Test Structure

### Test Categories

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Component interaction testing  
3. **UX Workflow Tests** - End-to-end user experience testing
4. **Performance Tests** - Speed and efficiency validation

### Test Files Overview

```
src/
├── __tests__/
│   ├── setup.ts                           # Global test configuration
│   ├── enhanced-cli.test.ts               # CLI command testing
│   └── integration/
│       └── ux-workflow.integration.test.ts # Full workflow testing
└── ux/
    └── __tests__/
        ├── enhanced-launch.test.ts         # Launch experience testing
        ├── status-indicator.test.ts        # Visual feedback testing
        └── smart-dashboard.test.ts         # Dashboard functionality testing
```

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test -- --coverage

# Run specific test file
npm test enhanced-launch.test.ts

# Run tests in watch mode
npm test -- --watch

# Run integration tests only
npm test -- --testPathPattern=integration

# Run UX component tests only  
npm test -- --testPathPattern=ux
```

### Test Coverage Goals

- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

## 🧩 Test Components

### 1. Enhanced Launch Tests (`enhanced-launch.test.ts`)

**Purpose**: Validate the improved initialization experience

**Key Test Areas**:
- ✅ Welcome animation display
- ✅ Interactive setup wizard
- ✅ Quick setup workflow
- ✅ Configuration generation
- ✅ VS Code integration setup
- ✅ Error handling and recovery

**Sample Test**:
```typescript
it('should perform quick setup when quick option is enabled', async () => {
  const options = { quick: true, skipWelcome: true };
  
  await enhancedLaunch.initialize(options);

  expect(mockContextScanner.scanProject).toHaveBeenCalledWith(mockProjectPath);
  expect(fs.ensureDir).toHaveBeenCalledWith(path.join(mockProjectPath, '.conductor'));
  expect(fs.writeJson).toHaveBeenCalled();
});
```

### 2. Status Indicator Tests (`status-indicator.test.ts`)

**Purpose**: Validate real-time visual feedback system

**Key Test Areas**:
- ✅ Spinner animations and lifecycle
- ✅ Agent status tracking
- ✅ Team consensus updates
- ✅ Persistent status bar creation
- ✅ Live activity dashboard
- ✅ Status icons and color coding

**Sample Test**:
```typescript
it('should update agent status correctly', () => {
  statusIndicator.updateAgentStatus('@frontend', 'analyzing', 'Component review', 0.85);
  
  statusIndicator.showTeamStatus({ json: true });
  
  expect(console.log).toHaveBeenCalledWith(
    expect.stringContaining('@frontend')
  );
});
```

### 3. Smart Dashboard Tests (`smart-dashboard.test.ts`)

**Purpose**: Validate terminal dashboard functionality

**Key Test Areas**:
- ✅ Dashboard layout creation (full/minimal)
- ✅ Real-time content updates
- ✅ Keyboard shortcut handling
- ✅ Activity logging and management
- ✅ Help modal functionality
- ✅ Theme and focus handling

**Sample Test**:
```typescript
it('should create full dashboard by default', async () => {
  await smartDashboard.launch();
  
  expect(blessed.screen).toHaveBeenCalledWith({
    smartCSR: true,
    title: '🎭 Conductor CLI - AI Team Dashboard',
    fullUnicode: true,
    cursor: expect.objectContaining({
      artificial: true,
      shape: 'line',
      blink: true,
      color: 'cyan'
    })
  });
});
```

### 4. Enhanced CLI Tests (`enhanced-cli.test.ts`)

**Purpose**: Validate new command interface and natural language commands

**Key Test Areas**:
- ✅ Command registration and options
- ✅ Natural language aliases (`ask`, `duck`, `explain`)
- ✅ Status indicator integration
- ✅ Dashboard launching
- ✅ Error handling and suggestions
- ✅ Help configuration

**Sample Test**:
```typescript
it('should start status indicator for ask command', async () => {
  const askCommand = program.commands.find(cmd => cmd.name() === 'ask');
  const action = (askCommand as any)._actionHandler;
  
  await action('Test question', {});
  
  expect(mockStatusIndicator.start).toHaveBeenCalledWith(
    '🦆 Rubber ducking with AI experts...'
  );
  expect(mockStatusIndicator.succeed).toHaveBeenCalledWith(
    '🎯 Expert consultation complete!'
  );
});
```

### 5. Integration Tests (`ux-workflow.integration.test.ts`)

**Purpose**: Validate complete user workflows and component interactions

**Key Test Areas**:
- ✅ Complete initialization workflow
- ✅ Status tracking across operations
- ✅ Configuration persistence
- ✅ Error handling workflows
- ✅ Performance under load
- ✅ User experience consistency

**Sample Test**:
```typescript
it('should initialize project with full workflow', async () => {
  const enhancedLaunch = new EnhancedLaunch(testProjectPath);
  
  await enhancedLaunch.initialize({
    skipWelcome: true,
    quick: false
  });

  // Verify configuration was created
  const configPath = path.join(testProjectPath, '.conductor', 'conductor.config.json');
  expect(await fs.pathExists(configPath)).toBe(true);

  const config = await fs.readJson(configPath);
  expect(config.projectType).toBe('nextjs');
  expect(config.agents).toHaveLength(3);
}, 10000);
```

## 🎯 Testing Strategies

### 1. Mock Strategy

**Global Mocks** (`setup.ts`):
- Console methods (log, error, warn)
- File system operations (fs-extra)
- User input prompts (inquirer)
- Terminal output (blessed)
- Process methods (exit, stdout, stderr)

**Component-Specific Mocks**:
- Context scanning and project detection
- Agent generation and configuration
- VS Code integration

### 2. Custom Matchers

Enhanced Jest matchers for better UX testing:

```typescript
expect(content).toContainEmoji();
expect(timestamp).toBeValidTimestamp();
expect(output).toHaveStatusIcon('ready');
```

### 3. Test Utilities

**Helper Functions**:
- `createMockProject()` - Generate test project contexts
- `createMockAgent()` - Create agent configurations
- `waitForAsync()` - Handle asynchronous operations
- `mockTimers()` - Control time-based functionality
- `captureConsoleOutput()` - Capture and verify output

### 4. Performance Testing

```typescript
it('should handle rapid status updates efficiently', () => {
  const startTime = Date.now();
  
  for (let i = 0; i < 1000; i++) {
    statusIndicator.updateAgentStatus(`@agent${i % 8}`, 'thinking', `Task ${i}`, Math.random());
  }
  
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(100); // Should complete in <100ms
});
```

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true
};
```

### Coverage Exclusions

- CLI entry points (`enhanced-cli.ts`)
- Type definition files (`*.d.ts`)
- Test files themselves
- Mock and setup files

## 📊 Test Results and Quality Gates

### Expected Test Results

```bash
 PASS  src/ux/__tests__/enhanced-launch.test.ts
 PASS  src/ux/__tests__/status-indicator.test.ts
 PASS  src/ux/__tests__/smart-dashboard.test.ts
 PASS  src/__tests__/enhanced-cli.test.ts
 PASS  src/__tests__/integration/ux-workflow.integration.test.ts

Test Suites: 5 passed, 5 total
Tests:       67 passed, 67 total
Coverage:    Lines 85%, Functions 87%, Branches 78%, Statements 85%
```

### Quality Gates

- ✅ All tests must pass
- ✅ Coverage thresholds must be met
- ✅ No console errors during test runs
- ✅ Integration tests must complete within timeout
- ✅ Performance tests must meet speed requirements

## 🐛 Common Testing Patterns

### Testing Async Operations
```typescript
it('should handle async initialization', async () => {
  await expect(enhancedLaunch.initialize(options)).resolves.toBeUndefined();
});
```

### Testing Error Scenarios
```typescript
it('should handle initialization errors', async () => {
  mockContextScanner.scanProject.mockRejectedValue(new Error('Permission denied'));
  
  await expect(enhancedLaunch.initialize({ quick: true }))
    .rejects.toThrow('Permission denied');
});
```

### Testing User Interactions
```typescript
it('should validate agent selection', async () => {
  const agentsPrompt = promptCall.find((q: any) => q.name === 'enabledAgents');
  
  expect(agentsPrompt.validate([])).toBe('Please select at least one agent');
  expect(agentsPrompt.validate(['frontend'])).toBe(true);
});
```

### Testing Visual Output
```typescript
it('should generate header content with current time', () => {
  const content = (smartDashboard as any).getHeaderContent();
  
  expect(content).toContain('🎭 CONDUCTOR CLI - AI TEAM DASHBOARD');
  expect(content).toMatch(/\d{1,2}:\d{2}:\d{2}/); // Time format
});
```

## 📈 Continuous Testing

### CI/CD Integration

Tests run automatically on:
- ✅ Pull request creation
- ✅ Code commits to main branch
- ✅ Release preparation
- ✅ Scheduled nightly builds

### Test Reporting

- **Coverage Reports**: HTML and LCOV formats
- **Test Results**: JUnit XML for CI integration  
- **Performance Metrics**: Execution time tracking
- **Failure Analysis**: Detailed error reporting

## 🎉 Benefits of This Testing Strategy

### For Developers
- **Confidence**: Comprehensive coverage ensures reliability
- **Productivity**: Fast feedback on code changes
- **Quality**: Enforced standards and patterns

### For Users
- **Reliability**: Thoroughly tested UX components
- **Performance**: Validated speed and efficiency
- **Experience**: Consistent, polished interactions

### For Maintenance
- **Regression Prevention**: Catch breaking changes early
- **Documentation**: Tests serve as living documentation
- **Evolution**: Safe refactoring with test coverage

---

## 🚀 Getting Started with Testing

1. **Install dependencies**: `npm install`
2. **Run tests**: `npm test`
3. **Check coverage**: `npm run test -- --coverage`
4. **Add new tests**: Follow existing patterns in `src/__tests__/`
5. **Update this guide**: Keep documentation current with new test patterns

The testing strategy ensures that the enhanced UX features work reliably and provide a smooth, professional experience that matches the quality promised by the "Rubber Ducking with AI Experts" brand! 🦆✨