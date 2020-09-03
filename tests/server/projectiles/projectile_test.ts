import * as assert from 'assert';
import { Velocity, Point } from '../../../src/server/models/basicTypes';
import { TestProjectile } from '../testClasses';
import Game from '../../../src/server/game';

describe('Projectile', function() {
  let projectile: TestProjectile;
  let velocity: Velocity;
  let origin: Point;
  let creatorId: string;

  beforeEach(function() {
    creatorId = "testId";
    origin = new Point(0, 0);
    velocity = new Velocity({ x: 1, y: 0 }, 1);
    projectile = new TestProjectile(Game.createTest(), creatorId, origin, velocity, 10);
  });

  describe('#update', function() {
    it('will update model position', function() {
      projectile.update();
      const position: Point = projectile.model.getPosition();
      assert.deepEqual(position, new Point(1, 0));
    });

    it('delete object if shouldDelete() == true', function() {
      projectile.shouldDeleteValue = true;
      assert(projectile.model.exists);
      projectile.update();
      assert(!projectile.model.exists);
    });
  });
});
