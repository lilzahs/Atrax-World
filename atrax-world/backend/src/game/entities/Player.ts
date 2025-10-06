import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger';

export interface PlayerData {
  id?: string;
  walletAddress: string;
  username: string;
  level: number;
  coins: number;
  health: number;
  energy: number;
  x: number;
  y: number;
  roomId?: string;
  lastActive: Date;
}

export class Player {
  public id: string;
  public walletAddress: string;
  public username: string;
  public level: number;
  public coins: number;
  public health: number;
  public energy: number;
  public x: number;
  public y: number;
  public roomId?: string;
  public lastActive: Date;
  public inventory: any[] = [];
  public stats: any = {};

  constructor(data: PlayerData) {
    this.id = data.id || uuidv4();
    this.walletAddress = data.walletAddress;
    this.username = data.username;
    this.level = data.level || 1;
    this.coins = data.coins || 100;
    this.health = data.health || 100;
    this.energy = data.energy || 100;
    this.x = data.x || 400;
    this.y = data.y || 300;
    this.roomId = data.roomId;
    this.lastActive = data.lastActive || new Date();
  }

  async update(updates?: any): Promise<void> {
    if (updates) {
      Object.assign(this, updates);
    }
    
    this.lastActive = new Date();
    
    // Update player logic
    await this.updateStats();
    await this.updateInventory();
  }

  private async updateStats(): Promise<void> {
    // Update player statistics
    this.stats = {
      totalPlayTime: Date.now() - this.lastActive.getTime(),
      buildingsOwned: 0, // Will be calculated from buildings
      totalCoinsEarned: this.coins,
      level: this.level
    };
  }

  private async updateInventory(): Promise<void> {
    // Update inventory logic
    // This could include item effects, timers, etc.
  }

  async syncWithBlockchain(): Promise<void> {
    try {
      // Sync player data with Solana blockchain
      // This would call your smart contract to get latest data
      logger.debug(`Syncing player ${this.id} with blockchain`);
    } catch (error) {
      logger.error(`Failed to sync player ${this.id} with blockchain:`, error);
    }
  }

  canAfford(cost: number): boolean {
    return this.coins >= cost;
  }

  spendCoins(amount: number): boolean {
    if (this.canAfford(amount)) {
      this.coins -= amount;
      return true;
    }
    return false;
  }

  earnCoins(amount: number): void {
    this.coins += amount;
  }

  moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.lastActive = new Date();
  }

  toJSON(): any {
    return {
      id: this.id,
      walletAddress: this.walletAddress,
      username: this.username,
      level: this.level,
      coins: this.coins,
      health: this.health,
      energy: this.energy,
      x: this.x,
      y: this.y,
      roomId: this.roomId,
      lastActive: this.lastActive,
      inventory: this.inventory,
      stats: this.stats
    };
  }
}