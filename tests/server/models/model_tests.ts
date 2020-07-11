import * as assert from 'assert';
import { Body, Polygon } from 'detect-collisions';
import { EmitEvent } from '../../../src/server/tools/emitEvent'
import Game from "../../../src/server/models/game";
import { TestModel } from "../testClasses";

describe('Model', function() {
  let game: Game;
  let square: Polygon;
  const INITIAL_BODIES = 1;

  beforeEach(function() {
    game = Game.getInstance();
    game.reset();

    // a square with side length of 10 and the bottom left point at the origin
    square = new Polygon(0, 0, [[0, 0], [10, 0], [10, 10], [0, 10]]);
    game.emitter.emit(EmitEvent.NewBody, square);
  });

  it('updatePosition updates body position', function() {
    const model = new TestModel({ x: 0, y: 0 });
    assert(!model.collidesWithBody(square));

    model.updatePosition({ x: 1, y: 1 });
    game.update();
    assert(model.collidesWithBody(square));
    assert(model.getBody().x == 1);
    assert(model.getBody().y == 1);
  });

  it('removeBody removes body from the collision system', function() {
    const model = new TestModel({ x: 0, y: 0 });
    let bodies: Body[] = game.system._bvh._bodies as Body[];
    assert(bodies.length == INITIAL_BODIES + 1);
    assert(model.exists);

    model.removeBody();
    bodies = game.system._bvh._bodies as Body[];
    assert(bodies.length == INITIAL_BODIES);
    assert(!model.exists);
  });
});

