import { Point } from '../../models/basicTypes';
import Player from '../../player';
import SingleFrameProjectile from './singleFrameProjectile';
import CircleModel from '../../models/circleModel';
import { IProjectile, ProjectileType } from '../../../models/interfaces/iGameState';
import projectileConstants from '../../../models/constants/projectileConstants';

export default class MeteorProjectile extends SingleFrameProjectile {
  static damage = 10;
  static armTimeInSeconds = 0.5;

  constructor(creatorId: string, position: Point) {
    super(creatorId, MeteorProjectile.armTimeInSeconds);
    this.model = new CircleModel(position, projectileConstants.Meteor.radius);
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(MeteorProjectile.damage);
  }

  toInterface(): IProjectile {
    return {
      projectileType: ProjectileType.Meteor,
      position: this.model.getPosition(),
      armed: this.canCollide(),
    };
  }
}
