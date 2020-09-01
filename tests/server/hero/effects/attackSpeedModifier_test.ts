import * as TypeMoq from "typemoq";
import Hero from '../../../../src/server/hero/hero';
import Game from '../../../../src/server/game';
import Player from '../../../../src/server/player';
import AttackSpeedModifierEffect from
  '../../../../src/server/hero/effects/attackSpeedModifierEffect';
import { Times } from 'typemoq';

describe('AttackSpeedModifierEffect', function() {
  let attackSpeedModifierEffect: AttackSpeedModifierEffect;
  const seconds = 10;
  const multiplier = 2;

  beforeEach(function() {
    hero = TypeMoq.Mock.ofType<Hero>();
    const player = TypeMoq.Mock.ofType<Player>();
    hero.setup(x => x.player).returns(() => player.object);
    const game = TypeMoq.Mock.ofType<Game>();
    player.setup(x => x.game).returns(() => game.object);
    game.setup(x => x.currentFrame).returns(() => 0);

    attackSpeedModifierEffect = new AttackSpeedModifierEffect(hero.object, seconds, multiplier);
  });

  it('Starting effect will increase attack speed', function() {
    const attackSpeed = 1;
    hero.object.attackSpeed = attackSpeed;
    attackSpeedModifierEffect.start();
    hero.verify(x => x.attackSpeed = attackSpeed * multiplier, Times.once());
  });
});
