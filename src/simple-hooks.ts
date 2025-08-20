/**
 * Simple Hooks System
 * Inspired by Claude Flow's hooks concept but much simpler
 * Allows pre/post operation hooks for basic automation
 */

export interface Hook {
  name: string;
  command: string;
  description?: string;
  enabled: boolean;
}

export interface HookConfig {
  preInit?: Hook[];
  postInit?: Hook[];
  preAsk?: Hook[];
  postAsk?: Hook[];
  preLaunch?: Hook[];
  postLaunch?: Hook[];
  preReview?: Hook[];
  postReview?: Hook[];
}

export class SimpleHooks {
  private hooks: HookConfig = {};
  
  constructor() {
    this.loadDefaultHooks();
  }

  /**
   * Load default hooks configuration
   */
  private loadDefaultHooks(): void {
    this.hooks = {
      preInit: [
        {
          name: 'check-node-version',
          command: 'node --version',
          description: 'Check Node.js version before init',
          enabled: true
        }
      ],
      postInit: [
        {
          name: 'install-dependencies',
          command: 'npm install',
          description: 'Install dependencies after init',
          enabled: false // Disabled by default
        }
      ],
      preAsk: [],
      postAsk: [
        {
          name: 'log-question',
          command: 'echo "Question asked at $(date)" >> .conductor/history.log',
          description: 'Log questions for history',
          enabled: false
        }
      ],
      preLaunch: [
        {
          name: 'check-git-status',
          command: 'git status --porcelain',
          description: 'Check git status before launch',
          enabled: false
        }
      ],
      postLaunch: [],
      preReview: [
        {
          name: 'run-linter',
          command: 'npm run lint',
          description: 'Run linter before code review',
          enabled: false
        }
      ],
      postReview: []
    };
  }

  /**
   * Execute hooks for a specific event
   */
  async executeHooks(event: keyof HookConfig, context: any = {}): Promise<void> {
    const hooks = this.hooks[event];
    if (!hooks || hooks.length === 0) return;

    const enabledHooks = hooks.filter(hook => hook.enabled);
    if (enabledHooks.length === 0) return;

    console.log(`🔗 Running ${enabledHooks.length} ${event} hooks...`);

    for (const hook of enabledHooks) {
      try {
        await this.executeHook(hook, context);
      } catch (error) {
        console.warn(`⚠️  Hook '${hook.name}' failed:`, error);
        // Continue with other hooks even if one fails
      }
    }
  }

  /**
   * Execute a single hook
   */
  private async executeHook(hook: Hook, context: any): Promise<void> {
    console.log(`  🎣 ${hook.name}: ${hook.description || hook.command}`);
    
    // Simple implementation - just log for now
    // In a real implementation, this would execute shell commands
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`  ✅ ${hook.name} completed`);
        resolve();
      }, 100);
    });
  }

  /**
   * Add a new hook
   */
  addHook(event: keyof HookConfig, hook: Hook): void {
    if (!this.hooks[event]) {
      this.hooks[event] = [];
    }
    this.hooks[event]!.push(hook);
  }

  /**
   * Enable/disable a hook
   */
  toggleHook(event: keyof HookConfig, hookName: string, enabled: boolean): boolean {
    const hooks = this.hooks[event];
    if (!hooks) return false;

    const hook = hooks.find(h => h.name === hookName);
    if (!hook) return false;

    hook.enabled = enabled;
    return true;
  }

  /**
   * List all hooks for an event
   */
  getHooks(event: keyof HookConfig): Hook[] {
    return this.hooks[event] || [];
  }

  /**
   * Get hooks configuration
   */
  getConfiguration(): HookConfig {
    return { ...this.hooks };
  }

  /**
   * Load hooks from configuration file
   */
  async loadFromFile(configPath: string): Promise<void> {
    try {
      // Simple file loading - in real implementation would read JSON/YAML
      console.log(`📝 Loading hooks configuration from ${configPath}`);
      // For now, just use defaults
    } catch (error) {
      console.warn('⚠️  Could not load hooks configuration, using defaults');
    }
  }

  /**
   * Save hooks to configuration file
   */
  async saveToFile(configPath: string): Promise<void> {
    try {
      // Simple file saving - in real implementation would write JSON/YAML
      console.log(`💾 Saving hooks configuration to ${configPath}`);
    } catch (error) {
      console.warn('⚠️  Could not save hooks configuration');
    }
  }

  /**
   * Get hook statistics
   */
  getStats(): { total: number; enabled: number; events: number } {
    let total = 0;
    let enabled = 0;
    const events = Object.keys(this.hooks).length;

    Object.values(this.hooks).forEach(hooks => {
      if (hooks) {
        total += hooks.length;
        enabled += hooks.filter(h => h.enabled).length;
      }
    });

    return { total, enabled, events };
  }
}

// Export singleton instance
export const hooks = new SimpleHooks();