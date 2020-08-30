import Model from '../models/model';
import { v4 as uuidv4 } from 'uuid';
import { IProjectile } from '../../models/interfaces/iGameState';
import Game from '../game';
import Player from '../player';
import { EmitEvent } from '../tools/emitEvent'

// Basic projectile abstract class that is iterated through and checks for
// collisions
// Must implement the following attributes:
// - model: Model
// Must implement the following methods:
// - onPlayerCollision(player: Player): void
// - protected shouldDelete(): boolean
// - toInterface(): IProjectile
// - canCollide(): boolean
export default abstract class Projectile {
  id: string;
  name: string;
  model: Model;
  creatorId: string;
  game: Game;

  constructor(game: Game, creatorId: string) {
    this.game = game
    this.id = uuidv4();
    this.creatorId = creatorId;
    console.log(`Creator ${creatorId} created projectile ${this.id}`);
    this.game.emitter.emit(EmitEvent.NewProjectile, this);
  }

  abstract onPlayerCollision(player: Player): void;

  protected abstract shouldDelete(): boolean;

  abstract toInterface(): IProjectile;

  // Return boolean indicating if Projectile model can collide with players
  abstract canCollide(): boolean;

  update(): void {
    if (this.shouldDelete()) {
      this.delete();
    }
    this.model.transform();
  }

  exists(): boolean {
    return this.model.exists;
  }

  collidesWithPlayer(player: Player): boolean {
    return this.canCollide() && this.model.collidesWithModel(player.hero.model);
  }

  protected delete(): void {
    console.log("deleted Projectile: " + this.id);
    this.model.removeBody();
    this.game.emitter.emit(EmitEvent.DeleteProjectile, this.id);
  }
}
