import Game from './game';
import UserInputController from './userInputController';
import { PlayerCastIO, IPoint, IGameState, Click } from '../../models/interfaces';

const CHARS_IN_PX = 2;

function registerSocket(socket: SocketIO.Socket): void {
  const _game: Game = Game.getInstance();
  const _userInputController: UserInputController = UserInputController.getInstance(socket);

  socket.on("S:UPDATE_GAME_STATE", (userGame: IGameState) => {
    _game.draw(userGame);
  });

  addEventListener("mousedown", function(event) {
    const gameMap = _game.gameMap;
    const screenPoint: IPoint = { x: event.clientX, y: event.clientY };

    const widthStr: string = gameMap.canvas.style.width;
    const width: number = parseInt(widthStr.substring(0, widthStr.length - CHARS_IN_PX))
    const heightStr: string = gameMap.canvas.style.height;
    const height: number = parseInt(heightStr.substring(0, heightStr.length - CHARS_IN_PX))

    let click: Click;
    switch(event.button) {
    case 0:
      click = Click.Left;
      break;
    case 2:
      click = Click.Right;
      break;
    }
    _userInputController.sendMouseClick(
      click,
      _game.camera.getAbsolutePosition(width, height, screenPoint));
  });

  function getPlayerMovementIO(event: KeyboardEvent): PlayerCastIO {
    switch(event.code) {
    case "KeyQ":
      return PlayerCastIO.Q;
    case "KeyW":
      return PlayerCastIO.W;
    case "KeyE":
      return PlayerCastIO.E;
    }
    return PlayerCastIO.None;
  }

  window.onkeydown = (event): void => {
    event.preventDefault();
    const io: PlayerCastIO = getPlayerMovementIO(event);
    _userInputController.registerPlayerMove(io);
  }
}

export { registerSocket };
