import Player from './player';
import Gamemap from './gamemap';
import { UserIO, IPoint } from '../../models/interfaces';
import { Velocity, Point } from './basicTypes';
import Projectile from './projectile';
import constants from '../constants';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  projectiles: Map<string, Projectile>;
  gamemap: Gamemap;

  private constructor() {
    this.players = new Map<string, Player>();
    this.projectiles = new Map<string, Projectile>();
    this.gamemap = new Gamemap();
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

  movePlayer(playerId: string, io: UserIO): void {
    if (this.players.has(playerId)) {
      const player: Player = this.players.get(playerId);
      player.updateVelocity(io);
    }
  }

  addProjectile(playerId: string, dest: IPoint): Projectile {
    if (this.players.has(playerId) && dest) {
      const player: Player = this.players.get(playerId);
      const velocity = new Velocity(dest,
        constants.DEFAULT_PROJECTILE_TO_USER_OFFSET,
        player.position);
      const origin: Point = player.position.transform(velocity);
      velocity.speed = constants.DEFAULT_PROJECTILE_SPEED;
      const projectile = new Projectile(origin, velocity)
      this.projectiles.set(projectile.id, projectile);
      return projectile;
    }
    return null;
  }

  update(io: SocketIO.Server): void {
    this.players.forEach((player): void => player.update(io));
    for (const projectile of this.projectiles.values()) {
      if (projectile.validPosition()) {
        projectile.update(io);
      } else {
        this.projectiles.delete(projectile.id);
        io.emit("S:DELETE_PROJECTILE", projectile.id);
      }
    }
  }
}

export default Game;
