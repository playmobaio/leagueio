import * as assert from 'assert';
import { Point } from '../../../../src/server/models/basicTypes';
import { TestTimedProjectile } from '../../testClasses';
import { secondsToFrames } from '../../../../src/server/tools/frame';
import Game from '../../../../src/server/game';

describe('TimedProjectile', function() {
  let projectile: TestTimedProjectile;
  const lifespanInSeconds = 1;
  const lifespanInFrames = secondsToFrames(lifespanInSeconds);
  let game: Game;
  let origin: Point;
  let creatorId: string;

  beforeEach(function() {
    creatorId = "testId";
    origin = new Point(0, 0);
    game = Game.createTest();
    projectile = new TestTimedProjectile(game, creatorId, lifespanInSeconds, origin);
  });

  describe('#update', function() {
    it('will not delete before lifespan passes', function() {
      game.currentFrame += lifespanInFrames;
      projectile.update();
      assert(projectile.model.exists);
    });

    it('will delete after lifespan passes', function() {
      game.currentFrame += lifespanInFrames + 1;
      projectile.update();
      assert(!projectile.model.exists);
    });
  });
});
