import * as assert from 'assert';
import Game from '../../src/server/models/game';
import Player from '../../src/server/models/player';
import { UserIO, IPoint } from '../../src/models/interfaces';
import { Point } from '../../src/server/models/basicTypes';
import constants from '../../src/server/constants';
import Projectile from '../../src/server/models/projectile';

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

  describe('#MovePlayers', function() {
    it("Game doesn't throw when player doesn't exist", function() {
      const game: Game = Game.getInstance();
      assert.doesNotThrow(() => game.movePlayer(id, UserIO.up));
    });

    it("Game sucessfully moves player on user io", function() {
      game.addPlayer(player);
      game.movePlayer(id, UserIO.up);
      assert.equal(constants.DEFAULT_VELOCITY, player.velocity.getSpeed());
    });
  });

  describe('#AddingProjectile', function() {
    it("Projectile", function() {
      game.addPlayer(player);
      const point: IPoint = { x: 0, y: 5 };
      const projectile: Projectile = game.addProjectile(id, point);
      assert.equal(constants.PROJECTILE_OFFSET, projectile.position.y);
      assert.equal(constants.PROJECTILE_MAGNITUDE, projectile.velocity.y);
    });
  })
});