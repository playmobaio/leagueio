import Player from './player';
import Gamemap from './gamemap';
import { PlayerMovementIO,
  IGameState,
  IPlayer,
  IProjectile,
  IUserGame,
  IPoint } from '../../models/interfaces';
import Projectile from './projectile';
import constants from '../constants';
import { Point, Velocity, Vector } from './basicTypes';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  projectiles: Map<string, Projectile>;
  gamemap: Gamemap;
  currentFrame: number;

  private constructor() {
    this.players = new Map<string, Player>();
    this.projectiles = new Map<string, Projectile>();
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

  addProjectile(pId: string, dest: IPoint): Projectile {
    const p: Player = this.players.get(pId);
    if (dest == undefined || p.position.equals(dest)) {
      return null;
    }
    const offsetVector = Vector.createFromPoints(p.position, dest);
    offsetVector.setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET);
    const origin: Point = p.position.transformWithVector(offsetVector);
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_SPEED,
      p.position);
    const projectile = new Projectile(p.id, origin, velocity)

    this.projectiles.set(projectile.id, projectile);
    return projectile;
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
      if(player.health.current <= 0) {
        player.respawn();
      }
      player.update();
    });

    this.projectiles.forEach((projectile): void => {
      if (!projectile.shouldDelete()) {
        projectile.update();
      } else {
        this.projectiles.delete(projectile.id);
      }
    });

    this.players.forEach((player): void => {
      this.projectiles.forEach((projectile): void => {
        if(projectile.creatorId != player.id &&
            player.model.collidesWithCircle(projectile.model)) {
          this.projectiles.delete(projectile.id);
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
      for (const projectile of this.projectiles.values()) {
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
