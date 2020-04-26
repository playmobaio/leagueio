import Player from './player';
import GameMap from './gameMap';
import { PlayerMovementIO, IGameState, IPlayer, IProjectile } from '../../models/interfaces';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  gameMap: GameMap;
  currentFrame: number;
  gameStates: Map<string, IGameState>;

  private constructor() {
    this.players = new Map<string, Player>();
    this.gameMap = new GameMap();
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
        if (!projectile.shouldDelete(this.gameMap)) {
          projectile.update();
        } else {
          player.projectiles.delete(projectile.id);
        }
      }
    });
    this.currentFrame++;
  }

  getGameStates(): Array<IGameState> {
    const iPlayers: IPlayer[] = [];
    const iProjectiles: IProjectile[] = [];
    const states = new Array<IGameState>();
    for (const player of this.players.values()) {
      iPlayers.push(player.toInterface());
      for (const projectile of player.projectiles.values()) {
        iProjectiles.push(projectile.toInterface());
      }
      states.push(player.getGameState(iPlayers, iProjectiles));
    }
    return states;
  }

  sendGameStates(gameStates: Array<IGameState>): void {
    gameStates.forEach((state: IGameState): void => {
      const clientId = state.client.id;
      if (this.players.has(clientId)) {
        const player = this.players.get(clientId);
        player.socket.emit("S:UPDATE_GAME_STATE", state);
      }
    });
  }
}

export default Game;
