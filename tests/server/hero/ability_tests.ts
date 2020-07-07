import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from 'typemoq';
import Game from "../../../src/server/models/game";
import HeroState from "../../../src/server/hero/heroState";
import Hero from "../../../src/server/hero/hero";
import { secondsToFrames } from '../../../src/server/tools/frame';
import { TestAbility, TestAbility2 } from '../testClasses';
import constants from '../../../src/server/constants';
import Player from '../../../src/server/models/player';
import { Abilities } from '../../../src/models/data/heroAbilities';
import { Point, Circle } from '../../../src/server/models/basicTypes';

describe('Ability', function() {
  let abilityA: TestAbility;
  let abilityB: TestAbility2;
  let hero: TypeMoq.IMock<Hero>;
  let heroState: TypeMoq.IMock<HeroState>;
  let game: Game;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  let player: Player;

  beforeEach(function() {
    heroState = TypeMoq.Mock.ofType<HeroState>();
    hero = TypeMoq.Mock.ofType<Hero>();
    hero.setup(x => x.state).returns(() => heroState.object);
    abilityA = new TestAbility(hero.object);
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    player = Player.create("id", socket.object, "name", 1);
    hero.setup(x => x.player).returns(() => player);
    abilityA.lastCastFrame = constants.DEFAULT_LAST_CAST_FRAME;
    game = Game.getInstance();
    game.reset();
    Abilities[abilityA.name] = { castingShape: null, range: 0, abilityName: abilityA.name };
    abilityB = new TestAbility2(hero.object);
    abilityB.lastCastFrame = constants.DEFAULT_LAST_CAST_FRAME;
    Abilities[abilityB.name] = { castingShape: null, range: 0, abilityName: abilityB.name };
  });

  it('can cast after cooldown', function() {
    game.currentFrame = secondsToFrames(21);
    abilityA.cast();
    heroState.verify(x => x.addCasting(TypeMoq.It.isAny()),
      Times.once());
    socket.verify(x => x.emit(TypeMoq.It.isValue("S:CASTING"), TypeMoq.It.isAny()),
      Times.once());
    assert.equal(abilityA.lastCastFrame, game.currentFrame);
  });

  it('cannot cast during cooldown', function() {
    abilityA.lastCastFrame = 1;
    game.currentFrame = secondsToFrames(12);
    abilityA.cast();
    assert.equal(abilityA.lastCastFrame, 1);
    assert.equal(abilityA.used, false);
  });

  it('verify ability cast time is less than a second by default', function() {
    abilityA.lastCastFrame = 1;
    game.currentFrame = secondsToFrames(2);
    assert.equal(abilityA.hasCastTimeElapsed(), true);
  });

  it('verify ability is not expired at current frame', function() {
    abilityA.lastCastFrame = 1;
    abilityA.castTime = 3;
    game.currentFrame = secondsToFrames(2);
    assert.equal(abilityA.hasCastTimeElapsed(), false);
  });

  it('verify ability is expired at current frame', function() {
    game.currentFrame = secondsToFrames(10) + 1;
    assert.ok(abilityA.hasCastTimeElapsed());
  });

  it('if cast is not within range; velocity is updated and cast is queued', function() {
    Abilities[abilityA.name] = { castingShape: null, range: 4, abilityName: abilityA.name };
    hero.setup(x => x.model).returns(() => new Circle(3, new Point(10, 10)));
    abilityA.targetPosition = new Point(1, 1);
    abilityA.cast();
    hero.verify(x => x.updateVelocity(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.queueCast(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.isQueuedCast(TypeMoq.It.isAny()), Times.never());
  });

  it('if cast is within range and cast is still queued hero is stopped', function() {
    Abilities[abilityA.name] = { castingShape: null, range: 4, abilityName: abilityA.name };
    hero.setup(x => x.model).returns(() => new Circle(3, new Point(0, 0)));
    heroState.setup(x => x.isQueuedCast(TypeMoq.It.isAny())).returns(() => true);
    abilityA.targetPosition = new Point(1, 1);
    abilityA.cast();
    hero.verify(x => x.stopHero, Times.once());
    heroState.verify(x => x.clearQueueCast(), Times.once());
  });

  it('if ability has cast restriction None we will cast', function() {
    abilityB.cast();
    heroState.verify(x => x.queueCast(TypeMoq.It.isAny()), Times.never());
    heroState.verify(x => x.addCasting(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.clearQueueCast(), Times.once());
    socket.verify(x => x.emit(TypeMoq.It.isValue("S:CASTING"), TypeMoq.It.isAny()), Times.once());
  });

  it('ability A is cleared from queue when user casts ability B', function() {
    heroState.setup(x => x.queuedCast).returns(() => abilityA);
    abilityB.cast();
    heroState.verify(x => x.queueCast(TypeMoq.It.isAny()), Times.never());
    heroState.verify(x => x.clearQueueCast(), Times.once());
    heroState.verify(x => x.addCasting(TypeMoq.It.isAny()), Times.once());
    socket.verify(x => x.emit(TypeMoq.It.isValue("S:CASTING"), TypeMoq.It.isAny()), Times.once());
  });
});
