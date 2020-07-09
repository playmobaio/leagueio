import * as TypeMoq from "typemoq";
import * as assert from 'assert';
import Game from '../../../../src/server/models/game';
import Swipe180 from '../../../../src/server/hero/attacks/swipe180';
import { TestHero } from '../../testClasses';
import { Circle, Point, Vector } from "../../../../src/server/models/basicTypes";

describe('Swipe180', function() {
  let game: Game;
  let swipe: Swipe180;
  let hero: TypeMoq.IMock<TestHero>;

  beforeEach(function() {
    game = Game.getInstance();
    game.reset();
    hero = TypeMoq.Mock.ofType<TestHero>();
    swipe = new Swipe180(hero.object, 2);
  });

  it('onExecute will create attackVector', function() {
    hero.setup(x => x.model).returns(() => new Circle(1, new Point(0, 0)));
    swipe.onExecute(new Point(1, 0));
    assert.equal(parseInt(swipe.attackVector.x.toFixed(2)), 0);
    assert.equal(parseInt(swipe.attackVector.y.toFixed(2)), -1);
  });

  it('onUpdate will rotate by degreePerUpdate', function() {
    swipe.attackVector = new Vector(1, 0);
    swipe.onUpdate();
    assert.equal(parseInt(swipe.attackVector.x.toFixed(2)), 0);
    assert.equal(parseInt(swipe.attackVector.y.toFixed(2)), 1);
  });
});