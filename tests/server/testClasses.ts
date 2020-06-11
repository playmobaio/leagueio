import Hero from "../../src/server/hero/hero";
import { Circle } from "../../src/server/models/basicTypes";
import Ability from "../../src/server/hero/ability";
import Effect from "../../src/server/hero/effect";

export class TestHero extends Hero {
  eAbility = null;
  qAbility = null;
  wAbility = null;
  autoAttacked = false;
  model = new Circle(10);

  onAutoAttack(): void {
    this.autoAttacked = true;
  }
}

export class TestAbility extends Ability {
  used = false;
  castLength = 10;
  cooldown = 20;

  onCast(): void {
    this.used = true;
  }
  onFailure(): void {
    return;
  }
  onSuccess(): void {
    return;
  }
}

export class TestEffect extends Effect {
  start(): void {
    return;
  }

  finish(): void {
    return;
  }
}