import 'phaser';
import { IGameState } from '../../../models/interfaces';
import PhaserInputController from '../phaserInputController';
import { drawGameTime } from './draw/gameTime';

class HudScene extends Phaser.Scene {
  socket: SocketIO.Socket;
  gameTimeText: Phaser.GameObjects.Text;

  constructor()
  {
    super({
      key: "HudScene",
      active: true
    });
  }

  create(): void
  {
    const inputController = PhaserInputController.getInstance();
    this.socket = inputController.socket;
    // Register socket event to bind to render function
    this.socket.on("S:UPDATE_GAME_STATE", this.render.bind(this));
  }

  render(userGame: IGameState): void {
    drawGameTime(this, userGame.currentFrame);
  }
}
export default HudScene;
