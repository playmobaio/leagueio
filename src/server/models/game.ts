import Player from './player';
import Gamemap from './gamemap';
import { PlayerMovementIO,
  IGameState,
  IPlayer,
  IProjectile,
  IUserGame } from '../../models/interfaces';
import Projectile from './projectile';
import constants from '../constants';

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
    const listOfProjectiles : Projectile[] = [];
    this.players.forEach((player): void => {
      if(player.health.current <= 0) {
        player.respawn();
      }
      player.update()
      for (const projectile of player.projectiles.values()) {
        if (!projectile.shouldDelete()) {
          projectile.update();
          listOfProjectiles.push(projectile);
        } else {
          player.projectiles.delete(projectile.id);
        }
      }
    });

    this.players.forEach((player): void => {
      // check collision with projectiles
      listOfProjectiles.forEach((projectile): void => {
        if(player.model.hasCollisionToCircle(projectile.model)
            && projectile.shooterSourceId != player.id) {
          const shooter = this.players.get(projectile.shooterSourceId);
          shooter.projectiles.delete(projectile.id);
          player.updateHealth(player.health.current - constants.DEFAULT_DAMAGE_FROM_PROJECTILE,
            player.health.maximum);
        }
      });
    });
    this.currentFrame++;
  }

  createGameState(): IGameState {
    const iPlayers: IPlayer[] = [];
    const iProjectiles: IProjectile[] = [];
    for (const player of this.players.values()) {
      iPlayers.push(player.toInterface());
      for (const projectile of player.projectiles.values()) {
        iProjectiles.push(projectile.toInterface());
      }
    }
    return { players: iPlayers, projectiles: iProjectiles }
  }

  sendGameState(): void {
    const gameState: IGameState = this.createGameState();
    this.players.forEach((player) => {
      const userState: IUserGame = { user: player.toInterface(), gameState: gameState };
      player.socket.emit("S:UPDATE_GAME_STATE", userState);
    });
  }
}

export default Game;
