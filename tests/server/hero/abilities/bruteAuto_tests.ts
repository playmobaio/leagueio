import * as TypeMoq from "typemoq";
import * as assert from 'assert';
import Game from '../../../../src/server/game';
import BruteAuto from '../../../../src/server/hero/abilities/bruteAuto';
import CircleModel from '../../../../src/server/models/circleModel';
import { TestHero } from '../../testClasses';
import { Point, Vector } from "../../../../src/server/models/basicTypes";
import constants from "../../../../src/server/constants";

describe('bruteAuto', function() {
  let game: Game;
  let bruteAuto: BruteAuto;
  let hero: TypeMoq.IMock<TestHero>;

  beforeEach(function() {
    game = new Game(false);
    hero = TypeMoq.Mock.ofType<TestHero>();
    bruteAuto = new BruteAuto(hero.object);
  });

  it('onCast will create attackVector', function() {
    hero.setup(x => x.model).returns(() => new CircleModel(game, new Point(0, 0), 1));
    bruteAuto.targetPosition = new Point(1, 0);
    bruteAuto.onCast();
    assert.equal(parseInt(bruteAuto.attackVector.x.toFixed(2)), 0);
    assert.equal(parseInt(bruteAuto.attackVector.y.toFixed(2)), -constants.BRUTE_MELEE_RANGE);
  });

  it('onUpdate will rotate by degreePerUpdate', function() {
    bruteAuto.attackVector = new Vector(1, 0);
    for (let i = 0; i < 15; i++){
      bruteAuto.onUpdate();
    }
    assert.equal(parseInt(bruteAuto.attackVector.x.toFixed(2)), 0);
    assert.equal(parseInt(bruteAuto.attackVector.y.toFixed(2)), 1);
  });
});
