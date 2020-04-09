// Client
class Game {
  constructor() {
    if(! Game.instance) {
      this.players = [];
      this.user = null;
      Game.instance = this;
    }
    
    return Game.instance;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(id) {
    this.players = this.players.filter(p => p.id != id);
  }
}
new Game();