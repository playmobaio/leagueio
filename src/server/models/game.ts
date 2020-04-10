import Player from './player';
import Gamemap from './gamemap';

// Server
class Game {
  private static instance: Game;
  private _players: Player[];
  gamemap: Gamemap;

  private constructor() {
    this._players = [];
    this.gamemap = new Gamemap();
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }

    return Game.instance;
  }

  addPlayer(player): void {
    this._players.push(player);
  }

  removePlayer(id): void {
    this._players = this._players.filter(player => player.id != id);
  }

  getPlayers(): Player[] {
    return this._players;
  }
}

export default Game;
