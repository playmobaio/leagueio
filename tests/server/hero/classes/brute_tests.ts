import * as TypeMoq from "typemoq";
import Player from "../../../../src/server/models/player";
import Game from "../../../../src/server/models/game";
import Brute from '../../../../src/server/hero/classes/brute';
import Swipe180 from '../../../../src/server/hero/attacks/swipe180';

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
    const attack = TypeMoq.Mock.ofType<Swipe180>();
    brute.autoAttack = attack.object;
    brute.onAutoAttack({ x: 0, y: 0 });
    attack.verify(x => x.execute(TypeMoq.It.isAny()), TypeMoq.Times.once());
  });
});
