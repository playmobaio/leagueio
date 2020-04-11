import Player from './player';
import Gamemap from './gamemap';
import { Velocity } from './basicTypes';
import { UserIO } from '../../models/interfaces';

// Server
class Game {
  private static instance: Game;
  players: Map<string, Player>;
  gamemap: Gamemap;

  private constructor() {
    this.players = new Map<string, Player>();
    this.gamemap = new Gamemap();
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }

    return Game.instance;
  }

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  movePlayer(socket: SocketIO.Socket, io: UserIO): void {
    const player: Player = this.players.get(socket.id);
    player.velocity = Velocity.getVelocity(io);
  }

  update(): void {
    this.players.forEach((player): void => player.update());
  }
}

export default Game;
