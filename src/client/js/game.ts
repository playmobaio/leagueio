import CPlayer from './cplayer';
import { IPlayer, IGameState, IProjectile, Layer } from "../../models/interfaces";
import CProjectile from './cprojectile';
import CGameMap from './cgameMap';
import Camera from './camera';

// Client
class Game {
  private static instance: Game;
  gameMap: CGameMap;
  camera: Camera;
  currentFrame: number;

  constructor(gameMap: CGameMap, camera: Camera) {
    this.gameMap = gameMap;
    this.camera = camera;
    this.currentFrame = 0;
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
    this.currentFrame = gameState.currentFrame;
    this.gameMap.resetFrame();
    this.camera.setFrameReference(gameState.client);
    this.gameMap.drawLayer(this.camera, Layer.Background);

    gameState.players.forEach((iPlayer: IPlayer): void => {
      const player = new CPlayer(iPlayer, this.camera);
      player.draw(this.gameMap);
    });

    gameState.projectiles.forEach((iProjectile: IProjectile): void => {
      const projectile = new CProjectile(iProjectile, this.camera);
      projectile.draw(this.gameMap);
    });

    this.gameMap.drawLayer(this.camera, Layer.Foreground);

    // display health text
    this.gameMap.context.font = "30px Arial";
    this.gameMap.context.fillText(`Health: ${gameState.client.health.current}`, 10, 30);
  }
}

export default Game;
