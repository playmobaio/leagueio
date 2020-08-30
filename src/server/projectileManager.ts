import Game from './game';
import Player from './player';
import MeteorProjectile from './projectiles/singleFrame/meteorProjectile';
import EzrealUltimateProjectile from './projectiles/rangeBased/ezrealUltimateProjectile';
import { Point, VectorBuilder } from './models/basicTypes';
import { secondsToFrames } from './tools/frame';
import FinalSparkProjectile from './projectiles/singleFrame/finalSparkProjectile';
import MysticShotProjectile from './projectiles/rangeBased/mysticShotProjectile';

// ProjectileManager autogenerate projectiles to shoot at the player.
class ProjectileManager {
  game: Game;
  id: string;
  private multiplier: number;

  // all frequencies are in 10 second increments
  static METEOR_FREQUENCY = 8;
  static MYSTIC_SHOT_FREQUENCY = 6;
  static EZREAL_ULTIMATE_FREQUENCY = 4;
  static FINAL_SPARK_FREQUENCY = 3;

  static ID = "PROJECTILE_MANAGER";
  static AppxmLogBase2500 = 7.824
  static RANDOM_POINT_RADIUS = 50;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {
    const numPlayers: number = this.game.players.size;
    // should only have one player but found
    if (numPlayers != 1) {
      return;
    }
    this.setMultiplier();
    this.maybeCreateMeteor();
    this.maybeCreateEzrealUltimate();
    this.maybeCreateFinalSpark();
    this.maybeCreateMysticShot();
  }

  private setMultiplier(): void {
    // The goal here is that frequency multipler rises by
    // https://www.wolframalpha.com/input/?i=graph+log+base+2500+x+from+500+to+10000
    this.multiplier = Math.log(this.game.currentFrame) / ProjectileManager.AppxmLogBase2500;
  }

  private maybeCreateMeteor(): void {
    if (!this.shouldCast(ProjectileManager.METEOR_FREQUENCY)) {
      return;
    }

    new MeteorProjectile(this.game, ProjectileManager.ID, this.getCastDestination());
  }

  private maybeCreateEzrealUltimate(): void {
    if (!this.shouldCast(ProjectileManager.EZREAL_ULTIMATE_FREQUENCY)) {
      return;
    }

    new EzrealUltimateProjectile(
      this.game,
      ProjectileManager.ID,
      this.getCastOrigin(),
      this.getCastDestination());
  }

  private maybeCreateFinalSpark(): void {
    if (!this.shouldCast(ProjectileManager.FINAL_SPARK_FREQUENCY)) {
      return;
    }

    new FinalSparkProjectile(
      this.game,
      ProjectileManager.ID,
      this.getCastOrigin(),
      this.getCastDestination());
  }

  private maybeCreateMysticShot(): void {
    if (!this.shouldCast(ProjectileManager.MYSTIC_SHOT_FREQUENCY)) {
      return;
    }

    new MysticShotProjectile(
      this.game,
      ProjectileManager.ID,
      this.getCastOrigin(),
      this.getCastDestination());
  }

  private shouldCast(frequency: number): boolean {
    return frequency * this.multiplier > this.getRandomInt(secondsToFrames(10));
  }

  // return random int from 0 - (ceiling - 1)
  private getRandomInt(ceiling: number): number {
    return Math.floor(Math.random() * ceiling);
  }

  private getCastDestination(): Point {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * ProjectileManager.RANDOM_POINT_RADIUS;
    const player: Player = this.game.players.values().next().value;
    const vector = new VectorBuilder(1, 0)
      .rotateCounterClockWise(angle)
      .setMagnitude(radius)
      .build();
    return player.hero.model.getPosition().transformWithVector(vector);
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
