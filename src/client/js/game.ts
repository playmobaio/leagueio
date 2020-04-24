import CPlayer from './cplayer';
import { IPlayer, IGameState, IProjectile } from "../../models/interfaces";
import CProjectile from './cprojectile';
import Loader from './loader';
import CGameMap from './cgameMap';

// Client
class Game {
  private static instance: Game;
  gameMap: CGameMap;
  tileAtlas: HTMLImageElement;
  imageloader: Loader;

  constructor() {
    this.gameMap = CGameMap.getInstance();
    this.imageloader = new Loader();
  }

  static async getInstance(): Promise<Game> {
    if(Game.instance == null) {
      const game = new Game();
      game.tileAtlas = await game.imageloader.loadImage('tiles', '../assets/tiles.png');
      Game.instance = game;
    }
    return Game.instance;
  }

  drawLayer(gameState: IGameState, layer: number): void {
    gameState.tiles[layer].forEach(tile => {
      this.gameMap.context.drawImage(
        this.tileAtlas, // image
        (tile.tile - 1) * gameState.tileSize, // source x
        0, // source y
        gameState.tileSize, // source width
        gameState.tileSize, // source height
        tile.position.x,  // target x
        tile.position.y, // target y
        gameState.tileSize, // target width
        gameState.tileSize // target height
      );
    });
  }

  draw(gameState: IGameState): void {
    this.gameMap.context.clearRect(0, 0, this.gameMap.canvas.width, this.gameMap.canvas.height);

    this.drawLayer(gameState, 0);
    gameState.players.forEach((iPlayer: IPlayer): void => {
      const player = new CPlayer(iPlayer);
      player.draw(this.gameMap);
    });

    gameState.projectiles.forEach((iProjectile: IProjectile): void => {
      const projectile = new CProjectile(iProjectile);
      projectile.draw(this.gameMap);
    });

    this.drawLayer(gameState, 1);
  }
}

export default Game;
