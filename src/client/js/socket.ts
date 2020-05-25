import Game from './game';
import UserInputController from './userInputController';
import { PlayerMoveIO, IPoint, IGameState, Click } from '../../models/interfaces';

async function registerSocket(socket: SocketIO.Socket): Promise<void> {
  const _game: Game = await Game.getInstance();
  const _userInputController: UserInputController = UserInputController.getInstance(socket);
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";

  socket.on("S:UPDATE_GAME_STATE", (userGame: IGameState) => {
    _game.draw(userGame);
  });

  addEventListener("mousedown", function(event) {
    const gameMap = _game.gameMap;
    const domRect = gameMap.canvas.getBoundingClientRect();
    const point: IPoint = { x: event.clientX - domRect.left, y: event.clientY - domRect.top };
    let click: Click;
    switch(event.button) {
    case 0:
      click = Click.Left;
      break;
    case 2:
      click = Click.Right;
      break;
    }
    _userInputController.sendMouseClick(click, _game.camera.getAbsolutePosition(point));
  });

  function getPlayerMovementIO(event: KeyboardEvent): PlayerMoveIO {
    switch(event.code) {
    case "KeyQ":
      return PlayerMoveIO.Q;
    case "KeyW":
      return PlayerMoveIO.W;
    case "KeyE":
      return PlayerMoveIO.E;
    }
    return PlayerMoveIO.None;
  }

  window.onkeydown = (event): void => {
    event.preventDefault();
    const io: PlayerMoveIO = getPlayerMovementIO(event);
    _userInputController.registerPlayerMove(io);
  }
}

export { registerSocket };
