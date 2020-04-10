import CPlayer from './cplayer';

// Client
class Game {
  private static instance : Game;
  players : Array<CPlayer>;
  user : CPlayer;

  static getInstance(): Game {
    if(!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  addPlayer(player): void {
    this.players.push(player);
  }
  removePlayer(id: string): void {
    this.players = this.players.filter(p => p.id != id);
  }
}

export default Game;