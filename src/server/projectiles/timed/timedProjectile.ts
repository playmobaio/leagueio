import { secondsToFrames } from '../../tools/frame';
import Projectile from '../projectile';
import Game from '../../game';

// TimedProjectile represents a projectile that will live for a fixed amount of
// time (lifespan).
// Must implement the following attributes:
// - model: Model
// Must implement the following methods:
// - onPlayerCollision(player: Player): void
// - toInterface(): IProjectile
export default abstract class TimedProjectile extends Projectile {
  startingFrame: number;
  lifeSpanInFrames: number;

  constructor(game: Game, creatorId: string, lifeSpanInSeconds: number) {
    super(game, creatorId);
    this.startingFrame = this.game.currentFrame;
    this.lifeSpanInFrames = secondsToFrames(lifeSpanInSeconds);
  }

  // Will always collide
  canCollide(): boolean {
    return true;
  }

  protected shouldDelete(): boolean {
    return this.startingFrame + this.lifeSpanInFrames < this.game.currentFrame;
  }
}

