import { IPlayer,
  PlayerMovementIO,
  IPoint,
  IHealth,
  IGameState,
  IProjectile } from '../../models/interfaces';
import { Point, Velocity, Vector } from './basicTypes';
import Projectile from './projectile';
import Game from "./game";
import constants from '../constants';
import Camera from './camera';
import GameMap from './gameMap';

class Player implements IPlayer {
  id: string;
  position: Point;
  velocity: Velocity;
  socket: SocketIO.Socket;
  projectiles: Map<string, Projectile>;
  game: Game;
  attackSpeed: number;
  lastAutoAttackFrame: number;
  health: IHealth;
  camera: Camera;

  constructor(id: string, point: Point, socket: SocketIO.Socket, map: GameMap) {
    this.id = id;
    this.position = point;
    this.velocity = new Velocity(this.position, 0);
    this.socket = socket;
    this.projectiles = new Map<string, Projectile>();
    this.attackSpeed = constants.DEFAULT_PLAYER_ATTACK_SPEED;
    this.lastAutoAttackFrame = -1;
    this.game = Game.getInstance();
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
    this.camera = new Camera(map,
      constants.DEFAULT_MAP_VIEW_WIDTH,
      constants.DEFAULT_MAP_VIEW_HEIGHT);
  }

  registerAutoAttack(dest: IPoint): void {
    if (!this.canAutoAttack()) {
      return;
    }
    this.lastAutoAttackFrame = this.game.currentFrame;
    this.addProjectile(dest);
  }

  canAutoAttack(): boolean {
    if (this.lastAutoAttackFrame == -1) {
      return true;
    }

    const framesBetweenAutoAttacks = constants.FRAMES_PER_SECOND * this.attackSpeed;
    return this.lastAutoAttackFrame + framesBetweenAutoAttacks <= this.game.currentFrame;
  }

  addProjectile(dest: IPoint): Projectile {
    if (dest == undefined || this.position.equals(dest)) {
      return null;
    }

    const offsetVector = Vector.createFromPoints(this.position, dest);
    offsetVector.setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET);
    const origin: Point = this.position.transformWithVector(offsetVector);
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_SPEED,
      this.position);
    const projectile = new Projectile(origin, velocity)

    this.projectiles.set(projectile.id, projectile);
    return projectile;
  }

  updatePosition(point: Point): void {
    this.position = point;
  }

  updateVelocity(io: PlayerMovementIO): void {
    this.velocity = Velocity.getPlayerVelocity(io);
  }

  update(): void {
    this.updatePosition(this.position.transform(this.velocity));
  }

  toInterface(): IPlayer {
    return { id: this.id, position: this.position, health: this.health };
  }

  getGameState(players: Map<string, Player>, map: GameMap): IGameState {
    const iPlayers: Array<IPlayer> = new Array<IPlayer>();
    const iProjectiles: Array<IProjectile> = new Array<IProjectile>();

    this.camera.update(this);
    players.forEach(player => {
      const iPlayer: IPlayer = player.toInterface();
      iPlayer.position = player.id !== this.id ?
        this.camera.getRelativePosition(player.position) :
        this.camera.realtivePosition;
      iPlayers.push(iPlayer);

      player.projectiles.forEach(projectile => {
        const iProjectile: IProjectile = projectile.toInterface();
        iProjectile.position = this.camera.getRelativePosition(projectile.position);
        iProjectiles.push(iProjectile);
      });
    });

    return {
      tiles: map.getLayers(this.camera),
      players: iPlayers,
      projectiles: iProjectiles,
      tileSize: map.tileSize
    };
  }
}

export default Player;
