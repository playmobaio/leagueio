import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import HeroState from '../../../src/server/hero/heroState';
import Hero from '../../../src/server/hero/hero';
import Player from '../../../src/server/player';
import Game from '../../../src/server/game';
import { TestAbility, TestEffect } from '../testClasses';

describe('HeroState', function() {
  let heroState: HeroState;
  let ability: TypeMoq.IMock<TestAbility>;
  let effect: TypeMoq.IMock<TestEffect>;
  let effect2: TypeMoq.IMock<TestEffect>;

  beforeEach(function(){
    const hero = TypeMoq.Mock.ofType<Hero>();
    const player = TypeMoq.Mock.ofType<Player>();
    hero.setup(x => x.player).returns(() => player.object);
    const game = new Game(false);
    player.setup(x => x.game).returns(() => game);

    heroState = new HeroState(hero.object);
    ability = TypeMoq.Mock.ofType<TestAbility>();
    effect = TypeMoq.Mock.ofType<TestEffect>();
    effect2 = TypeMoq.Mock.ofType<TestEffect>();
  });

  it("AddEffect will start effect", function() {
    heroState.addEffect(effect.object);
    assert.equal(heroState.effects.length, 1);
    effect.verify(x => x.start(), TypeMoq.Times.once());
  });

  it("addCasting adds CastEffect to heroState", function() {
    heroState.addCasting(ability.object);
    assert.equal(heroState.effects.length, 1);
  });

  it("addCasting does not allow multiple spells to be casted concurrently", function() {
    heroState.addCasting(ability.object);
    heroState.addCasting(ability.object);
    assert.equal(heroState.effects.length, 1);
  });

  it("Update will filter out expired effects", function() {
    const description = "2";
    effect.setup(x => x.isExpired()).returns(() => true);
    effect2.setup(x => x.isExpired()).returns(() => false);
    effect2.setup(x => x.description).returns(() => description);
    heroState.addEffect(effect.object);
    heroState.addEffect(effect2.object);
    heroState.update();
    assert.equal(heroState.effects.length, 1);
    assert.equal(heroState.effects[0].description, description);
  });

  it("If there is a queuedCast update will try to cast it", function() {
    heroState.queueCast(ability.object);
    heroState.update();
    ability.verify(x => x.cast(), TypeMoq.Times.once());
  });

  it("If there is a queuedCast isQueuedCast will be true", function() {
    ability.setup(x => x.name).returns(() => "Ability Name");
    heroState.queueCast(ability.object);
    assert.ok(heroState.isQueuedCast(ability.object));
  });
});
