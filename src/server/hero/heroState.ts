import Effect from './effect';
import Ability from './ability';
import { Condition, IHeroState } from '../../models/interfaces';

class HeroState {
  effects: Effect[];
  condition: Condition;
  casting: Ability;

  constructor() {
    this.effects = [];
    this.condition = Condition.ACTIVE;
  }

  addCasting(ability: Ability): void {
    this.casting = ability;
  }

  addEffect(effect: Effect): void {
    effect.start();
    console.log(`Using ${effect.description}`);
    this.effects.push(effect);
  }

  toInterface(): IHeroState {
    return {
      condition: this.condition,
      casting: this.casting?.toInterface()
    }
  }

  update(): void {
    if (this.casting?.isExpired()) {
      this.casting = null;
    }
    this.effects = this.effects.filter((effect: Effect) => {
      const expired = effect.isExpired();
      if (expired) {
        effect.finish();
        console.log(`Resetting ${effect.description}`);
      }
      return !expired;
    });
  }
}
export default HeroState;