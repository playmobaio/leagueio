import { IPoint, PlayerMovementIO, IUserInput, IUserMouseClick } from '../../models/interfaces';

class UserInputController {
  private static instance: UserInputController;
  socket: SocketIO.Socket;
  userIO: PlayerMovementIO;
  mouseClick: boolean;
  cursorPosition: IPoint;

  private constructor(socket: SocketIO.Socket) {
    this.socket = socket
    this.userIO = PlayerMovementIO.None;
    this.mouseClick = false;
  }

  static getInstance(socket: SocketIO.Socket): UserInputController {
    if (!UserInputController.instance) {
      UserInputController.instance = new UserInputController(socket);
    }
    if (socket != null && UserInputController.instance.socket == null) {
      UserInputController.instance.socket = socket;
    }

    return UserInputController.instance;
  }

  registerPlayerMovement(io: PlayerMovementIO): void {
    this.userIO |= io;
    this.sendPlayerInput();
  }

  deregisterPlayerMovement(io: PlayerMovementIO): void {
    this.userIO &= ~io;
    this.sendPlayerInput();
  }

  registerMouseClick(cursorPosition: IPoint): void {
    this.cursorPosition = cursorPosition;
    this.mouseClick = true;
    this.sendMouseClick();
  }

  sendPlayerInput(): void {
    if (this.socket == null) {
      return;
    }

    const userInput: IUserInput = { io: this.userIO };
    this.socket.emit("C:USER_MOVE", userInput);
  }

  sendMouseClick(): void {
    if (this.socket == null) {
      return;
    }

    const userMouseClick: IUserMouseClick = { cursorPosition: this.cursorPosition }
    this.socket.emit("C:USER_MOUSE_CLICK", userMouseClick);
    this.mouseClick = false;
  }
}

export default UserInputController;
