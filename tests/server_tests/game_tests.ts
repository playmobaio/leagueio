import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Game from '../../src/server/models/game';
import Player from '../../src/server/models/player';
import { UserIO } from '../../src/models/interfaces';
import { Times } from 'typemoq';

describe('Game', function() {
  let game: Game;
  let player: TypeMoq.IMock<Player>;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  const id = "id";

  beforeEach(function(){
    game = Game.getInstance();
    player = TypeMoq.Mock.ofType<Player>();
    player.setup((player) => player.id).returns(() => id);
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    socket.setup((socket) => socket.id).returns(() => id);
  });

  describe('#AddandRemovePlayers', function() {
    it('Game can add and remove players', function() {
      game.addPlayer(player.object);
      assert.equal(1, game.players.size);
      game.removePlayer(id);
      assert.equal(0, game.players.size);
    });
  });

  describe('#MovePlayers', function() {
    it("Game doesn't throw when player doesn't exist", function() {
      const game: Game = Game.getInstance();
      const socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
      assert.doesNotThrow(() => game.movePlayer(socket.object, UserIO.up));
    });

    it("Game sucessfully moves player on user io", function() {
      game.addPlayer(player.object);
      game.movePlayer(socket.object, UserIO.up);
      player.verify(x => x.updateVelocity(1), Times.once());
    });
  });
});