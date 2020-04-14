import { IPlayer, UserIO } from '../../models/interfaces';
import { Point, Velocity } from './basicTypes';

class Player implements IPlayer{
  id: string;
  position: Point;
  velocity: Velocity;
  socket: SocketIO.Socket;

  constructor(id: string, point: Point, socket: SocketIO.Socket) {
    this.id = id;
    this.position = point;
    this.velocity = new Velocity(this.position, 0);
    this.socket = socket;
  }

  updatePosition(point: Point): void {
    this.position = point;
  }

  updateVelocity(io: UserIO): void {
    this.velocity = Velocity.getPlayerVelocity(io);
  }

  update(io: SocketIO.Server): void {
    const retPlayer: IPlayer = { id: this.id, position: this.position };
    io.emit("S:PLAYER_MOVE", retPlayer);
    this.updatePosition(this.position.transform(this.velocity));
  }
}

export default Player;