import * as TypeMoq from "typemoq";
import Hero from '../../../../src/server/hero/hero';
import AttackSpeedModifierEffect from
  '../../../../src/server/hero/effects/attackSpeedModifierEffect';
import { Times } from 'typemoq';

describe('attackSpeedModifierEffect', function() {
  let hero: TypeMoq.IMock<Hero>;
  let attackSpeedModifierEffect: AttackSpeedModifierEffect;
  const seconds = 10;
  const multiplier = 2;

  beforeEach(function() {
    hero = TypeMoq.Mock.ofType<Hero>();
    attackSpeedModifierEffect = new AttackSpeedModifierEffect(hero.object, seconds, multiplier);
  });

  it('Start will increase attack speed', function() {
    const attackSpeed = 1;
    hero.object.attackSpeed = attackSpeed;
    attackSpeedModifierEffect.start();
    hero.verify(x => x.attackSpeed = attackSpeed * multiplier, Times.once());
  });
});
