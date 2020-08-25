import Effect from './effect';
import Ability from './ability';
import { Condition } from '../../models/interfaces/basicTypes';

class HeroState {
  effects: Effect[];
  condition: Condition;
  casting: Ability;
  queuedCast: Ability;

  constructor() {
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
    this.setCondition(Condition.Casting);
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

  update(): void {
    if (this.casting?.hasCastTimeElapsed()) {
      this.casting.onCast();
      this.setCondition(Condition.Active);
      this.casting = null;
    }
    this.queuedCast?.cast();
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
