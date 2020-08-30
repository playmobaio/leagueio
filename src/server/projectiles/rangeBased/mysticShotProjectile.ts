import { Point, Velocity, Vector } from '../../models/basicTypes';
import RangeBasedProjectile from './rangeBasedProjectile';
import RectangleModel from '../../models/rectangleModel';
import { IProjectile, ProjectileType } from '../../../models/interfaces/iGameState';
import projectileConstants from '../../../models/constants/projectileConstants';
import Player from '../../player';
import Game from '../../game';

export default class MysticShotProjectile extends RangeBasedProjectile {
  static damage = 10;
  static speed = 5;

  constructor(game: Game, creatorId: string, origin: Point, dest: Point) {
    super(game, creatorId);

    this.origin = origin;
    // get angle and rotate by 90 degrees
    const angleInRadians = Vector.createFromPoints(origin, dest).getAngleInRadians() - Math.PI/2;
    this.model = new RectangleModel(origin,
      projectileConstants.EzrealUltimate.width,
      projectileConstants.EzrealUltimate.height,
      angleInRadians
    );

    const velocity = new Velocity(dest,
      MysticShotProjectile.speed,
      origin);
    this.model.setVelocity(velocity);
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(MysticShotProjectile.damage);
    this.delete();
  }

  getRange(): number {
    return -1;
  }

  toInterface(): IProjectile {
    return {
      projectileType: ProjectileType.MysticShot,
      position: this.model.getPosition(),
      angle: this.model.getAngle(),
    };
  }
}

