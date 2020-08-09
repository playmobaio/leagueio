import * as assert from 'assert';
import { Point } from '../../../../src/server/models/basicTypes';
import Game from '../../../../src/server/game';
import { framesToSeconds } from '../../../../src/server/tools/frame';
import { TestSingleFrameProjectile } from '../../testClasses';

describe('SingleFrameProjectile', function() {
  let projectile: TestSingleFrameProjectile;
  let position: Point;
  let creatorId: string;
  const armTimeInFrames = 1;
  const armTimeInSeconds = framesToSeconds(armTimeInFrames);
  const game = Game.getInstance();

  beforeEach(function() {
    game.reset();
    creatorId = "testId";
    position = new Point(0, 0);
    projectile = new TestSingleFrameProjectile(creatorId, armTimeInSeconds, position);
  });

  describe('#canCollide', function() {
    it('cannot collide while projectile is arming', function() {
      assert(!projectile.canCollide());

      game.currentFrame += armTimeInFrames;
      assert(!projectile.canCollide());
    });

    it('collides during one frame', function() {
      game.currentFrame += armTimeInFrames + 1;
      assert(projectile.canCollide());
    });
  });

  describe('#shouldDelete', function() {
    it('should not delete while arming or during collision frame', function() {
      assert(!projectile.shouldDelete());

      game.currentFrame += armTimeInFrames + 1;
      assert(!projectile.shouldDelete());
    });

    it('should delete after collision frame', function() {
      game.currentFrame += armTimeInFrames + 2;
      assert(projectile.shouldDelete());
    });
  });
});
