import io from 'socket.io-client';
import Game from './game';
import CPlayer from './cplayer';
import { Point } from  '../../types/basicTypes';

document.getElementById("joinGame").onclick = (): void => {
  console.log("Initializing Socket");
  let socket = io();
  registerSocket(socket);

  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";
  socket.emit("CLIENT:JOIN_GAME");
};

function registerSocket(socket) {
  const _game: Game = Game.getInstance();
  
  socket.on("SERVER:PLAYER_CREATED", (state) => {
    _game.players = state.players.map(p => {
      const point = new Point(p.x, p.y);
      new CPlayer(p.id, point);
    });
    _game.removePlayer(socket.id);

    // TODO: We should refactor this when we update the event loop also update server
    if (socket.id == state.generated.id) {
      const point = new Point(state.generated.x, state.generated.y);
      const player = new CPlayer(socket.id, point);
      _game.user = player;
    }
  });

  socket.on("SERVER:PLAYER_DC", (id) => {
    _game.removePlayer(id);
  })
}
