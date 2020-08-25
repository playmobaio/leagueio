import Game from './game';
import Player from './player';
import MeteorProjectile from './projectiles/singleFrame/meteorProjectile';
import EzrealUltimateProjectile from './projectiles/rangeBased/ezrealUltimateProjectile';
import { Point } from './models/basicTypes';
import { secondsToFrames } from './tools/frame';

// ProjectileManager autogenerate projectiles to shoot at the player.
class ProjectileManager {
  game: Game;
  id: string;

  // all frequencies are in 10 second increments
  static METEOR_FREQUENCY = 8;
  static EZREAL_ULTIMATE_FREQUENCY = 2;

  static ID = "PROJECTILE_MANAGER";

  constructor(game: Game) {
    this.game = game;
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
    if (!this.shouldCast(ProjectileManager.METEOR_FREQUENCY)) {
      return;
    }

    new MeteorProjectile(ProjectileManager.ID, this.getCastDestination());
  }

  private maybeCreateEzrealUltimate(): void {
    if (!this.shouldCast(ProjectileManager.EZREAL_ULTIMATE_FREQUENCY)) {
      return;
    }

    new EzrealUltimateProjectile(ProjectileManager.ID, this.getCastOrigin(), this.getCastDestination());
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
