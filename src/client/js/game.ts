import Canvas from './canvas';
import CPlayer from './cplayer';
import { IProjectile, IPlayer } from "../../models/interfaces";
import CProjectile from './cprojectile';

// Client
class Game {
  private static instance: Game;
  players: Map<string, CPlayer>;
  projectiles: Map<string, CProjectile>;
  canvas: Canvas;

  constructor() {
    this.players = new Map<string, CPlayer>();
    this.projectiles = new Map<string, CProjectile>();
    this.canvas = Canvas.getInstance();
  }

  static getInstance(): Game {
    if(Game.instance == null) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  updatePlayers(players: IPlayer[]): void {
    this.players = new Map<string, CPlayer>();
    for (const player of players) {
      this.players.set(player.id, new CPlayer(player));
    }
  }

  updateProjectiles(projectiles: IProjectile[]): void {
    this.projectiles = new Map<string, CProjectile>();
    for (const projectile of projectiles) {
      this.projectiles.set(projectile.id, new CProjectile(projectile));
    }
  }

  addOrUpdatePlayer(player: CPlayer): void {
    this.players.set(player.id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  draw(): void {
    this.canvas.context.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    this.players.forEach((cPlayer: CPlayer): void => {
      cPlayer.draw(this.canvas);
    });

    this.projectiles.forEach((projectile: CProjectile): void => {
      projectile.draw(this.canvas);
    });
  }
}

export default Game;
