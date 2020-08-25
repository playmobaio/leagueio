import { PlayerCastIO, IUserInput } from '../../models/interfaces/iUserInput';
import { Click, IUserMouseClick } from '../../models/interfaces/iUserMouseClick';
import GameScene from './scenes/gameScene';
import { drawPointer } from './scenes/draw/pointer';

class PhaserInputController {
  private static instance: PhaserInputController;
  socket: SocketIO.Socket;
  heroId: HeroID;

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

  getPlayerCastIO(event: KeyboardEvent): PlayerCastIO {
    switch(event.code) {
    case "KeyQ":
      return PlayerCastIO.Q;
    case "KeyW":
      return PlayerCastIO.W;
    case "KeyE":
      return PlayerCastIO.E;
    }
    return PlayerCastIO.None;
  }

  sendPlayerInput(userInput: IUserInput): void {
    if (this.socket == null) {
      return;
    }
    this.socket.emit("C:USER_CAST", userInput);
  }

  setHeroId(heroId: HeroID): void {
    this.heroId = heroId;
  }
}

export default PhaserInputController;
