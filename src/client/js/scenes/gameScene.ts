import 'phaser';
import TileMap from '../../../models/tileMap';
import { IUserInput } from '../../../models/interfaces/iUserInput';
import { IGameState } from '../../../models/interfaces/iGameState';
import PhaserInputController from '../phaserInputController';
import { drawPlayer } from './draw/player';
import { drawTiles } from './draw/tiles';
import { drawProjectile } from './draw/projectile';

class GameScene extends Phaser.Scene {
  tileMap: TileMap;
  dest: Phaser.GameObjects.GameObject;
  socket: SocketIO.Socket;
  gameObjects: Phaser.GameObjects.GameObject[];
  client: Phaser.GameObjects.Arc;

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
    // Camera will not follow player in the middle of the screen
    this.cameras.main.deadzone = new Phaser.Geom.Rectangle(100, 100, 400, 175);

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
    ["Q", "W", "E"].forEach(this.addKey.bind(this));
  }

  render(userGame: IGameState): void {
    // cleanup old game objects
    this.gameObjects.forEach(x => x.destroy());
    this.gameObjects = [];

    // render new game objects
    userGame.players.forEach(player => drawPlayer(this, player));
    userGame.projectiles.forEach(projectile => drawProjectile(this, projectile));
  }

  addKey(key: string): void {
    const keyObj = this.input.keyboard.addKey(key);
    keyObj.on('up', this.sendPlayerInput.bind(this));
  }

  sendPlayerInput(event): void {
    const controller = PhaserInputController.getInstance();
    const castIO = controller.getPlayerCastIO(event.originalEvent);
    const userInput: IUserInput = {
      io: castIO,
      cursorPosition: {
        x: this.input.mousePointer.worldX,
        y: this.input.mousePointer.worldY
      }
    };
    controller.sendPlayerInput(userInput);
  }

  update(): void {
    if (this.input.mousePointer.isDown) {
      PhaserInputController.getInstance().sendMouseClick(this);
    }
  }
}
export default GameScene;
