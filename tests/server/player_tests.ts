import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Player from '../../src/server/player';
import Game from '../../src/server/game';

describe('Player', function() {
  let player: Player;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  const id = "id";
  const defaultName = "DEFAULT_NAME";
  const defaultHeroID = 1;
  let game: Game;

  beforeEach(function(){
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    socket.setup((socket) => socket.id).returns(() => id);
    game = new Game(false);
    player = Player.create(game, id, socket.object, defaultName, defaultHeroID);
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

  it("end player game resets game", function() {
    player.endPlayerGame();
    socket.verify(x => x.emit("S:END_GAME"), TypeMoq.Times.atLeastOnce());
  })
});
