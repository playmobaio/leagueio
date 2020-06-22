import Effect from './effect';
import Condition from './condition';
import Ability from './ability';
import { IEffect } from '../../models/interfaces';
import Player from '../models/player';

class HeroState {
  effects: Effect[];
  condition: Condition;
  casting: Ability;
  player: Player;

  constructor(player: Player) {
    this.effects = [];
    this.condition = Condition.ACTIVE;
    this.player = player;
  }

  addCasting(ability: Ability): void {
    this.casting = ability;
  }

  addEffect(effect: Effect): void {
    effect.start();
    this.player.socket.emit('S:PLAYER_EFFECTS', effect);
    console.log(`Using ${effect.description}`);
    this.effects.push(effect);
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