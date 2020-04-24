import Player from './player';
import GameMap from './gameMap';
import { PlayerMovementIO, IGameState } from '../../models/interfaces';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  gamemap: GameMap;
  currentFrame: number;
  gameStates: Map<string, IGameState>;

  private constructor() {
    this.players = new Map<string, Player>();
    this.gamemap = new GameMap();
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

  getStates(): Map<string,IGameState> {
    const states = new Map<string, IGameState>();
    this.players.forEach((player: Player) => {
      player.camera.update(player);
      states.set(player.id, player.getGameState(this.players, this.gamemap));
    });
    return states;
  }

  sendGameStates(gameStates: Map<string,IGameState>): void {
    gameStates.forEach((state: IGameState, playerId: string): void => {
      if (this.players.has(playerId)) {
        const player = this.players.get(playerId);
        player.socket.emit("S:UPDATE_GAME_STATE", state);
      }
    });
  }
}

export default Game;
