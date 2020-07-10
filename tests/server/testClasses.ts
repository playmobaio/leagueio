import Hero from "../../src/server/hero/hero";
import { Circle } from "../../src/server/models/basicTypes";
import Ability from "../../src/server/hero/ability";
import Effect from "../../src/server/hero/effect";
import { CastRestriction, IPoint } from "../../src/models/interfaces";
import Attack from "../../src/server/hero/attacks/attack";

export class TestAbility extends Ability {
  used = false;
  castLength = 10;
  cooldown = 20;
  name = "TestAbility";
  castRestriction = CastRestriction.InRange;

  onCast(): void {
    this.used = true;
  }
  useAbility(): void {
    return;
  }
}

export class TestAbility2 extends Ability {
  used = false;
  castLength = 10;
  cooldown = 20;
  name = "TestAbility2";
  castRestriction = CastRestriction.None;

  onCast(): void {
    this.used = true;
  }
  useAbility(): void {
    return;
  }
}

export class TestHero extends Hero {
  qAbility = new TestAbility(this);
  wAbility = null;
  eAbility = new TestAbility(this);
  autoAttacked = false;
  model = new Circle(10);

  onAutoAttack(): void {
    this.autoAttacked = true;
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

export class TestAttack extends Attack {
  executed = false;
  updated = false;
  onAttack(dest: IPoint): void {
    console.log(dest);
    this.executed = !this.executed;
  }

  onUpdate(): void {
    this.updated = !this.updated;
  }
}