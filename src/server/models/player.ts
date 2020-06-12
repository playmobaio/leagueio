import { IPlayer,
  HeroID,
  IHealth,
  IGameState,
  IProjectile } from '../../models/interfaces';
import { Circle } from './basicTypes';
import Game from "./game";
import constants from '../constants';
import { EmitEvent } from '../tools/emitEvent'
import Hero from '../hero/hero';
import Ranger from '../hero/classes/ranger';
import Brute from '../hero/classes/brute';

class Player {
  id: string;
  username: string;
  displayName: string;
  team: string;
  hero: Hero;
  name: string;
  socket: SocketIO.Socket;
  attackSpeed: number;
  health: IHealth;
  range: number;
  stocks: number;

  constructor(id: string, socket: SocketIO.Socket, name: string, heroId: HeroID) {
    this.id = id;
    this.displayName = name;
    this.socket = socket;
    this.range = 0;
    this.stocks = constants.DEFAULT_STARTING_STOCK;
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
    this.hero = this.createHero(heroId);
  }

  createHero(heroId: HeroID): Hero {
    switch (heroId) {
    case HeroID.Ranger: {
      return new Ranger(this);
    }
    case HeroID.Brute: {
      return new Brute(this);
    }
    default: {
      throw new Error("HeroId: " + heroId + " does not exist");
    }
    }
  }

  static create(id: string, socket: SocketIO.Socket, name: string, heroId: HeroID): Player {
    const player = new Player(id, socket, name, heroId);
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
      stocks: this.stocks
    };
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
