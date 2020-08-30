import { Point, Velocity, Vector } from '../../models/basicTypes';
import RangeBasedProjectile from './rangeBasedProjectile';
import RectangleModel from '../../models/rectangleModel';
import { IProjectile, ProjectileType } from '../../../models/interfaces/iGameState';
import projectileConstants from '../../../models/constants/projectileConstants';
import Player from '../../player';
import Game from '../../game';

export default class EzrealUltimateProjectile extends RangeBasedProjectile {
  static damage = 20;
  static speed = 7;

  collidedPlayerIds: Set<string>;

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
      EzrealUltimateProjectile.speed,
      origin);
    this.model.setVelocity(velocity);
    this.collidedPlayerIds = new Set();
  }

  getRange(): number {
    return -1;
  }

  onPlayerCollision(player: Player): void {
    // Ezreal Ultimate can only hit each player once
    if (this.collidedPlayerIds.has(player.id)) {
      return;
    }

    this.collidedPlayerIds.add(player.id);
    player.receiveDamage(EzrealUltimateProjectile.damage);
  }

  toInterface(): IProjectile {
    return {
      projectileType: ProjectileType.EzrealUltimate,
      position: this.model.getPosition(),
      angle: this.model.getAngle(),
    };
  }
}

