import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from 'typemoq';
import Game from "../../../src/server/models/game";
import HeroState from "../../../src/server/hero/heroState";
import Hero from "../../../src/server/hero/hero";
import { secondsToFrames } from '../../../src/server/tools/frame';
import { TestAbility } from '../testClasses';
import constants from '../../../src/server/constants';
import Player from '../../../src/server/models/player';
import { Abilities } from '../../../src/models/data/heroAbilities';
import { Point, Circle } from '../../../src/server/models/basicTypes';

describe('Ability', function() {
  let ability: TestAbility;
  let hero: TypeMoq.IMock<Hero>;
  let heroState: TypeMoq.IMock<HeroState>;
  let game: Game;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  let player: Player;

  beforeEach(function() {
    heroState = TypeMoq.Mock.ofType<HeroState>();
    hero = TypeMoq.Mock.ofType<Hero>();
    hero.setup(x => x.state).returns(() => heroState.object);
    ability = new TestAbility(hero.object);
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    player = Player.create("id", socket.object, "name", 1);
    hero.setup(x => x.player).returns(() => player);
    ability.lastCastFrame = constants.DEFAULT_LAST_CAST_FRAME;
    game = Game.getInstance();
    game.reset();
    Abilities[ability.name] = { castingShape: null, range: 0, abilityName: ability.name };
  });

  it('can cast after cooldown', function() {
    game.currentFrame = secondsToFrames(21);
    ability.cast();
    heroState.verify(x => x.addCasting(TypeMoq.It.isAny()),
      Times.once());
    socket.verify(x => x.emit(TypeMoq.It.isValue("S:CASTING"), TypeMoq.It.isAny()),
      Times.once());
    assert.equal(ability.lastCastFrame, game.currentFrame);
  });

  it('cannot cast during cooldown', function() {
    ability.lastCastFrame = 1;
    game.currentFrame = secondsToFrames(12);
    ability.cast();
    assert.equal(ability.lastCastFrame, 1);
    assert.equal(ability.used, false);
  });

  it('verify ability cast time is less than a second by default', function() {
    ability.lastCastFrame = 1;
    game.currentFrame = secondsToFrames(2);
    assert.equal(ability.hasCastTimeElapsed(), true);
  });

  it('verify ability is not expired at current frame', function() {
    ability.lastCastFrame = 1;
    ability.castTime = 3;
    game.currentFrame = secondsToFrames(2);
    assert.equal(ability.hasCastTimeElapsed(), false);
  });

  it('verify ability is expired at current frame', function() {
    game.currentFrame = secondsToFrames(10) + 1;
    assert.ok(ability.hasCastTimeElapsed());
  });

  it('if cast is not within range; velocity is updated and cast is queued', function() {
    Abilities[ability.name] = { castingShape: null, range: 4, abilityName: ability.name };
    hero.setup(x => x.model).returns(() => new Circle(3, new Point(10, 10)));
    ability.targetPosition = new Point(1, 1);
    ability.cast();
    hero.verify(x => x.updateVelocity(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.queueCast(TypeMoq.It.isAny()), Times.once());
    heroState.verify(x => x.hasQueuedCast(), Times.never());
  });

  it('if cast is within range and cast is still queued hero is stopped', function() {
    Abilities[ability.name] = { castingShape: null, range: 4, abilityName: ability.name };
    hero.setup(x => x.model).returns(() => new Circle(3, new Point(0, 0)));
    heroState.setup(x => x.hasQueuedCast()).returns(() => true);
    ability.targetPosition = new Point(1, 1);
    ability.cast();
    hero.verify(x => x.stopHero, Times.once());
  })
});
