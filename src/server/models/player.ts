import { IPlayer,
  IHealth,
  IGameState,
  IProjectile } from '../../models/interfaces';
import { Circle } from './basicTypes';
import Game from "./game";
import constants from '../constants';
import { EmitEvent } from '../tools/emitEvent'
import Hero from '../hero/hero';
import Ranger from '../hero/classes/ranger';

class Player {
  id: string;
  username: string;
  displayName: string;
  team: string;
  hero: Hero;
  socket: SocketIO.Socket;
  attackSpeed: number;
  health: IHealth;
  range: number;
  stocks: number;

  private constructor(id: string, socket: SocketIO.Socket) {
    this.id = id;
    this.socket = socket;
    this.range = 0;
    this.stocks = constants.DEFAULT_STARTING_STOCK;
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
    this.hero = new Ranger(this);
  }

  static create(id: string, socket: SocketIO.Socket): Player {
    const player = new Player(id, socket);
    Game.getInstance().emitter.emit(EmitEvent.NewPlayer, player);
    return player;
  }

  receiveDamage(incomingDamage: number): void {
    this.health.current = Math.max(0, this.health.current - incomingDamage);
  }

  respawn(): void {
    this.hero.model = new Circle(this.hero.model.radius);
    this.health.current = constants.DEFAULT_PLAYER_MAXIMUM_HEALTH;
  }

  endPlayerGame(): void {
    Game.getInstance().removePlayer(this.id);
  }

  update(): void {
    this.hero.update();
  }

  toInterface(): IPlayer {
    return {
      id: this.id,
      model: this.hero.model.toInterface(),
      health: this.health,
      stocks: this.stocks };
  }

  getGameState(players: Array<IPlayer>, projectiles: Array<IProjectile>): IGameState {
    return {
      client: this.toInterface(),
      players: players,
      projectiles: projectiles,
      currentFrame: Game.getInstance().currentFrame
    };
  }
}

export default Player;
