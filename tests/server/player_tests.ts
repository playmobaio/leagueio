import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Player from '../../src/server/models/player';
import { PlayerMovementIO } from '../../src/models/interfaces';
import { Point } from '../../src/server/models/basicTypes';
import constants from '../../src/server/constants';
import Projectile from '../../src/server/models/projectile';
import Game from '../../src/server/models/game';

describe('Player', function() {
  let player: Player;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  let point: Point;
  const id = "id";
  let game: Game;

  beforeEach(function(){
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    socket.setup((socket) => socket.id).returns(() => id);
    game = Game.getInstance();
    // new game not initiated, singleton. So just deleting projectiles
    game.projectiles.clear();
    point = new Point(0, 1);
    player = new Player(id, new Point(0, 0), socket.object);
    player.lastAutoAttackFrame = -1;
  });

  describe('#update', function() {
    it("Verify player updates position", function() {
      player.updatePosition(new Point(1, 1));
      assert.equal(1, player.model.center.x);
      assert.equal(1, player.model.center.y);
    });

    it("Verify velocity updates correctly", function() {
      player.updateVelocity(PlayerMovementIO.up);
      assert.equal(-1, player.velocity.getUnitVector().y);
      assert.equal(constants.DEFAULT_PLAYER_VELOCITY, player.velocity.getSpeed());
    });
  });

  describe("#addProjectile", function() {
    it("Smoke", function() {
      const projectile: Projectile = game.addProjectile(player.id, point);
      assert.equal(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET, projectile.model.center.y);
      assert.equal(constants.DEFAULT_PROJECTILE_SPEED, projectile.velocity.getSpeed());
    });
  });

  describe("#registerAutoAttack", function() {
    it("will autoattack immediately on spawn", function() {
      player.registerAutoAttack(point);
      assert.equal(game.projectiles.size, 1);
    });

    it("cannot auto attack too soon", function() {
      player.lastAutoAttackFrame = 0;
      player.attackSpeed = 1;
      game.currentFrame = 59; // Should be able to attack after 1 second, or 60 frams at 60 fps

      player.registerAutoAttack(point);
      assert.equal(game.projectiles.size, 0);
    });

    it("can auto attack after set number of frames", function() {
      player.lastAutoAttackFrame = 0;
      player.attackSpeed = 1;
      game.currentFrame = 60; // Should be able to attack after 1 second, or 60 frams at 60 fps

      player.registerAutoAttack(point);
      assert.equal(game.projectiles.size, 1);
    });
  });
});
