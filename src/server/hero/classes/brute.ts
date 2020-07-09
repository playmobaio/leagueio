import Hero from "../hero";
import { IPoint } from '../../../models/interfaces';
import Player from '../../models/player';
import { Circle } from '../../models/basicTypes';
import constants from '../../constants';
import { getFramesBetweenAutoAttack } from '../../tools/frame';
import Swipe180 from '../attacks/swipe180';

class Brute extends Hero {
  qAbility = null;
  wAbility = null;
  eAbility = null;

  constructor(player: Player) {
    super(player);
    this.model = new Circle(constants.DEFAULT_CIRCLE_RADIUS);
    this.attackSpeed = 2;
    this.autoAttack = new Swipe180(this, getFramesBetweenAutoAttack(this.attackSpeed));
  }

  onAutoAttack(dest: IPoint): void {
    this.autoAttack.execute(dest);
  }
}

export default Brute;
