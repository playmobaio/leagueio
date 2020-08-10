import 'phaser';
import { IGameState } from '../../../models/interfaces';
import PhaserInputController from '../phaserInputController';
import { drawHealth } from './draw/health';
import { drawGameTime } from './draw/gameTime';

class HudScene extends Phaser.Scene {
  socket: SocketIO.Socket;
  stockText: Phaser.GameObjects.Text;
  healthBar: Phaser.GameObjects.Rectangle;
  healthText: Phaser.GameObjects.Text;
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
    drawHealth(this, userGame.client);
    drawGameTime(this, userGame.currentFrame);
  }
}
export default HudScene;
