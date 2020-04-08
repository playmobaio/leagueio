// Server
class Game {
  constructor() {
    if(! Game.instance) {
      this._players = [];
      Game.instance = this;
    }
    
    return Game.instance;
  }

  addPlayer(player) {
    this._players.push(player);
  }

  removePlayer(id) {
    this._players = this._players.filter(player => player.id != id);
  }

  getPlayers() {
    return this._players;
  }
}

const instance = new Game();
module.exports = instance;