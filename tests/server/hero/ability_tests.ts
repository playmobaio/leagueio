import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import { Times } from 'typemoq';
import Game from "../../../src/server/models/game";
import HeroState from "../../../src/server/hero/heroState";
import Hero from "../../../src/server/hero/hero";
import { secondsToFrames } from '../../../src/server/tools/frame';
import { TestAbility } from '../testClasses';
import constants from '../../../src/server/constants';

describe('Ability', function() {
  let ability: TestAbility;
  let hero: TypeMoq.IMock<Hero>;
  let heroState: TypeMoq.IMock<HeroState>;
  let game: Game;

  beforeEach(function() {
    heroState = TypeMoq.Mock.ofType<HeroState>();
    hero = TypeMoq.Mock.ofType<Hero>();
    hero.setup(x => x.state).returns(() => heroState.object);
    ability = new TestAbility(hero.object);
    ability.lastCastFrame = constants.DEFAULT_LAST_CAST_FRAME;
    game = Game.getInstance();
    game.reset();
  });

  it('can cast after cooldown', function() {
    game.currentFrame = secondsToFrames(21);

    ability.cast();
    heroState.verify(x =>
      x.addCasting(TypeMoq.It.isAny()),
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

  it('toInterface without cast will return cooldownLeft of 0', function() {
    assert.equal(ability.toInterface().cooldown, 0);
  });

  it('toInterface before cooldown finishes will return nonzero cooldownLeft', function() {
    ability.lastCastFrame = 1
    const gameFrame = 2;
    game.currentFrame = secondsToFrames(gameFrame);
    const cooldown: number = ability.toInterface().cooldown;
    assert.equal(cooldown, ability.cooldown - gameFrame + ability.lastCastFrame);
  });

  it('toInterface after cooldown finishes will return zero cooldownLeft', function() {
    ability.lastCastFrame = 1
    const gameFrame = 21;
    game.currentFrame = secondsToFrames(gameFrame);
    assert.equal(ability.toInterface().cooldown, 0);
  });
});
