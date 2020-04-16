import * as assert from 'assert';
import { Velocity, Point, Vector } from '../../../src/server/models/basicTypes';
import Projectile from '../../../src/server/models/projectile';
import constants from '../../../src/server/constants';

describe('Projectile', function() {
  let projectile: Projectile;
  let velocity: Velocity;
  let src: Point;

  beforeEach(function() {
    src = new Point(0, 0);
    velocity = new Velocity(1, 0);
    projectile = new Projectile(src, velocity);
  });

  describe('#rangeExpired', function() {
    it('in range projectiles return false', function() {
      projectile.range = 10;
      projectile.position = new Point(10, 0);
      assert(!projectile.rangeExpired());
    });

    it('out of range projectiles return true', function() {
      projectile.range = 10;
      projectile.position = new Point(11, 0);
      assert(projectile.rangeExpired());
    });
  });
});