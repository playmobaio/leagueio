import Canvas from './canvas';
import CPlayer from './cplayer';

// Client
class Game {
  private static instance: Game;
  players: Map<string, CPlayer>;
  canvas: Canvas;

  constructor() {
    this.players = new Map<string, CPlayer>();
    this.canvas = Canvas.getInstance();
  }

  static getInstance(): Game {
    if(!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  startGame(): void {
    document.getElementById("game").style.visibility = "visible";
    document.getElementById("startpanel").style.visibility = "hidden";
    window.setInterval(() => this.update(), 1000/ 60);
  }

  addOrUpdatePlayer(player: CPlayer): void {
    this.players.set(player.id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  update(): void {
    this.players.forEach((player: CPlayer): void => {
      player.draw(this.canvas);
      // this.canvas.context.beginPath();
      // this.canvas.context.arc(player.position.x, player.position.y, 10, 0, 2 * Math.PI);
      // this.canvas.context.stroke();
    });
  }
}

export default Game;