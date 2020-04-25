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

  constructor(gameMap: CGameMap, camera: Camera) {
    this.gameMap = gameMap;
    this.camera = camera;
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
    this.gameMap.resetFrame();
    this.camera.setFrameReference(gameState.client);
    this.gameMap.drawLayer(this.camera, Layer.background);

    gameState.players.forEach((iPlayer: IPlayer): void => {
      iPlayer.position = this.camera.getRelativePosition(iPlayer.position)
      const player = new CPlayer(iPlayer);
      player.draw(this.gameMap);
    });

    gameState.projectiles.forEach((iProjectile: IProjectile): void => {
      iProjectile.position = this.camera.getRelativePosition(iProjectile.position)
      const projectile = new CProjectile(iProjectile);
      projectile.draw(this.gameMap);
    });

    this.gameMap.drawLayer(this.camera, Layer.foreground);
  }
}

export default Game;
