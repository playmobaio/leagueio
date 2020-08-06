import Player from './player';
import GameMap from './gameMap';
import { IGameState,
  IPlayer,
  IProjectile } from '../models/interfaces';
import Projectile from './projectiles/projectile';
import { Collisions, Body } from 'detect-collisions';
import { EmitEvent } from './tools/emitEvent'
import { IEmitEventMapping } from './tools/iEmitEventMapping'
import { StrictEventEmitter } from 'strict-event-emitter-types';
import { EventEmitter } from 'events';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  projectiles: Map<string, Projectile>;
  gameMap: GameMap;
  currentFrame: number;
  gameStates: Map<string, IGameState>;
  emitter: StrictEventEmitter<EventEmitter, IEmitEventMapping>;
  collisionSystem: Collisions;

  private constructor() {
    this.players = new Map<string, Player>();
    this.projectiles = new Map<string, Projectile>();
    this.collisionSystem = new Collisions();
    this.gameMap = new GameMap(this);
    this.currentFrame = 0;
    this.emitter = new EventEmitter;
    this.registerEvents();
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }

    return Game.instance;
  }

  registerEvents(): void {
    const addPlayer = (player: Player): void => {
      this.players.set(player.id, player);
    }

    const addProjectile = (projectile: Projectile): void => {
      this.projectiles.set(projectile.id, projectile);
    }

    const deleteProjectile = (projectileId: string): void => {
      this.projectiles.delete(projectileId);
    }

    const newBody = (body: Body): void => {
      this.collisionSystem.insert(body);
    }

    const removeBody = (body: Body): void => {
      body.remove();
    }

    this.emitter.addListener(EmitEvent.NewPlayer, addPlayer);
    this.emitter.addListener(EmitEvent.NewProjectile, addProjectile);
    this.emitter.addListener(EmitEvent.DeleteProjectile, deleteProjectile);
    this.emitter.addListener(EmitEvent.NewBody, newBody);
    this.emitter.addListener(EmitEvent.RemoveBody, removeBody);
  }

  reset(): void {
    this.players.forEach(x => x.socket.emit("S:END_GAME"));
    this.players.clear();
    this.projectiles.clear();
    this.collisionSystem = new Collisions();
    this.gameMap = new GameMap(this);
    this.currentFrame = 0;
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  update(): void {
    // Update all projectiles
    for (const projectile of this.projectiles.values()) {
      projectile.update();
    }

    // Update all players
    for (const player of this.players.values()) {
      player.update();
    }

    // Update collision collisionSystem
    this.collisionSystem.update();

    // Resolve all collisions
    for (const projectile of this.projectiles.values()) {
      for (const player of this.players.values()) {
        if (projectile.collidesWithPlayer(player)) {
          projectile.onPlayerCollision(player);
          if (!projectile.exists()) {
            break;
          }
        }
      }
    }

    // Remove dead players
    for (const player of this.players.values()) {
      if (player.health.current > 0) {
        continue;
      }
      if (player.stocks > 1) {
        player.stocks -= 1;
        player.respawn();
      }
      else {
        player.endPlayerGame();
      }
    }

    // update frame counter
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
