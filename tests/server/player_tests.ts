import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Player from '../../src/server/models/player';
import { PlayerMovementIO, IPoint } from '../../src/models/interfaces';
import { Times } from 'typemoq';
import { Point } from '../../src/server/models/basicTypes';
import constants from '../../src/server/constants';
import Projectile from '../../src/server/models/projectile';
import Game from '../../src/server/models/game';

describe('Player', function() {
  let player: Player;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  let io: TypeMoq.IMock<SocketIO.Server>;
  let point: Point;
  const id = "id";
  let game: Game;

  beforeEach(function(){
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    socket.setup((socket) => socket.id).returns(() => id);
    io = TypeMoq.Mock.ofType<SocketIO.Server>();
    game = Game.getInstance();
    player = new Player(id, new Point(0, 0), socket.object);
    point = <IPoint> { x: 0, y: 5 };
  });

  describe('#update', function() {
    it("Verify player updates position", function() {
      player.updatePosition(new Point(1, 1));
      assert.equal(1, player.position.x);
      assert.equal(1, player.position.y);
    });

    it("Verify velocity updates correctly", function() {
      player.updateVelocity(PlayerMovementIO.up);
      assert.equal(-1, player.velocity.getUnitVector().y);
      assert.equal(constants.DEFAULT_PLAYER_VELOCITY, player.velocity.speed);
    });

    it("Verify io player update", function() {
      player.updateVelocity(PlayerMovementIO.up);
      player.update(io.object);
      io.verify(x => x.emit("S:PLAYER_MOVE", TypeMoq.It.isObjectWith({ id: id })), Times.once());
      assert.equal(0, player.position.x);
      assert.equal(-constants.DEFAULT_PLAYER_VELOCITY, player.position.y);
    });
  });

  describe("#addProjectile", function() {
    it("Smoke", function() {
      const projectile: Projectile = player.addProjectile(point);
      assert.equal(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET, projectile.position.y);
      assert.equal(constants.DEFAULT_PROJECTILE_SPEED, projectile.velocity.speed);
    });
  });

  describe("#registerAutoAttack", function () {
    it("will autoattack immediately on spawn", function() {
      player.registerAutoAttack(point);
      assert.equal(player.projectiles.size, 1);
    });

    it("cannot auto attack too soon", function() {
      player.lastAutoAttackFrame = 0;
      player.attackSpeed = 1;
      game.currentFrame = 59; // Should be able to attack after 1 second, or 60 frams at 60 fps

      player.registerAutoAttack(point);
      assert.equal(player.projectiles.size, 0);
    });

    it("can auto attack after set number of frames", function() {
      player.lastAutoAttackFrame = 0;
      player.attackSpeed = 1;
      game.currentFrame = 60; // Should be able to attack after 1 second, or 60 frams at 60 fps

      player.registerAutoAttack(point);
      assert.equal(player.projectiles.size, 1);
    });
  });
});
