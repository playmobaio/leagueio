import { IPlayer, IGameState, IProjectile, Layer } from "../../models/interfaces";
import CGameMap from './cgameMap';
import Camera from './camera';
import { drawPlayer } from './draw/player';
import { drawProjectile } from './draw/projectile';
import { drawClientHealth } from './draw/health';

// Client
class Game {
  private static instance: Game;
  gameMap: CGameMap;
  camera: Camera;
  currentFrame: number;

  constructor(gameMap: CGameMap, camera: Camera) {
    this.gameMap = gameMap;
    this.camera = camera;
    this.currentFrame = -1;
  }

  static async getInstance(): Promise<Game> {
    if(Game.instance == null) {
      const gameMap: CGameMap = await CGameMap.getInstance();
      const camera = new Camera(gameMap, gameMap.canvas.width, gameMap.canvas.height);
      const game = new Game(gameMap, camera);
      Game.instance = game;
    }
    return Game.instance;
  }

  draw(gameState: IGameState): void {
    if(this.currentFrame >= gameState.currentFrame) {
      return;
    }

    this.currentFrame = gameState.currentFrame;
    this.gameMap.resetFrame();
    this.camera.setFrameReference(gameState.client);
    this.gameMap.drawLayer(this.camera, Layer.Background);

    gameState.players.forEach((iPlayer: IPlayer): void => {
      drawPlayer(this.gameMap, iPlayer, this.camera);
    });

    gameState.projectiles.forEach((iProjectile: IProjectile): void => {
      drawProjectile(this.gameMap, iProjectile, this.camera);
    });

    this.gameMap.drawLayer(this.camera, Layer.Foreground);
    drawClientHealth(this.gameMap, gameState.client);
  }
}

export default Game;
