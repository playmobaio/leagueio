import Game from "../../../../src/server/models/game";
import { TestAttack, TestHero } from "../../testClasses";
import * as TypeMoq from "typemoq";
import * as assert from 'assert';
import { Point } from "../../../../src/server/models/basicTypes";

describe("Attack", function() {
  let game: Game;
  let testAttack: TestAttack;

  beforeEach(function() {
    game = Game.getInstance();
    game.reset();
    const hero: TypeMoq.IMock<TestHero> = TypeMoq.Mock.ofType<TestHero>();
    testAttack = new TestAttack(hero.object, 10);
  });

  it("cannot call execute while already executing", function() {
    const flag = testAttack.executed;
    testAttack.execute(new Point(1, 1));
    assert.equal(!flag, testAttack.executed);

    Game.getInstance().currentFrame += 1
    testAttack.execute(new Point(1, 1));
    assert.notEqual(!!flag, testAttack.executed);
  });

  it("do not update when not executing", function() {
    const flag = testAttack.updated;
    testAttack.update();
    assert.notEqual(!flag, testAttack.updated);

    Game.getInstance().currentFrame += 1
    testAttack.update();
    assert.notEqual(!flag, testAttack.updated);
  });

  it("update while executing", function() {
    const flag = testAttack.updated;
    Game.getInstance().currentFrame = 10
    testAttack.execute(new Point(1, 1));

    testAttack.update();
    assert.equal(!flag, testAttack.updated);

    Game.getInstance().currentFrame += 1
    testAttack.update();
    assert.equal(!!flag, testAttack.updated);
  });

  it("update stops after executing", function() {
    const flag = testAttack.updated;
    Game.getInstance().currentFrame = 10
    testAttack.execute(new Point(1, 1));

    testAttack.update();
    assert.equal(!flag, testAttack.updated);

    Game.getInstance().currentFrame += testAttack.lengthInFrames;
    testAttack.update();
    assert.notEqual(!!flag, testAttack.updated);
  });
});