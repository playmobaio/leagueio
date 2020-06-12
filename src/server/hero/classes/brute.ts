import Hero from "../hero";
import { IPoint } from '../../../models/interfaces';
import Projectile from '../../models/projectile';
import Player from '../../models/player';
import { Circle } from '../../models/basicTypes';
import constants from '../../constants';

class Brute extends Hero {
  qAbility = null;
  wAbility = null;
  eAbility = null;

  constructor(player: Player) {
    super(player);
    this.model = new Circle(constants.DEFAULT_CIRCLE_RADIUS);
    this.attackSpeed = 2;
  }

  onAutoAttack(dest: IPoint): void {
    Projectile.create(this.player, this.model, dest, constants.BRUTE_PROJECTILE_RANGE);
  }
}

export default Brute;
