import Hero from "../hero";
import { IPoint } from '../../../models/interfaces';
import Projectile from '../../models/projectile';
import Player from '../../models/player';
import { Circle } from '../../models/basicTypes';
import constants from '../../constants';
import RapidFire from '../abilities/rapidFire';

class Ranger extends Hero {
  constructor(player: Player) {
    super(player);
    this.model = new Circle(constants.DEFAULT_CIRCLE_RADIUS);
    this.attackSpeed = 3;
    this.qAbility = new RapidFire(this);
  }

  performAutoAttack(dest: IPoint): void {
    super.performAutoAttack(dest, () => {
      Projectile.create(this.player, this.model, dest, constants.RANGER_PROJECTILE_RANGE);
    });
  }
}

export default Ranger;