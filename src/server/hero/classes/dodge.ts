import Hero from "../hero";

class Dodge extends Hero {
  qAbility = null;
  wAbility = null;
  eAbility = null;

  onAutoAttack(): void {
    return;
  }
}

export default Dodge;
