import { IPoint, PlayerMoveIO, IUserInput, IUserMouseClick, Click } from '../../models/interfaces';
import Game from './game';
import constants from './constants';

class UserInputController {
  private static instance: UserInputController;
  socket: SocketIO.Socket;
  userIO: PlayerMoveIO;
  targetPosition: IPoint;

  private constructor(socket: SocketIO.Socket) {
    this.socket = socket
    this.userIO = PlayerMoveIO.None;
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

  registerPlayerMove(io: PlayerMoveIO): void {
    this.userIO = io;
    this.sendPlayerInput();
  }

  sendMouseClick(click: Click, cursorPosition: IPoint): void {
    if (this.socket == null) {
      return;
    }

    if (click == Click.Right) {
      this.targetPosition = cursorPosition;
    }
    const userMouseClick: IUserMouseClick = { cursorPosition: cursorPosition, click: click }
    this.socket.emit("C:USER_MOUSE_CLICK", userMouseClick);
  }

  sendPlayerInput(): void {
    if (this.socket == null) {
      return;
    }

    const userInput: IUserInput = { io: this.userIO };
    this.socket.emit("C:USER_MOVE", userInput);
  }

  drawTargetPosition(game: Game): void {
    if (this.targetPosition == null) {
      return;
    }
    const point: IPoint = game.camera.getRelativePosition(this.targetPosition);
    game.gameMap.context.beginPath();
    game.gameMap.context.strokeStyle = "red";

    game.gameMap.context.strokeRect(point.x,
      point.y,
      constants.DEFAULT_CURSOR_PIXEL_LENGTH,
      constants.DEFAULT_CURSOR_PIXEL_LENGTH);
  }
}

export default UserInputController;
