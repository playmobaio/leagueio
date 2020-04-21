import Game from './game';
import UserInputController from './UserInputController';
import { PlayerMovementIO, IPoint, IUserGame } from '../../models/interfaces';
import CPlayer from './cplayer';

function registerSocket(socket: SocketIO.Socket): void {
  const _game: Game = Game.getInstance();
  const _userInputController: UserInputController = UserInputController.getInstance(socket);
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";

  socket.on("S:UPDATE_GAME_STATE", (userGame: IUserGame) => {
    _game.user = new CPlayer(userGame.user);
    _game.updatePlayers(userGame.gameState.players);
    _game.updateProjectiles(userGame.gameState.projectiles);
    _game.draw();
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
