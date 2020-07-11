import * as TypeMoq from "typemoq";
import Player from "../../../../src/server/models/player";
import Game from "../../../../src/server/models/game";
import Brute from '../../../../src/server/hero/classes/brute';
import BruteAuto from "../../../../src/server/hero/abilities/bruteAuto";

describe('Brute', function() {
  let player: TypeMoq.IMock<Player>;
  let game: Game;
  let brute: Brute;

  beforeEach(function() {
    player = TypeMoq.Mock.ofType<Player>();
    game = Game.getInstance();
    // new game not initiated, singleton. So just deleting projectiles
    game.reset();
    brute = new Brute(player.object);
  });

  it('Brute autoattack will execute', function() {
    const auto = TypeMoq.Mock.ofType<BruteAuto>();
    brute.autoAttack = auto.object;
    brute.onAutoAttack({ x: 0, y: 0 });
    auto.verify(x => x.targetPosition = TypeMoq.It.isObjectWith({ x: 0, y: 0 }),
      TypeMoq.Times.once());
    auto.verify(x => x.cast(), TypeMoq.Times.once());
  });
});
