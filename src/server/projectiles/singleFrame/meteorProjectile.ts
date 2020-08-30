import { Point } from '../../models/basicTypes';
import Player from '../../player';
import SingleFrameProjectile from './singleFrameProjectile';
import CircleModel from '../../models/circleModel';
import { IProjectile, ProjectileType } from '../../../models/interfaces/iGameState';
import projectileConstants from '../../../models/constants/projectileConstants';
import Game from '../../game';

export default class MeteorProjectile extends SingleFrameProjectile {
  static damage = 10;
  static armTimeInSeconds = 0.5;

  constructor(game: Game, creatorId: string, position: Point) {
    super(game, creatorId, MeteorProjectile.armTimeInSeconds);
    this.model = new CircleModel(game, position, projectileConstants.Meteor.radius);
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
