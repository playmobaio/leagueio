import { Point, Velocity, Vector } from '../../models/basicTypes';
import RangeBasedProjectile from './rangeBasedProjectile';
import RectangleModel from '../../models/rectangleModel';
import { IProjectile } from '../../../models/interfaces/iGameState';
import Player from '../../player';

export default class EzrealUltimateProjectile extends RangeBasedProjectile {
  static width = 50;
  static height = 20;
  static damage = 20;
  static speed = 10;

  constructor(creatorId: string, origin: Point, dest: Point) {
    super(creatorId);

    this.origin = origin;
    const angleInRadians = Vector.createFromPoints(origin, dest).getAngleInRadians();
    this.model = new RectangleModel(origin,
      EzrealUltimateProjectile.width,
      EzrealUltimateProjectile.height,
      angleInRadians
    );

    const velocity = new Velocity(dest,
      EzrealUltimateProjectile.speed,
      origin);
    this.model.setVelocity(velocity);
  }

  getRange(): number {
    return -1;
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(EzrealUltimateProjectile.damage);
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toIModel() };
  }
}

