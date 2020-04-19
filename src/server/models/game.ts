import Player from './player';
import Gamemap from './gamemap';
import { PlayerMovementIO, IGameState } from '../../models/interfaces';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  gamemap: Gamemap;
  currentFrame: number;

  private constructor() {
    this.players = new Map<string, Player>();
    this.gamemap = new Gamemap();
    this.currentFrame = 0;
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }

    return Game.instance;
  }

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  updatePlayerVelocity(playerId: string, io: PlayerMovementIO): void {
    if (this.players.has(playerId)) {
      const player: Player = this.players.get(playerId);
      player.updateVelocity(io);
    }
  }

  update(): void {
    this.players.forEach((player): void => {
      player.update()
      for (const projectile of player.projectiles.values()) {
        if (!projectile.shouldDelete(this.gamemap)) {
          projectile.update();
        } else {
          player.projectiles.delete(projectile.id);
        }
      }
    });
    this.currentFrame++;
  }

  sendGameState(): void {
    this.players.forEach((player) => {
      player.camera.update(player);
      const gameState: IGameState = player.createGameState(this.players, this.gamemap);
      player.socket.emit("S:UPDATE_GAME_STATE", gameState);
    });
  }
}

export default Game;
