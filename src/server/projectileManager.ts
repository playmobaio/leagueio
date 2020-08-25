import Game from './game';
import Player from './player';
import MeteorProjectile from './projectiles/singleFrame/meteorProjectile';
import EzrealUltimateProjectile from './projectiles/rangeBased/ezrealUltimateProjectile';
import { Point } from './models/basicTypes';
import { secondsToFrames } from './tools/frame';
import { ProjectileManagerConfig } from './projectileManagerConfig';

// ProjectileManager autogenerate projectiles to shoot at the player.
class ProjectileManager {
  game: Game;
  config: ProjectileManagerConfig;
  id: string;

  constructor(game: Game, config: ProjectileManagerConfig) {
    this.game = game;
    this.config = config;
    this.id = "PROJECTILE_MANAGER";
  }

  update(): void {
    const numPlayers: number = this.game.players.size;
    // should only have one player but found
    if (numPlayers != 1) {
      return;
    }

    this.maybeCreateMeteor();
    this.maybeCreateEzrealUltimate();
  }

  private maybeCreateMeteor(): void {
    if (!this.shouldCast(this.config.getMeteorFrequency())) {
      return;
    }

    new MeteorProjectile(this.id, this.getCastDestination());
  }

  private maybeCreateEzrealUltimate(): void {
    if (!this.shouldCast(this.config.getEzrealUltimateFrequency())) {
      return;
    }

    new EzrealUltimateProjectile(this.id, this.getCastOrigin(), this.getCastDestination());
  }

  private shouldCast(frequency: number): boolean {
    return frequency > this.getRandomInt(secondsToFrames(10));
  }

  // return random int from 0 - (ceiling - 1)
  private getRandomInt(ceiling: number): number {
    return Math.floor(Math.random() * ceiling);
  }

  private getCastDestination(): Point {
    const player: Player = this.game.players.values().next().value;
    return player.hero.model.getPosition();
  }

  private getCastOrigin(): Point {
    const randomInt: number = this.getRandomInt(4);

    switch (randomInt) {
    case 0: { // cast from top of map
      return new Point(this.getRandomInt(this.game.gameMap.width), 0)
      break;
    }
    case 1: { // cast from bottom of map
      return new Point(this.getRandomInt(this.game.gameMap.width),
        this.game.gameMap.height)
      break;
    }
    case 2: { // cast from left of map
      return new Point(0, this.getRandomInt(this.game.gameMap.height))
      break;
    }
    default: { // cast from left of map
      return new Point(this.game.gameMap.width, this.getRandomInt(this.game.gameMap.height))
      break;
    }
    }
  }
}

export default ProjectileManager;
