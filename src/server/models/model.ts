import { Body } from 'detect-collisions';
import { EmitEvent } from '../tools/emitEvent'
import { Point, Velocity } from './basicTypes';
import Game from './game';

// A Model is the representation of an in game object. A model is an interface
// for using the detect-collisions package
export default abstract class Model {
  protected position: Point;
  velocity: Velocity;
  protected abstract body: Body;
  exists: boolean;

  constructor() {
    this.exists = true;
  }

  updatePosition(position: Point): void {
    this.position = position;
    this.body.x = position.x;
    this.body.y = position.y;
  }

  collides(otherModel: Model): boolean {
    return otherModel.collidesWithBody(this.body)
  }

  collidesWithBody(otherBody: Body): boolean {
    return this.body.collides(otherBody);
  }

  transform(): void {
    this.updatePosition(this.position.transform(this.velocity));
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
}

