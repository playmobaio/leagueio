import { Point, Velocity, VectorBuilder, Vector } from './basicTypes';
import CircleModel from './circleModel';
import { v4 as uuidv4 } from 'uuid';
import { IProjectile } from '../../models/interfaces';
import constants from '../constants';
import Game from '../game';
import Player from '../player';
import { EmitEvent } from '../tools/emitEvent'

class Projectile {
  id: string;
  range: number;
  readonly origin: Point;
  model: CircleModel;
  creatorId: string;

  constructor(creatorId: string, src: Point, velocity: Velocity, range: number) {
    this.id = uuidv4();
    this.creatorId = creatorId;
    this.range = range;
    this.origin = src;
    this.model = new CircleModel(src, constants.DEFAULT_CIRCLE_RADIUS);
    this.model.setVelocity(velocity);
  }

  static create(player: Player, casterPosition: Point, dest: Point, range: number): Projectile {
    const offsetVector: Vector = VectorBuilder.createFromPoints(casterPosition, dest)
      .setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET)
      .build();
    const origin: Point = casterPosition.transformWithVector(offsetVector);
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_SPEED,
      origin);

    const projectile: Projectile = new Projectile(player.id, origin, velocity, range)
    Game.getInstance().emitter.emit(EmitEvent.NewProjectile, projectile);
    return projectile;
  }

  shouldDelete(): boolean {
    return this.rangeExpired();
  }

  rangeExpired(): boolean {
    const vector = Vector.createFromPoints(this.origin, this.model.getPosition());
    return vector.getMagnitude() > this.range;
  }

  update(): void {
    this.model.transform();
  }

  delete(): void {
    this.model.removeBody();
    Game.getInstance().emitter.emit(EmitEvent.DeleteProjectile, this.id);
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toICircle() };
  }
}

export default Projectile;
