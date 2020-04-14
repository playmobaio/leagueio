import Canvas from './canvas';
import CPlayer from './cplayer';
import { IPoint, UserIO, IUserInput, IUserMouseClick } from '../../models/interfaces';
import CProjectile from './cprojectile';

// Client
class Game {
  private static instance: Game;
  players: Map<string, CPlayer>;
  projectiles: Map<string, CProjectile>;
  canvas: Canvas;
  socket: SocketIO.Socket;
  userIO: UserIO;
  mouseClick: boolean;
  cursorPosition: IPoint;

  constructor(socket: SocketIO.Socket) {
    this.players = new Map<string, CPlayer>();
    this.projectiles = new Map<string, CProjectile>();
    this.canvas = Canvas.getInstance();
    this.socket = socket;
    this.userIO = UserIO.none;
    this.mouseClick = false;
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
    this.players.set(player.id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  update(): void {
    this.canvas.context.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    this.players.forEach((cPlayer: CPlayer): void => {
      cPlayer.draw(this.canvas);
    });

    this.projectiles.forEach((projectile: CProjectile): void => {
      projectile.draw(this.canvas);
    });

    // TODO: separate player movement from cursor clicking socket updates
    this.sendPlayerInput();
    if (this.mouseClick) {
      this.sendMouseClick();
    }
  }

  registerUserIO(io: UserIO): void {
    this.userIO |= io;
  }

  deregisterUserIO(io: UserIO): void {
    this.userIO &= ~io;
  }

  registerMouseClick(cursorPosition: IPoint): void {
    this.cursorPosition = cursorPosition;
    this.mouseClick = true;
  }

  sendPlayerInput(): void {
    const userInput: IUserInput = { io: this.userIO };
    this.socket.emit("C:USER_MOVE", userInput);
  }

  sendMouseClick(): void {
    const userMouseClick: IUserMouseClick = { cursorPosition: this.cursorPosition }
    this.socket.emit("C:USER_MOUSE_CLICK", userMouseClick);
    this.mouseClick = false;
  }
}

export default Game;
