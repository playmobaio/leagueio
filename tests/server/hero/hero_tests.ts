import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from 'typemoq';
import Player from '../../../src/server/player';
import Game from '../../../src/server/game';
import GameMap from '../../../src/server/gameMap';
import { Point, Velocity } from '../../../src/server/models/basicTypes';
import HeroState from '../../../src/server/hero/heroState';
import { TestHero } from '../testClasses';
import { Condition } from '../../../src/models/interfaces/basicTypes';

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
    hero.movementSpeed = 3;
  });

  it("can autoattack immediately on spawn", function() {
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

  it("hero updates position when destination not reached", function() {
    mock.object.velocity = new Velocity({ x: 1, y: 1 }, 10);
    mock.setup(x => x.reachedDestination()).returns(() => false);
    mock.object.update();
    mock.verify(x => x.stopHero(), Times.never());
  });

  it("state still updates even when rangeExpired", function() {
    mock.setup(x => x.reachedDestination()).returns(() => true);

    mock.object.update();
    stateMock.verify(x => x.update(), Times.once());
  })

  it("calling perform attack while heroState is active will autoAttack", function() {
    stateMock.setup(x => x.condition).returns(() => Condition.Active);
    mock.object.performAttack(point);
    mock.verify(x => x.performAutoAttack(TypeMoq.It.isAny()), TypeMoq.Times.once());
  });

  it("on update velocity queued casts are cleared", function() {
    mock.object.updateVelocity(point);
    stateMock.verify(x => x.clearQueueCast(), Times.once());
  });

  it("shouldStopHero return true if hero has reached destination", function() {
    mock.setup(x => x.reachedDestination()).returns(() => true);
    assert(mock.object.shouldStopHero());
  });

  it("shouldStopHero return true if hero is moving off map", function() {
    const gameMap = TypeMoq.Mock.ofType<GameMap>();
    gameMap.setup(x => x.isOnMap(TypeMoq.It.isAny())).returns(() => false);
    game.gameMap = gameMap.object;

    hero.updateVelocity(new Point(10, 10));
    assert(hero.shouldStopHero());
  });

  it("shouldStopHero return true if hero moving into a solid tile", function() {
    const gameMap = TypeMoq.Mock.ofType<GameMap>();
    gameMap.setup(x => x.isSolidTile(TypeMoq.It.isAny())).returns(() => true);
    game.gameMap = gameMap.object;

    hero.updateVelocity(new Point(10, 10));
    assert(hero.shouldStopHero());
  });
});
