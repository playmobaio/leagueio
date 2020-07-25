import 'phaser';
import TileMap from '../../../models/tileMap';
import { IGameState } from '../../../models/interfaces';
import PhaserInputController from '../phaserInputController';
import { drawPlayer } from './draw/player';
import { drawTiles } from './draw/tiles';
import { drawProjectile } from './draw/projectile';

class GameScene extends Phaser.Scene {
  tileMap: TileMap;
  dest: Phaser.GameObjects.GameObject;
  socket: SocketIO.Socket;
  gameObjects: Phaser.GameObjects.GameObject[];

  constructor()
  {
    super({
      key: "GameScene"
    });
    this.gameObjects = [];
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
    // cleanup old game objects
    this.gameObjects.forEach(x => x.destroy());
    this.gameObjects = [];

    // render new game objects
    userGame.players.forEach(player => drawPlayer(this, player));
    userGame.projectiles.forEach(projectile => drawProjectile(this, projectile));
  }

  update(): void {
    if (this.input.mousePointer.isDown) {
      PhaserInputController.getInstance().sendMouseClick(this);
    }
  }
}
export default GameScene;