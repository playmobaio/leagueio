import * as assert from 'assert';
import { Velocity, Point } from '../../../src/server/models/basicTypes';
import { TestRangeBasedProjectile } from '../testClasses';

describe('RangeBasedProjectile', function() {
  let velocity: Velocity;
  let projectile: TestRangeBasedProjectile;
  let origin: Point;
  let creatorId: string;

  beforeEach(function() {
    creatorId = "testId";
    origin = new Point(0, 0);
    velocity = new Velocity({ x: 1, y: 1 }, TestRangeBasedProjectile.range);
    projectile = new TestRangeBasedProjectile(creatorId, origin, velocity);
  });

  describe('#update', function() {
    it('will not delete when moving less than range', function() {
      projectile.update();
      assert(projectile.model.exists);
    });

    it('will delete after moving more than range', function() {
      projectile.update();
      projectile.update();
      assert(!projectile.model.exists);
    });
  });
});
