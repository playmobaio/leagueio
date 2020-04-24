import CPlayer from './cplayer';
import { IPlayer, IGameState, IProjectile, Layer } from "../../models/interfaces";
import CProjectile from './cprojectile';
import CGameMap from './cgameMap';

// Client
class Game {
  private static instance: Game;
  gameMap: CGameMap;

  static async getInstance(): Promise<Game> {
    if(Game.instance == null) {
      const game = new Game();
      game.gameMap = await CGameMap.getInstance();
      Game.instance = game;
    }
    return Game.instance;
  }

  draw(gameState: IGameState): void {
    this.gameMap.context.clearRect(0, 0, this.gameMap.canvas.width, this.gameMap.canvas.height);

    this.gameMap.drawLayer(gameState, Layer.background);
    gameState.players.forEach((iPlayer: IPlayer): void => {
      const player = new CPlayer(iPlayer);
      player.draw(this.gameMap);
    });

    gameState.projectiles.forEach((iProjectile: IProjectile): void => {
      const projectile = new CProjectile(iProjectile);
      projectile.draw(this.gameMap);
    });

    this.gameMap.drawLayer(gameState, Layer.foreground);
  }
}

export default Game;
