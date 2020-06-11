import * as TypeMoq from "typemoq";
import RapidFire from '../../../../src/server/hero/abilities/rapidFire';
import Hero from '../../../../src/server/hero/hero';
import HeroState from '../../../../src/server/hero/heroState';
import AttackSpeedModifierEffect from
  '../../../../src/server/hero/effects/attackSpeedModifierEffect';
import { Times } from 'typemoq';

describe('RapidFire', function() {
  let rapidFire: RapidFire;
  let hero: TypeMoq.IMock<Hero>;

  beforeEach(function() {
    hero = TypeMoq.Mock.ofType<Hero>();
    rapidFire = new RapidFire(hero.object);
  });

  it('AttackSpeedModifier added to player hero onCast', function() {
    const heroState = TypeMoq.Mock.ofType<HeroState>();
    hero.setup(x => x.state).returns(() => heroState.object);
    rapidFire.onCast();
    heroState.verify(x => x.addEffect(
      TypeMoq.It.is((x: AttackSpeedModifierEffect) => x.multiplier == 2)
    ), Times.atLeastOnce());
  });
});
