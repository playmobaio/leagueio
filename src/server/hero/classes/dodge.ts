import Hero from "../hero";
import Flash from '../abilities/flash';
import Ghost from '../abilities/ghost';

class Dodge extends Hero {
  qAbility = new Flash(this);
  wAbility = new Ghost(this);
  eAbility = null;

  onAutoAttack(): void {
    return;
  }
}

export default Dodge;
