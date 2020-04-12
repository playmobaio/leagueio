import Game from './game';
import CPlayer from './cplayer';
import { IPlayer } from '../../models/interfaces';

function registerSocket(socket: SocketIO.Socket): void {
  const _game: Game = Game.getInstance(socket);
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";

  socket.on("S:PLAYER_MOVE", (player: IPlayer) => {
    const cplayer = new CPlayer(player.id, player.position);
    _game.addOrUpdatePlayer(cplayer);
  });
}

export { registerSocket };