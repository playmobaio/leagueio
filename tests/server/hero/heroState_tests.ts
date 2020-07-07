import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import HeroState from '../../../src/server/hero/heroState';
import { TestAbility, TestEffect } from '../testClasses';

describe('HeroState', function() {
  let heroState: HeroState;
  let ability: TypeMoq.IMock<TestAbility>;
  let effect: TypeMoq.IMock<TestEffect>;
  let effect2: TypeMoq.IMock<TestEffect>;

  beforeEach(function(){
    heroState = new HeroState();
    ability = TypeMoq.Mock.ofType<TestAbility>();
    effect = TypeMoq.Mock.ofType<TestEffect>();
    effect2 = TypeMoq.Mock.ofType<TestEffect>();
  });

  it("AddCasting sets casting", function() {
    heroState.addCasting(ability.object);
    assert.ok(heroState.casting != null);
  });

  it("AddEffect will start effect", function() {
    heroState.addEffect(effect.object);
    assert.equal(heroState.effects.length, 1);
    effect.verify(x => x.start(), TypeMoq.Times.once());
  });

  it("Update clears expired abilities and calls onCast", function() {
    ability.setup(x => x.hasCastTimeElapsed()).returns(() => true);
    heroState.addCasting(ability.object);

    heroState.update();
    ability.verify(x => x.onCast(), TypeMoq.Times.once());
    assert.equal(heroState.casting, null);
  });

  it("Update does not clear non-expired abilities", function() {
    ability.setup(x => x.hasCastTimeElapsed()).returns(() => false);
    heroState.addCasting(ability.object);

    heroState.update();
    assert.ok(heroState.casting != null);
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
