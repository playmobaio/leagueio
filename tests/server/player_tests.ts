import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Player from '../../src/server/models/player';
import { UserIO, IPoint } from '../../src/models/interfaces';
import { Times } from 'typemoq';
import { Point } from '../../src/server/models/basicTypes';
import constants from '../../src/server/constants';
import Projectile from '../../src/server/models/projectile';

describe('Player', function() {
  let player: Player;
  let socket: TypeMoq.IMock<SocketIO.Socket>;
  let io: TypeMoq.IMock<SocketIO.Server>;
  let point: Point;
  const id = "id";

  beforeEach(function(){
    socket = TypeMoq.Mock.ofType<SocketIO.Socket>();
    socket.setup((socket) => socket.id).returns(() => id);
    io = TypeMoq.Mock.ofType<SocketIO.Server>();
    point = new Point(0, 0);
    player = new Player(id, point, socket.object);
  });

  describe('#PlayerUpdate', function() {
    it("Verify player updates position", function() {
      const newPoint = new Point(1, 1);
      player.updatePosition(newPoint);
      assert.equal(1, player.position.x);
      assert.equal(1, player.position.y);
    });

    it("Verify velocity updates correctly", function() {
      player.updateVelocity(UserIO.up);
      assert.equal(-1, player.velocity.getUnitVector().y);
      assert.equal(constants.DEFAULT_PLAYER_VELOCITY, player.velocity.speed);
    });

    it("Verify io player update", function() {
      player.updateVelocity(UserIO.up);
      player.update(io.object);
      io.verify(x => x.emit("S:PLAYER_MOVE", TypeMoq.It.isObjectWith({ id: id })), Times.once());
      assert.equal(0, player.position.x);
      assert.equal(-constants.DEFAULT_PLAYER_VELOCITY, player.position.y);
    });

    it("Smoke testing adding projectile", function() {
      const point: IPoint = { x: 0, y: 5 };
      const projectile: Projectile = player.addProjectile(point);
      assert.equal(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET, projectile.position.y);
      assert.equal(constants.DEFAULT_PROJECTILE_SPEED, projectile.velocity.speed);
    });
  });
});