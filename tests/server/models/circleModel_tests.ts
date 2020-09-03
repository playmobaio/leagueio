import * as assert from 'assert';
import { Point } from 'detect-collisions';
import { EmitEvent } from '../../../src/server/tools/emitEvent'
import Game from "../../../src/server/game";
import CircleModel from "../../../src/server/models/circleModel";

describe('CircleModel', function() {
  let game: Game;
  let point: Point;

  beforeEach(function() {
    game = Game.createTest();

    point = new Point(10, 0);
    game.emitter.emit(EmitEvent.NewBody, point);
  });

  it('correctly initializes Body', function() {
    const model = new CircleModel(game, { x: 0, y: 0 }, 20);
    assert(model.collidesWithBody(point));
  });

  it('updateRadius correctly updates radius', function() {
    const model = new CircleModel(game, { x: 0, y: 0 }, 10);
    assert(!model.collidesWithBody(point));

    model.updateRadius(20);
    game.update();
    assert(model.collidesWithBody(point));
  });
});

