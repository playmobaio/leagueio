import Canvas from './canvas';
import CPlayer from './cplayer';
import { UserIO, IPoint } from '../../models/interfaces';
import CProjectile from './cprojectile';

// Client
class Game {
  private static instance: Game;
  players: Map<string, CPlayer>;
  projectiles: Map<string, CProjectile>;
  canvas: Canvas;
  socket: SocketIO.Socket;

  constructor(socket: SocketIO.Socket) {
    this.players = new Map<string, CPlayer>();
    this.projectiles = new Map<string, CProjectile>();
    this.canvas = Canvas.getInstance();
    this.socket = socket;
  }

  static getInstance(socket: SocketIO.Socket = null): Game {
    if(Game.instance == null) {
      Game.instance = new Game(socket);
    }
    if(socket == null && Game.instance.socket == null) {
      Game.instance.socket = socket;
    }
    return Game.instance;
  }

  addOrUpdatePlayer(player: CPlayer): void {
    if (this.socketExists() && this.socket.id == player.id) {
      const res: { user: CPlayer, found: boolean } = this.tryGetUserPlayer();
      if (res.found) {
        player.userIo = res.user.userIo;
      }
      this.players.set(player.id, player);
    }
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  registerPlayerIO(value: UserIO, point: IPoint = null): void {
    const res: { user: CPlayer, found: boolean } = this.tryGetUserPlayer();
    if (res.found) {
      res.user.registerIo(value, point);
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
    this.players.forEach((cPlayer: CPlayer): void => {
      cPlayer.draw(this.canvas);
    });

    this.projectiles.forEach((projectile: CProjectile): void => {
      projectile.draw(this.canvas);
    })

    const res = this.tryGetUserPlayer();
    if (res.found) {
      res.user.sendPlayerInput(this.socket);
    }
  }

  private tryGetUserPlayer(): { user: CPlayer, found: boolean } {
    if (this.socketExists()) {
      const id: string = this.socket.id;
      return { user: this.players.get(id), found: this.players.has(id) };
    }
    return { user: null, found: false };
  }

  private socketExists(): boolean {
    return this.socket != null;
  }
}

export default Game;