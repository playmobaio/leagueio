import { IPlayer } from '../../models/interfaces';
import { Point, Velocity } from './basicTypes';

class Player implements IPlayer{
  id: string;
  position: Point;
  velocity: Velocity;
  socket: SocketIO.Socket;
  io: SocketIO.Server;

  constructor(id: string, point: Point, socket: SocketIO.Socket, io: SocketIO.Server) {
    this.id = id;
    this.position = point;
    this.velocity = new Velocity(0, 0);
    this.socket = socket;
    this.io = io;
  }

  updatePosition(point: Point): void {
    this.position = point;
  }

  update(): void {
    const retPlayer: IPlayer = { id: this.id, position: this.position };
    this.io.emit("S:PLAYER_MOVE", retPlayer);
    this.updatePosition(this.position.transform(this.velocity));
    this.velocity.decrement();
  }
}

export default Player;