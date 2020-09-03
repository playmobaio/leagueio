import Effect from '../effect';
import Hero from '../hero';
import Condition from '../condition';
import Ability from '../ability';

class CastEffect extends Effect {
  ability: Ability;

  constructor(hero: Hero, ability: Ability) {
    super(hero, ability.castTime, `hero casting for ${ability.castTime} seconds`);
    this.ability = ability;
  }

  start(): void {
    return;
  }

  finish(): void {
    this.ability.onCast();
  }

  causes(): Condition {
    return Condition.Casting
  }
}
export default CastEffect;
