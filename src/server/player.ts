import { HeroID } from '../models/interfaces/iJoinGame';
import { IGameState, IHealth, IProjectile, IPlayer } from '../models/interfaces/iGameState';
import Game from "./game";
import constants from './constants';
import { EmitEvent } from './tools/emitEvent'
import Hero from './hero/hero';
import Ranger from './hero/classes/ranger';
import Brute from './hero/classes/brute';
import Dodge from './hero/classes/dodge';

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

  constructor(id: string, socket: SocketIO.Socket, name: string, heroId: HeroID) {
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

  static create(id: string, socket: SocketIO.Socket, name: string, heroId: HeroID): Player {
    const player = new Player(id, socket, name, heroId);
    Game.getInstance().emitter.emit(EmitEvent.NewPlayer, player);
    return player;
  }

  receiveDamage(incomingDamage: number): void {
    this.health.current = Math.max(0, this.health.current - incomingDamage);
  }

  respawn(): void {
    this.hero.respawn();
    this.health.current = constants.DEFAULT_PLAYER_MAXIMUM_HEALTH;
  }

  endPlayerGame(): void {
    const score = Game.getInstance().currentFrame;
    console.log(`Score ${score}`);
    this.addScore(score);
    Game.getInstance().reset();
  }

  addScore(score: number): void {
    Game.getInstance().scoreCollection.addScore({
      score: score,
      name: this.displayName == "" ? "Anonymous" : this.displayName,
      date: new Date()
    });
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
