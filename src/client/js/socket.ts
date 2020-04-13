import Game from './game';
import CPlayer from './cplayer';
import { IPlayer, UserIO, IPoint, IProjectile } from '../../models/interfaces';
import CProjectile from './cprojectile';

function registerSocket(socket: SocketIO.Socket): void {
  const _game: Game = Game.getInstance(socket);
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";

  socket.on("S:PLAYER_MOVE", (player: IPlayer) => {
    const cplayer = new CPlayer(player.id, player.position);
    _game.addOrUpdatePlayer(cplayer);
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

  window.onkeydown = (event): void => {
    event.preventDefault();
    const _game = Game.getInstance();
    if (_game.socket) {
      switch(event.code) {
        case "KeyS":
        case "ArrowDown":
          _game.registerPlayerIO(UserIO.down)
          break;
        case "KeyW":
        case "ArrowUp":
          _game.registerPlayerIO(UserIO.up)
          break;
        case "KeyA":
        case "ArrowLeft":
          _game.registerPlayerIO(UserIO.left)
          break;
        case "KeyD":
        case "ArrowRight":
          _game.registerPlayerIO(UserIO.right)
          break;
      }
    }
  }

  window.onkeyup = (event): void => {
    event.preventDefault();
    const _game = Game.getInstance();
    if (_game.socket) {
      switch(event.code) {
        case "KeyS":
        case "ArrowDown":
          _game.deregisterPlayerIO(UserIO.down)
          break;
        case "KeyW":
        case "ArrowUp":
          _game.deregisterPlayerIO(UserIO.up)
          break;
        case "KeyA":
        case "ArrowLeft":
          _game.deregisterPlayerIO(UserIO.left)
          break;
        case "KeyD":
        case "ArrowRight":
          _game.deregisterPlayerIO(UserIO.right)
          break;
      }
    }
  }
}

export { registerSocket };