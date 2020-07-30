import { Point, Vector } from '../../models/basicTypes';
import Projectile from '../projectile';

// RangeBasedProjectile represents a projectile that will live until it has
// moved a fixed distance from it's origin in a straight line.
// Must implement the following attributes:
// - model: Model
// - origin: Point
// Must implement the following methods:
// - onPlayerCollision(player: Player): void
// - toInterface(): IProjectile
// - getRange(): number
export default abstract class RangeBasedProjectile extends Projectile {
  origin: Point;

  constructor(creatorId: string) {
    super(creatorId);
  }

  abstract getRange(): number;

  protected shouldDelete(): boolean {
    const distanceTraveled =
      Vector.createFromPoints(this.model.getPosition(), this.origin).getMagnitude();
    return distanceTraveled >= this.getRange();
  }
}

