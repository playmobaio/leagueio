import Game from './game';
import UserInputController from './UserInputController';
import CPlayer from './cplayer';
import { IPlayer, PlayerMovementIO, IPoint, IProjectile } from '../../models/interfaces';
import CProjectile from './cprojectile';

function registerSocket(socket: SocketIO.Socket): void {
  const _game: Game = Game.getInstance();
  const _userInputController: UserInputController = UserInputController.getInstance(socket);
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
    _userInputController.registerMouseClick(point);
  });

  function getPlayerMovementIO(event: KeyboardEvent): PlayerMovementIO {
    switch(event.code) {
      case "KeyS":
      case "ArrowDown":
        return PlayerMovementIO.down;
      case "KeyW":
      case "ArrowUp":
        return PlayerMovementIO.up;
      case "KeyA":
      case "ArrowLeft":
        return PlayerMovementIO.left;
      case "KeyD":
      case "ArrowRight":
        return PlayerMovementIO.right;
    }
    return PlayerMovementIO.none;
  }

  window.onkeydown = (event): void => {
    event.preventDefault();
    const io: PlayerMovementIO = getPlayerMovementIO(event);
    _userInputController.registerPlayerMovement(io);
  }

  window.onkeyup = (event): void => {
    event.preventDefault();
    const io: PlayerMovementIO = getPlayerMovementIO(event);
    _userInputController.deregisterPlayerMovement(io);
  }
}

export { registerSocket };
