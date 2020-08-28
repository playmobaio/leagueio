import Player from './player';
import GameMap from './gameMap';
import ProjectileManager from './projectileManager';
import { IGameState,
  IPlayer,
  IProjectile } from '../models/interfaces/iGameState';
import Projectile from './projectiles/projectile';
import { Collisions, Body } from 'detect-collisions';
import { EmitEvent } from './tools/emitEvent'
import { IEmitEventMapping } from './tools/iEmitEventMapping'
import { StrictEventEmitter } from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import ScoreCollection from './db/scoreCollection';

// Server
class Game {
  static FRAMES_PER_SECOND = 60;
  private static instance: Game;
  players: Map<string, Player>;
  projectiles: Map<string, Projectile>;
  gameMap: GameMap;
  currentFrame: number;
  gameStates: Map<string, IGameState>;
  emitter: StrictEventEmitter<EventEmitter, IEmitEventMapping>;
  collisionSystem: Collisions;
  projectileManager: ProjectileManager;
  gameLoop: NodeJS.Timeout;
  scoreCollection: ScoreCollection;

  private constructor() {
    this.players = new Map<string, Player>();
    this.projectiles = new Map<string, Projectile>();
    this.collisionSystem = new Collisions();
    this.gameMap = new GameMap(this);
    this.currentFrame = 0;
    this.emitter = new EventEmitter;
    this.registerEvents();
    this.projectileManager = new ProjectileManager(this);
    this.scoreCollection = new ScoreCollection();
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
    console.log("Game Reset");
    this.players.forEach(x => x.socket.emit("S:END_GAME"));
    clearInterval(this.gameLoop);
    this.players.clear();
    this.projectiles.clear();
    this.collisionSystem = new Collisions();
    this.gameMap = new GameMap(this);
    this.currentFrame = 0;
  }

  start(): void {
    console.log("Game Start");
    this.currentFrame = 0;
    this.gameLoop = setInterval(() => {
      const game = Game.getInstance();
      game.update();
      const gameState: Array<IGameState> = game.getGameStates();
      game.sendGameStates(gameState);
    }, 1000 / Game.FRAMES_PER_SECOND); // 60 frames a second
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
          console.log(`Projectile ${projectile.id} collided with player ${player.id}`);
          projectile.onPlayerCollision(player);
          if (!projectile.exists()) {
            break;
          }
        }
      }
    }

    // Remove dead players
    for (const player of this.players.values()) {
      if (player.health.current <= 0) {
        player.endPlayerGame();
      }
    }

    // update ProjectileManager
    this.projectileManager.update();

    // update frame counter
    this.currentFrame++;
  }

  getGameStates(): Array<IGameState> {
    const iPlayers: IPlayer[] = [];
    for (const player of this.players.values()) {
      iPlayers.push(player.toInterface());
    }

    const iProjectiles: IProjectile[] = [];
    for (const projectile of this.projectiles.values()) {
      iProjectiles.push(projectile.toInterface());
    }

    const states = new Array<IGameState>();
    for (const player of iPlayers) {
      const gameState: IGameState = {
        client: player,
        players: players,
        projectiles: projectiles,
        currentFrame: this.currentFrame
      }
      states.push(gameState);
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
