import Hero from "../../src/server/hero/hero";
import { Point, Velocity } from "../../src/server/models/basicTypes";
import Ability from "../../src/server/hero/ability";
import Effect from "../../src/server/hero/effect";
import { CastRestriction } from "../../src/models/interfaces/iAbility";
import { IProjectile } from "../../src/models/interfaces/iGameState";
import Model from "../../src/server/models/model";
import CircleModel from "../../src/server/models/circleModel";
import { Point as dcPoint, Body } from 'detect-collisions';
import Player from '../../src/server/player';
import Projectile from '../../src/server/projectiles/projectile';
import RangeBasedProjectile from '../../src/server/projectiles/rangeBased/rangeBasedProjectile';
import TimedProjectile from '../../src/server/projectiles/timed/timedProjectile';
import SingleFrameProjectile from '../../src/server/projectiles/singleFrame/singleFrameProjectile';

export class TestAbility extends Ability {
  used = false;
  castTime = 10;
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

  constructor(position: Point) {
    super();
    this.position = new Point(position.x, position.y);
    this.body = new dcPoint(position.x, position.y);
    this.addBody();
  }

  getBody(): Body {
    return this.body;
  }
}

export class TestProjectile extends Projectile {
  shouldDeleteValue: boolean;
  damage: number;
  radius = 10;

  constructor(creatorId: string, origin: Point, velocity: Velocity, damage: number) {
    super(creatorId);
    this.model = new CircleModel(origin, TestProjectile.radius);
    this.model.setVelocity(velocity);
    this.origin = origin;
    this.damage = damage
    this.shouldDeleteValue = false;
  }

  protected shouldDelete(): boolean {
    return this.shouldDeleteValue;
  }

  canCollide(): boolean {
    return true;
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(this.damage);
    this.delete();
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toIModel() };
  }
}


export class TestRangeBasedProjectile extends RangeBasedProjectile {
  static DEFAULT_RANGE = 10;
  static radius = 10;
  damage = 10;
  range: number;

  constructor(creatorId: string, origin: Point, velocity: Velocity) {
    super(creatorId);
    this.model = new CircleModel(origin, TestRangeBasedProjectile.radius);
    this.model.setVelocity(velocity);
    this.origin = origin;
    this.range = TestRangeBasedProjectile.DEFAULT_RANGE;
  }

  setRange(range: number): void {
    this.range = range;
  }

  canCollide(): boolean {
    return true;
  }

  getRange(): number {
    return this.range;
  }

  setPosition(position: Point): void {
    this.model.updatePosition(position);
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(TestRangeBasedProjectile.damage);
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toIModel() };
  }
}

export class TestTimedProjectile extends TimedProjectile {
  static radius = 10;
  static damage = 10;

  constructor(creatorId: string, lifeSpan: number, origin: Point) {
    super(creatorId, lifeSpan);
    this.model = new CircleModel(origin, TestTimedProjectile.radius);
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(TestTimedProjectile.damage);
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toIModel() };
  }
}

export class TestSingleFrameProjectile extends SingleFrameProjectile {
  static radius = 10;
  static damage = 10;

  constructor(creatorId: string, armTimeInSeconds: number, position: Point) {
    super(creatorId, armTimeInSeconds);
    this.model = new CircleModel(position, TestSingleFrameProjectile.radius);
  }

  onPlayerCollision(player: Player): void {
    player.receiveDamage(TestSingleFrameProjectile.damage);
  }

  toInterface(): IProjectile {
    return { id: this.id, model: this.model.toIModel() };
  }
}
