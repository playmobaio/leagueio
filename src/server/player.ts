import { HeroID } from '../models/interfaces/iJoinGame';
import { IHealth, IPlayer } from '../models/interfaces/iGameState';
import Game from "./game";
import constants from './constants';
import { EmitEvent } from './tools/emitEvent'
import Hero from './hero/hero';
import Ranger from './hero/classes/ranger';
import Brute from './hero/classes/brute';
import Dodge from './hero/classes/dodge';

class Player {
  game: Game;
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

  constructor(game: Game, id: string, socket: SocketIO.Socket, name: string, heroId: HeroID) {
    this.game = game;
    this.id = id;
    this.displayName = name;
    this.socket = socket;
    this.range = 0;
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
    this.hero = this.createHero(heroId);
  }

  createHero(heroId: HeroID): Hero {
    switch (heroId) {
    case HeroID.Dodge: {
      return new Dodge(this);
    }
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

  static create(
      game: Game,
      id: string,
      socket: SocketIO.Socket,
      name: string,
      heroId: HeroID): Player {
    const player = new Player(game, id, socket, name, heroId);
    game.emitter.emit(EmitEvent.NewPlayer, player);
    return player;
  }

  receiveDamage(incomingDamage: number): void {
    this.socket.emit("S:RECEIVED_DAMAGE");
    this.health.current = Math.max(0, this.health.current - incomingDamage);
  }

  respawn(): void {
    this.hero.respawn();
    this.health.current = constants.DEFAULT_PLAYER_MAXIMUM_HEALTH;
  }

  endPlayerGame(): void {
    this.game.submitScore(this);
    this.game.reset();
  }
  update(): void {
    this.hero.update();
  }

  toInterface(): IPlayer {
    return {
      id: this.id,
      hero: this.hero.toInterface(),
      health: this.health,
    };
  }
}

export default Player;
