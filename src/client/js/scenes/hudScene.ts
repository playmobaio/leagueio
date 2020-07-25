import 'phaser';
import { IGameState } from '../../../models/interfaces';
import PhaserInputController from '../phaserInputController';
import { drawStocks } from './draw/stocks';

class HudScene extends Phaser.Scene {
  socket: SocketIO.Socket;
  gameObjects: Phaser.GameObjects.GameObject[];

  constructor()
  {
    super({
      key: "HudScene",
      active: true
    });
    this.gameObjects = [];
  }

  create(): void
  {
    const inputController = PhaserInputController.getInstance();
    this.socket = inputController.socket;
    // Register socket event to bind to render function
    this.socket.on("S:UPDATE_GAME_STATE", this.render.bind(this));
  }

  render(userGame: IGameState): void {
    // clear game objects
    this.gameObjects.forEach(x => x.destroy());

    // render new objects
    drawStocks(this, userGame.client);
  }
}
export default HudScene;