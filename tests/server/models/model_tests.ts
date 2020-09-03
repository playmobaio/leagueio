import * as assert from 'assert';
import { Body, Polygon } from 'detect-collisions';
import { EmitEvent } from '../../../src/server/tools/emitEvent'
import Game from "../../../src/server/game";
import { TestModel } from "../testClasses";
import { Velocity } from "../../../src/server/models/basicTypes";

describe('Model', function() {
  let game: Game;
  let square: Polygon;
  let initialBodies: number;

  function getNumBodies(): number {
    const bodies: Body[] = game.collisionSystem._bvh._bodies as Body[];
    return bodies.length
  }

  beforeEach(function() {
    game = Game.createTest();

    // a square with side length of 10 and the bottom left point at the origin
    square = new Polygon(0, 0, [[0, 0], [10, 0], [10, 10], [0, 10]]);
    game.emitter.emit(EmitEvent.NewBody, square);
    initialBodies = getNumBodies();
  });

  function assertModelPosition(model: TestModel, x: number, y: number): void {
    const position = model.getPosition();
    assert.equal(position.x, x);
    assert.equal(position.y, y);
  }

  it('transform correctly updates position', function() {
    const model = new TestModel(game, { x: 0, y: 0 });
    assertModelPosition(model, 0, 0);

    // Should default to having a velocity of 0 initially
    model.transform();
    assertModelPosition(model, 0, 0);

    model.setVelocity(new Velocity({ x: 1, y: 0 }, 1));
    model.transform();
    assertModelPosition(model, 1, 0);
  });

  it('updatePosition updates body position', function() {
    const model = new TestModel(game, { x: 0, y: 0 });
    assert(!model.collidesWithBody(square));

    model.updatePosition({ x: 1, y: 1 });
    game.update();
    assert(model.collidesWithBody(square));
    assert(model.getBody().x == 1);
    assert(model.getBody().y == 1);
  });

  it('removeBody removes body from the collision system', function() {
    const model = new TestModel(game, { x: 0, y: 0 });
    assert(getNumBodies() == initialBodies + 1);
    assert(model.exists);

    model.removeBody();
    assert(getNumBodies() == initialBodies);
    assert(!model.exists);
  });
});


