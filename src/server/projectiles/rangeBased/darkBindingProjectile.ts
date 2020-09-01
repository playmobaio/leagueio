import { Point, Velocity, Vector } from '../../models/basicTypes';
import RangeBasedProjectile from './rangeBasedProjectile';
import RectangleModel from '../../models/rectangleModel';
import StunEffect from '../../hero/effects/stunEffect';
import { IProjectile, ProjectileType } from '../../../models/interfaces/iGameState';
import projectileConstants from '../../../models/constants/projectileConstants';
import Player from '../../player';
import Game from '../../game';

export default class DarkBindingProjectile extends RangeBasedProjectile {
  static speed = 4;
  static stunInSeconds = 0.5;

  collidedPlayerIds: Set<string>;

  constructor(game: Game, creatorId: string, origin: Point, dest: Point) {
    super(game, creatorId);

    this.origin = origin;
    // get angle and rotate by 90 degrees
    const angleInRadians = Vector.createFromPoints(origin, dest).getAngleInRadians() - Math.PI/2;
    this.model = new RectangleModel(game, origin,
      projectileConstants.DarkBinding.width,
      projectileConstants.DarkBinding.height,
      angleInRadians
    );

    const velocity = new Velocity(dest,
      DarkBindingProjectile.speed,
      origin);
    this.model.setVelocity(velocity);
    this.collidedPlayerIds = new Set();
  }

  getRange(): number {
    return -1;
  }

  onPlayerCollision(player: Player): void {
    player.hero.state.addEffect(
      new StunEffect(DarkBindingProjectile.stunInSeconds));
    player.socket.emit("S:RECEIVED_DAMAGE");
    this.delete();
  }

  toInterface(): IProjectile {
    return {
      projectileType: ProjectileType.DarkBinding,
      position: this.model.getPosition(),
      angle: this.model.getAngle(),
    };
  }
}

