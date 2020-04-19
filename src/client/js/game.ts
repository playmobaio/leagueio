import Gamemap from './cgamemap';
import CPlayer from './cplayer';
import { IPlayer, IGameState, IProjectile } from "../../models/interfaces";
import CProjectile from './cprojectile';
import Loader from './loader';

// Client
class Game {
  private static instance: Game;
  gamemap: Gamemap;
  tileAtlas: HTMLImageElement;
  imageloader: Loader;

  constructor() {
    this.gamemap = Gamemap.getInstance();
    this.imageloader = new Loader();
    this.imageloader.loadImage('tiles', '../assets/tiles.png').then(() => {
      this.tileAtlas = this.imageloader.getImage('tiles');
    });
  }

  static getInstance(): Game {
    if(Game.instance == null) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  drawLayer(gameState: IGameState, layer: number): void {
    gameState.tiles[layer].forEach(tile => {
      this.gamemap.context.drawImage(
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
    this.gamemap.context.clearRect(0, 0, this.gamemap.canvas.width, this.gamemap.canvas.height);

    this.drawLayer(gameState, 0);
    gameState.players.forEach((iPlayer: IPlayer): void => {
      const player = new CPlayer(iPlayer);
      player.draw(this.gamemap, player.position);
    });

    gameState.projectiles.forEach((iProjectile: IProjectile): void => {
      const projectile = new CProjectile(iProjectile);
      projectile.draw(this.gamemap, projectile.position);
    });

    this.drawLayer(gameState, 1);
  }
}

export default Game;
