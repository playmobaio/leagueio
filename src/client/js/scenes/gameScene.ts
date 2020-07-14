import 'phaser';
import TileMap from '../../../models/tileMap';
import { IGameState } from '../../../models/interfaces';
import PhaserInputController from '../phaserInputController';
import { drawPlayer } from './draw/player';
import { drawTiles } from './draw/tiles';

class GameScene extends Phaser.Scene {
  tileMap: TileMap;
  dest: Phaser.GameObjects.GameObject;
  socket: SocketIO.Socket;
  players: Map<string, Phaser.GameObjects.Arc>;

  constructor()
  {
    super({
      key: "GameScene"
    });
    this.players = new Map<string, Phaser.GameObjects.Arc>();
  }

  preload(): void
  {
    this.tileMap =  new TileMap();
    this.load.image('tileMap', '../../assets/tiles-extruded.png');
  }

  create(): void
  {
    this.input.mouse.disableContextMenu();
    this.cameras.main.setBounds(
      0,
      0,
      TileMap.tileSize * TileMap.cols,
      TileMap.tileSize * TileMap.rows).setZoom(1.5);
    // Draw Tiles
    drawTiles(this, this.tileMap.background);
    drawTiles(this, this.tileMap.foreground);

    const inputController = PhaserInputController.getInstance();
    this.socket = inputController.socket;
    // Register socket event to bind to render function
    this.socket.on("S:UPDATE_GAME_STATE", this.render.bind(this));
  }

  render(userGame: IGameState): void {
    userGame.players.forEach(x => drawPlayer(this, x));
  }

  update(): void {
    if (this.input.mousePointer.isDown) {
      PhaserInputController.getInstance().sendMouseClick(this);
    }
  }
}
export default GameScene;