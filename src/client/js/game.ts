// Client 
class Game {
    private static instance : Game;
    public players : Array<any>;
    public user : any; 
    
  constructor() {}

  public static getInstance(): Game {
      if(!Game) {
          Game.instance = new Game(); 
      }

      return Game.instance;
  }

  addPlayer(player) {
      this.players.push(player);
  }
  removePlayer(id : number) {
      this.players = this.players.filter(p => p.id != id);
  }
}
