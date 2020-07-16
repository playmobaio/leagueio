import Hero from "../hero";
import { IPoint } from '../../../models/interfaces';
import Projectile from '../../models/projectile';
import Player from '../../models/player';
import constants from '../../constants';
import RapidFire from '../abilities/rapidFire';
import HailOfArrows from '../abilities/hailOfArrows';

class Ranger extends Hero {
  qAbility = new RapidFire(this);
  wAbility = new HailOfArrows(this);
  eAbility = null;

  constructor(player: Player) {
    super(player);
    this.attackSpeed = 3;
  }

  onAutoAttack(dest: IPoint): void {
    Projectile.create(this.player,
      this.model.getPosition(),
      dest,
      constants.RANGER_PROJECTILE_RANGE);
  }
}

export default Ranger;
