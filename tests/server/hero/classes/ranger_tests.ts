import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Player from "../../../../src/server/player";
import Game from "../../../../src/server/game";
import Ranger from "../../../../src/server/hero/classes/ranger";

describe('Ranger', function() {
  let player: TypeMoq.IMock<Player>;
  let game: Game;
  let ranger: Ranger;

  beforeEach(function() {
    player = TypeMoq.Mock.ofType<Player>();
    game = new Game(false);
    player.setup(x => x.game).returns(() => game);
    ranger = new Ranger(player.object);
  });

  it('AutoAttack will create Projectile', function() {
    ranger.onAutoAttack({ x: 0, y: 0 });
    assert.equal(game.projectiles.size, 1, "Expected one projectile to be made");
  });
});
