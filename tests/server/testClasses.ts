import Hero from "../../src/server/hero/hero";
import { Point } from "../../src/server/models/basicTypes";
import Ability from "../../src/server/hero/ability";
import Effect from "../../src/server/hero/effect";
import { CastRestriction } from "../../src/models/interfaces";
import Model from "../../src/server/models/model";
import { Point as dcPoint, Body } from 'detect-collisions';

export class TestAbility extends Ability {
  used = false;
  castLength = 10;
  cooldown = 20;
  name = "TestAbility";
  castRestriction = CastRestriction.InRange;
  updated = false;

  onCast(): void {
    this.used = !this.used;
  }
  useAbility(): void {
    return;
  }
  onUpdate(): void {
    this.updated = !this.updated;
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

export class TestModel extends Model {
  body = null;

  constructor(position: IPoint) {
    super();
    this.position = new Point(position.x, position.y);
    this.body = new dcPoint(position.x, position.y);
    this.addBody();
  }

  getBody(): Body {
    return this.body;
  }
}
