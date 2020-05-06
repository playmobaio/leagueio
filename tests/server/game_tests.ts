import * as assert from 'assert';
import Game from '../../src/server/models/game';
import Player from '../../src/server/models/player';
import { PlayerMovementIO } from '../../src/models/interfaces';
import { Point } from '../../src/server/models/basicTypes';
import constants from '../../src/server/constants';

describe('Game', function() {
  let game: Game;
  let player: Player;
  const id = "id";

  beforeEach(function(){
    game = Game.getInstance();
    player = new Player(id, new Point(0, 0), null);
  });

  describe('#AddandRemovePlayers', function() {
    it('Game can add and remove players', function() {
      game.addPlayer(player);
      assert.equal(1, game.players.size);
      game.removePlayer(id);
      assert.equal(0, game.players.size);
    });
  });

  describe('#UpdatePlayerVelocity', function() {
    it("Game sucessfully updates player velocity", function() {
      game.addPlayer(player);
      game.updatePlayerVelocity(id, PlayerMovementIO.Up);
      assert.equal(constants.DEFAULT_PLAYER_VELOCITY, player.velocity.getSpeed());
    });
  });
});
