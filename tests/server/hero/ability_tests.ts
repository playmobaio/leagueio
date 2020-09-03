import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from 'typemoq';
import Game from "../../../src/server/game";
import HeroState from "../../../src/server/hero/heroState";
import Hero from "../../../src/server/hero/hero";
import { secondsToFrames } from '../../../src/server/tools/frame';
import { TestAbility, TestAbility2 } from '../testClasses';
import Player from '../../../src/server/player';
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
    game = new Game(false);
    heroState = TypeMoq.Mock.ofType<HeroState>();
    hero = TypeMoq.Mock.ofType<Hero>();
    hero.setup(x => x.state).returns(() => heroState.object);
    abilityA = new TestAbility(hero.object);
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    player = Player.create(game, "id", socket.object, "name", 1);
    hero.setup(x => x.player).returns(() => player);
    abilityA.nextAvailableCastFrame = 0;
    Abilities[abilityA.name] = { model: null, range: 0, abilityName: abilityA.name };
    abilityB = new TestAbility2(hero.object);
    abilityB.nextAvailableCastFrame = 0;
    Abilities[abilityB.name] = { model: null, range: 0, abilityName: abilityB.name };
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

  it('cast time has elapsed when current frame > castTimeExpiration', function() {
    abilityA.castTimeExpiration = 1;
    game.currentFrame = 2;
    assert.equal(abilityA.hasCastTimeElapsed(), true);
  });

  it('cast time has not elapsed when current frame == castTimeExpiration', function() {
    abilityA.nextAvailableCastFrame = 1;
    game.currentFrame = 1;
    assert.equal(abilityA.hasCastTimeElapsed(), false);
  });

  it('verify ability is expired at castTime + 1', function() {
    abilityA.cast();
    game.currentFrame = secondsToFrames(abilityA.castTime) + 1;
    assert.ok(abilityA.hasCastTimeElapsed());
  });

  it('if cast is not within range; velocity is updated and cast is queued', function() {
    Abilities[abilityA.name] = { model: null, range: 4, abilityName: abilityA.name };
    hero.setup(x => x.model).returns(() => new CircleModel(game, new Point(10, 10), 3));
    abilityA.targetPosition = new Point(1, 1);
    abilityA.cast();
    hero.verify(x => x.updateVelocity(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.queueCast(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.isQueuedCast(TypeMoq.It.isAny()), Times.never());
  });

  it('if cast is within range and cast is still queued hero is stopped', function() {
    Abilities[abilityA.name] = { model: null, range: 4, abilityName: abilityA.name };
    hero.setup(x => x.model).returns(() => new CircleModel(game, new Point(0, 0), 3));
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
