import * as assert from 'assert';
import * as TypeMoq from "typemoq";
import Player from '../../src/server/models/player';
import { UserIO } from '../../src/models/interfaces';
import { Times } from 'typemoq';
import { Point } from '../../src/server/models/basicTypes';

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
      assert.ok(player.velocity.y < 0);
    });

    it("Verify io emitted on player update", function() {
      player.update(io.object);
      io.verify(x => x.emit("S:PLAYER_MOVE", TypeMoq.It.isObjectWith({ id: id })), Times.once());
    });
  });
});