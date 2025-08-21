import { HiveMind } from './hive-mind/core/HiveMind';
import { SwarmCoordinator } from './coordination/swarm-coordinator';
import { MemoryManager } from './memory/manager';
import { MCPServer } from './mcp/server';
import { AgentManager } from './agents/agent-manager';

export class ClaudeFlowIntegration {
  private hiveMind: HiveMind;
  private swarmCoordinator: SwarmCoordinator;
  private memoryManager: MemoryManager;
  private mcpServer: MCPServer;
  private agentManager: AgentManager;

  constructor() {
    this.memoryManager = new MemoryManager();
    this.agentManager = new AgentManager();
    this.swarmCoordinator = new SwarmCoordinator(this.agentManager);
    this.hiveMind = new HiveMind(this.memoryManager);
    this.mcpServer = new MCPServer();
  }

  async initialize(): Promise<void> {
    await this.memoryManager.initialize();
    await this.hiveMind.initialize();
    await this.swarmCoordinator.initialize();
    await this.mcpServer.start();
  }

  async getAvailableAgents(): Promise<string[]> {
    return this.agentManager.getAvailableAgents();
  }

  async executeSwarmTask(task: string, agents?: string[]): Promise<any> {
    return this.swarmCoordinator.executeTask(task, agents);
  }

  async getHiveMindStatus(): Promise<any> {
    return this.hiveMind.getStatus();
  }

  async shutdown(): Promise<void> {
    await this.mcpServer.stop();
    await this.hiveMind.shutdown();
    await this.swarmCoordinator.shutdown();
    await this.memoryManager.cleanup();
  }
}

export default ClaudeFlowIntegration;