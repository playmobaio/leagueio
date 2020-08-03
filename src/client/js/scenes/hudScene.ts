import 'phaser';
import { IGameState } from '../../../models/interfaces';
import PhaserInputController from '../phaserInputController';
import { drawStocks } from './draw/stocks';
import { drawHealth } from './draw/health';

class HudScene extends Phaser.Scene {
  socket: SocketIO.Socket;
  stockText: Phaser.GameObjects.Text;
  healthText: Phaser.GameObjects.Text;

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
    drawStocks(this, userGame.client);
    drawHealth(this, userGame.client);
  }
}
export default HudScene;