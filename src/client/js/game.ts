import Canvas from './canvas';
import CPlayer from './cplayer';
import { UserIO } from '../../models/interfaces';

// Client
class Game {
  private static instance: Game;
  players: Map<string, CPlayer>;
  canvas: Canvas;
  socket: SocketIO.Socket;

  constructor(socket: SocketIO.Socket) {
    this.players = new Map<string, CPlayer>();
    this.canvas = Canvas.getInstance();
    this.socket = socket;
  }

  static getInstance(socket: SocketIO.Socket = null): Game {
    if(!Game.instance) {
      Game.instance = new Game(socket);
    }
    return Game.instance;
  }

  addOrUpdatePlayer(player: CPlayer): void {
    if (this.socket.id == player.id) {
      const res: { user: CPlayer, found: boolean } = this.tryGetUserPlayer();
      if (res.found) {
        player.userIo = res.user.userIo;
      }
    }
    this.players.set(player.id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  registerPlayerIO(value: UserIO): void {
    const res: { user: CPlayer, found: boolean } = this.tryGetUserPlayer();
    if (res.found) {
      res.user.registerIo(value);
    }
  }

  deregisterPlayerIO(value: UserIO): void {
    const res: { user: CPlayer, found: boolean } = this.tryGetUserPlayer();
    if (res.found) {
      res.user.deregisterIo(value);
    }
  }

  update(): void {
    this.canvas.context.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    this.players.forEach((player: CPlayer): void => {
      player.draw(this.canvas);
    });

    const res = this.tryGetUserPlayer();
    if (res.found) {
      res.user.update(this.socket);
    }
  }

  private tryGetUserPlayer(): { user: CPlayer, found: boolean } {
    if (this.socket) {
      const id: string = this.socket.id;
      return { user: this.players.get(id), found: this.players.has(id) };
    }
    return { user: null, found: false };
  }
}

export default Game;