import { Point, Vector } from '../../models/basicTypes';
import Game from '../../game';
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

  // Negative range means that the ability has infinite range.
  abstract getRange(): number;

  canCollide(): boolean {
    return true;
  }

  protected shouldDelete(): boolean {
    // Delete any ability that is no longer on the map
    const game = Game.getInstance();
    if (!game.gameMap.isModelOnMap(this.model)) {
      return true;
    }

    // infinite range abilities will keep moving until no longer on the map
    if (this.getRange() < 0) {
      return false;
    }

    const distanceTraveled =
      Vector.createFromPoints(this.model.getPosition(), this.origin).getMagnitude();
    return distanceTraveled >= this.getRange();
  }
}

