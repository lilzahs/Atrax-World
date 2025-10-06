import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger';

export interface BuildingData {
  id?: string;
  type: string;
  level: number;
  x: number;
  y: number;
  ownerId: string;
  roomId: string;
  cost: number;
  productionRate: number;
  lastProduction: Date;
}

export class Building {
  public id: string;
  public type: string;
  public level: number;
  public x: number;
  public y: number;
  public ownerId: string;
  public roomId: string;
  public cost: number;
  public productionRate: number;
  public lastProduction: Date;
  public health: number;
  public maxHealth: number;

  constructor(data: BuildingData) {
    this.id = data.id || uuidv4();
    this.type = data.type;
    this.level = data.level || 1;
    this.x = data.x;
    this.y = data.y;
    this.ownerId = data.ownerId;
    this.roomId = data.roomId;
    this.cost = data.cost;
    this.productionRate = data.productionRate || 1;
    this.lastProduction = data.lastProduction || new Date();
    this.maxHealth = this.calculateMaxHealth();
    this.health = this.maxHealth;
  }

  async update(): Promise<void> {
    // Update building logic
    await this.produceResources();
    await this.updateHealth();
  }

  private async produceResources(): Promise<void> {
    const now = new Date();
    const timeSinceLastProduction = now.getTime() - this.lastProduction.getTime();
    
    // Produce resources based on production rate
    if (timeSinceLastProduction >= 60000) { // 1 minute
      const resourcesProduced = Math.floor(timeSinceLastProduction / 60000) * this.productionRate;
      
      // Emit event for resource production
      // This would be handled by the game state manager
      
      this.lastProduction = now;
    }
  }

  private async updateHealth(): Promise<void> {
    // Update building health
    // Buildings could lose health over time or from events
  }

  private calculateMaxHealth(): number {
    return this.cost * 10; // Max health is 10x the cost
  }

  async upgrade(): Promise<boolean> {
    if (this.level >= 10) return false; // Max level
    
    this.level++;
    this.productionRate *= 1.5;
    this.maxHealth = this.calculateMaxHealth();
    this.health = this.maxHealth;
    
    return true;
  }

  async syncWithBlockchain(): Promise<void> {
    try {
      // Sync building data with Solana blockchain
      logger.debug(`Syncing building ${this.id} with blockchain`);
    } catch (error) {
      logger.error(`Failed to sync building ${this.id} with blockchain:`, error);
    }
  }

  toJSON(): any {
    return {
      id: this.id,
      type: this.type,
      level: this.level,
      x: this.x,
      y: this.y,
      ownerId: this.ownerId,
      roomId: this.roomId,
      cost: this.cost,
      productionRate: this.productionRate,
      lastProduction: this.lastProduction,
      health: this.health,
      maxHealth: this.maxHealth
    };
  }
}