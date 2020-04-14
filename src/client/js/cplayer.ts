import { IPlayer, IPoint, UserIO, IUserInput } from '../../models/interfaces';
import Canvas from './canvas';

class CPlayer implements IPlayer {
  id: string;
  position: IPoint;
  userIo: UserIO;
  ioPoint: IPoint;

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

  registerIo(io: UserIO, point: IPoint = null): void {
    this.userIo |= io;
    this.ioPoint = point;
  }

  deregisterIo(io: UserIO): void {
    this.userIo ^= io;
  }

  sendPlayerInput(socket: SocketIO.Socket): void {
    const userInput: IUserInput = { io: this.userIo, position: this.ioPoint };
    socket.emit("C:USER_MOVE", userInput);
  }
}

export default CPlayer;