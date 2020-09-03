import * as assert from 'assert';
import { Point } from 'detect-collisions';
import { EmitEvent } from '../../../src/server/tools/emitEvent'
import Game from "../../../src/server/game";
import RectangleModel from "../../../src/server/models/rectangleModel";

describe('RectangleModel', function() {
  let game: Game;
  let point: Point;

  beforeEach(function() {
    game = Game.createTest(true);

    point = new Point(10, 10);
    game.emitter.emit(EmitEvent.NewBody, point);
  });

  it('correctly initializes Body without angle', function() {
    const model = new RectangleModel(game, { x: 0, y: 0 }, 20, 20);
    assert(model.collidesWithBody(point));
  });

  it('correctly initializes Body with angle', function() {
    const model = new RectangleModel(game, { x: 20, y: 0 }, 20, 20, Math.PI/2);
    assert(model.collidesWithBody(point));
  });

  it('updateWidth correctly updates width', function() {
    const model = new RectangleModel(game, { x: 0, y: 0 }, 10, 20);
    assert(!model.collidesWithBody(point));

    model.updateWidth(20);
    game.update();
    assert(model.collidesWithBody(point));
  });

  it('updateHeight correctly updates height', function() {
    const model = new RectangleModel(game, { x: 0, y: 0 }, 20, 10);
    assert(!model.collidesWithBody(point));

    model.updateHeight(20);
    game.update();
    assert(model.collidesWithBody(point));
  });

  it('updateAngle correctly updates angle', function() {
    const model = new RectangleModel(game, { x: 20, y: 0 }, 20, 20);
    assert(!model.collidesWithBody(point));

    model.updateAngle(Math.PI/2);
    game.update();
    assert(model.collidesWithBody(point));
  });
});

