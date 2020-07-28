import { Click, IUserMouseClick } from '../../models/interfaces';
import GameScene from './scenes/gameScene';
import { drawPointer } from './scenes/draw/pointer';

class PhaserInputController {
  private static instance: PhaserInputController;
  socket: SocketIO.Socket;

  private constructor(socket: SocketIO.Socket) {
    this.socket = socket
  }

  static createInstance(socket: SocketIO.Socket): void {
    PhaserInputController.instance = new PhaserInputController(socket);
  }

  static getInstance(): PhaserInputController {
    return PhaserInputController.instance;
  }

  sendMouseClick(scene: GameScene): void {
    const cursorPosition = {
      x: scene.input.mousePointer.worldX,
      y: scene.input.mousePointer.worldY
    };
    let click: Click;
    switch (scene.input.mousePointer.buttons) {
    case 1:
      click = Click.Left;
      break;
    case 2: {
      click = Click.Right;
      drawPointer(scene, cursorPosition);
      break;
    }
    case 0:
      return;
    }

    const userMouseClick: IUserMouseClick = { cursorPosition: cursorPosition, click: click };
    this.socket.emit("C:USER_MOUSE_CLICK", userMouseClick);
  }
}

export default PhaserInputController;
