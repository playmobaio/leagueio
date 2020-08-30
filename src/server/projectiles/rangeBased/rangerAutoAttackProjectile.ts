import { Point, Velocity, Vector, VectorBuilder } from '../../models/basicTypes';
import RangeBasedProjectile from './rangeBasedProjectile';
import CircleModel from '../../models/circleModel';
import { IProjectile, ProjectileType } from '../../../models/interfaces/iGameState';
import projectileConstants from '../../../models/constants/projectileConstants';
import Player from '../../player';
import Game from '../../game';

export default class RangerAutoAttackProjectile extends RangeBasedProjectile {
  static range = 300;
  static damage = 10;
  static speed = 12;
  static projectileOffset = 12;

  constructor(game: Game, creatorId: string, casterPosition: Point, dest: Point) {
    super(game,creatorId);
    // offset origin, so the projectile is starting beyond the ranger's current
    // location.
    const offsetVector: Vector = VectorBuilder.createFromPoints(casterPosition, dest)
      .setMagnitude(RangerAutoAttackProjectile.projectileOffset)
      .build();
    const origin: Point = casterPosition.transformWithVector(offsetVector);

    this.origin = origin;
    this.model = new CircleModel(game, origin, projectileConstants.RangerAutoAttack.radius);

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
    return {
      projectileType: ProjectileType.RangerAutoAttack,
      position: this.model.getPosition(),
    };
  }
}
