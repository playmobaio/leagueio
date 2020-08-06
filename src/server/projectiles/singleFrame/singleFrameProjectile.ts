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
export default abstract class SingleFrameProjectile extends Projectile {
  startingFrame: number;
  armTimeInFrames: number;

  constructor(creatorId: string, armTimeInSeconds: number) {
    super(creatorId);
    this.startingFrame = Game.getInstance().currentFrame;
    this.armTimeInFrames = secondsToFrames(armTimeInSeconds);
  }

  canCollide(): boolean {
    return this.startingFrame + this.armTimeInFrames + 1 == Game.getInstance().currentFrame;
  }

  protected shouldDelete(): boolean {
    console.log(Game.getInstance().currentFrame);
    console.log('here');
    console.log(this.startingFrame + this.armTimeInFrames + 1);
    return this.startingFrame + this.armTimeInFrames + 1 < Game.getInstance().currentFrame;
  }
}
