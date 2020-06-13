import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from 'typemoq';
import Player from '../../../src/server/models/player';
import Game from '../../../src/server/models/game';
import { Point, Circle, Velocity } from '../../../src/server/models/basicTypes';
import HeroState from '../../../src/server/hero/heroState';
import { TestHero, TestAbility } from '../testClasses';
import { Condition } from '../../../src/models/interfaces';

describe('Hero', function() {
  let player: TypeMoq.IMock<Player>;
  let game: Game;
  let hero: TestHero;
  let point: Point;
  let mock: TypeMoq.IMock<TestHero>;
  let stateMock: TypeMoq.IMock<HeroState>;

  beforeEach(function(){
    game = Game.getInstance();
    game.reset();
    point = new Point(0, 1);
    player = TypeMoq.Mock.ofType<Player>();
    hero = new TestHero(player.object);
    mock = TypeMoq.Mock.ofInstance(hero);
    mock.callBase = true;
    stateMock = TypeMoq.Mock.ofType<HeroState>();
    mock.setup(x => x.state).returns(() => stateMock.object);
  });

  it("verify player updates position", function() {
    const position = new Point(1, 1);
    const circle = TypeMoq.Mock.ofType<Circle>();
    circle.setup(x => x.isInvalidPosition(
      TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny())
    ).returns(() => false);
    hero.model = circle.object;
    hero.updatePosition(position);

    circle.verify(x => x.center = TypeMoq.It.isValue(position), Times.once());
  });

  it("will autoattack immediately on spawn", function() {
    hero.performAutoAttack(point);
    assert.equal(hero.lastAutoAttackFrame, game.currentFrame);
  });

  it("cannot auto attack too soon", function() {
    hero.lastAutoAttackFrame = 0;
    hero.attackSpeed = 1;
    game.currentFrame = 59; // Should be able to attack after 1 second, or 60 frams at 60 fps

    hero.performAutoAttack(point);
    assert.equal(game.projectiles.size, 0);
  });

  it("can auto attack after set number of frames", function() {
    hero.lastAutoAttackFrame = 0;
    hero.attackSpeed = 1;
    game.currentFrame = 60; // Should be able to attack after 1 second, or 60 frames at 60 fps

    hero.performAutoAttack(point);
    assert.equal(hero.lastAutoAttackFrame, game.currentFrame);
  });

  it("hero updates position when not expired", function() {
    mock.object.velocity = new Velocity({ x: 1, y: 1 }, 10);
    mock.setup(x => x.rangeExpired()).returns(() => false);
    mock.object.update();
    mock.verify(x => x.updatePosition(TypeMoq.It.isAny()), Times.once());
    stateMock.verify(x => x.update(), Times.once());
  });

  it("state still updates even when rangeExpired", function() {
    mock.setup(x => x.rangeExpired()).returns(() => true);

    mock.object.update();
    stateMock.verify(x => x.update(), Times.once());
  })

  it("calling toInterface with private true will not return abilities", function() {
    const ret = hero.toInterface(true);
    assert.equal(ret.state, null);
    assert.equal(ret.qAbility, null);
    assert.equal(ret.wAbility, null);
    assert.equal(ret.eAbility, null);
  });

  it("calling toInterface with private false will return abilities if they exist", function() {
    const ret = hero.toInterface(false);
    assert.notEqual(ret.state, null);
    assert.notEqual(ret.qAbility, null);
    assert.equal(ret.wAbility, null);
    assert.notEqual(ret.eAbility, null);
  });

  it("calling perform attack while heroState is active will autoAttack", function() {
    stateMock.setup(x => x.condition).returns(() => Condition.ACTIVE);
    mock.object.performAttack(point);
    mock.verify(x => x.performAutoAttack(TypeMoq.It.isAny()), TypeMoq.Times.once());
  });

  it("calling perform attack while heroState is casting will useAbility", function() {
    const abilityMock = TypeMoq.Mock.ofType<TestAbility>();
    stateMock.setup(x => x.condition).returns(() => Condition.CASTING);
    stateMock.setup(x => x.casting).returns(() => abilityMock.object);
    mock.object.performAttack(point);
    abilityMock.verify(x => x.useAbility(), TypeMoq.Times.once());
  });
});
