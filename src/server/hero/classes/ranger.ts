import Hero from "../hero";
import RangerAutoAttackProjectile from '../../projectiles/rangeBased/rangerAutoAttackProjectile';
import { Point } from '../../models/basicTypes';
import Player from '../../player';
import Flash from '../abilities/flash';
import Ghost from '../abilities/ghost';

class Ranger extends Hero {
  qAbility = new Flash(this);
  wAbility = new Ghost(this);
  eAbility = null;

  constructor(player: Player) {
    super(player);
    this.attackSpeed = 3;
  }

  onAutoAttack(dest: Point): void {
    new RangerAutoAttackProjectile(this.player.id,
      this.model.getPosition(),
      dest);
  }
}

export default Ranger;
