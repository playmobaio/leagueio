import Hero from "../hero";
import RangerAutoAttackProjectile from '../../projectiles/rangeBased/rangerAutoAttackProjectile';
import { Point } from '../../models/basicTypes';
import Player from '../../player';
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

  onAutoAttack(dest: Point): void {
    new RangerAutoAttackProjectile(this.player.game, this.player.id,
      this.model.getPosition(),
      dest);
  }
}

export default Ranger;
