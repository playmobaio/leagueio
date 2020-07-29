import { Point, Velocity, Vector, VectorBuilder } from '../../models/basicTypes';
import RangeBasedProjectile from '../rangeBasedProjectile';
import CircleModel from '../../models/circleModel';
import { IProjectile } from '../../../models/interfaces';
import Player from '../../player';
import constants from '../../constants';

export default class RangerAutoAttackProjectile extends RangeBasedProjectile {
  static range = 300;
  static radius = 10;
  static damage = 10;
  static speed = 12;

  constructor(creatorId: string, casterPosition: Point, dest: Point) {
    super(creatorId);
    const offsetVector: Vector = VectorBuilder.createFromPoints(casterPosition, dest)
      .setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET)
      .build();
    const origin: Point = casterPosition.transformWithVector(offsetVector);

    this.origin = origin;
    this.model = new CircleModel(origin, RangerAutoAttackProjectile.radius);

    const velocity = new Velocity(dest,
      RangerAutoAttackProjectile.speed,
      origin);
    this.model.setVelocity(velocity);
  }

  getRange(): number {
    return RangerAutoAttackProjectile.range;
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(RangerAutoAttackProjectile.damage);
    this.delete();
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toICircle() };
  }
}
