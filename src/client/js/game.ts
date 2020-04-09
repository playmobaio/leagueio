// Client 
class Game {
  constructor() {
      if(!Game.instance) {
          this.players = [];
          this.user = null;
          Game.instance = this;
      }

      return Game.instance;
  }

  addPlayer(player : Player) {
      this.players.push(player);
  }
  removePlayer(id : number) {
      this.players = this.players.filter(p => p.id != id);
  }
}
new Game();