import Effect from './effect';
import Hero from './hero';
import CastEffect from './effects/castEffect';
import Ability from './ability';
import { Condition } from '../../models/interfaces/basicTypes';

class HeroState {
  hero: Hero;
  effects: Effect[];
  condition: Condition;
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

    this.addEffect(new CastEffect(this.hero, ability));
    this.updateCondition();
  }

  addEffect(effect: Effect): void {
    effect.start();
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
    const effects = [];
    for (const effect of this.effects) {
      if (effect.isExpired()) {
        effect.finish();
        console.log(`Resetting ${effect.description}`);
      } else {
        effects.push(effect);
      }
    }
    this.effects = effects;
  }

  updateCondition(): void {
    let finalCondition: Condition = Condition.Active;
    for (const effect of this.effects) {
      const effectCondition = effect.causes();
      if (effectCondition > finalCondition) {
        finalCondition = effectCondition;
      }
    }
    this.setCondition(finalCondition);
  }

  update(): void {
    this.filterExpiredEffects();
    this.updateCondition();
    this.queuedCast?.cast();
  }

  canMove(): boolean {
    return this.condition == Condition.Active;
  }
}
export default HeroState;
