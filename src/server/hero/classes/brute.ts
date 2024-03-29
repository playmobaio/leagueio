import Hero from "../hero";
import { Point } from '../../models/basicTypes';
import Player from '../../player';
import BruteAuto from '../abilities/bruteAuto';

class Brute extends Hero {
  qAbility = null;
  wAbility = null;
  eAbility = null;

  constructor(player: Player) {
    super(player);
    this.attackSpeed = 2;
    this.autoAttack = new BruteAuto(player.hero);
  }

  onAutoAttack(dest: Point): void {
    this.autoAttack.targetPosition = dest;
    this.autoAttack.cast();
  }
}

export default Brute;
