import { secondsToFrames } from '../../tools/frame';
import Projectile from '../projectile';
import Game from '../../game';

// SingleFrameProjectile represents a projectile that will live for a fixed amount of
// time (armTime) + 1, where the projectile cannot collide with units during
// armtime followed by one frame where the projectile model can collide with
// players.
// Must implement the following attributes:
// - model: Model
// Must implement the following methods:
// - onPlayerCollision(player: Player): void
// - toInterface(): IProjectile
export default abstract class SingleFrameProjectile extends Projectile {
  startingFrame: number;
  // Arm time is the time when the projectile animation is indicating the
  // projectile location but before the projectile can collide.
  armTimeInFrames: number;

  constructor(creatorId: string, armTimeInSeconds: number) {
    super(creatorId);
    this.startingFrame = Game.getInstance().currentFrame;
    this.armTimeInFrames = secondsToFrames(armTimeInSeconds);
  }

  // SingleFrameProjectile should only allow the model to collide for the single
  // frame after arm time
  canCollide(): boolean {
    return this.startingFrame + this.armTimeInFrames + 1 == Game.getInstance().currentFrame;
  }

  // Delete after arm time and the single frame of collisions
  protected shouldDelete(): boolean {
    return this.startingFrame + this.armTimeInFrames + 1 < Game.getInstance().currentFrame;
  }
}
