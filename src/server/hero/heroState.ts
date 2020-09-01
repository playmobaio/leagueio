import Effect from './effect';
import Hero from './hero';
import CastEffect from './effects/castEffect';
import Ability from './ability';
import Condition from './condition';

class HeroState {
  hero: Hero;
  effects: Effect[];
  condition: Condition;
  casting: Ability;
  queuedCast: Ability;

  constructor(hero: Hero) {
    this.hero = hero;
    this.effects = [];
    this.condition = Condition.Active;
  }

  setCondition(condition: Condition): void {
    this.condition = condition;
  }

  addCasting(ability: Ability): void {
    if (this.condition != Condition.Active) {
      return;
    }
    this.casting = ability;
    this.addEffect(new CastEffect(ability.castTime));
  }

  addEffect(effect: Effect): void {
    effect.start(this.hero);
    console.log(`Using ${effect.description}`);
    this.effects.push(effect);
  }

  queueCast(ability: Ability): void {
    this.queuedCast = ability;
  }

  isQueuedCast(ability: Ability): boolean {
    if (this.queuedCast == null) {
      return false;
    }
    return this.queuedCast.name === ability.name;
  }

  clearQueueCast(): void {
    this.queuedCast = null;
  }

  filterExpiredEffects(): void {
    this.effects = this.effects.filter((effect: Effect) => {
      const expired = effect.isExpired();
      if (expired) {
        effect.finish(this.hero);
        console.log(`Resetting ${effect.description}`);
      }
      return !expired;
    });
  }

  updateCondition(): void {
    let finalCondition: Condition = Condition.Active;
    for (const effect of this.effects) {
      const effectCondition = effect.causes();
      if (effectCondition.overrides(finalCondition)) {
        finalCondition = effectCondition;
      }
    }
    this.setCondition(finalCondition);
  }

  update(): void {
    this.filterExpiredEffects();
    this.updateCondition();

    if (this.condition.equals(Condition.Casting)
      && this.casting?.hasCastTimeElapsed()) {

      this.casting.onCast();
      this.setCondition(Condition.Active);
      this.casting = null;
    }
    this.queuedCast?.cast();
  }

  canMove(): boolean {
    return this.condition.equals(Condition.Active);
  }
}
export default HeroState;
