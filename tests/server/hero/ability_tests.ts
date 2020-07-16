import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from 'typemoq';
import Game from "../../../src/server/models/game";
import HeroState from "../../../src/server/hero/heroState";
import Hero from "../../../src/server/hero/hero";
import { secondsToFrames } from '../../../src/server/tools/frame';
import { TestAbility, TestAbility2 } from '../testClasses';
import Player from '../../../src/server/models/player';
import { Abilities } from '../../../src/models/data/heroAbilities';
import { Point } from '../../../src/server/models/basicTypes';
import CircleModel from '../../../src/server/models/circleModel';

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
    abilityA.nextAvailableCastFrame = 0;
    game = Game.getInstance();
    game.reset();
    Abilities[abilityA.name] = { castingShape: null, range: 0, abilityName: abilityA.name };
    abilityB = new TestAbility2(hero.object);
    abilityB.nextAvailableCastFrame = 0;
    Abilities[abilityB.name] = { castingShape: null, range: 0, abilityName: abilityB.name };
  });

  it('can cast after cooldown', function() {
    game.currentFrame = secondsToFrames(21);
    abilityA.cast();
    heroState.verify(x => x.addCasting(TypeMoq.It.isAny()),
      Times.once());
    socket.verify(x => x.emit(TypeMoq.It.isValue("S:CASTING"), TypeMoq.It.isAny()),
      Times.once());
    assert.notEqual(abilityA.nextAvailableCastFrame, 0);
  });

  it('cannot cast during cooldown', function() {
    const frames = secondsToFrames(13)
    abilityA.nextAvailableCastFrame = frames;
    game.currentFrame = secondsToFrames(12);
    abilityA.cast();
    assert.equal(abilityA.nextAvailableCastFrame, frames);
    assert.equal(abilityA.used, false);
  });

  it('verify ability cast time is less than a second by default', function() {
    abilityA.nextAvailableCastFrame = 11;
    game.currentFrame = secondsToFrames(2);
    assert.equal(abilityA.hasCastTimeElapsed(), true);
  });

  it('verify ability is not expired at current frame', function() {
    abilityA.nextAvailableCastFrame = secondsToFrames(3);
    game.currentFrame = secondsToFrames(2);
    assert.equal(abilityA.hasCastTimeElapsed(), false);
  });

  it('verify ability is expired at current frame', function() {
    game.currentFrame = secondsToFrames(10) + 1;
    assert.ok(abilityA.hasCastTimeElapsed());
  });

  it('if cast is not within range; velocity is updated and cast is queued', function() {
    Abilities[abilityA.name] = { castingShape: null, range: 4, abilityName: abilityA.name };
    hero.setup(x => x.model).returns(() => new CircleModel(new Point(10, 10), 3));
    abilityA.targetPosition = new Point(1, 1);
    abilityA.cast();
    hero.verify(x => x.updateVelocity(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.queueCast(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.isQueuedCast(TypeMoq.It.isAny()), Times.never());
  });

  it('if cast is within range and cast is still queued hero is stopped', function() {
    Abilities[abilityA.name] = { castingShape: null, range: 4, abilityName: abilityA.name };
    hero.setup(x => x.model).returns(() => new CircleModel(new Point(0, 0), 3));
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

  it("update stops after casting", function() {
    const flag = abilityA.updated;
    Game.getInstance().currentFrame = 10
    abilityA.cast();

    abilityA.update();
    assert.equal(!flag, abilityA.updated);

    Game.getInstance().currentFrame += secondsToFrames(abilityA.cooldown);
    abilityA.update();
    assert.notEqual(!!flag, abilityA.updated);
  });

  it("update while casting", function() {
    const flag = abilityA.updated;
    Game.getInstance().currentFrame = 10
    abilityA.cast();

    abilityA.update();
    assert.equal(!flag, abilityA.updated);

    Game.getInstance().currentFrame += 1
    abilityA.update();
    assert.equal(!!flag, abilityA.updated);
  });

  it("do not update when not casting", function() {
    const flag = abilityA.updated;
    abilityA.update();
    assert.notEqual(!flag, abilityA.updated);

    Game.getInstance().currentFrame += 1
    abilityA.update();
    assert.notEqual(!flag, abilityA.updated);
  });
});
