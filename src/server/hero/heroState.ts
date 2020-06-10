import Effect from './effect';
import Condition from './condition';
import Ability from './ability';

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
    this.effects.push(effect);
  }

  update(): void {
    if (this.casting?.isExpired()) {
      this.casting = null;
    }
    this.effects = this.effects.filter((effect: Effect) => {
      const expired = effect.isExpired();
      if (expired) {
        effect.effectFinishCallback();
      }
      return !expired;
    });
  }
}
export default HeroState;