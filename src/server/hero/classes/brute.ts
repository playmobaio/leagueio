import Hero from "../hero";
import { IPoint } from '../../../models/interfaces';
import Player from '../../models/player';
import { Circle } from '../../models/basicTypes';
import constants from '../../constants';
import BruteAuto from '../abilities/bruteAuto';

class Brute extends Hero {
  qAbility = null;
  wAbility = null;
  eAbility = null;

  constructor(player: Player) {
    super(player);
    this.model = new Circle(constants.DEFAULT_CIRCLE_RADIUS);
    this.attackSpeed = 2;
    this.autoAttack = new BruteAuto(player.hero);
  }

  onAutoAttack(dest: IPoint): void {
    this.autoAttack.targetPosition = dest;
    this.autoAttack.cast();
  }
}

export default Brute;
