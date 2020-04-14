import Game from './game';
import CPlayer from './cplayer';
import { IPlayer, UserIO, IPoint, IProjectile } from '../../models/interfaces';
import CProjectile from './cprojectile';

function registerSocket(socket: SocketIO.Socket): void {
  const _game: Game = Game.getInstance(socket);
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";

  socket.on("S:PLAYER_MOVE", (player: IPlayer) => {
    const cPlayer = new CPlayer(player.id, player.position);
    _game.addOrUpdatePlayer(cPlayer);
  });

  socket.on("S:PLAYER_DC", (id: string) => {
    _game.removePlayer(id);
  });

  socket.on("S:PROJECTILE_MOVE", (projectile: IProjectile) => {
    const cprojectile = new CProjectile(projectile.id, projectile.position);
    _game.projectiles.set(cprojectile.id, cprojectile);
  });

  socket.on("S:DELETE_PROJECTILE", (id: string) => {
    _game.projectiles.delete(id);
  });

  addEventListener("mousedown", function(event) {
    const canvas = _game.canvas;
    const domRect = canvas.canvas.getBoundingClientRect();
    const point: IPoint = { x: event.clientX - domRect.left, y: event.clientY - domRect.top };
    _game.registerPlayerIO(UserIO.click, point);
  });

  addEventListener("mouseup", function() {
    _game.deregisterPlayerIO(UserIO.click);
  });

  function getUserIO(event: KeyboardEvent): UserIO {
    switch(event.code) {
      case "KeyS":
      case "ArrowDown":
        return UserIO.down;
      case "KeyW":
      case "ArrowUp":
        return UserIO.up;
      case "KeyA":
      case "ArrowLeft":
        return UserIO.left;
      case "KeyD":
      case "ArrowRight":
        return UserIO.right;
    }
    return UserIO.none;
  }

  window.onkeydown = (event): void => {
    event.preventDefault();
    if (_game.socket) {
      const io: UserIO = getUserIO(event);
      _game.registerPlayerIO(io);
    }
  }

  window.onkeyup = (event): void => {
    event.preventDefault();
    if (_game.socket) {
      const io: UserIO = getUserIO(event);
      _game.deregisterPlayerIO(io);
    }
  }
}

export { registerSocket };