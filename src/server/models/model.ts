import { Body } from 'detect-collisions';
import { EmitEvent } from '../tools/emitEvent'
import { Point, Velocity } from './basicTypes';
import Game from '../game';
import GameMap from '../gameMap';
import { IModel } from '../../models/interfaces';

// A Model is the representation of an in game object. A model is an interface
// for using the detect-collisions package
export default abstract class Model {
  protected position: Point;
  protected velocity: Velocity;
  protected abstract body: Body;
  exists: boolean;

  // All subclasses should instantiate Body
  constructor() {
    this.velocity = Velocity.createNull();
    this.exists = true;
  }

  getPosition(): Point {
    return this.position;
  }

  updatePosition(position: Point): void {
    this.position = position;
    this.body.x = position.x;
    this.body.y = position.y;
  }

  getVelocity(): Velocity {
    return this.velocity;
  }

  setVelocity(velocity: Velocity): void {
    this.velocity = velocity;
  }

  collidesWithModel(otherModel: Model): boolean {
    return otherModel.collidesWithBody(this.body)
  }

  collidesWithBody(otherBody: Body): boolean {
    return this.body.collides(otherBody);
  }

  transform(): void {
    this.updatePosition(this.position.transform(this.velocity));
  }

  // Get the point that transform will update position to
  getTransformPosition(): Point {
    return this.position.transform(this.velocity);
  }

  // Should be called in every Model's constructor for the detection collision
  // system to recognize the body.
  protected addBody(): void {
    Game.getInstance().emitter.emit(EmitEvent.NewBody, this.body);
  }

  removeBody(): void {
    Game.getInstance().emitter.emit(EmitEvent.RemoveBody, this.body);
    this.exists = false;
  }

  abstract toIModel(): IModel;

  // The points that should be checked for map related position collisions.
  // Primarily if a model is colliding with a wall or is on the map.
  abstract getMapCollisionPositions(point: Point): Point[];

  collidesWithSolidTile(point = this.position): boolean {
    const map: GameMap = Game.getInstance().gameMap;

    const mapCollisionPositions = this.getMapCollisionPositions(point);
    for (const index in mapCollisionPositions) {
      if (map.isSolidTile(mapCollisionPositions[index])) {
        return true;
      }
    }
    return false;
  }

  isOnMap(point = this.position): boolean {
    const map: GameMap = Game.getInstance().gameMap;

    const mapCollisionPositions = this.getMapCollisionPositions(point);
    for (const index in mapCollisionPositions) {
      if (map.isOnMap(mapCollisionPositions[index])) {
        return true;
      }
    }
    return false;
  }
}

