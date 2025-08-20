/**
 * Simple Configuration Manager
 * Inspired by Claude Flow's configuration system but lightweight
 * Manages basic settings and user preferences
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface AgentConfig {
  name: string;
  enabled: boolean;
  confidence: number;
  specialization: string;
}

export interface ConductorConfig {
  version: string;
  initialized: boolean;
  user: {
    name?: string;
    email?: string;
    experience: 'beginner' | 'intermediate' | 'expert';
    preferredFramework?: string;
  };
  agents: AgentConfig[];
  settings: {
    autoLaunch: boolean;
    verboseOutput: boolean;
    enableHooks: boolean;
    theme: 'default' | 'minimal' | 'detailed';
    responseStyle: 'concise' | 'detailed' | 'conversational';
  };
  project: {
    type?: 'react' | 'nextjs' | 'vue' | 'nodejs' | 'python' | 'other';
    name?: string;
    description?: string;
    lastModified: string;
  };
  history: {
    totalQuestions: number;
    lastUsed: string;
    favoriteAgents: string[];
  };
}

export class SimpleConfigManager {
  private configPath: string;
  private config: ConductorConfig;

  constructor() {
    this.configPath = path.join(os.homedir(), '.conductor', 'config.json');
    this.config = this.getDefaultConfig();
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): ConductorConfig {
    return {
      version: '1.0.0',
      initialized: false,
      user: {
        experience: 'beginner',
      },
      agents: [
        { name: 'pm', enabled: true, confidence: 85, specialization: 'Product Management' },
        { name: 'design', enabled: true, confidence: 80, specialization: 'UX/UI Design' },
        { name: 'frontend', enabled: true, confidence: 90, specialization: 'Frontend Development' },
        { name: 'backend', enabled: true, confidence: 85, specialization: 'Backend Development' },
        { name: 'qa', enabled: true, confidence: 75, specialization: 'Quality Assurance' },
        { name: 'devops', enabled: true, confidence: 70, specialization: 'DevOps & Deployment' },
        { name: 'reviewer', enabled: true, confidence: 85, specialization: 'Code Review' },
        { name: 'security', enabled: true, confidence: 80, specialization: 'Security' },
      ],
      settings: {
        autoLaunch: false,
        verboseOutput: false,
        enableHooks: false,
        theme: 'default',
        responseStyle: 'concise',
      },
      project: {
        lastModified: new Date().toISOString(),
      },
      history: {
        totalQuestions: 0,
        lastUsed: new Date().toISOString(),
        favoriteAgents: [],
      },
    };
  }

  /**
   * Initialize configuration
   */
  async initialize(): Promise<void> {
    try {
      // Ensure .conductor directory exists
      const configDir = path.dirname(this.configPath);
      await fs.ensureDir(configDir);

      // Load existing config or create default
      await this.load();
      
      this.config.initialized = true;
      this.config.history.lastUsed = new Date().toISOString();
      
      await this.save();
      console.log('🎯 Conductor configuration initialized!');
    } catch (error) {
      console.warn('⚠️  Could not initialize configuration:', error);
    }
  }

  /**
   * Load configuration from file
   */
  async load(): Promise<void> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const fileContent = await fs.readFile(this.configPath, 'utf8');
        const loadedConfig = JSON.parse(fileContent);
        
        // Merge with defaults to ensure all properties exist
        this.config = { ...this.getDefaultConfig(), ...loadedConfig };
        console.log('📖 Configuration loaded successfully');
      } else {
        console.log('📝 Using default configuration');
      }
    } catch (error) {
      console.warn('⚠️  Could not load configuration, using defaults');
      this.config = this.getDefaultConfig();
    }
  }

  /**
   * Save configuration to file
   */
  async save(): Promise<void> {
    try {
      const configDir = path.dirname(this.configPath);
      await fs.ensureDir(configDir);
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('💾 Configuration saved successfully');
    } catch (error) {
      console.warn('⚠️  Could not save configuration:', error);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): ConductorConfig {
    return { ...this.config };
  }

  /**
   * Update user preferences
   */
  async updateUser(updates: Partial<ConductorConfig['user']>): Promise<void> {
    this.config.user = { ...this.config.user, ...updates };
    await this.save();
  }

  /**
   * Update project information
   */
  async updateProject(updates: Partial<ConductorConfig['project']>): Promise<void> {
    this.config.project = { 
      ...this.config.project, 
      ...updates,
      lastModified: new Date().toISOString()
    };
    await this.save();
  }

  /**
   * Update settings
   */
  async updateSettings(updates: Partial<ConductorConfig['settings']>): Promise<void> {
    this.config.settings = { ...this.config.settings, ...updates };
    await this.save();
  }

  /**
   * Enable/disable agent
   */
  async toggleAgent(agentName: string, enabled: boolean): Promise<boolean> {
    const agent = this.config.agents.find(a => a.name === agentName);
    if (!agent) return false;

    agent.enabled = enabled;
    await this.save();
    return true;
  }

  /**
   * Get enabled agents
   */
  getEnabledAgents(): AgentConfig[] {
    return this.config.agents.filter(agent => agent.enabled);
  }

  /**
   * Update agent confidence
   */
  async updateAgentConfidence(agentName: string, confidence: number): Promise<boolean> {
    const agent = this.config.agents.find(a => a.name === agentName);
    if (!agent) return false;

    agent.confidence = Math.max(0, Math.min(100, confidence));
    await this.save();
    return true;
  }

  /**
   * Record a question in history
   */
  async recordQuestion(agentUsed?: string): Promise<void> {
    this.config.history.totalQuestions++;
    this.config.history.lastUsed = new Date().toISOString();
    
    if (agentUsed && !this.config.history.favoriteAgents.includes(agentUsed)) {
      this.config.history.favoriteAgents.push(agentUsed);
      // Keep only top 5 favorites
      if (this.config.history.favoriteAgents.length > 5) {
        this.config.history.favoriteAgents = this.config.history.favoriteAgents.slice(-5);
      }
    }
    
    await this.save();
  }

  /**
   * Get configuration summary for display
   */
  getSummary(): {
    initialized: boolean;
    agents: number;
    enabledAgents: number;
    totalQuestions: number;
    experience: string;
    projectType?: string;
  } {
    return {
      initialized: this.config.initialized,
      agents: this.config.agents.length,
      enabledAgents: this.getEnabledAgents().length,
      totalQuestions: this.config.history.totalQuestions,
      experience: this.config.user.experience,
      projectType: this.config.project.type,
    };
  }

  /**
   * Reset configuration to defaults
   */
  async reset(): Promise<void> {
    this.config = this.getDefaultConfig();
    await this.save();
    console.log('🔄 Configuration reset to defaults');
  }

  /**
   * Export configuration for backup
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from backup
   */
  async importConfig(configJson: string): Promise<boolean> {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...this.getDefaultConfig(), ...importedConfig };
      await this.save();
      console.log('📥 Configuration imported successfully');
      return true;
    } catch (error) {
      console.warn('⚠️  Could not import configuration:', error);
      return false;
    }
  }
}

// Export singleton instance
export const config = new SimpleConfigManager();