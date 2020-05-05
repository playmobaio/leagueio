import Player from './player';
import GameMap from './gameMap';
import { PlayerMovementIO,
  IGameState,
  IPlayer,
  IProjectile,
  IPoint } from '../../models/interfaces';
import Projectile from './projectile';
import constants from '../constants';
import { Point, Velocity, Vector } from './basicTypes';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  projectiles: Map<string, Projectile>;
  gameMap: GameMap;
  currentFrame: number;
  gameStates: Map<string, IGameState>;

  private constructor() {
    this.players = new Map<string, Player>();
    this.projectiles = new Map<string, Projectile>();
    this.gameMap = new GameMap();
    this.currentFrame = 0;
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }

    return Game.instance;
  }

  reset(): void {
    this.player.clear();
    this.projectiles.clear();
    this.gameMap = new GameMap();
    this.currentFrame = 0;
  }

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  addProjectile(pId: string, dest: IPoint): Projectile {
    const player: Player = this.players.get(pId);
    if (player == null || dest == undefined || player.model.center.equals(dest)) {
      return null;
    }
    const offsetVector = Vector.createFromPoints(player.model.center, dest);
    offsetVector.setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET);
    const origin: Point = player.model.center.transformWithVector(offsetVector);
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_SPEED,
      player.model.center);
    const projectile = new Projectile(player.id, origin, velocity)

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
      else {
        player.update();
      }
    });

    this.projectiles.forEach((projectile): void => {
      if (!projectile.shouldDelete(this.gameMap)) {
        projectile.update();
        // check each player to see if colldes
        this.players.forEach((player): void => {
          if(projectile.creatorId != player.id &&
              player.model.collidesWithCircle(projectile.model)) {
            this.projectiles.delete(projectile.id);
            player.receiveDamage(constants.DEFAULT_DAMAGE_FROM_PROJECTILE);
          }
        });
      } else {
        this.projectiles.delete(projectile.id);
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
      for (const projectile of this.projectiles.values()) {
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
