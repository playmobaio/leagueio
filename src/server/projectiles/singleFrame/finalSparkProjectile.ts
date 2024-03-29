import { Point, Vector } from '../../models/basicTypes';
import Player from '../../player';
import SingleFrameProjectile from './singleFrameProjectile';
import { IProjectile, ProjectileType } from '../../../models/interfaces/iGameState';
import projectileConstants from '../../../models/constants/projectileConstants';
import RectangleModel from '../../models/rectangleModel';
import Game from '../../game';

export default class FinalSparkProjectile extends SingleFrameProjectile {
  static damage = 50;
  static armTimeInSeconds = 0.75;

  constructor(game: Game, creatorId: string, origin: Point, dest: Point) {
    super(game, creatorId, FinalSparkProjectile.armTimeInSeconds);

    const angleInRadians = Vector.createFromPoints(origin, dest).getAngleInRadians() - Math.PI/2;
    this.model = new RectangleModel(game, origin,
      projectileConstants.FinalSpark.width,
      projectileConstants.FinalSpark.height,
      angleInRadians
    );
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(FinalSparkProjectile.damage);
  }

  toInterface(): IProjectile {
    return {
      projectileType: ProjectileType.FinalSpark,
      angle: this.model.getAngle(),
      position: this.model.getPosition(),
      armed: this.canCollide(),
    };
  }
}
