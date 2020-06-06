import { Point, Velocity, Vector, Circle } from './basicTypes';
import { v4 as uuidv4 } from 'uuid';
import { IProjectile, IPoint } from '../../models/interfaces';
import constants from '../constants';
import Game from './game';
import GameMap from './gameMap';
import Player from './player';
import { EmitEvent } from '../tools/emitEvent'

class Projectile implements IProjectile {
  velocity: Velocity;
  id: string;
  range: number;
  origin: Point;
  model: Circle;
  creatorId: string;

  constructor(creatorId: string, src: Point, velocity: Velocity, range: number) {
    this.id = uuidv4();
    this.creatorId = creatorId;
    this.range = range;
    this.origin = src;
    this.model = new Circle(constants.DEFAULT_CIRCLE_RADIUS, src);
    this.velocity = velocity;
  }

  static create(player: Player, model: Circle, dest: IPoint, range: number): Projectile {
    const offsetVector = Vector.createFromPoints(model.center, dest)
      .setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET);
    const origin: Point = model.center.transformWithVector(offsetVector);
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_SPEED,
      model.center);

    const projectile: Projectile = new Projectile(player.id, origin, velocity, range)
    Game.getInstance().emitter.emit(EmitEvent.NewProjectile, projectile);
    return projectile;
  }

  shouldDelete(map: GameMap): boolean {
    return this.model.isInvalidPosition(map) || this.rangeExpired();
  }

  rangeExpired(): boolean {
    const vector = Vector.createFromPoints(this.origin, this.model.center);
    return vector.getMagnitude() > this.range;
  }

  update(): void {
    this.model.center = this.model.center.transform(this.velocity);
  }

  delete(): void {
    Game.getInstance().emitter.emit(EmitEvent.DeleteProjectile, this.id);
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model };
  }
}

export default Projectile;
