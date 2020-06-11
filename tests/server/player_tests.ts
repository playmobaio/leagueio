import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Player from '../../src/server/models/player';
import Game from '../../src/server/models/game';

describe('Player', function() {
  let player: Player;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  const id = "id";
  let game: Game;

  beforeEach(function(){
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    socket.setup((socket) => socket.id).returns(() => id);
    game = Game.getInstance();
    // new game not initiated, singleton. So just deleting projectiles
    game.reset();
    player = Player.create(id, socket.object);
  });

  it("health cannot be negative", function() {
    player.health.current = 0;
    player.receiveDamage(10);
    assert.equal(player.health.current, 0);
  });

  it("recieveDamage will reduce health", function() {
    player.health.current = 12;
    player.receiveDamage(10);
    assert.equal(player.health.current, 2);
  });

  it("respawn resets health", function() {
    player.health.current = 0;
    player.respawn();
    assert.equal(player.health.current, player.health.maximum);
  });
});
