import Player from './player';

// Server
class Game {
  private static instance: Game;
  private _players: Player[];

  private constructor() { 
    this._players = [];
  }

  public static getInstance(): Game {
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