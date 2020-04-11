import { IPlayer, IPoint, UserIO } from '../../models/interfaces';
import Canvas from './canvas';

class CPlayer implements IPlayer {
  id: string;
  position: IPoint;
  userIo: UserIO;

  constructor(id: string, point: IPoint) {
    this.id = id;
    this.position = point;
    this.userIo = UserIO.none;
  }

  draw(canvas: Canvas): void {
    canvas.context.beginPath();
    canvas.context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
    canvas.context.stroke();
  }

  registerIo(io: UserIO): void {
    this.userIo |= io;
  }

  deregisterIo(io: UserIO): void {
    this.userIo ^= io;
  }

  update(socket: SocketIO.Socket): void {
    socket.emit("C:USER_MOVE", this.userIo);
  }
}

export default CPlayer;