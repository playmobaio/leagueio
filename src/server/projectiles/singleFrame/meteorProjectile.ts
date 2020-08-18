import { Point } from '../../models/basicTypes';
import Player from '../../player';
import SingleFrameProjectile from './singleFrameProjectile';
import CircleModel from '../../models/circleModel';
import { IProjectile } from '../../../models/interfaces';

export default class MeteorProjectile extends SingleFrameProjectile {
  static radius = 20;
  static damage = 10;
  static armTimeInSeconds = 0.75;

  constructor(creatorId: string, position: Point) {
    super(creatorId, MeteorProjectile.armTimeInSeconds);
    this.model = new CircleModel(position, MeteorProjectile.radius);
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(MeteorProjectile.damage);
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toIModel() };
  }
}
