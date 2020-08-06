import * as assert from 'assert';
import { Velocity, Point } from '../../../../src/server/models/basicTypes';
import Game from '../../../../src/server/game';
import { TestRangeBasedProjectile } from '../../testClasses';

describe('RangeBasedProjectile', function() {
  let projectile: TestRangeBasedProjectile;
  let origin: Point;
  let creatorId: string;

  beforeEach(function() {
    creatorId = "testId";
    origin = new Point(0, 0);
    projectile = new TestRangeBasedProjectile(creatorId, origin, Velocity.createNull());
  });

  describe('#shouldDelete', function() {
    it('will not delete when moving less than range', function() {
      const point = new Point(0, projectile.getRange() - 1);
      projectile.setPosition(point)
      assert(!projectile.shouldDelete());
    });

    it('will delete after moving the range', function() {
      const point = new Point(0, projectile.getRange());
      projectile.setPosition(point)
      assert(projectile.shouldDelete());
    });

    it('infinite ranged ability: should not delete from range', function() {
      projectile.setRange(-1);

      const point = new Point(0, TestRangeBasedProjectile.DEFAULT_RANGE);
      projectile.setPosition(point)
      assert(!projectile.shouldDelete());
    });

    it('infinite ranged ability: should not delete while on the map', function() {
      projectile.setRange(-1);

      const game = Game.getInstance();
      const point = new Point(game.gameMap.width, game.gameMap.height);
      projectile.setPosition(point);
      assert(!projectile.shouldDelete());
    });

    it('infinite ranged ability: should delete when off the map', function() {
      projectile.setRange(-1);

      const game = Game.getInstance();
      const point =
        new Point(game.gameMap.width, game.gameMap.height + TestRangeBasedProjectile.radius);
      projectile.setPosition(point);
      assert(projectile.shouldDelete());
    });
  });
});
